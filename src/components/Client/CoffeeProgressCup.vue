<script setup lang="ts">
// Cup images - small size
import cupSmallBwPreparing from '@/assets/images/cupSmallBwPreparing.png'
import cupSmallColorPreparing from '@/assets/images/cupSmallColorPreparing.png'
import cupSmallColorReady from '@/assets/images/cupSmallColorReady.png'

// Cup images - large size
import cupBigBwPreparing from '@/assets/images/cupBigBwPreparing.png'
import cupBigColorPreparing from '@/assets/images/cupBigColorPreparing.png'
import cupBigColorReady from '@/assets/images/cupBigColorReady.png'

import { CupSize } from '@/types/Coffee'
import { computed } from 'vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { PreparationStatus } from '@/types/Transaction'

const coffeeStore = useCoffeeStore()

const progressPercent = computed(() => {
  return Math.min(100, Math.max(0, coffeeStore.preparationProgress))
})

const showProgress = computed(() => {
  return coffeeStore.preparationStatus === PreparationStatus.PREPARING
})

const isReady = computed(() => {
  return coffeeStore.preparationStatus === PreparationStatus.READY
})

const showCup = computed(() => {
  // return true
  return showProgress.value || isReady.value
})

// Get cup size from current recipe
const cupSize = computed(() => {
  return coffeeStore.requiredIngredients?.cup || CupSize.SMALL
})

// Get appropriate cup images based on size and status
const cupImages = computed(() => {
  const isSmall = cupSize.value === CupSize.SMALL

  return {
    bw: isSmall ? cupSmallBwPreparing : cupBigBwPreparing,
    color: isReady.value
      ? isSmall
        ? cupSmallColorReady
        : cupBigColorReady
      : isSmall
        ? cupSmallColorPreparing
        : cupBigColorPreparing,
  }
})

const handleTakeCoffee = () => {
  if (isReady.value) {
    coffeeStore.takeCoffee()
  }
}
</script>

<template>
  <div
    v-if="showCup"
    class="coffee-progress"
    :class="{ ready: isReady, preparing: showProgress }"
    @click="handleTakeCoffee"
  >
    <!-- Grayscale base image -->
    <img v-if="!isReady" class="coffee-img base" :src="cupImages.bw" alt="Coffee cup" />

    <!-- Color mask that reveals the colored image based on progress height: progressPercent -->
    <div class="color-mask" :style="{ height: progressPercent + '%' }">
      <img class="coffee-img color" :src="cupImages.color" alt="Coffee cup" />
    </div>
  </div>
</template>

<style scoped>
/* Container with fixed aspect ratio */
.coffee-progress {
  position: absolute;
  top: 649px;
  left: 768px;
  width: 123px;
  aspect-ratio: 287 / 460;
  overflow: hidden;
  transition: transform 0.3s ease;
}

/* Preparing state - semi-transparent */
.coffee-progress.preparing {
  cursor: not-allowed;
}

/* Ready state - pulse animation and pointer cursor */
.coffee-progress.ready {
  cursor: pointer;
  animation: pulse 1s ease-in-out infinite;
}

.coffee-progress.ready:hover {
  transform: scale(1.05);
}

/* Both images same size */
.coffee-img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* Mask that reveals the colored image */
.color-mask {
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  opacity: 1;
  transition: height 0.3s linear;
}

.base {
  z-index: 1;
  filter: grayscale(100%);
  opacity: 0.7;
}

.color {
  z-index: 2;
}

/* Pulse animation for ready coffee - smooth scale from 100% to 95% */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
}
</style>
