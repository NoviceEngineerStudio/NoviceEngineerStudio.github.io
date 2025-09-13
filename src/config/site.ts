import { Language } from "./language";

interface PageLink {
    rel: string;
    href: string;
    as?: string;
    type?: string;
    crossorigin: "anonymous" | "use-credentials";
}

interface SiteMetaData {
    title: string;
    description: string;
    authors: string[];
    icon_path: string;
    static_links: PageLink[];
}

function buildMetaData(language: Language, page_title?: string): SiteMetaData {
    const meta_data: SiteMetaData = {
        title: page_title
            ? `Novice Engineer - ${page_title}`
            : 'Novice Engineering Studio',
        description: "Unknown Language...",
        authors: [
            "Novice Engineer",
            "Skyler Riggle",
        ],
        icon_path: "/favicon.ico",
        static_links: [
            {
                rel: "preload",
                href: "/fonts/rubik/Rubik-VariableFont_wght.ttf",
                as: "font",
                type: "font/ttf",
                crossorigin: "anonymous",
            }
        ],
    }

    switch (language) {
        case Language.ENGLISH:
            meta_data.description = (
                "Welcome to the Novice Engineering Studio! This website serves as a " +
                "hub for all of our current and prior projects; A fun place to document " +
                "our continued growth as a studio, as well as announce what we're up to. " +
                "Hope to see you there!"
            );
            break;
        case Language.SPANISH:
            break;
    }

    return meta_data;
}

export { type PageLink, type SiteMetaData };
export default buildMetaData;