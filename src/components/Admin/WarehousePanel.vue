<script setup lang="ts">
import { useWarehouseStore } from '@/stores/warehouseStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { ResourceInventory } from '@/types/Coffee'
import { RESOURCE_UNITS } from '@/data/resourceUnits'

const warehouseStore = useWarehouseStore()
const i18nStore = useI18nStore()

const handlePurchase = (resourceType: keyof ResourceInventory) => {
  warehouseStore.purchaseResource(resourceType)
}

const resourceList: Array<{ key: keyof ResourceInventory; icon: string }> = [
  { key: 'water', icon: '💧' },
  { key: 'coffee', icon: '☕' },
  { key: 'milk', icon: '🥛' },
  { key: 'smallCups', icon: '🥤' },
  { key: 'largeCups', icon: '🥤' },
  { key: 'stirrers', icon: '🥄' },
]
</script>

<template>
  <div class="warehouse-panel">
    <h2>{{ i18nStore.t.admin.warehouse }}</h2>

    <div class="warehouse-grid">
      <div v-for="resource in resourceList" :key="resource.key" class="warehouse-item">
        <div class="item-header">
          <span class="item-icon">{{ resource.icon }}</span>
          <span class="item-label">{{ i18nStore.t.resources[resource.key] }}</span>
        </div>
        <div class="item-stock">{{ i18nStore.t.admin[RESOURCE_UNITS[resource.key]] }}</div>
        <div class="item-stock">{{ warehouseStore.inventory[resource.key] }}</div>

        <button class="purchase-btn" @click="handlePurchase(resource.key)">
          {{ i18nStore.t.admin.purchase }}
        </button>
      </div>
    </div>
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
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
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
  font-size: 1rem;
}

.purchase-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.purchase-btn:active {
  transform: translateY(0);
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
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .warehouse-grid {
    grid-template-columns: 1fr;
  }
}
</style>
