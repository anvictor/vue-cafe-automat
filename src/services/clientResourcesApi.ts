/**
 * API Client for Client Resources Google Sheets Integration
 *
 * This module provides methods to interact with the Google Apps Script
 * that manages client machine resource inventory in Google Sheets.
 */

import type { ResourceInventory, Ingredients } from '@/types/Coffee'

const APPS_SCRIPT_URL = import.meta.env.VITE_CLIENT_RESOURCES_URL
const USE_PROXY = import.meta.env.DEV // Use proxy in development mode
const PROXY_URL = 'http://localhost:3002/proxy'

// In development, route through proxy to bypass CORS
const API_URL = USE_PROXY && APPS_SCRIPT_URL
  ? `${PROXY_URL}?url=${encodeURIComponent(APPS_SCRIPT_URL)}`
  : APPS_SCRIPT_URL

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

/**
 * Check if Google Sheets integration is enabled
 */
export function isGoogleSheetsEnabled(): boolean {
  return Boolean(API_URL)
}

/**
 * Get current client resource inventory from Google Sheets
 */
export async function getInventory(): Promise<ResourceInventory> {
  if (!API_URL) {
    throw new Error('Client Resources API URL not configured')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<ResourceInventory> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch inventory')
    }

    return result.data
  } catch (error) {
    console.error('[ClientResourcesAPI] Error fetching inventory:', error)
    throw error
  }
}

/**
 * Consume resources (after coffee preparation)
 */
export async function consumeResources(ingredients: Ingredients): Promise<ResourceInventory> {
  if (!API_URL) {
    throw new Error('Client Resources API URL not configured')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'consume',
        ingredients: {
          water: ingredients.water,
          coffee: ingredients.coffee,
          milk: ingredients.milk,
          cup: ingredients.cup,
          sugar: ingredients.sugar,
          stirrer: ingredients.stirrer
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<ResourceInventory> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to consume resources')
    }

    return result.data
  } catch (error) {
    console.error('[ClientResourcesAPI] Error consuming resources:', error)
    throw error
  }
}

/**
 * Refill resources (from warehouse)
 */
export async function refillResources(amounts: Partial<ResourceInventory>): Promise<ResourceInventory> {
  if (!API_URL) {
    throw new Error('Client Resources API URL not configured')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'refill',
        amounts
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<ResourceInventory> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to refill resources')
    }

    return result.data
  } catch (error) {
    console.error('[ClientResourcesAPI] Error refilling resources:', error)
    throw error
  }
}

/**
 * Update entire inventory (manual override)
 */
export async function updateInventory(inventory: ResourceInventory): Promise<ResourceInventory> {
  if (!API_URL) {
    throw new Error('Client Resources API URL not configured')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        inventory
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<ResourceInventory> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update inventory')
    }

    return result.data
  } catch (error) {
    console.error('[ClientResourcesAPI] Error updating inventory:', error)
    throw error
  }
}

export const clientResourcesApi = {
  isEnabled: isGoogleSheetsEnabled,
  getInventory,
  consumeResources,
  refillResources,
  updateInventory
}
