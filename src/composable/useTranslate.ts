import { inject } from "vue";
import { I18nService } from "../translations/i18n.class";

export type TranslateParams = Record<string, string | number>;

/**
 * Reactive translation composable. Returns a `t` function usable in templates
 * (`{{ t('key', { name }) }}`) and scripts. Re-renders on language switch and
 * once the translation file finishes loading.
 */
export function useTranslate() {
    const i18n = inject<I18nService>('i18n');
    if (!i18n) throw new Error('[vue-translate] plugin not installed: useTranslate() called without app.use(vueTranslate)');

    const t = (key: string, params?: TranslateParams): string => i18n.resolve(key, params);

    return { t, i18n };
}
