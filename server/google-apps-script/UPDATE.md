# Оновлення Google Apps Script

## Проблеми, які виправлено:

1. ✅ **Синхронізація початкових даних**: Тепер `water` починається з 10000 мл (як у `INITIAL_WAREHOUSE_INVENTORY`)
2. ✅ **Додано колонку Unit**: Тепер в таблиці видно одиниці виміру (ml, g, pcs)
3. ✅ **Показ кількості покупки**: На кнопці "Купити" тепер показується скільки буде додано (наприклад, "+750")

## Як оновити ваш Google Apps Script:

### Крок 1: Відкрийте Apps Script Editor

1. Відкрийте вашу Google Таблицю
2. **Розширення → Apps Script**

### Крок 2: Оновіть код

Знайдіть функцію `initializeSheet` (біля рядка 56) і замініть її на:

```javascript
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
```

### Крок 3: Збережіть та оновіть лист

**Варіант А: Видалити існуючий лист "Warehouse"**

1. У вашій Google Таблиці видаліть лист "Warehouse"
2. Відкрийте Apps Script URL у браузері
3. Скрипт автоматично створить новий лист з правильною структурою

**Варіант Б: Вручну додати колонку Unit**

1. У листі "Warehouse" додайте заголовок "Unit" в комірку C1
2. Додайте одиниці виміру:
   - C2: `ml` (water)
   - C3: `g` (coffee)
   - C4: `ml` (milk)
   - C5: `pcs` (smallCups)
   - C6: `pcs` (largeCups)
   - C7: `pcs` (stirrers)
   - C8: `pcs` (sugar)
3. Оновіть B2 (water) з 5000 на 10000

### Крок 4: Перевірте результат

Після оновлення ваша таблиця має виглядати так:

| Resource  | Amount | Unit |
| --------- | ------ | ---- |
| water     | 10000  | ml   |
| coffee    | 1000   | g    |
| milk      | 5000   | ml   |
| smallCups | 100    | pcs  |
| largeCups | 100    | pcs  |
| stirrers  | 200    | pcs  |
| sugar     | 200    | pcs  |

## Що змінилося в UI:

### Warehouse Panel (Admin)

**Було:**

```
Вода
ml
5000

[Купити]
```

**Стало:**

```
Вода
5000 ml

[Купити +750]
```

Тепер одразу видно:

- Поточну кількість з одиницями виміру
- Скільки буде додано при покупці (+750 ml)

## Troubleshooting

### Помилка "Column index out of bounds"

Якщо після оновлення виникає помилка, це означає що скрипт намагається записати в колонку C, але вона не існує. Рішення:

1. Видаліть лист "Warehouse"
2. Запустіть функцію `testScript()` в Apps Script editor
3. Або просто відкрийте Apps Script URL у браузері

### Дані не оновлюються

1. Перевірте, що ви зберегли зміни в Apps Script
2. Можливо потрібно створити нове розгортання:
   - **Розгорнути → Керувати розгортаннями**
   - Створіть нову версію

## Примітки

- Одиниці виміру (`ml`, `g`, `pcs`) тепер зберігаються в Google Sheets
- Frontend показує ці одиниці в Admin панелі
- Кнопка "Купити" показує точну кількість, яка буде додана
- Початкові дані синхронізовані з `constants.ts`
