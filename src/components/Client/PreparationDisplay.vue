<script setup lang="ts">
import { computed } from 'vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useI18nStore } from '@/stores/i18nStore'
import { PreparationStatus } from '@/types/Transaction'

const coffeeStore = useCoffeeStore()
const i18nStore = useI18nStore()

const isVisible = computed(() => {
  return coffeeStore.preparationStatus === PreparationStatus.PREPARING
})

const progressPercentage = computed(() => {
  return Math.round(coffeeStore.preparationProgress)
})
</script>

<template>
  <div v-if="isVisible" class="preparation-display">
    <span>{{ i18nStore.t.preparation.preparing }}...</span>
    <span>{{ progressPercentage }}%</span>
  </div>
</template>

<style scoped>
.preparation-display {
  position: absolute;
  top: 48vh;
  left: 69vh;
  /* padding: 2rem; */
  border-radius: 16px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b983 0%, #2ecc71 100%);
  transition: width 0.1s linear;
  border-radius: 16px;
}

.progress-text {
  font-size: 1.2rem;
  font-weight: bold;
}

.coffee-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.steam {
  font-size: 2rem;
  animation: float 2s ease-in-out infinite;
}

.cup {
  font-size: 4rem;
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}
</style>
