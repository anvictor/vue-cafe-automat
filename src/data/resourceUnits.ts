// Resource units for display
export const RESOURCE_UNITS = {
  water: 'ml',
  coffee: 'g',
  milk: 'ml',
  smallCups: 'pcs',
  largeCups: 'pcs',
  stirrers: 'pcs'
} as const

// Maximum capacity for client machine (same as initial × 2 for safety margin)
export const CLIENT_MAX_CAPACITY = {
  water: 600,
  coffee: 56,
  milk: 600,
  smallCups: 20,
  largeCups: 16,
  stirrers: 20
} as const
