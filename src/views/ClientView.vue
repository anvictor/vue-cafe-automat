<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import DepositPanel from '@/components/Client/DepositPanel.vue'
import CoffeeMenu from '@/components/Client/CoffeeMenu.vue'
import SugarControl from '@/components/Client/SugarControl.vue'
import PrepareButton from '@/components/Client/PrepareButton.vue'
import PreparationDisplay from '@/components/Client/PreparationDisplay.vue'
import CoffeePreparing from '@/components/Client/CoffeePreparing.vue'
import ChangeDisplay from '@/components/Client/ChangeDisplay.vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useDepositStore } from '@/stores/depositStore'
import { useResourceStore } from '@/stores/resourceStore'
import { useWebSocket } from '@/composables/useWebSocket'
import { useResponsiveScale } from '@/composables/useResponsiveScale'
import type { RefillEvent } from '@/types/WebSocket'

const coffeeStore = useCoffeeStore()
const depositStore = useDepositStore()
const resourceStore = useResourceStore()
const ws = useWebSocket()
const changeAmount = ref(0)

// Responsive scaling for coffee machine container
const { scaleFactor, BASE_WIDTH, BASE_HEIGHT } = useResponsiveScale()

// Watch for coffee taken to show change
coffeeStore.$subscribe((mutation, state) => {
  if (state.preparationStatus === 'taken') {
    changeAmount.value = depositStore.change
  }
})

// WebSocket connection and listeners
onMounted(async () => {
  ws.connect()

  // Listen for refill updates from admin
  ws.onRefillUpdate((data: RefillEvent) => {
    console.log('[Client] Received refill update:', data)
    resourceStore.refillResources(data.amounts)
  })

  // Load client resources from Google Sheets
  await resourceStore.loadFromGoogleSheets()
})

onUnmounted(() => {
  // Clean up listeners but keep connection alive
  ws.offRefillUpdate(() => {})
})
</script>

<template>
  <div class="client-view">
    <div class="header">
      <h1>☕ Coffee Machine</h1>
      <LanguageSelector />
    </div>

    <div class="main-content">
      <div
        class="coffee-machine-container"
        :style="{
          transform: `scale(${scaleFactor})`,
          // width: `${BASE_WIDTH}px`,
        }"
      >
        <!-- Background image as img element to scale with transform -->
        <img
          src="@/assets/images/mashine_bgrnd.png"
          alt="Coffee Machine"
          class="machine-background"
        />

        <!-- UI Elements -->
        <DepositPanel />
        <SugarControl />
        <CoffeeMenu />
        <PrepareButton />
        <PreparationDisplay />
        <CoffeePreparing />
        <ChangeDisplay :amount="changeAmount" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2);
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

/* Base layout for all screen sizes */
.client-view {
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.client-view .header {
  flex: 0 0 auto;
}

/* MAIN CONTENT - Wrapper for scaling container */
.main-content {
  background: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  min-height: 0; /* Allow flex item to shrink below content size */
}

/* COFFEE MACHINE CONTAINER - Fixed size with transform scale */
.coffee-machine-container {
  width: 100%;
  position: relative;
  transform-origin: center center;
  aspect-ratio: 3238/1728;
  /* Ensure all absolute positioned children scale with container */
}

/* Background image as img element */
.machine-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none; /* Allow clicks to pass through to UI elements */
  z-index: 0; /* Behind all UI elements */
}
</style>
