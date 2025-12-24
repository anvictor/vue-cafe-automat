import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ResourceInventory } from '@/types/Coffee'
import { INITIAL_WAREHOUSE_INVENTORY, PURCHASE_AMOUNTS } from '@/data/constants'
import { warehouseApi } from '@/services/warehouseApi'

export const useWarehouseStore = defineStore('warehouse', () => {
    // State
    const inventory = ref<ResourceInventory>({ ...INITIAL_WAREHOUSE_INVENTORY })
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isGoogleSheetsEnabled = ref(false)

    // Check if Google Sheets is configured
    const checkGoogleSheetsConfig = () => {
        const url = import.meta.env.VITE_APPS_SCRIPT_URL
        isGoogleSheetsEnabled.value = !!url && url.length > 0
        return isGoogleSheetsEnabled.value
    }

    // Load inventory from Google Sheets
    async function loadFromGoogleSheets() {
        if (!checkGoogleSheetsConfig()) {
            console.log('[Warehouse] Google Sheets not configured, using local state')
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log('[Warehouse] Loading from Google Sheets...')
            const data = await warehouseApi.getInventory()
            inventory.value = data
            console.log('[Warehouse] Loaded from Google Sheets:', data)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load from Google Sheets'
            console.error('[Warehouse] Error loading from Google Sheets:', err)
            // Fallback to local state
        } finally {
            isLoading.value = false
        }
    }

    // Purchase resource and sync with Google Sheets
    async function purchaseResource(resourceType: keyof ResourceInventory) {
        const amount = PURCHASE_AMOUNTS[resourceType]

        // Optimistic update
        inventory.value[resourceType] += amount

        if (checkGoogleSheetsConfig()) {
            isLoading.value = true
            error.value = null

            try {
                console.log(`[Warehouse] Purchasing ${amount} of ${resourceType}...`)
                const data = await warehouseApi.purchaseResource(resourceType, amount)
                inventory.value = data
                console.log('[Warehouse] Purchase synced to Google Sheets')
            } catch (err) {
                // Revert optimistic update on error
                inventory.value[resourceType] -= amount
                error.value = err instanceof Error ? err.message : 'Failed to sync purchase'
                console.error('[Warehouse] Error syncing purchase:', err)
                throw err
            } finally {
                isLoading.value = false
            }
        } else {
            console.log(`[Warehouse] Purchased ${amount} of ${resourceType} (local only)`)
        }

        return amount
    }

    // Transfer to client and sync with Google Sheets
    async function transferToClient(resourceType: keyof ResourceInventory, amount: number): Promise<boolean> {
        if (inventory.value[resourceType] < amount) {
            return false
        }

        // Optimistic update
        const previousAmount = inventory.value[resourceType]
        inventory.value[resourceType] -= amount

        if (checkGoogleSheetsConfig()) {
            isLoading.value = true
            error.value = null

            try {
                console.log(`[Warehouse] Transferring ${amount} of ${resourceType} to client...`)
                const data = await warehouseApi.transferResource(resourceType, amount)
                inventory.value = data
                console.log('[Warehouse] Transfer synced to Google Sheets')
            } catch (err) {
                // Revert optimistic update on error
                inventory.value[resourceType] = previousAmount
                error.value = err instanceof Error ? err.message : 'Failed to sync transfer'
                console.error('[Warehouse] Error syncing transfer:', err)
                return false
            } finally {
                isLoading.value = false
            }
        } else {
            console.log(`[Warehouse] Transferred ${amount} of ${resourceType} (local only)`)
        }

        return true
    }

    // Set inventory (local only, no sync)
    function setInventory(newInventory: Partial<ResourceInventory>) {
        inventory.value = { ...inventory.value, ...newInventory }
    }

    // Sync current inventory to Google Sheets
    async function syncToGoogleSheets() {
        if (!checkGoogleSheetsConfig()) {
            console.log('[Warehouse] Google Sheets not configured')
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log('[Warehouse] Syncing to Google Sheets...')
            const data = await warehouseApi.updateInventory(inventory.value)
            inventory.value = data
            console.log('[Warehouse] Synced to Google Sheets')
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to sync to Google Sheets'
            console.error('[Warehouse] Error syncing to Google Sheets:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Reset to initial values
    function reset() {
        inventory.value = { ...INITIAL_WAREHOUSE_INVENTORY }
        error.value = null
    }

    return {
        inventory,
        isLoading,
        error,
        isGoogleSheetsEnabled,
        loadFromGoogleSheets,
        purchaseResource,
        transferToClient,
        setInventory,
        syncToGoogleSheets,
        reset
    }
})
