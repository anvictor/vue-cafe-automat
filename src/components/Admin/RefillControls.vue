<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWarehouseStore } from '@/stores/warehouseStore'
import { useResourceStore } from '@/stores/resourceStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { ResourceInventory } from '@/types/Coffee'
import { RESOURCE_UNITS, CLIENT_MAX_CAPACITY } from '@/data/resourceUnits'

import water from '@/assets/images/water.png'
import coffee from '@/assets/images/coffee.png'
import milk from '@/assets/images/milk.png'
import smallCups from '@/assets/images/smallCups.png'
import largeCups from '@/assets/images/largeCups.png'
import stirrers from '@/assets/images/stirrers.png'
import sugar from '@/assets/images/sugar.png'

const warehouseStore = useWarehouseStore()
const resourceStore = useResourceStore()
const i18nStore = useI18nStore()

// Prepared amounts for refill (staged)
const preparedRefill = ref<Partial<ResourceInventory>>({
  water: 0,
  coffee: 0,
  milk: 0,
  smallCups: 0,
  largeCups: 0,
  stirrers: 0,
  sugar: 0,
})

const resourceList: Array<{ key: keyof ResourceInventory; icon: string }> = [
  { key: 'water', icon: water },
  { key: 'coffee', icon: coffee },
  { key: 'milk', icon: milk },
  { key: 'smallCups', icon: smallCups },
  { key: 'largeCups', icon: largeCups },
  { key: 'stirrers', icon: stirrers },
  { key: 'sugar', icon: sugar },
]

// Calculate how much can be added (1 unit at a time, not exceeding capacity)
const canAddToPrepared = (resourceType: keyof ResourceInventory) => {
  const currentClient = resourceStore.inventory[resourceType]
  const currentPrepared = preparedRefill.value[resourceType] || 0
  const maxCapacity = CLIENT_MAX_CAPACITY[resourceType]

  // Can add if: warehouse has stock AND (client + prepared) < max capacity
  return warehouseStore.inventory[resourceType] > 0 && currentClient + currentPrepared < maxCapacity
}

// Add 1 unit to prepared refill
const addToPrepared = (resourceType: keyof ResourceInventory) => {
  if (canAddToPrepared(resourceType)) {
    preparedRefill.value[resourceType] = (preparedRefill.value[resourceType] || 0) + 1
  }
}

// Remove 1 unit from prepared refill
const removeFromPrepared = (resourceType: keyof ResourceInventory) => {
  const current = preparedRefill.value[resourceType] || 0
  if (current > 0) {
    preparedRefill.value[resourceType] = current - 1
  }
}

// Total prepared amount
const totalPrepared = computed(() => {
  return Object.values(preparedRefill.value).reduce((sum, val) => sum + (val || 0), 0)
})

// Execute refill - transfer all prepared amounts
const executeRefill = async () => {
  if (totalPrepared.value === 0) return

  const refillData: Partial<ResourceInventory> = {}

  // Transfer each prepared amount
  for (const [key, amount] of Object.entries(preparedRefill.value)) {
    if (amount && amount > 0) {
      const resourceKey = key as keyof ResourceInventory
      const success = await warehouseStore.transferToClient(resourceKey, amount)
      if (success) {
        refillData[resourceKey] = amount
      }
    }
  }

  // Update client resources
  if (Object.keys(refillData).length > 0) {
    resourceStore.refillResources(refillData)

    // Reset prepared amounts
    preparedRefill.value = {
      water: 0,
      coffee: 0,
      milk: 0,
      smallCups: 0,
      largeCups: 0,
      stirrers: 0,
      sugar: 0,
    }
  }
}
</script>

<template>
  <div class="refill-controls">
    <div class="header-section">
      <h2>{{ i18nStore.t.admin.refillClient }}</h2>
      <button class="execute-refill-btn" :disabled="totalPrepared === 0" @click="executeRefill">
        {{ i18nStore.t.admin.executeRefill }} ({{ totalPrepared }})
      </button>
    </div>

    <div class="refill-grid">
      <div v-for="resource in resourceList" :key="resource.key" class="refill-item">
        <div class="item-info">
          <img :src="resource.icon" :alt="resource.key" />
          <div class="item-details">
            <div class="item-label">{{ i18nStore.t.resources[resource.key] }}</div>
            <div class="item-amounts">
              <span class="client-amount">
                {{ i18nStore.t.admin.clientResources }}: {{ resourceStore.inventory[resource.key] }}
                {{ i18nStore.t.admin[RESOURCE_UNITS[resource.key]] }}
              </span>
              <span class="warehouse-amount">
                {{ i18nStore.t.admin.warehouse }}: {{ warehouseStore.inventory[resource.key] }}
                {{ i18nStore.t.admin[RESOURCE_UNITS[resource.key]] }}
              </span>
              <span class="capacity-info">
                Max: {{ CLIENT_MAX_CAPACITY[resource.key] }}
                {{ i18nStore.t.admin[RESOURCE_UNITS[resource.key]] }}
              </span>
            </div>
          </div>
        </div>

        <div class="controls">
          <div class="prepared-display">
            <span class="prepared-label">{{ i18nStore.t.admin.prepared }}:</span>
            <span class="prepared-value"
              >{{ preparedRefill[resource.key] || 0 }}
              {{ i18nStore.t.admin[RESOURCE_UNITS[resource.key]] }}</span
            >
          </div>
          <div class="buttons">
            <button
              class="control-btn minus"
              :disabled="(preparedRefill[resource.key] || 0) === 0"
              @click="removeFromPrepared(resource.key)"
            >
              −
            </button>
            <button
              class="control-btn plus"
              :disabled="!canAddToPrepared(resource.key)"
              @click="addToPrepared(resource.key)"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.refill-controls {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.execute-refill-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.execute-refill-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.execute-refill-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.refill-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.refill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  transition: all 0.3s;
}

.refill-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.item-icon {
  font-size: 2rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.item-amounts {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #666;
}

.client-amount {
  color: #42b983;
  font-weight: 600;
}

.warehouse-amount {
  color: #667eea;
  font-weight: 600;
}

.capacity-info {
  color: #95a5a6;
  font-weight: 600;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.prepared-display {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.9rem;
}

.prepared-label {
  color: #666;
}

.prepared-value {
  font-weight: 600;
  color: #e74c3c;
  min-width: 60px;
  text-align: right;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #42b983;
  background: white;
  color: #42b983;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: #42b983;
  color: white;
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn.minus {
  border-color: #e74c3c;
  color: #e74c3c;
}

.control-btn.minus:hover:not(:disabled) {
  background: #e74c3c;
  color: white;
}

@media (max-width: 768px) {
  .refill-controls {
    padding: 1.5rem;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .execute-refill-btn {
    width: 100%;
  }

  .refill-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }

  .item-amounts {
    flex-direction: column;
    gap: 0.25rem;
  }

  .controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
