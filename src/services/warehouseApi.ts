// API client for Google Sheets warehouse integration
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export interface WarehouseApiResponse {
    success: boolean
    data?: ResourceInventory
    error?: string
    timestamp?: string
}

import type { ResourceInventory } from '@/types/Coffee'

class WarehouseApiClient {
    private baseUrl: string

    constructor(url: string) {
        this.baseUrl = url
    }

    /**
     * Get current warehouse inventory from Google Sheets
     */
    async getInventory(): Promise<ResourceInventory> {
        if (!this.baseUrl) {
            throw new Error('Apps Script URL not configured')
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: WarehouseApiResponse = await response.json()

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to fetch inventory')
            }

            return result.data
        } catch (error) {
            console.error('[WarehouseAPI] Failed to get inventory:', error)
            throw error
        }
    }

    /**
     * Purchase resource (add to warehouse)
     */
    async purchaseResource(
        resourceType: keyof ResourceInventory,
        amount: number
    ): Promise<ResourceInventory> {
        if (!this.baseUrl) {
            throw new Error('Apps Script URL not configured')
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'purchase',
                    resource: resourceType,
                    amount: amount
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: WarehouseApiResponse = await response.json()

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to purchase resource')
            }

            return result.data
        } catch (error) {
            console.error('[WarehouseAPI] Failed to purchase resource:', error)
            throw error
        }
    }

    /**
     * Transfer resource to client (subtract from warehouse)
     */
    async transferResource(
        resourceType: keyof ResourceInventory,
        amount: number
    ): Promise<ResourceInventory> {
        if (!this.baseUrl) {
            throw new Error('Apps Script URL not configured')
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'transfer',
                    resource: resourceType,
                    amount: amount
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: WarehouseApiResponse = await response.json()

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to transfer resource')
            }

            return result.data
        } catch (error) {
            console.error('[WarehouseAPI] Failed to transfer resource:', error)
            throw error
        }
    }

    /**
     * Update entire warehouse inventory
     */
    async updateInventory(inventory: ResourceInventory): Promise<ResourceInventory> {
        if (!this.baseUrl) {
            throw new Error('Apps Script URL not configured')
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'update',
                    inventory: inventory
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: WarehouseApiResponse = await response.json()

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to update inventory')
            }

            return result.data
        } catch (error) {
            console.error('[WarehouseAPI] Failed to update inventory:', error)
            throw error
        }
    }
}

// Export singleton instance
export const warehouseApi = new WarehouseApiClient(APPS_SCRIPT_URL)
