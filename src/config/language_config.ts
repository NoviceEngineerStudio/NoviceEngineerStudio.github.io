enum Languages {
    ENGLISH = "en",
    SPANISH = "es"
};

interface LanguageConfig {
    default_language: Languages;
    supported_languages: Languages[];
};

const language_config: LanguageConfig = {
    default_language: Languages.ENGLISH,
    supported_languages: [
        Languages.ENGLISH
    ]
};

export { type LanguageConfig, Languages };
export default language_config;