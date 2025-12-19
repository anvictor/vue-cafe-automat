import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Language, translations } from '@/data/i18n'
import type { Translations } from '@/types/i18n'

export const useI18nStore = defineStore('i18n', () => {
    // State
    const currentLanguage = ref<Language>(Language.UA)

    // Getters
    const t = computed<Translations>(() => translations[currentLanguage.value])

    // Actions
    function setLanguage(lang: Language) {
        currentLanguage.value = lang
        // Save to localStorage for persistence
        localStorage.setItem('coffee-machine-language', lang)
    }

    function initLanguage() {
        const saved = localStorage.getItem('coffee-machine-language') as Language
        if (saved && Object.values(Language).includes(saved)) {
            currentLanguage.value = saved
        }
    }

    return {
        currentLanguage,
        t,
        setLanguage,
        initLanguage
    }
})
