import { I18nService } from "./src/translations/i18n.class";
import { vTranslate } from "./src/directive/vTranslate.directive";
import { App, Plugin } from "vue";

export type { I18nService }
import SelectLang from "./src/component/select-lang.vue";
export { SelectLang }
export default {
    install: (app: App, options) => {
        const i18n = new I18nService(options.availableLanguage, options.translationFilesUrl, options.defaultLang)
        app.provide('i18n', i18n);
        app.directive('translate', vTranslate(i18n));
    }
} as Plugin<{ availableLanguage: `${string}-${string}`[], translationFilesUrl: string, defaultLang: `${string}-${string}` }>
