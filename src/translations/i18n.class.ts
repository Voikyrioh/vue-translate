import { ref } from "vue";
import { Observable } from "@Voikyrioh/observable";
import { TranslationFile } from "./file-service";

type lang = `${string}-${string}`;

export class I18nService {
    readonly ready = new Observable<lang>()
    readonly languageRef = ref<lang>()

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
        this.#files.set(value, new TranslationFile(await fetch(`${this.#accessUrl}/${value}`).then(res => res.json())));
        this.ready.emit(value);
    }

    get activeLanguage(): lang {
        return this.#activeLanguage;
    }

    set activeLanguage(value: lang) {
        if(!this.#availableLanguages.includes(value)) throw new Error('Language not found')
        this.#activeLanguage = value;

        if (!this.#files.get(value)) this.#getLangFile(value).then(() => this.languageRef.value = this.#activeLanguage)
        else this.languageRef.value = value;
    }

    get availableLanguages(): string[] {
        return this.#availableLanguages;
    }

    public getKey(key: string): Promise<string> {
        return new Promise((resolve) => this.ready.subscribe(() => resolve(this.#files.get(this.#activeLanguage)?.get(key) ?? key)));
    }
}
