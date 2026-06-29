import { I18nService } from "./src/translations/i18n.class";
import { vTranslate } from "./src/directive/vTranslate.directive";
import { App, Plugin } from "vue";
import SelectLang from './src/component/select-lang.vue'

export default {
    install: (app: App, options) => {
        const i18n = new I18nService(options.availableLanguage, options.translationFilesUrl, options.defaultLang);
        app.provide('i18n', i18n);
        app.directive('translate', vTranslate(i18n));
        app.component('SelectLang', SelectLang);
    }
} as Plugin<{ availableLanguage: `${string}-${string}`[], translationFilesUrl: string, defaultLang: `${string}-${string}` }>

export { useTranslate } from "./src/composable/useTranslate"
export type { TranslateParams } from "./src/composable/useTranslate"
export type { I18nService }
