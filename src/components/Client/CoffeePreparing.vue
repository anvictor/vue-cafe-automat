<script setup lang="ts">
import { computed } from 'vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useI18nStore } from '@/stores/i18nStore'
import { PreparationStatus } from '@/types/Transaction'
import CoffeeProgressCup from '@/components/Client/CoffeeProgressCup.vue'

const coffeeStore = useCoffeeStore()
const i18nStore = useI18nStore()
console.log('coffeeStore.selectedCoffeeType', coffeeStore.selectedCoffeeType)
const isReady = computed(() => {
  return coffeeStore.preparationStatus === PreparationStatus.READY
})
</script>

<template>
  <div v-if="isReady" class="ready-message">
    {{ i18nStore.t.preparation.ready }}
    <br />
    <span class="click-hint">{{ i18nStore.t.preparation.takeCoffee }}</span>
  </div>
  <CoffeeProgressCup />
</template>

<style scoped>
.coffee-cup-container {
  position: absolute;
  top: 57%;
  left: 46%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
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

.ready-message {
  position: absolute;
  top: 48%;
  left: 49%;
  z-index: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: hsl(62, 100%, 50%);
  animation: glow 1.5s ease-in-out infinite;
}

.click-hint {
  font-size: 1rem;
  font-weight: normal;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(66, 185, 131, 0.8);
  }
}

.coffee-cup {
  position: relative;
  width: 170px;
  height: auto;
}

.coffee-cup img {
  width: 170px;
  height: auto;
  display: block;
}

.cup-base {
  opacity: 0.4;
  filter: grayscale(100%);
}

.cup-fill-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 170px;
  height: 100%;
  transition: height 0.3s linear;
  overflow: hidden;
}

.cup-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 170px;
  height: 170px;
}
</style>
