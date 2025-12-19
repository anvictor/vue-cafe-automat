// Internationalization types

export enum Language {
  EN = 'en',
  ES = 'es',
  UA = 'ua'
}

export interface Translations {
  // Common
  language: {
    name: string
  }

  // Deposit
  deposit: {
    title: string
    balance: string
    required: string
    insertCoin: string
    change: string
  }

  // Coffee menu
  menu: {
    title: string
    selectCoffee: string
    price: string
  }

  // Coffee names (localized)
  coffeeNames: {
    espresso: string
    espresso_double: string
    americano: string
    coffee_with_milk: string
    cappuccino: string
    latte: string
    macchiato: string
    hot_milk: string
    hot_water: string
  }

  // Coffee descriptions
  coffeeDescriptions: {
    espresso: string
    espresso_double: string
    americano: string
    coffee_with_milk: string
    cappuccino: string
    latte: string
    macchiato: string
    hot_milk: string
    hot_water: string
  }

  // Sugar control
  sugar: {
    title: string
    amount: string
    teaspoons: string
  }

  // Preparation
  preparation: {
    prepare: string
    preparing: string
    ready: string
    takeCoffee: string
    insufficientFunds: string
    insufficientResources: string
    progress: string
  }

  // Resources
  resources: {
    water: string
    coffee: string
    milk: string
    smallCups: string
    largeCups: string
    stirrers: string
    low: string
    alert: string
  }

  // Admin
  admin: {
    title: string
    clientResources: string
    warehouse: string
    purchase: string
    refill: string
    refillClient: string
    prepared: string
    executeRefill: string
    pcs: string
    ml: string
    g: string
  }
}
