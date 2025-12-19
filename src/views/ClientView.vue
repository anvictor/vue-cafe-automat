<script setup lang="ts">
import { ref } from 'vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import DepositPanel from '@/components/Client/DepositPanel.vue'
import CoffeeMenu from '@/components/Client/CoffeeMenu.vue'
import SugarControl from '@/components/Client/SugarControl.vue'
import PrepareButton from '@/components/Client/PrepareButton.vue'
import PreparationDisplay from '@/components/Client/PreparationDisplay.vue'
import CoffeeCup from '@/components/Client/CoffeeCup.vue'
import ChangeDisplay from '@/components/Client/ChangeDisplay.vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useDepositStore } from '@/stores/depositStore'

const coffeeStore = useCoffeeStore()
const depositStore = useDepositStore()
const changeAmount = ref(0)

// Watch for coffee taken to show change
coffeeStore.$subscribe((mutation, state) => {
  if (state.preparationStatus === 'taken') {
    changeAmount.value = depositStore.change
  }
})
</script>

<template>
  <div class="client-view">
    <div class="header">
      <h1>☕ Coffee Machine</h1>
      <LanguageSelector />
    </div>
    
    <div class="main-content">
      <div class="left-panel">
        <DepositPanel />
        <SugarControl />
      </div>
      
      <div class="center-panel">
        <CoffeeMenu />
        <PrepareButton />
        <PreparationDisplay />
        <CoffeeCup />
        <ChangeDisplay :amount="changeAmount" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.client-view {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.main-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Tablet and smaller desktops */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .left-panel {
    flex-direction: row;
    gap: 1rem;
  }
  
  .left-panel > * {
    flex: 1;
  }
}

/* Mobile portrait */
@media (max-width: 768px) {
  .client-view {
    padding: 0.25rem;
  }
  
  .header {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .main-content {
    gap: 1rem;
  }
  
  .left-panel {
    flex-direction: column;
    gap: 1rem;
  }
  
  .center-panel {
    gap: 1rem;
  }
}

/* Mobile landscape */
@media (max-width: 768px) and (orientation: landscape) {
  .client-view {
    padding: 0.25rem;
  }
  
  .header {
    padding: 0.5rem 1rem;
    margin-bottom: 0.75rem;
  }
  
  h1 {
    font-size: 1.25rem;
  }
  
  .main-content {
    grid-template-columns: 300px 1fr;
    gap: 1rem;
  }
  
  .left-panel {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .center-panel {
    gap: 0.75rem;
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
