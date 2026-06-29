import { type DirectiveBinding, watch } from "vue";
import { I18nService } from "../translations/i18n.class";
import type { TranslateParams } from "../composable/useTranslate";

type TranslateBinding = string | { key: string; params?: TranslateParams };

function normalize(value: TranslateBinding): { key: string; params?: TranslateParams } {
    return typeof value === "string" ? { key: value } : value;
}

export const vTranslate = (i18n: I18nService) => ({
    async mounted(el: HTMLElement, binding: DirectiveBinding<TranslateBinding>) {
        const render = async () => {
            const { key, params } = normalize(binding.value);
            el.innerText = await i18n.getKey(key, params) ?? key;
        };
        await render();
        watch(i18n.languageRef, render);
    },
    async updated(el: HTMLElement, binding: DirectiveBinding<TranslateBinding>) {
        const { key, params } = normalize(binding.value);
        el.innerText = await i18n.getKey(key, params) ?? key;
    }
});
