import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ResourceInventory, Ingredients } from '@/types/Coffee'
import { INITIAL_CLIENT_INVENTORY, RESOURCE_THRESHOLDS } from '@/data/constants'
import { CupSize as CupSizeEnum } from '@/types/Coffee'
import { useWebSocket } from '@/composables/useWebSocket'
import { clientResourcesApi } from '@/services/clientResourcesApi'

export const useResourceStore = defineStore('resource', () => {
    // State
    const inventory = ref<ResourceInventory>({ ...INITIAL_CLIENT_INVENTORY })
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isGoogleSheetsEnabled = ref(false)

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

    // Check if Google Sheets is configured
    function checkGoogleSheetsConfig() {
        isGoogleSheetsEnabled.value = clientResourcesApi.isEnabled()
        console.log('[ClientResources] Google Sheets enabled:', isGoogleSheetsEnabled.value)
    }

    // Load inventory from Google Sheets
    async function loadFromGoogleSheets() {
        if (!isGoogleSheetsEnabled.value) {
            console.log('[ClientResources] Google Sheets not configured, using local state')
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log('[ClientResources] Loading from Google Sheets...')
            const data = await clientResourcesApi.getInventory()
            inventory.value = data
            console.log('[ClientResources] Loaded from Google Sheets:', data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            error.value = errorMessage
            console.error('[ClientResources] Failed to load from Google Sheets:', errorMessage)
            console.log('[ClientResources] Using local state as fallback')
        } finally {
            isLoading.value = false
        }
    }

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

    async function consumeResources(ingredients: Ingredients): Promise<boolean> {
        if (!canMakeCoffee(ingredients)) return false

        const { water, coffee, milk, cup, stirrer, sugar } = ingredients

        // Store previous state for rollback
        const previousInventory = { ...inventory.value }

        // Optimistic update - deduct resources immediately
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

        // Sync to Google Sheets if enabled
        if (isGoogleSheetsEnabled.value) {
            try {
                console.log('[ClientResources] Syncing consumption to Google Sheets...')
                const updatedInventory = await clientResourcesApi.consumeResources(ingredients)
                inventory.value = updatedInventory
                console.log('[ClientResources] Consumption synced to Google Sheets')
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error'
                error.value = errorMessage
                console.error('[ClientResources] Failed to sync consumption:', errorMessage)
                // Rollback on error
                inventory.value = previousInventory
                return false
            }
        }

        return true
    }

    async function refillResources(amounts: Partial<ResourceInventory>) {
        // Store previous state for rollback
        const previousInventory = { ...inventory.value }

        // Optimistic update - add resources immediately
        for (const [key, value] of Object.entries(amounts)) {
            if (value !== undefined) {
                inventory.value[key as keyof ResourceInventory] += value
            }
        }

        // Emit WebSocket event for real-time sync
        const ws = useWebSocket()
        ws.emitResourceUpdate(inventory.value)

        // Sync to Google Sheets if enabled
        if (isGoogleSheetsEnabled.value) {
            try {
                console.log('[ClientResources] Syncing refill to Google Sheets...')
                const updatedInventory = await clientResourcesApi.refillResources(amounts)
                inventory.value = updatedInventory
                console.log('[ClientResources] Refill synced to Google Sheets')
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error'
                error.value = errorMessage
                console.error('[ClientResources] Failed to sync refill:', errorMessage)
                // Rollback on error
                inventory.value = previousInventory
            }
        }
    }

    function setInventory(newInventory: Partial<ResourceInventory>) {
        inventory.value = { ...inventory.value, ...newInventory }
    }

    async function syncToGoogleSheets() {
        if (!isGoogleSheetsEnabled.value) {
            console.log('[ClientResources] Google Sheets not enabled')
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log('[ClientResources] Manually syncing to Google Sheets...')
            const updatedInventory = await clientResourcesApi.updateInventory(inventory.value)
            inventory.value = updatedInventory
            console.log('[ClientResources] Manual sync completed')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            error.value = errorMessage
            console.error('[ClientResources] Failed to sync:', errorMessage)
        } finally {
            isLoading.value = false
        }
    }

    function reset() {
        inventory.value = { ...INITIAL_CLIENT_INVENTORY }
    }

    // Initialize Google Sheets config on store creation
    checkGoogleSheetsConfig()

    return {
        inventory,
        isLoading,
        error,
        isGoogleSheetsEnabled,
        lowResources,
        hasLowResources,
        canMakeCoffee,
        consumeResources,
        refillResources,
        setInventory,
        loadFromGoogleSheets,
        syncToGoogleSheets,
        reset
    }
})
