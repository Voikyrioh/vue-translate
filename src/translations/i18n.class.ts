import { ref } from "vue";
import { Observable } from "observable";
import { TranslationFile } from "./file-service";

type lang = `${string}-${string}`;

export class I18nService {
    readonly ready = new Observable<boolean>(false)
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
        this.#getLangFile(selectedLanguage).then(() => this.ready.emit(true));
    };

    async #getLangFile(value: lang) {
        this.#files.set(value, new TranslationFile(await fetch(`${this.#accessUrl}/${value}`).then(res => res.json())));
        this.ready.emit(true);
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

    public getKey(key: string): string {
        return this.#files.get(this.#activeLanguage)?.get(key) ?? key;
    }
}
