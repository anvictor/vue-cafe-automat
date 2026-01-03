// Google Apps Script для інтеграції з Coffee Machine
// Розгорніть як Web App для доступу до складу

const SHEET_NAME = 'Warehouse' // Назва листа зі складом

// Структура даних складу
const RESOURCES = ['water', 'coffee', 'milk', 'smallCups', 'largeCups', 'stirrers', 'sugar']

/**
 * GET запит - отримати поточний стан складу
 */
function doGet(e) {
  try {
    const sheet = getWarehouseSheet()
    const inventory = readInventory(sheet)

    return createJsonResponse({
      success: true,
      data: inventory,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return createJsonResponse(
      {
        success: false,
        error: error.message,
      },
      500,
    )
  }
}

/**
 * POST запит - оновити склад
 * Body: { action: 'purchase' | 'transfer', resource: string, amount: number }
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getWarehouseSheet()

    if (data.action === 'purchase') {
      purchaseResource(sheet, data.resource, data.amount)
    } else if (data.action === 'transfer') {
      transferResource(sheet, data.resource, data.amount)
    } else if (data.action === 'update') {
      updateInventory(sheet, data.inventory)
    } else {
      throw new Error('Invalid action: ' + data.action)
    }

    const inventory = readInventory(sheet)

    return createJsonResponse({
      success: true,
      data: inventory,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return createJsonResponse(
      {
        success: false,
        error: error.message,
      },
      400,
    )
  }
}

/**
 * Отримати лист складу
 */
function getWarehouseSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)

  // Якщо листа немає, створити його
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    initializeSheet(sheet)
  }

  return sheet
}

/**
 * Ініціалізувати лист з заголовками та початковими даними
 */
function initializeSheet(sheet) {
  // Заголовки
  sheet.getRange('A1:C1').setValues([['Resource', 'Amount', 'Unit']])
  sheet.getRange('A1:C1').setFontWeight('bold')
  sheet.getRange('A1:C1').setBackground('#4285f4')
  sheet.getRange('A1:C1').setFontColor('#ffffff')

  // Початкові дані (синхронізовані з INITIAL_WAREHOUSE_INVENTORY)
  const initialData = [
    ['water', 10000, 'ml'],
    ['coffee', 1000, 'g'],
    ['milk', 5000, 'ml'],
    ['smallCups', 100, 'pcs'],
    ['largeCups', 100, 'pcs'],
    ['stirrers', 200, 'pcs'],
    ['sugar', 200, 'pcs'],
  ]

  sheet.getRange(2, 1, initialData.length, 3).setValues(initialData)

  // Форматування
  sheet.setColumnWidth(1, 150)
  sheet.setColumnWidth(2, 100)
  sheet.setColumnWidth(3, 80)
  sheet.getRange('B2:B8').setNumberFormat('#,##0')

  // Додати примітку про одиниці виміру
  sheet.getRange('C1').setNote('ml - мілілітри, g - грами, pcs - штуки')
}

/**
 * Прочитати інвентар зі листа
 */
function readInventory(sheet) {
  const data = sheet.getDataRange().getValues()
  const inventory = {}

  // Пропустити заголовок (рядок 0)
  for (let i = 1; i < data.length; i++) {
    const resource = data[i][0]
    const amount = data[i][1]

    if (resource && typeof amount === 'number') {
      inventory[resource] = amount
    }
  }

  return inventory
}

/**
 * Купити ресурс (додати до складу)
 */
function purchaseResource(sheet, resource, amount) {
  const rowIndex = findResourceRow(sheet, resource)

  if (rowIndex === -1) {
    throw new Error('Resource not found: ' + resource)
  }

  const currentAmount = sheet.getRange(rowIndex, 2).getValue()
  const newAmount = currentAmount + amount

  sheet.getRange(rowIndex, 2).setValue(newAmount)

  // Додати timestamp оновлення
  if (sheet.getLastColumn() < 3) {
    sheet.getRange(1, 3).setValue('Last Updated')
    sheet.getRange(1, 3).setFontWeight('bold')
  }
  sheet.getRange(rowIndex, 3).setValue(new Date())
}

/**
 * Передати ресурс клієнту (відняти зі складу)
 */
function transferResource(sheet, resource, amount) {
  const rowIndex = findResourceRow(sheet, resource)

  if (rowIndex === -1) {
    throw new Error('Resource not found: ' + resource)
  }

  const currentAmount = sheet.getRange(rowIndex, 2).getValue()

  if (currentAmount < amount) {
    throw new Error('Insufficient stock for ' + resource)
  }

  const newAmount = currentAmount - amount
  sheet.getRange(rowIndex, 2).setValue(newAmount)
  sheet.getRange(rowIndex, 3).setValue(new Date())
}

/**
 * Оновити весь інвентар
 */
function updateInventory(sheet, inventory) {
  for (const resource in inventory) {
    const rowIndex = findResourceRow(sheet, resource)
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, 2).setValue(inventory[resource])
      sheet.getRange(rowIndex, 3).setValue(new Date())
    }
  }
}

/**
 * Знайти рядок ресурсу
 */
function findResourceRow(sheet, resource) {
  const data = sheet.getDataRange().getValues()

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === resource) {
      return i + 1 // +1 тому що getRange використовує 1-based index
    }
  }

  return -1
}

/**
 * Створити JSON відповідь
 */
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)

  return output
}

/**
 * Тестова функція для перевірки
 */
function testScript() {
  const sheet = getWarehouseSheet()
  const inventory = readInventory(sheet)
  Logger.log('Current inventory:', inventory)

  // Тест покупки
  purchaseResource(sheet, 'water', 750)
  Logger.log('After purchase:', readInventory(sheet))
}
