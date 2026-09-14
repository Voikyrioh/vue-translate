# Guide d'utilisation — @Voikyrioh/vue-translate

API publique complète du plugin i18n Vue 3.

## Installation

### 1. Configuration `.npmrc`

Comme `@Voikyrioh/vue-translate` est hébergé sur GitHub Packages, créer ou completer un fichier `.npmrc` :

```ini
@Voikyrioh:registry=https://npm.pkg.github.com
```

### 2. Installation npm

```bash
npm install @Voikyrioh/vue-translate
```

## Plugin options

Passer les options à l'installation dans `main.ts` :

```typescript
import { createApp } from 'vue'
import VueTranslate from '@Voikyrioh/vue-translate'
import App from './App.vue'

const app = createApp(App)
app.use(VueTranslate, {
  availableLanguage: ['en-US', 'fr-FR'],
  translationFilesUrl: 'https://api.example.com/locales',
  defaultLang: 'en-US'
})
app.mount('#app')
```

| Option | Type | Description |
|---|---|---|
| `availableLanguage` | `string[]` (format `${code}-${region}`) | Langues supportées (ex. `['en-US', 'fr-FR']`) |
| `translationFilesUrl` | `string` | URL de base où sont hébergés les fichiers JSON traduction. Le plugin fetch `${url}/${language}` |
| `defaultLang` | `string` (même format) | Langue initiale à charger |

## Composable `useTranslate()`

Injecter et utiliser le composable dans `<script setup>` :

```typescript
import { useTranslate } from '@Voikyrioh/vue-translate'

export default defineComponent({
  setup() {
    const { t, i18n } = useTranslate()
    
    return { t, i18n }
  }
})
```

### `t(key, params?): string`

Retourne la traduction pour une clé, reactive.

- **Synchrone** : retourne imédiatement depuis le cache `currentFile` une fois chargé
- **Fallback** : retourne la clé elle-même si pas encore chargé ou clé introuvable
- **Reactive** : se met à jour automatiquement quand la langue change ou le fichier se charge

Exemple :

```vue
<script setup>
import { useTranslate } from '@Voikyrioh/vue-translate'
const { t } = useTranslate()
</script>

<template>
  <p>{{ t('welcome') }}</p>
  <p>{{ t('confirm.transfer', { pseudo: 'Voiky' }) }}</p>
</template>
```

### `i18n.languageRef`

Ref réactive de la langue actuellement active (type `Ref<string>`). Utile pour réactions ou condition :

```vue
<script setup>
import { useTranslate } from '@Voikyrioh/vue-translate'
const { i18n } = useTranslate()
</script>

<template>
  <p v-if="i18n.languageRef.value === 'fr-FR'">Vous êtes en français</p>
</template>
```

## Directive `v-translate`

Utiliser directement dans les templates sans composable :

```vue
<p v-translate="'welcome'"></p>
```

### Binding string simple

`v-translate="'keyName'"` remplace le texte de l'élément par la traduction de la clé.

```vue
<button v-translate="'button.submit'"></button>
<!-- Devient : <button>Soumettre</button> (si langue FR) -->
```

### Binding objet (avec interpolation)

Pour passer des paramètres, utiliser un objet `{ key, params }` :

```vue
<template>
  <p v-translate="{ key: 'user.greeting', params: { name: userName } }"></p>
</template>

<script setup>
const userName = ref('Alice')
</script>
```

**Reactive** : quand `userName` change, le texte se met à jour.

## Composant `SelectLang`

Composant dropdown pré-construit pour sélectionner la langue (affiche drapeaux avec `country-flag-icons`) :

```vue
<template>
  <SelectLang class="lang-selector" />
</template>

<style scoped>
.lang-selector {
  /* Vos styles */
}
</style>
```

Le composant :
- Affiche chaque langue disponible avec son drapeau emoji
- Émet un changement d'événement sur sélection
- Synchronise automatiquement `i18n.activeLanguage`

## Format des fichiers traduction

Les fichiers traduction sont des fichiers JSON hébergés à `{translationFilesUrl}/{language}`.

### Structure

Objet plat clé-valeur. Les clés peuvent être imbriquées via notation pointée :

```json
{
  "welcome": "Bienvenue sur notre app!",
  "confirm.transfer": "Transférer admin à {pseudo}?",
  "user.greeting": "Bonjour {name}",
  "button.submit": "Soumettre"
}
```

### Interpolation `{nom}`

Les placeholders `{paramName}` sont remplacés au runtime par les valeurs de `params` :

```json
{
  "hello": "Bonjour {name}, vous avez {count} messages"
}
```

```typescript
t('hello', { name: 'Alice', count: 5 })
// Résultat : "Bonjour Alice, vous avez 5 messages"
```

**Règles** :
- Placeholders inconnus restent intacts (ex. `{unknown}` ne disparaît pas)
- Type : `params` est un `Record<string, string | number>`

### Texte riche `#text#`

Entourer du texte avec `#` pour le convertir en `<code>` :

```json
{
  "install": "Exécutez #npm install# dans le terminal"
}
```

Rendu :

```html
Exécutez <code>npm install</code> dans le terminal
```

## Fallback et comportement au chargement

### Before load

Tant que le fichier traduction n'est pas chargé :
- `useTranslate().t('key')` retourne la clé elle-même en fallback
- `v-translate` attend et affiche une fois le load complet (async)

### After load

Dès que le fichier est chargé :
- Les éléments DOM avec `v-translate` se mettent à jour
- `useTranslate().t()` retourne la valeur du fichier (ou la clé si missing)

### Language switch

Changement de langue (via `SelectLang` ou modification de `i18n.languageRef`) :
- Fetch automatique du nouveau fichier
- Tous les `{{ t('key') }}` se mettent à jour
- Tous les `v-translate` se mettent à jour

## Cas limites

1. **Clé introuvable** : retour de la clé elle-même en fallback
2. **Fichier invalide (non-JSON)** : logged en erreur, aucune update (ancien fichier gardé si existant)
3. **Paramètre manquant** : placeholder `{missing}` reste intact
4. **Langue non supportée** : erreur au chargement, fallback `defaultLang`

## Consommateurs recommandés

Actuellement intégré dans :
- `mmo-web-api` (backoffice MMO)
- `mmo-website` (site public)
- Autres projets utilisant i18n centralisé

## Notes techniques

- Type-safe : export `type { I18nService }` pour typage des injections
- Réactif : basé sur Vue 3 Reactivity API (refs, computed)
- Async-ready : pattern Observable + sync fallback
- Cache : fichiers traduction cachés en mémoire par langue
