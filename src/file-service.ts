import { z } from "zod/v4";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

const countries = [ 'GB', 'FR' ]
const fileNameValidator = z.string()
    .regex(/^[A-Z]{2}\.json$/)
    .transform(name => name.split('.')[0])
    .refine((country) => countries.includes(country));

export class FileService {
    #translations: Map<string, TranslationFile> = new Map();
    #ready = false;

    constructor(translationsDirectoryPath: string) {
        const dirPath = path.join(__dirname, '/public/', translationsDirectoryPath)
        assert(fs.accessSync(dirPath), new Error('Directory not found'))
        this.#getTranslationFiles(dirPath);
    }

    async #getTranslationFiles(dirPath: string): Promise<void> {
        const translationsDirectory = fs.opendirSync(dirPath);
        assert(translationsDirectory.readSync(), 'translationsDirectory is null');

        for await (const dirent of translationsDirectory) {
            assert(dirent, new Error('no files found'));
            if ( dirent.isFile() && dirent.name.endsWith('.json') ) {
                const lang = fileNameValidator.parse(dirent.name);
                const fileData = await fs.readFile(path.join(dirPath, dirent.name), 'utf-8');
                const translations = JSON.parse(fileData);
                if ( translations && typeof translations === 'object')
                this.#translations.set(lang, new TranslationFile(lang, await ))
            }
        }
    }

    get ready() { return this.#ready; }
}

export class TranslationFile {
    readonly translations: Record<string, string>;

    customPatternReplacement(match: string, ...p: string[]): string {
        if (match.charAt(0) === '#') return `<code>${p[0]}</code>`;
        return match;
    }

    constructor(public readonly lang: string, translations: unknown) {
        this.translations =
            z.record(
                z.string().transform((v) => v.replace(/#(.*)#/, this.customPatternReplacement))
            ).parse(translations);
    }

    get(key: string) {
        return this.translations[key] ?? key;
    }
}
