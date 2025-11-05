import { Languages } from "../../config/language_config";

import en_common from "../../locales/en/common.json";
import en_home_page from "../../locales/en/home_page.json";

interface TranslationTable {
    common: typeof en_common;
    home_page: typeof en_home_page;
};

const TRANSLATION_TABLES: Map<Languages, TranslationTable> = new Map<Languages, TranslationTable>([
    [Languages.ENGLISH, {
        common: en_common,
        home_page: en_home_page
    }]
]);

type TranslationTableKey = keyof TranslationTable;
type TranslationFileKey = {
    [K in TranslationTableKey]: keyof TranslationTable[K]
};

function translate<
    K extends TranslationTableKey,
    T extends keyof TranslationTable[K]
>(
    language: Languages,
    file_key: K,
    text_key: T
): string {
    const table: TranslationTable | undefined = TRANSLATION_TABLES.get(language);

    if (table !== undefined) {
        const text: TranslationTable[K][T] | undefined = table[file_key][text_key];
        if (text !== undefined) {
            return text as string;
        }
    }

    const error_message: string = `No translation text for keys (${String(file_key)}, ${String(text_key)})!`;
    console.error(error_message);
    return error_message;
}

export { type TranslationTableKey, type TranslationFileKey };
export default translate;