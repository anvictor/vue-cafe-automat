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
    <h2>{{ i18nStore.t.deposit.title }}</h2>

    <div class="balance-display">
      <div class="balance-item">
        <span class="label">{{ i18nStore.t.deposit.balance }}:</span>
        <span class="value">{{ formattedCurrentBalance }}</span>
      </div>

      <div class="balance-item required">
        <span class="label">{{ i18nStore.t.deposit.required }}:</span>
        <span class="value">{{ formattedRequiredAmount }}</span>
      </div>
    </div>

    <button class="insert-coin-btn" @click="handleInsertCoin">
      <span class="coin-icon">🪙</span>
      {{ i18nStore.t.deposit.insertCoin }}
    </button>
  </div>
</template>

<style scoped>
.deposit-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  text-align: center;
}

.balance-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
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
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
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

/* Mobile responsive */
@media (max-width: 768px) {
  .deposit-panel {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  .balance-display {
    padding: 1rem;
  }

  .balance-item {
    font-size: 1rem;
  }

  .value {
    font-size: 1.25rem;
  }

  .insert-coin-btn {
    padding: 0.875rem 1.5rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .deposit-panel {
    padding: 1rem;
  }

  h2 {
    font-size: 1.1rem;
  }

  .balance-item {
    font-size: 0.9rem;
  }

  .value {
    font-size: 1.1rem;
  }
}
</style>
