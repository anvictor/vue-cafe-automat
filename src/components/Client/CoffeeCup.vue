<script setup lang="ts">
import { computed } from 'vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useI18nStore } from '@/stores/i18nStore'
import { PreparationStatus } from '@/types/Transaction'

const coffeeStore = useCoffeeStore()
const i18nStore = useI18nStore()

const isReady = computed(() => {
  return coffeeStore.preparationStatus === PreparationStatus.READY
})

const isPreparing = computed(() => {
  return coffeeStore.preparationStatus === PreparationStatus.PREPARING
})

const handleTakeCoffee = () => {
  coffeeStore.takeCoffee()
}
</script>

<template>
  <div class="coffee-cup-container">
    <div 
      v-if="isReady || isPreparing"
      class="coffee-cup"
      :class="{ 
        ready: isReady, 
        preparing: isPreparing 
      }"
      @click="isReady ? handleTakeCoffee() : null"
    >
      <div class="cup-icon">☕</div>
      <div v-if="isReady" class="ready-message">
        {{ i18nStore.t.preparation.ready }}
        <br>
        <span class="click-hint">{{ i18nStore.t.preparation.takeCoffee }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coffee-cup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.coffee-cup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 16px;
  transition: all 0.3s;
}

.coffee-cup.preparing {
  opacity: 0.5;
  filter: grayscale(100%);
  cursor: not-allowed;
}

.coffee-cup.ready {
  cursor: pointer;
  animation: bounce 1s ease-in-out infinite;
}

.coffee-cup.ready:hover {
  transform: scale(1.1);
}

.cup-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
}

.ready-message {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  animation: glow 1.5s ease-in-out infinite;
}

.click-hint {
  font-size: 1rem;
  color: #666;
  font-weight: normal;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(66, 185, 131, 0.8);
  }
}
</style>
