<script setup lang="ts">
import espresso from '@/assets/images/Espresso.png'
import espresso_double from '@/assets/images/Espresso_double.png'
import americano from '@/assets/images/Americano.png'
import coffee_with_milk from '@/assets/images/Coffee_with_milk.png'
import cappuccino from '@/assets/images/Cappuccino.png'
import latte from '@/assets/images/Latte.png'
import macchiato from '@/assets/images/Macchiato.png'
import hot_milk from '@/assets/images/Hot_milk.png'
import hot_water from '@/assets/images/Hot_water.png'
import type { CoffeeType } from '@/types/Coffee'
const coffeeImageMap = {
  espresso,
  espresso_double,
  americano,
  coffee_with_milk,
  cappuccino,
  latte,
  macchiato,
  hot_milk,
  hot_water,
}
const getCoffeeImage = (type: CoffeeType) => {
  return coffeeImageMap[type]
}

import { computed } from 'vue'
import { useCoffeeStore } from '@/stores/coffeeStore'

const coffeeStore = useCoffeeStore()

const progressPercent = computed(() => {
  return Math.min(100, Math.max(0, coffeeStore.preparationProgress))
})

const showProgress = computed(() => {
  return coffeeStore.preparationStatus === 'preparing'
})

const isTaken = computed(() => {
  return coffeeStore.preparationStatus === 'taken'
})
</script>
<template>
  <div v-if="showProgress" class="coffee-progress">
    <!-- Нижнє ч/б зображення -->
    <img
      v-if="coffeeStore.selectedCoffeeType"
      class="coffee-img base"
      :src="getCoffeeImage(coffeeStore.selectedCoffeeType)"
      alt="{{getCoffeeImage(coffeeStore.selectedCoffeeType)}}"
    />

    <!-- Контейнер, який відкриває кольорове зображення -->
    <div class="color-mask" :style="{ height: progressPercent + '%', overflow: 'hidden' }">
      <img
        v-if="coffeeStore.selectedCoffeeType"
        class="coffee-img color"
        :src="getCoffeeImage(coffeeStore.selectedCoffeeType)"
        alt="{{getCoffeeImage(coffeeStore.selectedCoffeeType)}}"
      />
    </div>
  </div>
  <div v-if="!isTaken" class="coffee-progress">
    <!-- Нижнє ч/б зображення -->
    <img
      v-if="coffeeStore.selectedCoffeeType"
      class="coffee-img base"
      :src="getCoffeeImage(coffeeStore.selectedCoffeeType)"
      alt="{{getCoffeeImage(coffeeStore.selectedCoffeeType)}}"
    />

    <!-- Контейнер, який відкриває кольорове зображення -->
    <div class="color-mask" :style="{ height: progressPercent + '%', overflow: 'hidden' }">
      <img
        v-if="coffeeStore.selectedCoffeeType"
        class="coffee-img color"
        :src="getCoffeeImage(coffeeStore.selectedCoffeeType)"
        alt="{{getCoffeeImage(coffeeStore.selectedCoffeeType)}}"
      />
    </div>
  </div>
</template>

<style scoped>
/* Контейнер з фіксованою пропорцією 4:3 */
.coffee-progress {
  position: absolute;
  top: 650px;
  left: 720px;
  width: 200px;
  aspect-ratio: 1 / 1; /* адаптивність + фіксована пропорція */
  overflow: hidden;
}

/* Обидва зображення однакового розміру */
.coffee-img {
  position: absolute;
  bottom: 0; /* вирівнювання по низу */
  left: 0;
  width: 100%;
  /* height: 100%; */
  object-fit: contain; /* зберігає пропорції */
  pointer-events: none;
}

/* Маска, яка відкриває кольорове зображення */
.color-mask {
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 0;
  left: 0;
}

.base {
  z-index: 1;
  filter: grayscale(100%);
}

.color {
  z-index: 2;
}
</style>
