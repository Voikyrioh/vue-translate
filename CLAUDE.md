# CLAUDE.md

Lire `ARCHITECTURE.md` puis `docs/INDEX.md` avant toute tâche. Skills obligatoires : code-search, dev-task, bugfix, doc-update.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A lightweight, reactive, type-safe Vue 3 translation library. Provides a `v-translate` directive and `SelectLang` component for internationalization with async translation file loading.

## Commands

### Type Checking
```bash
npm run ci
```
Runs `vue-tsc` for strict type checking of TypeScript and Vue files. This is the primary validation command - there are no build, test, or lint scripts configured.

## Architecture

### Plugin Structure
Entry point: `index.ts` - Installs the Vue plugin with three main features:
1. Provides `I18nService` instance globally via Vue's provide/inject
2. Registers `v-translate` directive for reactive translation in templates
3. Registers `SelectLang` component globally

### Core Services

**I18nService** (`src/translations/i18n.class.ts`)
- Central translation service managing language state and file loading
- Uses `@Voikyrioh/observable` for async readiness notifications
- Lazy-loads translation files via fetch from configured URL
- Maintains reactive `languageRef` (Vue ref) that triggers UI updates
- Private fields: `#files` (Map cache), `#activeLanguage`, `#availableLanguages`, `#accessUrl`
- Reactive `currentFile` ref: holds the active language's `TranslationFile`, updated on load and language switch — drives synchronous resolution
- `getKey(key, params?): Promise<string>` - async resolution (awaits readiness), used by the directive
- `resolve(key, params?): string` - synchronous, reactive resolution (reads `currentFile`), falls back to the key until loaded — used by the composable
- `params` enable `{name}` interpolation (see TranslationFile)

**TranslationFile** (`src/translations/file-service.ts`)
- Validates translation JSON with Zod schema (flat key-value object)
- Custom pattern replacement: `#text#` → `<code>text</code>` (at parse time)
- `get(key, params?)`: runtime `{name}` interpolation from `params`; unknown placeholders left intact
- Returns key as fallback if translation missing

### Composable

**useTranslate** (`src/composable/useTranslate.ts`)
- Injects the `i18n` service; throws if the plugin isn't installed
- Returns `{ t, i18n }` where `t(key, params?)` is a reactive synchronous translator
- Use in `<script setup>` and `{{ }}` — re-renders on language switch and file load

### Directive

**vTranslate** (`src/directive/vTranslate.directive.ts`)
- Binding value is the key `'foo'` or an object `{ key, params }` (for interpolation)
- Sets `innerText` on mount after fetching translation; `updated` hook re-renders on param change
- Watches `i18n.languageRef` to reactively update text on language change

### Components

**SelectLang** (`src/component/select-lang.vue`)
- Dropdown selector for available languages
- Uses `country-flag-icons` to display Unicode flag emojis
- Injects `i18n` service and updates `activeLanguage` on selection

## Configuration

Plugin requires three options:
- `availableLanguage`: Array of locale codes (format: `${string}-${string}`)
- `translationFilesUrl`: Base URL for translation JSON files (fetches `${url}/${locale}`)
- `defaultLang`: Initial language to load

## Publishing

Package is published to GitHub Packages registry under `@Voikyrioh` scope. Users need `.npmrc` configured:
```
@Voikyrioh:registry=https://npm.pkg.github.com
```
