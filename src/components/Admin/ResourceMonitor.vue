<script setup lang="ts">
import { computed } from 'vue'
import { useResourceStore } from '@/stores/resourceStore'
import { useI18nStore } from '@/stores/i18nStore'
import type { ResourceInventory } from '@/types/Coffee'
import { RESOURCE_THRESHOLDS } from '@/data/constants'
import { RESOURCE_UNITS } from '@/data/resourceUnits'

const resourceStore = useResourceStore()
const i18nStore = useI18nStore()

const resourceList = computed(() => {
  const resources: Array<{
    key: keyof ResourceInventory
    label: string
    current: number
    unit: 'pcs' | 'ml' | 'g'
    threshold: number
    isLow: boolean
    percentage: number
  }> = []

  const resourceKeys: Array<keyof ResourceInventory> = [
    'water',
    'coffee',
    'milk',
    'smallCups',
    'largeCups',
    'stirrers',
  ]

  resourceKeys.forEach((key) => {
    const current = resourceStore.inventory[key]
    const threshold = RESOURCE_THRESHOLDS[key]
    const isLow = current <= threshold
    const maxValue = threshold * 4 // визначаємо максимум як 4x threshold
    const percentage = Math.min((current / maxValue) * 100, 100)

    resources.push({
      key,
      label: i18nStore.t.resources[key],
      current,
      unit: RESOURCE_UNITS[key],
      threshold,
      isLow,
      percentage,
    })
  })

  return resources
})

const getStatusColor = (isLow: boolean, percentage: number) => {
  if (isLow) return '#e74c3c'
  if (percentage < 50) return '#f39c12'
  return '#42b983'
}
</script>

<template>
  <div class="resource-monitor">
    <h2>{{ i18nStore.t.admin.clientResources }}</h2>

    <div class="resources-grid">
      <div
        v-for="resource in resourceList"
        :key="resource.key"
        class="resource-card"
        :class="{ low: resource.isLow }"
      >
        <div class="resource-header">
          <span class="resource-label">{{ resource.label }}</span>
          <span v-if="resource.isLow" class="low-badge">{{ i18nStore.t.resources.low }}</span>
        </div>

        <div class="resource-value">
          {{ resource.current }}
          <span class="unit">
            {{ i18nStore.t.admin[`${resource.unit}`] }}
          </span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: `${resource.percentage}%`,
              backgroundColor: getStatusColor(resource.isLow, resource.percentage),
            }"
          ></div>
        </div>

        <div class="threshold-info">
          {{ i18nStore.t.resources.alert }}: {{ resource.threshold }} {{ resource.unit }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource-monitor {
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

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 3px solid transparent;
  transition: all 0.3s;
}

.resource-card.low {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #ffe5e5 0%, #ffcccc 100%);
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
  }
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.resource-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.low-badge {
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.resource-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.unit {
  font-size: 1.2rem;
  font-weight: normal;
  color: #666;
  margin-left: 0.25rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  transition:
    width 0.3s,
    background-color 0.3s;
  border-radius: 6px;
}

.threshold-info {
  font-size: 0.85rem;
  color: #666;
}

@media (max-width: 768px) {
  .resource-monitor {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .resources-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .resource-card {
    padding: 1rem;
  }

  .resource-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
