/**
 * Google Apps Script for Client Machine Resources Management
 *
 * This script manages the client coffee machine's resource inventory
 * in Google Sheets, providing persistent storage across page reloads.
 *
 * Deploy as: Web App
 * Execute as: Me
 * Access: Anyone
 */

/**
 * Handle GET requests - return current client inventory
 */
function doGet(e) {
  try {
    const sheet = getClientResourcesSheet()
    const inventory = readInventory(sheet)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        data: inventory,
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Handle POST requests - update inventory based on action
 */
function doPost(e) {
  try {
    const sheet = getClientResourcesSheet()
    const params = JSON.parse(e.postData.contents)
    const action = params.action

    let inventory

    switch (action) {
      case 'consume':
        inventory = consumeResources(sheet, params.ingredients)
        break
      case 'refill':
        inventory = refillResources(sheet, params.amounts)
        break
      case 'update':
        inventory = updateInventory(sheet, params.inventory)
        break
      default:
        throw new Error('Invalid action: ' + action)
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        data: inventory,
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Get or create the ClientResources sheet
 */
function getClientResourcesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName('ClientResources')

  if (!sheet) {
    sheet = ss.insertSheet('ClientResources')
    initializeSheet(sheet)
  }

  return sheet
}

/**
 * Initialize sheet with headers and default data
 */
function initializeSheet(sheet) {
  // Headers
  sheet.getRange('A1:C1').setValues([['Resource', 'Amount', 'Unit']])
  sheet.getRange('A1:C1').setFontWeight('bold')
  sheet.getRange('A1:C1').setBackground('#42b983')
  sheet.getRange('A1:C1').setFontColor('#ffffff')

  // Initial data (from INITIAL_CLIENT_INVENTORY)
  const initialData = [
    ['water', 300, 'ml'],
    ['coffee', 28, 'g'],
    ['milk', 300, 'ml'],
    ['smallCups', 10, 'pcs'],
    ['largeCups', 8, 'pcs'],
    ['stirrers', 10, 'pcs'],
    ['sugar', 10, 'pcs'],
  ]

  sheet.getRange(2, 1, initialData.length, 3).setValues(initialData)

  // Formatting
  sheet.setColumnWidth(1, 150)
  sheet.setColumnWidth(2, 100)
  sheet.setColumnWidth(3, 80)
  sheet.getRange('B2:B8').setNumberFormat('#,##0')

  // Add note about units
  sheet.getRange('C1').setNote('ml - milliliters, g - grams, pcs - pieces')
}

/**
 * Read current inventory from sheet
 */
function readInventory(sheet) {
  const data = sheet.getRange('A2:B8').getValues()
  const inventory = {}

  data.forEach((row) => {
    const resource = row[0]
    const amount = row[1]
    inventory[resource] = amount
  })

  return inventory
}

/**
 * Consume resources (deduct after coffee preparation)
 */
function consumeResources(sheet, ingredients) {
  const inventory = readInventory(sheet)

  // Deduct water
  if (ingredients.water) {
    inventory.water -= ingredients.water
  }

  // Deduct coffee
  if (ingredients.coffee) {
    inventory.coffee -= ingredients.coffee
  }

  // Deduct milk
  if (ingredients.milk) {
    inventory.milk -= ingredients.milk
  }

  // Deduct cup (small or large)
  if (ingredients.cup === 'small') {
    inventory.smallCups -= 1
  } else if (ingredients.cup === 'large') {
    inventory.largeCups -= 1
  }

  // Deduct stirrer if sugar used
  if (ingredients.stirrer) {
    inventory.stirrers -= 1
  }

  // Deduct sugar
  if (ingredients.sugar) {
    inventory.sugar -= ingredients.sugar
  }

  // Write back to sheet
  updateInventory(sheet, inventory)

  return inventory
}

/**
 * Refill resources (add from warehouse)
 */
function refillResources(sheet, amounts) {
  const inventory = readInventory(sheet)

  // Add each amount
  Object.keys(amounts).forEach((resource) => {
    if (inventory.hasOwnProperty(resource)) {
      inventory[resource] += amounts[resource]
    }
  })

  // Write back to sheet
  updateInventory(sheet, inventory)

  return inventory
}

/**
 * Update entire inventory
 */
function updateInventory(sheet, inventory) {
  const resources = ['water', 'coffee', 'milk', 'smallCups', 'largeCups', 'stirrers', 'sugar']

  resources.forEach((resource, index) => {
    const row = index + 2
    const amount = inventory[resource] || 0
    sheet.getRange(row, 2).setValue(amount)
  })

  return inventory
}

/**
 * Find row number for a specific resource
 */
function findResourceRow(sheet, resourceName) {
  const data = sheet.getRange('A2:A8').getValues()

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === resourceName) {
      return i + 2 // +2 because we start from row 2
    }
  }

  return -1
}

/**
 * Test function - run this to verify the script works
 */
function testScript() {
  const sheet = getClientResourcesSheet()

  Logger.log('Initial inventory:')
  Logger.log(readInventory(sheet))

  // Test consume
  const testIngredients = {
    water: 30,
    coffee: 7,
    milk: 0,
    cup: 'small',
    sugar: 2,
    stirrer: true,
  }

  Logger.log('After consuming espresso:')
  Logger.log(consumeResources(sheet, testIngredients))

  // Test refill
  const testRefill = {
    water: 100,
    coffee: 14,
    smallCups: 5,
  }

  Logger.log('After refill:')
  Logger.log(refillResources(sheet, testRefill))
}
