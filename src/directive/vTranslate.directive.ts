import { type DirectiveBinding, inject } from "vue";
import type { I18nService } from "../translations/i18n.class.ts";

export const vTranslate = {
    mounted: (el: HTMLElement, binding: DirectiveBinding<string>) => {
        console.log(binding);
        el.innerText = inject<I18nService>('i18n')?.getKey(binding.value) ?? binding.value;
    }
}
