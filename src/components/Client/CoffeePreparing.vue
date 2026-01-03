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
  top: 57vh;
  left: 64vh;
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
  top: 48vh;
  left: 68vh;
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
------- .coffee-cup {
  position: relative; /* allows stacking the two image layers */
  width: 170px;
  height: auto;
}

.coffee-cup img {
  width: 170px;
  height: auto;
  display: block;
}

/* Bottom layer — faded empty cup */
.cup-base {
  opacity: 0.4;
  filter: grayscale(100%);
}

/* Wrapper that defines the full cup area and clips the filling */
.cup-fill-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 170px;
  height: 100%;
  transition: height 0.3s linear; /* smooth filling animation */
  overflow: hidden; /* prevents the upper part of the fill image from showing */
}

/* Filling image that grows upward */
.cup-fill {
  position: absolute;
  bottom: 0; /* keeps the image anchored to the bottom */
  left: 0;
  width: 170px;
  height: 170px; /* dynamically updated via progressPercentage */
}
</style>
