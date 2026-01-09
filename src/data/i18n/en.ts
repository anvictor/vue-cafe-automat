import type { Translations } from '@/types/i18n'

export const en: Translations = {
  language: {
    name: 'English'
  },

  deposit: {
    title: 'Deposit',
    balance: 'Balance',
    required: 'Required',
    insertCoin: 'Insert Coin',
    change: 'Change'
  },

  menu: {
    title: 'Coffee Menu',
    selectCoffee: 'Select your coffee',
    price: 'Price'
  },

  coffeeNames: {
    espresso: 'Espresso',
    espresso_double: 'Espresso double',
    americano: 'Americano',
    coffee_with_milk: 'Coffee with milk',
    cappuccino: 'Cappuccino',
    latte: 'Latte',
    macchiato: 'Macchiato',
    hot_milk: 'Hot milk',
    hot_water: 'Hot water'
  },

  coffeeDescriptions: {
    espresso: 'Classic strong espresso',
    espresso_double: 'Double shot of espresso',
    americano: 'Espresso with hot water',
    coffee_with_milk: 'Coffee with milk',
    cappuccino: 'Espresso with milk foam',
    latte: 'Gentle coffee with milk',
    macchiato: 'Espresso with a drop of milk',
    hot_milk: 'Hot milk',
    hot_water: 'Hot water'
  },

  sugar: {
    title: 'Sugar',
    amount: 'Amount',
    teaspoons: 'tsp'
  },

  preparation: {
    prepare: 'Prepare',
    preparing: 'Preparing',
    ready: 'Coffee Ready!',
    takeCoffee: 'Take Coffee',
    insufficientFunds: 'Insufficient funds',
    insufficientResources: 'Insufficient resources',
    progress: 'Progress'
  },

  resources: {
    water: 'Water',
    coffee: 'Coffee',
    milk: 'Milk',
    smallCups: 'Small Cups',
    largeCups: 'Large Cups',
    stirrers: 'Stirrers',
    sugar: 'Sugar',
    low: 'Low',
    alert: 'Alert threshold'
  },

  admin: {
    title: 'Admin Panel',
    clientResources: 'Client Machine Resources',
    warehouse: 'Warehouse Stock',
    refillClient: '⬅️ Refill Client Machine',
    purchase: '⬅️ Purchase on warehouse',
    refill: 'Refill',
    prepared: 'Prepared',
    executeRefill: 'Execute Refill',
    pcs: 'pcs',
    ml: 'ml',
    g: 'g',
    resource: 'Resource',
  }
}
