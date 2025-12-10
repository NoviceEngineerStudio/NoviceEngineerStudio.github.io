import { type TranslationFileKey } from "../utils/content/translation";

interface NavigationLink {
    label: TranslationFileKey["common"];
    href: string;
    is_external: boolean;
};

const navigation_bar_links: NavigationLink[] = [
    {
        label: "home_nav_link",
        href: "/",
        is_external: false
    }, {
        label: "blog_nav_link",
        href: "/blog/",
        is_external: false
    }, {
        label: "games_nav_link",
        href: "/games/",
        is_external: false
    }, {
        label: "fiverr_nav_link",
        href: "https://www.fiverr.com/s/0bmeRra",
        is_external: true
    }
]

export { type NavigationLink };
export default navigation_bar_links;
