<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useI18nStore } from '@/stores/i18nStore'
import { useResourceStore } from '@/stores/resourceStore'
import { useWarehouseStore } from '@/stores/warehouseStore'
import { useWebSocket } from '@/composables/useWebSocket'
import type { ResourceUpdateEvent, ResourceInventory } from '@/types/WebSocket'
import { RESOURCE_UNITS, CLIENT_MAX_CAPACITY } from '@/data/resourceUnits'
import { PURCHASE_AMOUNTS } from '@/data/constants'

import water from '@/assets/images/water.png'
import coffee from '@/assets/images/coffee.png'
import milk from '@/assets/images/milk.png'
import smallCups from '@/assets/images/smallCups.png'
import largeCups from '@/assets/images/largeCups.png'
import stirrers from '@/assets/images/stirrers.png'
import sugar from '@/assets/images/sugar.png'

const resourceList: Array<{ key: keyof ResourceInventory; icon: string }> = [
  { key: 'water', icon: water },
  { key: 'coffee', icon: coffee },
  { key: 'milk', icon: milk },
  { key: 'smallCups', icon: smallCups },
  { key: 'largeCups', icon: largeCups },
  { key: 'stirrers', icon: stirrers },
  { key: 'sugar', icon: sugar },
]

const i18nStore = useI18nStore()
const resourceStore = useResourceStore()
const warehouseStore = useWarehouseStore()
const ws = useWebSocket()

// Refill staging (reactive!)
const preparedRefill = reactive<Partial<ResourceInventory>>({
  water: 0,
  coffee: 0,
  milk: 0,
  smallCups: 0,
  largeCups: 0,
  stirrers: 0,
  sugar: 0,
})

const resources: Array<keyof ResourceInventory> = [
  'water',
  'coffee',
  'milk',
  'smallCups',
  'largeCups',
  'stirrers',
  'sugar',
]

// WebSocket connection
onMounted(async () => {
  ws.connect()
  ws.onResourceUpdate((data: ResourceUpdateEvent) => {
    resourceStore.setInventory(data.inventory)
  })
  await warehouseStore.loadFromGoogleSheets()
  await resourceStore.loadFromGoogleSheets()
})

onUnmounted(() => {
  ws.offResourceUpdate(() => {})
})

// Actions
const purchaseResource = async (resource: keyof ResourceInventory) => {
  await warehouseStore.purchaseResource(resource)
}

const addToRefill = (resource: keyof ResourceInventory) => {
  const current = resourceStore.inventory[resource]
  const prepared = preparedRefill[resource] || 0
  const max = CLIENT_MAX_CAPACITY[resource]
  const increment = Math.max(1, Math.round(max / 10)) // ~10% of max, minimum 1

  if (warehouseStore.inventory[resource] > 0 && current + prepared < max) {
    const newAmount = Math.min(prepared + increment, max - current)
    preparedRefill[resource] = newAmount
  }
}

const removeFromRefill = (resource: keyof ResourceInventory) => {
  const current = preparedRefill[resource] || 0
  const max = CLIENT_MAX_CAPACITY[resource]
  const decrement = Math.max(1, Math.round(max / 10)) // ~10% of max, minimum 1

  if (current > 0) {
    preparedRefill[resource] = Math.max(0, current - decrement)
  }
}

const executeRefill = async () => {
  const refillData: Partial<ResourceInventory> = {}

  for (const [key, amount] of Object.entries(preparedRefill)) {
    if (amount && amount > 0) {
      const resourceKey = key as keyof ResourceInventory
      const success = await warehouseStore.transferToClient(resourceKey, amount)
      if (success) {
        refillData[resourceKey] = amount
      }
    }
  }

  if (Object.keys(refillData).length > 0) {
    await resourceStore.refillResources(refillData)
    // Reset
    resources.forEach((r) => (preparedRefill[r] = 0))
  }
}

