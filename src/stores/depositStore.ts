import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DEFAULT_COIN_VALUE } from '@/data/constants'

export const useDepositStore = defineStore('deposit', () => {
    // State
    const currentBalance = ref(0)
    const requiredAmount = ref(0)

    // Getters
    const hasSufficientFunds = computed(() => currentBalance.value >= requiredAmount.value)
    const change = computed(() => Math.max(0, currentBalance.value - requiredAmount.value))

    // Actions
    function insertCoin(amount: number = DEFAULT_COIN_VALUE) {
        currentBalance.value += amount
    }

    function setRequiredAmount(amount: number) {
        requiredAmount.value = amount
    }

    function deductAmount(amount: number) {
        if (currentBalance.value >= amount) {
            currentBalance.value -= amount
            return true
        }
        return false
    }

    function returnChange(): number {
        const changeAmount = change.value
        currentBalance.value = 0
        requiredAmount.value = 0
        return changeAmount
    }

    function reset() {
        currentBalance.value = 0
        requiredAmount.value = 0
    }

    return {
        currentBalance,
        requiredAmount,
        hasSufficientFunds,
        change,
        insertCoin,
        setRequiredAmount,
        deductAmount,
        returnChange,
        reset
    }
})
