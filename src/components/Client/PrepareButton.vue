<script setup lang="ts">
import { computed } from 'vue'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useDepositStore } from '@/stores/depositStore'
import { useResourceStore } from '@/stores/resourceStore'
import { useI18nStore } from '@/stores/i18nStore'
import { PreparationStatus } from '@/types/Transaction'

const coffeeStore = useCoffeeStore()
const depositStore = useDepositStore()
const resourceStore = useResourceStore()
const i18nStore = useI18nStore()

const handlePrepare = async () => {
  await coffeeStore.prepareCoffee()
}

const buttonText = computed(() => {
  if (coffeeStore.preparationStatus === PreparationStatus.PREPARING) {
    return i18nStore.t.preparation.preparing
  }
  return i18nStore.t.preparation.prepare
})

const buttonDisabled = computed(() => {
  return !coffeeStore.canPrepare
})

const disabledReason = computed(() => {
  if (!coffeeStore.selectedRecipe) return ''
  if (!depositStore.hasSufficientFunds) {
    return i18nStore.t.preparation.insufficientFunds
  }
  if (
    coffeeStore.requiredIngredients &&
    !resourceStore.canMakeCoffee(coffeeStore.requiredIngredients)
  ) {
    return i18nStore.t.preparation.insufficientResources
  }
  return ''
})
</script>

<template>
  <div class="prepare-button-container">
    <button
      class="prepare-btn"
      :class="{ preparing: coffeeStore.preparationStatus === PreparationStatus.PREPARING }"
      :disabled="buttonDisabled"
      @click="handlePrepare"
    >
      {{ buttonText }}
    </button>

    <div v-if="buttonDisabled && disabledReason" class="disabled-reason">
      {{ disabledReason }}
    </div>
  </div>
</template>

<style scoped>
.prepare-button-container {
  text-align: center;
  position: absolute;
  margin: 0 0 0 13px;
  height: 93px;
  top: 14%;
  left: 70%;
  width: 234px;
  z-index: 1;
}

.prepare-btn {
  width: 100%;
  height: 45px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(66, 185, 131, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.prepare-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(66, 185, 131, 0.4);
}

.prepare-btn:active:not(:disabled) {
  transform: translateY(0);
}

.prepare-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.prepare-btn.preparing {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.disabled-reason {
  margin-top: 11px;
  color: #e74c3c;
  font-weight: 600;
  font-size: 1rem;
}
</style>