const getStatusClass = (resource: keyof ResourceInventory) => {
  const current = resourceStore.inventory[resource]
  const max = CLIENT_MAX_CAPACITY[resource]
  const percent = (current / max) * 100

  if (percent < 20) return 'critical'
  if (percent < 50) return 'low'
  return 'ok'
}
</script>

<template>
  <div class="admin-view">
    <div class="header">
      <h1>🔧 {{ i18nStore.t.admin.title }}</h1>
      <LanguageSelector />
    </div>

    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>{{ i18nStore.t.admin.resource }}</th>
            <th>{{ i18nStore.t.admin.clientResources }}</th>
            <th>{{ i18nStore.t.admin.refillClient }}</th>
            <th>{{ i18nStore.t.admin.warehouse }}</th>
            <th>{{ i18nStore.t.admin.purchase }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resource in resources" :key="resource">
            <td class="resource-name">
              <strong>{{ i18nStore.t.resources[resource] }}</strong>
            </td>

            <td class="client-amount">
              <span :class="['status', getStatusClass(resource)]">
                {{ resourceStore.inventory[resource] }} / {{ CLIENT_MAX_CAPACITY[resource] }}
                {{ i18nStore.t.admin[RESOURCE_UNITS[resource]] }}
              </span>
            </td>
            <td class="refill-controls">
              <button
                class="btn-minus"
                @click="removeFromRefill(resource)"
                :disabled="!preparedRefill[resource]"
              >
                −
              </button>
              <span class="prepared">{{ preparedRefill[resource] || 0 }}</span>
              <button
                class="btn-plus"
                @click="addToRefill(resource)"
                :disabled="warehouseStore.inventory[resource] === 0"
              >
                +
              </button>
            </td>
            <td class="warehouse-amount">
              {{ warehouseStore.inventory[resource] }}
              {{ i18nStore.t.admin[RESOURCE_UNITS[resource]] }}
            </td>

            <td class="actions">
              <button
                class="btn-buy"
                @click="purchaseResource(resource)"
                :title="`+${PURCHASE_AMOUNTS[resource]}`"
              >
                <img :src="resourceList.find((r) => r.key === resource)?.icon" alt="Coin" />
                +{{ PURCHASE_AMOUNTS[resource] }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="footer-actions">
        <button
          class="btn-execute"
          @click="executeRefill"
          :disabled="Object.values(preparedRefill).every((v) => !v || v === 0)"
        >
          ✅ {{ i18nStore.t.admin.executeRefill }} ({{
            Object.values(preparedRefill).reduce((sum, v) => sum + (v || 0), 0)
          }})
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 8px;
  color: white;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.admin-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
  font-size: 0.9rem;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

tbody tr:hover {
  background: #f8f9fa;
}

.resource-name {
  font-weight: 500;
  color: #2c3e50;
}

.client-amount .status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status.ok {
  background: #d4edda;
  color: #155724;
}

.status.low {
  background: #fff3cd;
  color: #856404;
}

.status.critical {
  background: #f8d7da;
  color: #721c24;
}

.warehouse-amount {
  color: #667eea;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-buy {
  padding: 0.4rem 0.8rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-buy:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.refill-controls {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.btn-minus,
.btn-plus {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-minus {
  background: #e74c3c;
  color: white;
}

.btn-minus:hover:not(:disabled) {
  background: #c0392b;
}

.btn-plus {
  background: #42b983;
  color: white;
}

.btn-plus:hover:not(:disabled) {
  background: #359268;
}

.btn-minus:disabled,
.btn-plus:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prepared {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
}

.footer-actions {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
}

.btn-execute {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #42b983 0%, #359268 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-execute:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.btn-execute:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .admin-view {
    padding: 0.5rem;
  }

  h1 {
    font-size: 1.2rem;
  }

  table {
    font-size: 0.85rem;
  }

  th,
  td {
    padding: 0.5rem;
  }

  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }

  .btn-buy {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
