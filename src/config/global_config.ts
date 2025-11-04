import type { PageLink } from "../types/PageLink";

interface GlobalConfig {
    title: string;
    authors: string[];

    shortcut_icon_href: string;
    icons: {
        href: string;
        width: number;
        height: number;
    }[];

    static_links: PageLink[];
};

const global_config: GlobalConfig = {
    title: "Novice Engineer Studio",
    authors: [
        "Skyler Riggle"
    ],

    shortcut_icon_href: "/icons/favicon.ico",
    icons: [
        { href: "/icons/favicon_32x32.png", width: 32, height: 32 },
        { href: "/icons/favicon_48x48.png", width: 48, height: 48 },
        { href: "/icons/favicon_96x96.png", width: 96, height: 96 },
        { href: "/icons/favicon_144x144.png", width: 144, height: 144 }
    ],

    static_links: [
        {
            rel: "preload",
            href: "/fonts/rubik/Rubik-VariableFont_wght.ttf",
            as: "font",
            type: "font/ttf",
            crossorigin: "anonymous"
        }
    ]
};

export { type GlobalConfig };
export default global_config;