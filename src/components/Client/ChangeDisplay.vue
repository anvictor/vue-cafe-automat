<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18nStore } from '@/stores/i18nStore'

const props = defineProps<{
  amount: number // in cents
}>()

const i18nStore = useI18nStore()
const isVisible = ref(false)

watch(() => props.amount, (newAmount) => {
  if (newAmount > 0) {
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }
})

const formatEuro = (cents: number) => {
  return `€${(cents / 100).toFixed(2)}`
}

// Generate coin images based on amount (in cents)
const coins = ref<number[]>([])

watch(() => props.amount, (newAmount) => {
  if (newAmount > 0) {
    // Break down amount into euro coins (50, 20, 10, 5, 2, 1 cents)
    const coinArray: number[] = []
    let remaining = newAmount
    
    // Use largest coins first (in cents)
    const coinValues = [50, 20, 10, 5, 2, 1]
    for (const value of coinValues) {
      while (remaining >= value) {
        coinArray.push(value)
        remaining -= value
      }
    }
    
    coins.value = coinArray
  }
})
</script>

<template>
  <transition name="fade">
    <div v-if="isVisible && amount > 0" class="change-display">
      <h3>{{ i18nStore.t.deposit.change }}: {{ formatEuro(amount) }}</h3>
      
      <div class="coins-container">
        <div 
          v-for="(coin, index) in coins" 
          :key="index"
          class="coin"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          🪙 {{ coin }}¢
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.change-display {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem;
  border-radius: 16px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
}

h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.coins-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.coin {
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  animation: coinDrop 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes coinDrop {
  0% {
    opacity: 0;
    transform: translateY(-50px) rotate(0deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(360deg);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
