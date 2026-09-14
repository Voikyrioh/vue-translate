# Docs — @Voikyrioh/vue-translate

Maj : 2026-09-14. Point d'entrée obligatoire des agents. ARCHITECTURE.md = carte du code.

| Dossier | Contenu | Quand le consulter |
|---|---|---|
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Structure repo + flux principaux | avant tout choix de modification architecturale |
| [adr/](./adr/INDEX.md) | décisions (plugin Vue, Zod, Observable) | avant de modifier la structure du plugin ou d'ajouter une dépendance |
| [business-rules/](./business-rules/INDEX.md) | N/A (librairie pure, pas de règles métier) | — |
| [guides/](./guides/usage.md) | API publique : installation, plugin options, useTranslate, v-translate, SelectLang, format fichiers traduction, interpolation, fallback | avant d'intégrer dans un projet consommateur |
| [bugs/](./bugs/INDEX.md) | fiches FIX:ULID | avant de modifier une zone marquée FIX: |

## Globales (orga-global)

- `J:/Dev/Projects/orga/global/docs/adr/INDEX.md` — ADR globales (conventions de code, librairies)
- `J:/Dev/Projects/orga/global/product-descriptions/packages.md` — fiche écosystème packages
