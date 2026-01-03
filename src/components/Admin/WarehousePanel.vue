<script setup lang="ts">
import { useWarehouseStore } from '@/stores/warehouseStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { ResourceInventory } from '@/types/Coffee'
import { RESOURCE_UNITS } from '@/data/resourceUnits'
import { PURCHASE_AMOUNTS } from '@/data/constants'

import water from '@/assets/images/water.png'
import coffee from '@/assets/images/coffee.png'
import milk from '@/assets/images/milk.png'
import smallCups from '@/assets/images/smallCups.png'
import largeCups from '@/assets/images/largeCups.png'
import stirrers from '@/assets/images/stirrers.png'
import sugar from '@/assets/images/sugar.png'

const warehouseStore = useWarehouseStore()
const i18nStore = useI18nStore()

const handlePurchase = (resourceType: keyof ResourceInventory) => {
  warehouseStore.purchaseResource(resourceType)
}

const resourceList: Array<{ key: keyof ResourceInventory; icon: string }> = [
  { key: 'water', icon: water },
  { key: 'coffee', icon: coffee },
  { key: 'milk', icon: milk },
  { key: 'smallCups', icon: smallCups },
  { key: 'largeCups', icon: largeCups },
  { key: 'stirrers', icon: stirrers },
  { key: 'sugar', icon: sugar },
]
</script>

<template>
  <div class="warehouse-panel">
    <h2>{{ i18nStore.t.admin.warehouse }}</h2>

    <div class="warehouse-grid">
      <div v-for="resource in resourceList" :key="resource.key" class="warehouse-item">
        <div class="item-header">
          <img :src="resource.icon" :alt="resource.key" />
          <span class="item-label">{{ i18nStore.t.resources[resource.key] }}</span>
        </div>
        <div class="item-stock">
          {{ warehouseStore.inventory[resource.key] }}
          {{ i18nStore.t.admin[RESOURCE_UNITS[resource.key]] }}
        </div>

        <button
          class="purchase-btn"
          @click="handlePurchase(resource.key)"
          :disabled="warehouseStore.isLoading"
        >
          {{ i18nStore.t.admin.purchase }} +{{ PURCHASE_AMOUNTS[resource.key] }}
        </button>
      </div>
    </div>

    <div v-if="warehouseStore.error" class="error-message">⚠️ {{ warehouseStore.error }}</div>
  </div>
</template>

<style scoped>
.warehouse-panel {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.warehouse-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.item-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.item-icon {
  font-size: 2.5rem;
}

.item-label {
  font-weight: 600;
  font-size: 1rem;
}

.item-stock {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.purchase-btn {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.purchase-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.purchase-btn:active:not(:disabled) {
  transform: translateY(0);
}

.purchase-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .warehouse-panel {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .warehouse-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .warehouse-item {
    padding: 1rem;
  }

  .item-stock {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .warehouse-grid {
    grid-template-columns: 1fr;
  }
}
</style>
