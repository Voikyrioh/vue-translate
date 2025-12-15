import { ref } from "vue";
type lang = 'en' | 'fr';
type country = 'GB' | 'FR';

class I18n {
    readonly availableLanguages = new Map<lang, country>([['en', 'GB'], ['fr', 'FR']]);
    #activeLanguage: string;
    readonly languageRef = ref('')
    constructor(language: string = 'en') {
        this.#activeLanguage = language;
        this.languageRef.value = this.#activeLanguage;
    };

    get activeLanguage(): string {
        return this.#activeLanguage;
    }

    set activeLanguage(value: string) {
        this.#activeLanguage = value;
        this.languageRef.value = this.#activeLanguage;
    }

    async getDocument(url: string): Promise<TranslationFile> {
        const data = await fetch( url ).then((response) => response.json()).catch((err) => {
            console.error(err);
            throw new Error('could not load file');
        });
        if (data && data[this.#activeLanguage]) {
            return new TranslationFile(this.#activeLanguage, data[this.#activeLanguage] as Record<string, string>);
        }
        else throw new Error('Language not found');
    }
}

export default new I18n('fr');
