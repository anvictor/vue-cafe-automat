<script setup lang="ts">
import { useI18nStore } from '@/stores/i18nStore'
import { Language } from '@/types/i18n'

const i18nStore = useI18nStore()

const languages = [
  { code: Language.EN, label: 'EN' },
  { code: Language.ES, label: 'ES' },
  { code: Language.UA, label: 'UA' }
]
</script>

<template>
  <div class="language-selector">
    <button
      v-for="lang in languages"
      :key="lang.code"
      :class="{ active: i18nStore.currentLanguage === lang.code }"
      @click="i18nStore.setLanguage(lang.code)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<style scoped>
.language-selector {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.language-selector button {
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.2);
  color: #2c3e50;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.language-selector button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.language-selector button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}
</style>
