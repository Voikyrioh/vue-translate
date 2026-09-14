---
id: ADR-0001
titre: Plugin Vue 3 avec inject/provide
type: architecture
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: []
---

# ADR-0001 — Plugin Vue 3 avec inject/provide

## Contexte

Plugin Vue 3 pour i18n doit rendre une instance `I18nService` (state, méthodes) accessible à tous les composants, composables et directives sans prop-drilling.

## Décision

Implémenter un plugin Vue standard (`install(app, options)`) qui :
1. Instancie `I18nService` une seule fois
2. La fournit globalement via `app.provide('i18n', i18nInstance)`
3. Enregistre la directive `v-translate` et le composant `SelectLang` globalement
4. Exporte `useTranslate()` composable qui injecte (`inject('i18n')`) avec fallback erreur

## Comment l'appliquer

- Point d'entrée : `index.ts` contient le plugin
- Installation : `app.use(VueTranslate, { availableLanguage, translationFilesUrl, defaultLang })`
- Consommation composable : `const { t } = useTranslate()`
- Consommation directive : `<p v-translate="'key'" />` ou `<p v-translate="{ key, params }" />`

## Quand NE PAS l'appliquer / limites

- Ne pas créer plusieurs instances `I18nService` (state décentralisé cassé)
- Si besoin d'i18n multi-tenant → redesign requis (provider par tenant)

## Alternatives rejetées

- Props drilling : verbeux, inextensible (comporte vue v-if/v-for)
- Context API uniquement (Vue 2 style) : moins type-safe que Provide/Inject + TypeScript

## Conséquences

- Tous les composants/composables ont accès centralité à `i18nService`
- Type-safe grâce à export `type { I18nService }`
- Une seule instance en mémoire (singleton pattern)

## Références

- [Vue Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- `index.ts` — Plugin install
- `src/composable/useTranslate.ts` — Injection pattern
