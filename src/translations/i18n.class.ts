import { ref } from "vue";
import { Observable } from "@Voikyrioh/observable";
import { TranslationFile } from "./file-service";

type lang = `${string}-${string}`;

export class I18nService {
    readonly ready = new Observable<lang>()
    readonly languageRef = ref<lang>()
    readonly currentFile = ref<TranslationFile>()

    #activeLanguage: lang;
    #availableLanguages: lang[];
    #files: Map<lang, TranslationFile> = new Map();
    #accessUrl: string;

    constructor(availableLanguages: lang[], accessUrl: string, selectedLanguage: lang) {
        this.#accessUrl = accessUrl;
        this.#availableLanguages = availableLanguages;
        this.#activeLanguage = selectedLanguage;
        this.languageRef.value = this.#activeLanguage;
        this.#getLangFile(selectedLanguage).then(() => this.ready.emit(selectedLanguage));
    };

    async #getLangFile(value: lang) {
        const file = new TranslationFile(await fetch(`${this.#accessUrl}/${value}`).then(res => res.json()));
        this.#files.set(value, file);
        if (value === this.#activeLanguage) this.currentFile.value = file;
        this.ready.emit(value);
    }

    /** Synchronous, reactive resolution for use in composables/templates. Falls back to the key until the file is loaded. */
    resolve(key: string, params?: Record<string, string | number>): string {
        return this.currentFile.value?.get(key, params) ?? key;
    }

    get activeLanguage(): lang {
        return this.#activeLanguage;
    }

    set activeLanguage(value: lang) {
        if(!this.#availableLanguages.includes(value)) throw new Error('Language not found')
        this.#activeLanguage = value;

        const cached = this.#files.get(value);
        if (!cached) this.#getLangFile(value).then(() => this.languageRef.value = this.#activeLanguage)
        else {
            this.currentFile.value = cached;
            this.languageRef.value = value;
        }
    }

    get availableLanguages(): string[] {
        return this.#availableLanguages;
    }

    public getKey(key: string, params?: Record<string, string | number>): Promise<string> {
        return new Promise((resolve) => this.ready.subscribe(() => resolve(this.#files.get(this.#activeLanguage)?.get(key, params) ?? key)));
    }
}
