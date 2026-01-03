<script setup lang="ts">
import { computed } from 'vue'
import { useDepositStore } from '@/stores/depositStore'
import { useI18nStore } from '@/stores/i18nStore'

const depositStore = useDepositStore()
const i18nStore = useI18nStore()

const formattedCurrentBalance = computed(() => {
  return formatEuro(depositStore.currentBalance)
})

const formattedRequiredAmount = computed(() => {
  return formatEuro(depositStore.requiredAmount)
})

const handleInsertCoin = () => {
  depositStore.insertCoin()
}

const formatEuro = (cents: number) => {
  return `€${(cents / 100).toFixed(2)}`
}
</script>

<template>
  <div class="deposit-panel">
    <div class="balance-display">
      <span class="label">{{ i18nStore.t.deposit.balance }}:</span>
      <span class="value">{{ formattedCurrentBalance }}</span>
    </div>
    <div class="balance-display">
      <span class="label">{{ i18nStore.t.deposit.required }}:</span>
      <span class="value">{{ formattedRequiredAmount }}</span>
    </div>

    <button class="insert-coin-btn" @click="handleInsertCoin">
      <span class="coin-icon">🪙</span>
      {{ i18nStore.t.deposit.insertCoin }}
    </button>
  </div>
</template>

<style scoped>
.deposit-panel {
  position: absolute;
  top: 21vh;
  left: 13vh;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  color: white;
  background: linear-gradient(45deg, black, #686565bf);
}
.deposit-panel span {
  width: 89px;

  text-align: center;
}

h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  text-align: center;
}

.balance-display {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.balance-item.required {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.label {
  opacity: 0.9;
}

.value {
  font-size: 1.5rem;
  font-weight: bold;
}

.insert-coin-btn {
  width: 199px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgb(255 255 255 / 54%);
  color: #667eea;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.insert-coin-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.insert-coin-btn:active {
  transform: translateY(0);
}

.coin-icon {
  font-size: 1.5rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0%,
  90% {
    transform: rotateY(0deg);
  }
  95% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>
