import { type DirectiveBinding, Ref, watch } from "vue";
import { I18nService } from "../translations/i18n.class";

export const vTranslate = (i18n: I18nService) => ({
    async mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
        el.innerText = await i18n.getKey(binding.value) ?? binding.value
        i18n.ready.subscribe(console.log)
        watch(i18n.languageRef, async () => el.innerText = await i18n.getKey(binding.value) ?? binding.value)
    }
})
