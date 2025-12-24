<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ResourceMonitor from '@/components/Admin/ResourceMonitor.vue'
import WarehousePanel from '@/components/Admin/WarehousePanel.vue'
import RefillControls from '@/components/Admin/RefillControls.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useI18nStore } from '@/stores/i18nStore'
import { useResourceStore } from '@/stores/resourceStore'
import { useWarehouseStore } from '@/stores/warehouseStore'
import { useWebSocket } from '@/composables/useWebSocket'
import type { ResourceUpdateEvent } from '@/types/WebSocket'

const i18nStore = useI18nStore()
const resourceStore = useResourceStore()
const warehouseStore = useWarehouseStore()
const ws = useWebSocket()

// WebSocket connection and listeners
onMounted(async () => {
  ws.connect()

  // Listen for resource updates from client
  ws.onResourceUpdate((data: ResourceUpdateEvent) => {
    console.log('[Admin] Received resource update:', data)
    resourceStore.setInventory(data.inventory)
  })

  // Load warehouse data from Google Sheets
  await warehouseStore.loadFromGoogleSheets()
})

onUnmounted(() => {
  // Clean up listeners but keep connection alive
  ws.offResourceUpdate(() => {})
})
</script>

<template>
  <div class="admin-view">
    <div class="header">
      <h1>🔧 {{ i18nStore.t.admin.title }}</h1>
      <LanguageSelector />
    </div>

    <div class="admin-content">
      <div class="top-section">
        <ResourceMonitor />
      </div>

      <div class="bottom-section">
        <WarehousePanel />
        <RefillControls />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 16px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.top-section {
  width: 100%;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Tablet */
@media (max-width: 1024px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }
}

/* Mobile portrait */
@media (max-width: 768px) {
  .admin-view {
    padding: 0.25rem;
  }

  .header {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .admin-content {
    gap: 1rem;
  }

  .bottom-section {
    gap: 1rem;
  }
}

/* Mobile landscape */
@media (max-width: 768px) and (orientation: landscape) {
  .header {
    padding: 0.5rem 1rem;
  }

  h1 {
    font-size: 1.25rem;
  }

  .bottom-section {
    grid-template-columns: 1fr 1fr;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  h1 {
    font-size: 1.25rem;
  }

  .header {
    padding: 0.5rem;
  }
}
</style>
