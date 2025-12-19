import type { ResourceInventory } from '@/types/Coffee'

// Coin values (in cents/kopiyky)
export const COIN_VALUES = [1, 2, 5, 10] as const

// Default coin value for "insert coin" button
export const DEFAULT_COIN_VALUE = 10

// Resource threshold levels - alert when below these values (~1 cup worth)
export const RESOURCE_THRESHOLDS: ResourceInventory = {
  water: 150,      // 1 cup worth
  coffee: 14,      // 1 cup worth
  milk: 150,       // 1 cup worth
  smallCups: 5,    // 1 round of small drinks
  largeCups: 4,    // 1 round of large drinks
  stirrers: 5      // 1 round
}

// Initial inventory for client machine (enough for ~2 cups of each drink)
export const INITIAL_CLIENT_INVENTORY: ResourceInventory = {
  water: 300,      // Max 150ml per drink × 2
  coffee: 28,      // Max 14g per drink × 2
  milk: 300,       // Max 150ml per drink × 2
  smallCups: 10,   // 5 drinks use small cups × 2
  largeCups: 8,    // 4 drinks use large cups × 2
  stirrers: 10     // Assuming sugar in some drinks × 2
}

// Initial warehouse inventory
export const INITIAL_WAREHOUSE_INVENTORY: ResourceInventory = {
  water: 10000,
  coffee: 1000,
  milk: 5000,
  smallCups: 100,
  largeCups: 100,
  stirrers: 200
}

// Purchase amounts - how much to add when "buying" resources (max 5 portions)
export const PURCHASE_AMOUNTS: ResourceInventory = {
  water: 750,      // 5 × 150ml
  coffee: 70,      // 5 × 14g
  milk: 750,       // 5 × 150ml
  smallCups: 25,   // 5 × 5 drinks
  largeCups: 20,   // 5 × 4 drinks
  stirrers: 25     // 5 × 5
}

// Refill amounts - how much to transfer from warehouse to client (enough for ~2 more cups)
export const REFILL_AMOUNTS: ResourceInventory = {
  water: 300,      // 2 cups worth
  coffee: 28,      // 2 cups worth
  milk: 300,       // 2 cups worth
  smallCups: 10,   // 2 rounds
  largeCups: 8,    // 2 rounds
  stirrers: 10     // 2 rounds
}

// Sugar limits
export const MIN_SUGAR = 0
export const MAX_SUGAR = 5
export const DEFAULT_SUGAR = 0

// Animation and timing
export const PREPARATION_UPDATE_INTERVAL = 100 // ms - how often to update progress
export const COIN_ANIMATION_DURATION = 500 // ms
export const CHANGE_DISPLAY_DURATION = 3000 // ms

// WebSocket configuration
export const WS_RECONNECT_INTERVAL = 3000 // ms
export const WS_MAX_RECONNECT_ATTEMPTS = 5
