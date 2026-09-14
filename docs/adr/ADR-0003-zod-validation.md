---
id: ADR-0003
titre: Zod pour validation fichiers traduction
type: librairie
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: []
---

# ADR-0003 — Zod pour validation fichiers traduction

## Contexte

Fichiers de traduction (JSON) chargés depuis URL distante peuvent être malformés ou contenir des clés inattendues. Validation au runtime garante la sécurité des types.

## Décision

Utiliser Zod pour valider la structure des fichiers traduction au chargement. Schéma accepte un objet plat clé-valeur (strings).

## Comment l'appliquer

- `TranslationFile` (`src/translations/file-service.ts`) : défini schéma Zod
- Au fetch : `schema.parse(jsonData)` valide et retourne typed object
- Invalid JSON → erreur catch, fallback gestion

## Quand NE PAS l'appliquer / limites

- Schéma rigide (clé-valeur plat) : pas de nested translations
- Valeur doit être string ou interpolable (nombres acceptés dans params seulement)

## Alternatives rejetées

- TypeScript seul : zéro validation runtime (données du réseau non garanties)
- Validation manuelle : erreur-prone, code duplication

## Conséquences

- Dépendance Zod (léger, bien maintenu)
- Performance : validation au premier chargement seulement (cached)

## Version

- `zod` : ^4.2.1 (package.json)

## Références

- `src/translations/file-service.ts` → `TranslationFile` + Zod schema
