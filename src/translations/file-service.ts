import { z } from "zod/v4";

export class TranslationFile {
    readonly translations: Record<string, string>;

    customPatternReplacement(match: string, ...p: string[]): string {
        if (match.charAt(0) === '#') return `<code>${p[0]}</code>`;
        return match;
    }

    constructor(translations: unknown) {
        this.translations = z.record(
                z.string(),
                z.string().transform((v) => v.replace(/#(.*)#/, this.customPatternReplacement))
            ).parse(translations);
    }

    get(key: string, params?: Record<string, string | number>) {
        const raw = this.translations[key] ?? key;
        if (!params) return raw;
        return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
            name in params ? String(params[name]) : match
        );
    }
}
