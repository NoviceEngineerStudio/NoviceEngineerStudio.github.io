import language_config, { Languages } from "../config/language_config";

let nav_language: Languages = navigator.language.split("-")[0].trim() as Languages;

if (!language_config.supported_languages.includes(nav_language)) {
    nav_language = language_config.default_language;
}

window.location.assign(`/${nav_language}`);