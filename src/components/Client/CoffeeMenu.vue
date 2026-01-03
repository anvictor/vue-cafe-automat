<script setup lang="ts">
import { CoffeeType } from '@/types/Coffee'
import { coffeeMenu } from '@/data/coffeeMenu'
import { useCoffeeStore } from '@/stores/coffeeStore'
import { useI18nStore } from '@/stores/i18nStore'

import espresso from '@/assets/images/Espresso.png'
import espresso_double from '@/assets/images/Espresso_double.png'
import americano from '@/assets/images/Americano.png'
import coffee_with_milk from '@/assets/images/Coffee_with_milk.png'
import cappuccino from '@/assets/images/Cappuccino.png'
import latte from '@/assets/images/Latte.png'
import macchiato from '@/assets/images/Macchiato.png'
import hot_milk from '@/assets/images/Hot_milk.png'
import hot_water from '@/assets/images/Hot_water.png'
const coffeeImageMap = {
  espresso,
  espresso_double,
  americano,
  coffee_with_milk,
  cappuccino,
  latte,
  macchiato,
  hot_milk,
  hot_water,
}
const getCoffeeImage = (type: CoffeeType) => {
  return coffeeImageMap[type]
}

const coffeeStore = useCoffeeStore()
const i18nStore = useI18nStore()

const handleSelectCoffee = (type: CoffeeType) => {
  coffeeStore.selectCoffee(type)
}

const getCoffeeName = (type: CoffeeType) => {
  const key = type as keyof typeof i18nStore.t.coffeeNames
  return i18nStore.t.coffeeNames[key]
}

const getCoffeeDescription = (type: CoffeeType) => {
  const key = type as keyof typeof i18nStore.t.coffeeDescriptions
  return i18nStore.t.coffeeDescriptions[key]
}

const formatPrice = (priceInCents: number) => {
  return `€${(priceInCents / 100).toFixed(2)}`
}
</script>

<template>
  <div class="coffee-menu">
    <div class="menu-grid">
      <div
        v-for="coffee in coffeeMenu"
        :key="coffee.type"
        class="coffee-card"
        :class="{ selected: coffeeStore.selectedCoffeeType === coffee.type }"
        @click="handleSelectCoffee(coffee.type)"
      >
        <div class="coffee-icon">
          <img :src="getCoffeeImage(coffee.type)" :alt="coffee.type" />
        </div>
        <h3>{{ getCoffeeName(coffee.type) }}</h3>
        <p class="description">{{ getCoffeeDescription(coffee.type) }}</p>
        <div class="price">{{ formatPrice(coffee.price) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coffee-menu {
  position: absolute;
  top: 38vh;
  left: 62vh;
  transform: translate(-50%, -50%);
  border-radius: 16px;
}

h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  text-align: center;
  font-size: 1.3rem;
}

.menu-grid {
  display: flex;
  gap: 0.75rem;
}

.coffee-card {
  color: #e0f7e9;
  background: #f0f8ff17;
  width: 10vh;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid gray;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coffee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.coffee-card.selected {
  border-color: #42b983;
  color: #42b983;
  background: linear-gradient(135deg, #e0f7e9 0%, #a8e6cf 100%);
}

.coffee-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

h3 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}

.description {
  margin: 0 0 0.5rem 0;

  font-size: 0.75rem;
  line-height: 1.3;
  min-height: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.price {
  font-weight: bold;
  color: #42b983;
  font-size: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>
