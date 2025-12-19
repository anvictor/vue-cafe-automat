import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CoffeeType } from '@/types/Coffee'
import type { CoffeeRecipe, Ingredients } from '@/types/Coffee'
import { PreparationStatus } from '@/types/Transaction'
import { getRecipeByType } from '@/data/coffeeMenu'
import { DEFAULT_SUGAR, PREPARATION_UPDATE_INTERVAL } from '@/data/constants'
import { useDepositStore } from './depositStore'
import { useResourceStore } from './resourceStore'

export const useCoffeeStore = defineStore('coffee', () => {
    // State
    const selectedCoffeeType = ref<CoffeeType | null>(null)
    const sugarAmount = ref(DEFAULT_SUGAR)
    const preparationStatus = ref<PreparationStatus>(PreparationStatus.IDLE)
    const preparationProgress = ref(0)

    let preparationInterval: number | null = null

    // Getters
    const selectedRecipe = computed<CoffeeRecipe | null>(() => {
        if (!selectedCoffeeType.value) return null
        return getRecipeByType(selectedCoffeeType.value) || null
    })

    const requiredIngredients = computed<Ingredients | null>(() => {
        if (!selectedRecipe.value) return null

        return {
            ...selectedRecipe.value.baseIngredients,
            sugar: sugarAmount.value,
            stirrer: sugarAmount.value > 0
        }
    })

    const canPrepare = computed(() => {
        const depositStore = useDepositStore()
        const resourceStore = useResourceStore()

        if (!selectedRecipe.value) return false
        if (!depositStore.hasSufficientFunds) return false
        if (!requiredIngredients.value) return false
        if (!resourceStore.canMakeCoffee(requiredIngredients.value)) return false
        if (preparationStatus.value !== PreparationStatus.IDLE) return false

        return true
    })

    // Actions
    function selectCoffee(type: CoffeeType) {
        selectedCoffeeType.value = type
        const recipe = getRecipeByType(type)
        if (recipe) {
            const depositStore = useDepositStore()
            depositStore.setRequiredAmount(recipe.price)
        }
    }

    function adjustSugar(delta: number) {
        const newAmount = sugarAmount.value + delta
        if (newAmount >= 0 && newAmount <= 5) {
            sugarAmount.value = newAmount
        }
    }

    async function prepareCoffee() {
        if (!canPrepare.value || !selectedRecipe.value || !requiredIngredients.value) {
            return false
        }

        const depositStore = useDepositStore()
        const resourceStore = useResourceStore()

        // Deduct payment
        if (!depositStore.deductAmount(selectedRecipe.value.price)) {
            return false
        }

        // Consume resources
        if (!resourceStore.consumeResources(requiredIngredients.value)) {
            // Refund if resources not available
            depositStore.insertCoin(selectedRecipe.value.price)
            return false
        }

        // Start preparation
        preparationStatus.value = PreparationStatus.PREPARING
        preparationProgress.value = 0

        const totalTime = selectedRecipe.value.preparationTime * 1000 // convert to ms
        const updateInterval = PREPARATION_UPDATE_INTERVAL
        const steps = totalTime / updateInterval
        const progressPerStep = 100 / steps

        return new Promise<boolean>((resolve) => {
            preparationInterval = window.setInterval(() => {
                preparationProgress.value += progressPerStep

                if (preparationProgress.value >= 100) {
                    preparationProgress.value = 100
                    preparationStatus.value = PreparationStatus.READY
                    if (preparationInterval) {
                        clearInterval(preparationInterval)
                        preparationInterval = null
                    }
                    resolve(true)
                }
            }, updateInterval)
        })
    }

    function takeCoffee() {
        if (preparationStatus.value !== PreparationStatus.READY) return

        preparationStatus.value = PreparationStatus.TAKEN

        const depositStore = useDepositStore()
        const changeAmount = depositStore.returnChange()

        // Reset for next order
        setTimeout(() => {
            reset()
        }, 2000)

        return changeAmount
    }

    function reset() {
        selectedCoffeeType.value = null
        sugarAmount.value = DEFAULT_SUGAR
        preparationStatus.value = PreparationStatus.IDLE
        preparationProgress.value = 0

        if (preparationInterval) {
            clearInterval(preparationInterval)
            preparationInterval = null
        }
    }

    return {
        selectedCoffeeType,
        sugarAmount,
        preparationStatus,
        preparationProgress,
        selectedRecipe,
        requiredIngredients,
        canPrepare,
        selectCoffee,
        adjustSugar,
        prepareCoffee,
        takeCoffee,
        reset
    }
})
