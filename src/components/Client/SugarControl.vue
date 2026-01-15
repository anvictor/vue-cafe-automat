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
  position: absolute;
  background: #f0f8ff17;
  position: absolute;
  background: #f0f8ff17;
  left: 42%;
  top: 12%;
  z-index: 1;
  margin: 0px 0px 0px 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid gray;
  color: white;
  border-radius: 12px;
  width: 26%;
  height: 10%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.1rem;
  text-align: center;
}

.sugar-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 0 7px 0;
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
}

.unit {
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
</style>
