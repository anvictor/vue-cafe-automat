import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ResourceInventory, Ingredients } from '@/types/Coffee'
import { INITIAL_CLIENT_INVENTORY, RESOURCE_THRESHOLDS } from '@/data/constants'
import { CupSize as CupSizeEnum } from '@/types/Coffee'
import { useWebSocket } from '@/composables/useWebSocket'

export const useResourceStore = defineStore('resource', () => {
    // State
    const inventory = ref<ResourceInventory>({ ...INITIAL_CLIENT_INVENTORY })

    // Getters
    const lowResources = computed(() => {
        const low: Partial<ResourceInventory> = {}

        for (const [key, value] of Object.entries(inventory.value)) {
            const threshold = RESOURCE_THRESHOLDS[key as keyof ResourceInventory]
            if (value <= threshold) {
                low[key as keyof ResourceInventory] = value
            }
        }

        return low
    })

    const hasLowResources = computed(() => Object.keys(lowResources.value).length > 0)

    // Actions
    function canMakeCoffee(ingredients: Ingredients): boolean {
        const { water, coffee, milk, cup, stirrer } = ingredients

        // Check basic ingredients
        if (inventory.value.water < water) return false
        if (inventory.value.coffee < coffee) return false
        if (inventory.value.milk < milk) return false

        // Check cup size
        const cupKey = cup === CupSizeEnum.SMALL ? 'smallCups' : 'largeCups'
        if (inventory.value[cupKey] < 1) return false

        // Check stirrer if needed
        if (stirrer && inventory.value.stirrers < 1) return false

        return true
    }

    function consumeResources(ingredients: Ingredients): boolean {
        if (!canMakeCoffee(ingredients)) return false

        const { water, coffee, milk, cup, stirrer, sugar } = ingredients

        // Deduct resources
        inventory.value.water -= water
        inventory.value.coffee -= coffee
        inventory.value.milk -= milk

        // Deduct cup
        const cupKey = cup === CupSizeEnum.SMALL ? 'smallCups' : 'largeCups'
        inventory.value[cupKey] -= 1

        // Deduct stirrer if needed
        if (stirrer) {
            inventory.value.stirrers -= 1
        }

        // Deduct sugar if needed
        if (sugar > 0) {
            inventory.value.sugar -= sugar
        }

        // Emit WebSocket event for real-time sync
        const ws = useWebSocket()
        ws.emitResourceUpdate(inventory.value)

        return true
    }

    function refillResources(amounts: Partial<ResourceInventory>) {
        for (const [key, value] of Object.entries(amounts)) {
            if (value !== undefined) {
                inventory.value[key as keyof ResourceInventory] += value
            }
        }

        // Emit WebSocket event for real-time sync
        const ws = useWebSocket()
        ws.emitResourceUpdate(inventory.value)
    }

    function setInventory(newInventory: Partial<ResourceInventory>) {
        inventory.value = { ...inventory.value, ...newInventory }
    }

    function reset() {
        inventory.value = { ...INITIAL_CLIENT_INVENTORY }
    }

    return {
        inventory,
        lowResources,
        hasLowResources,
        canMakeCoffee,
        consumeResources,
        refillResources,
        setInventory,
        reset
    }
})
