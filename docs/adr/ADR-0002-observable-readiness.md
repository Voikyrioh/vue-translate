---
id: ADR-0002
titre: @Voikyrioh/observable pour async readiness
type: librairie
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: [ADR-0001]
---

# ADR-0002 — @Voikyrioh/observable pour async readiness

## Contexte

`I18nService` charge les fichiers de traduction de façon asynchrone (fetch HTTP). Directives et composables doivent attendre la disponibilité du fichier avant de résoudre les clés.

## Décision

Utiliser la librairie `@Voikyrioh/observable` (dépendance partagée) pour gérer l'état de readiness (Observable pattern). `I18nService` expose un Observable qui notifie dès que le premier fichier est chargé.

## Comment l'appliquer

- `I18nService` : maintient un Observable interne de readiness
- Directive `v-translate` : appelle `i18n.getKey(key, params)` qui attend le readiness en interne
- Composable `useTranslate` : retourne `t()` synchrone qui lit un ref Vue (`currentFile`) mis à jour au readiness

## Quand NE PAS l'appliquer / limites

- Ne pas appeler `i18n.getKey()` depuis une template (async inapproprié)
- `useTranslate().t()` retourne la clé en fallback si pas encore chargé (acceptable)

## Alternatives rejetées

- Promise-only : pas de mécanisme de notification réutilisable (Observable + Promise)
- EventEmitter Node : trop lourd, dépendance runtime

## Conséquences

- Dépendance supplémentaire : `@Voikyrioh/observable`
- Pattern réactif cohérent avec Observable réactif

## Version

- `@Voikyrioh/observable` : ^0.1.3 (utilisé dans package.json)

## Références

- `src/translations/i18n.class.ts` — I18nService + Observable
- `src/directive/vTranslate.directive.ts` — getKey() async
- `src/composable/useTranslate.ts` — resolve() sync fallback
