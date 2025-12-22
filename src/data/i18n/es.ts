import type { Translations } from '@/types/i18n'

export const es: Translations = {
  language: {
    name: 'Español'
  },

  deposit: {
    title: 'Depósito',
    balance: 'Saldo',
    required: 'Requerido',
    insertCoin: 'Insertar Moneda',
    change: 'Cambio'
  },

  menu: {
    title: 'Menú de Café',
    selectCoffee: 'Selecciona tu café',
    price: 'Precio'
  },

  coffeeNames: {
    espresso: 'Cortado',
    espresso_double: 'Cafe solo',
    americano: 'Café americano',
    coffee_with_milk: 'Café con leche',
    cappuccino: 'Capuchino',
    latte: 'Latte',
    macchiato: 'Macchiato',
    hot_milk: 'Leche caliente',
    hot_water: 'Agua caliente'
  },

  coffeeDescriptions: {
    espresso: 'Espresso clásico fuerte',
    espresso_double: 'Doble espresso',
    americano: 'Espresso con agua caliente',
    coffee_with_milk: 'Café con leche',
    cappuccino: 'Espresso con espuma de leche',
    latte: 'Café suave con leche',
    macchiato: 'Espresso con una gota de leche',
    hot_milk: 'Leche caliente',
    hot_water: 'Agua caliente'
  },

  sugar: {
    title: 'Azúcar',
    amount: 'Cantidad',
    teaspoons: 'cdta'
  },

  preparation: {
    prepare: 'Preparar',
    preparing: 'Preparando',
    ready: '¡Café Listo!',
    takeCoffee: 'Tomar Café',
    insufficientFunds: 'Fondos insuficientes',
    insufficientResources: 'Recursos insuficientes',
    progress: 'Progreso'
  },

  resources: {
    water: 'Agua',
    coffee: 'Café',
    milk: 'Leche',
    smallCups: 'Vasos Pequeños',
    largeCups: 'Vasos Grandes',
    stirrers: 'Agitadores',
    sugar: 'Azúcar',
    low: 'Bajo',
    alert: 'Umbral de alerta'
  },

  admin: {
    title: 'Panel de Administración',
    clientResources: 'Recursos de la Máquina Cliente',
    warehouse: 'Stock del Almacén',
    purchase: 'Comprar',
    refill: 'Rellenar',
    refillClient: 'Rellenar Cliente',
    prepared: 'Preparado',
    executeRefill: 'Ejecutar Relleno',
    pcs: 'uds',
    ml: 'ml',
    g: 'g',
  }
}
