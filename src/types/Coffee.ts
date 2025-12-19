// Coffee types and related interfaces

export enum CoffeeType {
    ESPRESSO = 'espresso',
    ESPRESSO_DOUBLE = 'espresso_double',
    AMERICANO = 'americano',
    COFFEE_WITH_MILK = 'coffee_with_milk',
    CAPPUCCINO = 'cappuccino',
    LATTE = 'latte',
    MACCHIATO = 'macchiato',
    HOT_MILK = 'hot_milk',
    HOT_WATER = 'hot_water'
}

export enum CupSize {
    SMALL = 'small',
    LARGE = 'large'
}

export interface Ingredients {
    water: number // ml
    coffee: number // grams
    milk: number // ml
    sugar: number // teaspoons
    cup: CupSize
    stirrer: boolean // only if sugar > 0
}

export interface CoffeeRecipe {
    type: CoffeeType
    name: string
    description: string
    price: number // in cents/kopiyky
    baseIngredients: Omit<Ingredients, 'sugar' | 'stirrer'> // sugar is adjustable
    preparationTime: number // in seconds
}

export type ResourceType = 'water' | 'coffee' | 'milk' | 'smallCups' | 'largeCups' | 'stirrers'

export interface ResourceInventory {
    water: number
    coffee: number
    milk: number
    smallCups: number
    largeCups: number
    stirrers: number
}
