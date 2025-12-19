import { Language } from '@/types/i18n'
import type { Translations } from '@/types/i18n'
import { en } from './en'
import { es } from './es'
import { ua } from './ua'

export const translations: Record<Language, Translations> = {
    [Language.EN]: en,
    [Language.ES]: es,
    [Language.UA]: ua
}

export { Language }
export type { Translations }
