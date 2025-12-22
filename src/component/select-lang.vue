<script setup lang="ts">
import { inject } from "vue";
import type { I18nService } from "../../";
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { hasFlag } from "country-flag-icons";

const i18n = inject<I18nService>('i18n');
function handleSelectLang(event: Event) {
  if ( i18n && event.target instanceof HTMLSelectElement )
    i18n.activeLanguage = event.target?.value as `${ string }-${ string }`
}

function getFlagIcon(lang: string) {
  const country = lang.split('-')[1];

  return country && hasFlag(country) ? getUnicodeFlagIcon(country) : '';
}
</script>

<template>
  <select v-if="i18n" :value="i18n.languageRef.value" v-on:change="handleSelectLang">
    <option v-for="lang of i18n.availableLanguages" :value="lang">{{getFlagIcon(lang)}} {{ lang }}</option>
  </select>
</template>

<style scoped>

</style>
