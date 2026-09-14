# Architecture — @Voikyrioh/vue-translate

Stack : Vue 3, TypeScript, Zod · Style : plugin Vue · Entrée : `index.ts`
Maj : 2026-09-14

## Vue d'ensemble

Plugin Vue 3 pour l'internationalization (i18n) avec support des directives (`v-translate`), composables (`useTranslate()`), composant sélecteur (`SelectLang`), interpolation de paramètres `{name}`, et chargement asynchrone des fichiers de traduction. Valide avec Zod, réactif sur changement de langue via refs Vue.

## Carte

```
index.ts                           → Point d'entrée plugin ; exporte I18nService, useTranslate, types
src/
├── translations/                  → Services de traduction (chargement fichiers, résolution clés)
│   ├── i18n.class.ts             → I18nService (état langue, cache fichiers, readiness Observable)
│   └── file-service.ts           → TranslationFile (Zod + pattern `#text#` → `<code>`, interpolation {name})
├── composable/                    → Réactivité Vue dans les scripts
│   └── useTranslate.ts           → useTranslate() (injecte I18nService, retourne t() réactive)
├── directive/                     → Réactivité dans les templates
│   └── vTranslate.directive.ts   → v-translate (binding clé ou { key, params }, watch langue)
└── component/                     → Composants réutilisables
    └── select-lang.vue           → Dropdown sélection langue avec drapeaux (country-flag-icons)
```

## Flux principaux

- **Plugin install** : `index.ts` → `new I18nService()` → `app.provide('i18n')` → directive + component registrés
- **Résolution clé (async)** : directive → `i18n.getKey()` (attend readiness) → fetch `${url}/${lang}` → TranslationFile.get() → interpolation
- **Résolution clé (sync)** : composable → `i18n.resolve()` (reads currentFile ref) → retour imédiat ou fallback clé

## Conventions locales

- Langues : format ISO `${string}-${string}` (ex. `en-US`, `fr-FR`)
- Fichiers traduction : JSON plat clé-valeur, hébergés à `translationFilesUrl/${lang}`
- Pattern texte riche : `#text#` → `<code>text</code>` au parse
- Interpolation : `{paramName}` remplacé depuis `params` au runtime, placeholders inconnus laissés intacts

## Commandes

- Type checking : `npm run ci` (vue-tsc)

## Où chercher

| Je cherche… | Dossier / fichier |
|---|---|
| l'API d'injection du plugin | `index.ts` + `CLAUDE.md` (Configuration) |
| les options du plugin | `index.ts` type annotation + docs/guides/usage.md |
| comment utiliser le composable | `src/composable/useTranslate.ts` + docs/guides/usage.md |
| comment utiliser la directive | `src/directive/vTranslate.directive.ts` + docs/guides/usage.md |
| validation traduction (schéma) | `src/translations/file-service.ts` |
