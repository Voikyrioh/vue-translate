# @Voikyrioh/vue-translate 🌍

A lightweight, reactive, and type-safe translation library for **Vue 3**, powered by TypeScript and Zod.

[![NPM Version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://github.com/Voikyrioh/vue-translate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Vue 3 Compatible](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)

## ✨ Features

- 🚀 **Reactive Core**: Built on top of Vue 3's Reactivity API.
- 🛡️ **Type Safe**: Fully written in TypeScript with Zod validation for translation files.
- 🧩 **Directive Based**: Simple `v-translate` directive for quick integration.
- 🪝 **Composable**: `useTranslate()` exposes a reactive `t(key, params)` for scripts and `{{ }}`.
- 🔣 **Interpolation**: `{name}` placeholders replaced at runtime from params.
- 📦 **Zero-Friction Components**: Includes a built-in language selector with flag support.
- 📡 **Observable Powered**: Asynchronous file loading with `@Voikyrioh/observable`.
- 👨‍💻 **Rich Text Support**: Basic pattern replacement for code tags in translations.

## 📦 Installation

Since this package is hosted on **GitHub Packages**, ensure you have a `.npmrc` file configured to point to the `@Voikyrioh` scope:
```ini 
@Voikyrioh:registry=[https://npm.pkg.github.com](https://npm.pkg.github.com)
```

Then install via npm:
```bash
 npm install @Voikyrioh/vue-translate
 ```

## 🚀 Getting Started

### 1. Initialize the Plugin

Register the plugin in your main entry file (e.g., `main.ts`):

```typescript 
import { createApp } from 'vue'; import VueTranslate from '@Voikyrioh/vue-translate'; import App from './App.vue';
const app = createApp(App);
app.use(VueTranslate, { 
    availableLanguage: ['en-US', 'fr-FR'], 
    translationFilesUrl: 'https://your-api.com/locales', // Path to your JSON files or API endpoint
    defaultLang: 'en-US' });
app.mount('#app');
```

### 2. Usage in Templates

#### Using the Directive
The easiest way to translate text is using the `v-translate` directive. It will automatically update the element's text when the language changes.
```vue 
<p v-translate:key="'welcome_message'"></p>
```

#### Using the Composable (with interpolation)
For dynamic values, use `useTranslate()`. The returned `t` is reactive — it updates on language switch and once the file loads.
```vue
<script setup lang="ts">
import { useTranslate } from '@Voikyrioh/vue-translate'
const { t } = useTranslate()
</script>

<template>
  <p>{{ t('confirm.transfer', { pseudo: 'Voiky' }) }}</p>
  <span>{{ t('users.count', { count: 12 }) }}</span>
</template>
```

The directive also accepts params via an object binding:
```vue
<p v-translate="{ key: 'confirm.transfer', params: { pseudo } }"></p>
```

#### Using the Language Selector
Use the built-in component to let users switch languages (includes flags via `country-flag-icons`):
```vue 
<SelectLanguage class="your-class" />
```


### 3. Translation File Format

Your remote JSON files should be a flat key-value pair object. Use `#text#` to wrap content in `<code>` tags, and `{name}` placeholders for runtime interpolation:

```json 
  { "welcome_message": "Welcome to our #Vue 3# App!", "confirm.transfer": "Transfer superadmin to {pseudo}?" }
```

## 🛠️ Configuration Options

| Option | Type | Description |
| :--- | :--- | :--- |
| `availableLanguage` | `string[]` | Array of supported locales (e.g., `['fr-FR']`). |
| `translationFilesUrl`| `string` | Base URL where your JSON files are hosted. |
| `defaultLang` | `string` | The initial language to load. |

## 👨‍💻 Development

### Type Checking
This project uses `vue-tsc` for strict type checking of both TS and Vue files:
```bash 
npm run ci
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [Voikyrioh](https://voikyrioh.fr)

