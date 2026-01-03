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
import type { RefillEvent } from '@/types/WebSocket'

const coffeeStore = useCoffeeStore()
const depositStore = useDepositStore()
const resourceStore = useResourceStore()
const ws = useWebSocket()
const changeAmount = ref(0)

// Watch for coffee taken to show change
coffeeStore.$subscribe((mutation, state) => {
  if (state.preparationStatus === 'taken') {
    changeAmount.value = depositStore.change
  }
})

// WebSocket connection and listeners
onMounted(() => {
  ws.connect()

  // Listen for refill updates from admin
  ws.onRefillUpdate((data: RefillEvent) => {
    console.log('[Client] Received refill update:', data)
    resourceStore.refillResources(data.amounts)
  })
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
      <DepositPanel />
      <SugarControl />

      <CoffeeMenu />
      <PrepareButton />
      <PreparationDisplay />
      <CoffeePreparing />
      <ChangeDisplay :amount="changeAmount" />
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  max-width: 1400px;
  margin: 0 auto;

  display: flex;
  flex-direction: column; /* header on top by default */
  height: 100vh; /* occupy full screen height */
}

/* HEADER */
.client-view .header {
  flex: 0 0 auto; /* minimal height */
}

/* MAIN CONTENT */
.client-view .main-content {
  flex: 1 1 auto;
  position: relative;
  background-image: url('@/assets/images/mashine_bgrnd.png');

  /* Maintain background image aspect ratio */
  aspect-ratio: 2304 / 1728;
  max-height: 100vh;

  background-size: contain; /* fit entire image without cropping */
  background-position: center;
  background-repeat: no-repeat;
}

/* -------------------------------------- */
/* 1. Smartphone in landscape orientation */
/* -------------------------------------- */
@media (orientation: landscape) and (max-width: 900px) {
  .client-view {
    flex-direction: row; /* header on the left, content on the right */
    height: 100vh;
  }

  .client-view .header {
    width: auto;
    min-width: 80px; /* minimal width */
    height: 100%;
  }

  .client-view .main-content {
    position: relative;

    flex: 1;
    height: 100vh; /* cannot exceed screen height */
    aspect-ratio: 2304 / 1728;
    background-image: url('@/assets/images/mashine_bgrnd.png');
  }
}

/* -------------------------------------- */
/* 2. Smartphone in portrait orientation  */
/* -------------------------------------- */
@media (orientation: portrait) and (max-width: 900px) {
  .client-view {
    flex-direction: column; /* header on top */
    height: 100vh;
  }

  .client-view .header {
    height: auto;
    min-height: 60px;
  }

  .client-view .main-content {
    position: relative;

    flex: 1;
    width: 100%;
    max-height: calc(100vh - 60px); /* fill remaining space */
  }
}

/* ------------------------------ */
/* 3. Wide screens (desktop/tablet) */
/* ------------------------------ */
@media (min-width: 900px) {
  .client-view {
    flex-direction: column; /* header on top */
    height: auto;
  }

  .client-view .main-content {
    position: relative;

    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    aspect-ratio: 2304 / 1728;
  }
}
</style>
