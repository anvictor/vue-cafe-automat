<script setup lang="ts">
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useI18nStore } from '@/stores/i18nStore'

const coffeeStore = useCoffeeStore()
const i18nStore = useI18nStore()

const handleAdjustSugar = (delta: number) => {
  coffeeStore.adjustSugar(delta)
}
</script>

<template>
  <div class="sugar-control">
    <h3>{{ i18nStore.t.sugar.title }}</h3>
    
    <div class="sugar-display">
      <button 
        class="sugar-btn"
        @click="handleAdjustSugar(-1)"
        :disabled="coffeeStore.sugarAmount <= 0"
      >
        −
      </button>
      
      <div class="sugar-amount">
        <span class="amount">{{ coffeeStore.sugarAmount }}</span>
        <span class="unit">{{ i18nStore.t.sugar.teaspoons }}</span>
      </div>
      
      <button 
        class="sugar-btn"
        @click="handleAdjustSugar(1)"
        :disabled="coffeeStore.sugarAmount >= 5"
      >
        +
      </button>
    </div>
  </div>
</template>

<style scoped>
.sugar-control {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  text-align: center;
}

.sugar-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.sugar-btn {
  width: 48px;
  height: 48px;
  border: 2px solid #42b983;
  background: white;
  color: #42b983;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sugar-btn:hover:not(:disabled) {
  background: #42b983;
  color: white;
  transform: scale(1.1);
}

.sugar-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.sugar-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.unit {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sugar-control {
    padding: 1.25rem;
  }
  
  h3 {
    font-size: 1rem;
  }
  
  .sugar-btn {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
  
  .amount {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .sugar-control {
    padding: 1rem;
  }
  
  h3 {
    font-size: 0.95rem;
  }
  
  .sugar-display {
    gap: 1rem;
  }
  
  .sugar-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .amount {
    font-size: 1.5rem;
  }
  
  .unit {
    font-size: 0.8rem;
  }
}
</style>
