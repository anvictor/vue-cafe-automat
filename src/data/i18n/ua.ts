import type { Translations } from '@/types/i18n'

export const ua: Translations = {
  language: {
    name: 'Українська'
  },

  deposit: {
    title: 'Депозит',
    balance: 'Баланс',
    required: 'Потрібно',
    insertCoin: 'Кинути Монету',
    change: 'Решта'
  },

  menu: {
    title: 'Меню Кави',
    selectCoffee: 'Оберіть каву',
    price: 'Ціна'
  },

  coffeeNames: {
    espresso: 'Еспресо',
    espresso_double: 'Подвійний еспресо',
    americano: 'Амерікано',
    coffee_with_milk: 'Кава з молоком',
    cappuccino: 'Капучіно',
    latte: 'Лате',
    macchiato: 'Мак\'ято',
    hot_milk: 'Гаряче молоко',
    hot_water: 'Кип\'яток'
  },

  coffeeDescriptions: {
    espresso: 'Класичний міцний еспресо',
    espresso_double: 'Подвійна порція еспресо',
    americano: 'Еспресо з гарячою водою',
    coffee_with_milk: 'Кава з молоком',
    cappuccino: 'Еспресо з молочною піною',
    latte: 'Ніжна кава з молоком',
    macchiato: 'Еспресо з краплею молока',
    hot_milk: 'Гаряче молоко',
    hot_water: 'Кип\'яток'
  },

  sugar: {
    title: 'Цукор',
    amount: 'Кількість',
    teaspoons: 'ч.л.'
  },

  preparation: {
    prepare: 'Приготувати',
    preparing: 'Готується',
    ready: 'Кава Готова!',
    takeCoffee: 'Взяти Каву',
    insufficientFunds: 'Недостатньо коштів',
    insufficientResources: 'Недостатньо ресурсів',
    progress: 'Прогрес'
  },

  resources: {
    water: 'Вода',
    coffee: 'Кава',
    milk: 'Молоко',
    smallCups: 'Малі Стаканчики',
    largeCups: 'Великі Стаканчики',
    stirrers: 'Мішалки',
    sugar: 'Цукор',
    low: 'Низько',
    alert: 'Поріг попередження'
  },

  admin: {
    title: 'Панель Адміністратора',
    clientResources: 'Ресурси Автомата',
    warehouse: 'Склад',
    purchase: '⬅️ Купити на склад',
    refill: 'Поповнити',
    refillClient: '⬅️ Поповнити Автомат',
    prepared: 'Підготовлено',
    executeRefill: 'Виконати Поповнення',
    pcs: 'шт',
    ml: 'мл',
    g: 'г',
    resource: 'Ресурс'
  }
}
