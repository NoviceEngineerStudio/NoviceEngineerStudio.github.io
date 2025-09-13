enum Language {
    ENGLISH = "en",
    SPANISH = "es"
}

const DEFAULT_LANGUAGE: Language = Language.ENGLISH;

const SUPPORTED_LANGUAGES: Language[] = [
    Language.ENGLISH
];

export { DEFAULT_LANGUAGE, Language };
export default SUPPORTED_LANGUAGES;