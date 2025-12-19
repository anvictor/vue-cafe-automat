import { CoffeeType, CupSize } from '@/types/Coffee'
import type { CoffeeRecipe } from '@/types/Coffee'

// Coffee menu with realistic recipes and prices (in euro cents)
export const coffeeMenu: CoffeeRecipe[] = [
    {
        type: CoffeeType.ESPRESSO,
        name: 'Cortado', // ES name as default
        description: 'Класичний міцний еспресо',
        price: 120, // 1.20 EUR in cents
        baseIngredients: {
            water: 30,
            coffee: 7,
            milk: 0,
            cup: CupSize.SMALL
        },
        preparationTime: 20
    },
    {
        type: CoffeeType.ESPRESSO_DOUBLE,
        name: 'Cafe solo',
        description: 'Подвійна порція еспресо',
        price: 120, // 1.20 EUR
        baseIngredients: {
            water: 60,
            coffee: 14,
            milk: 0,
            cup: CupSize.SMALL
        },
        preparationTime: 25
    },
    {
        type: CoffeeType.AMERICANO,
        name: 'Café americano',
        description: 'Еспресо з гарячою водою',
        price: 150, // 1.50 EUR
        baseIngredients: {
            water: 150,
            coffee: 7,
            milk: 0,
            cup: CupSize.LARGE
        },
        preparationTime: 25
    },
    {
        type: CoffeeType.COFFEE_WITH_MILK,
        name: 'Café con leche',
        description: 'Кава з молоком',
        price: 160, // 1.60 EUR
        baseIngredients: {
            water: 50,
            coffee: 7,
            milk: 100,
            cup: CupSize.LARGE
        },
        preparationTime: 30
    },
    {
        type: CoffeeType.CAPPUCCINO,
        name: 'Capuchino',
        description: 'Еспресо з молочною піною',
        price: 180, // 1.80 EUR
        baseIngredients: {
            water: 30,
            coffee: 7,
            milk: 100,
            cup: CupSize.LARGE
        },
        preparationTime: 35
    },
    {
        type: CoffeeType.LATTE,
        name: 'Latte',
        description: 'Ніжна кава з молоком',
        price: 200, // 2.00 EUR
        baseIngredients: {
            water: 30,
            coffee: 7,
            milk: 150,
            cup: CupSize.LARGE
        },
        preparationTime: 35
    },
    {
        type: CoffeeType.MACCHIATO,
        name: 'Macchiato',
        description: 'Еспресо з краплею молока',
        price: 140, // 1.40 EUR
        baseIngredients: {
            water: 30,
            coffee: 7,
            milk: 20,
            cup: CupSize.SMALL
        },
        preparationTime: 25
    },
    {
        type: CoffeeType.HOT_MILK,
        name: 'Leche caliente',
        description: 'Гаряче молоко',
        price: 100, // 1.00 EUR
        baseIngredients: {
            water: 0,
            coffee: 0,
            milk: 150,
            cup: CupSize.SMALL
        },
        preparationTime: 15
    },
    {
        type: CoffeeType.HOT_WATER,
        name: 'Agua caliente',
        description: 'Кип\'яток',
        price: 50, // 0.50 EUR
        baseIngredients: {
            water: 150,
            coffee: 0,
            milk: 0,
            cup: CupSize.SMALL
        },
        preparationTime: 10
    }
]

// Helper function to get recipe by type
export function getRecipeByType(type: CoffeeType): CoffeeRecipe | undefined {
    return coffeeMenu.find(recipe => recipe.type === type)
}
