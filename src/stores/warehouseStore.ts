import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ResourceInventory } from '@/types/Coffee'
import { INITIAL_WAREHOUSE_INVENTORY, PURCHASE_AMOUNTS } from '@/data/constants'

export const useWarehouseStore = defineStore('warehouse', () => {
    // State
    const inventory = ref<ResourceInventory>({ ...INITIAL_WAREHOUSE_INVENTORY })

    // Actions
    function purchaseResource(resourceType: keyof ResourceInventory) {
        const amount = PURCHASE_AMOUNTS[resourceType]
        inventory.value[resourceType] += amount

        // TODO: Send to backend/Google Sheets
        console.log(`Purchased ${amount} of ${resourceType}`)

        return amount
    }

    function transferToClient(resourceType: keyof ResourceInventory, amount: number): boolean {
        if (inventory.value[resourceType] < amount) {
            return false
        }

        inventory.value[resourceType] -= amount
        return true
    }

    function setInventory(newInventory: Partial<ResourceInventory>) {
        inventory.value = { ...inventory.value, ...newInventory }
    }

    function reset() {
        inventory.value = { ...INITIAL_WAREHOUSE_INVENTORY }
    }

    return {
        inventory,
        purchaseResource,
        transferToClient,
        setInventory,
        reset
    }
})
