interface NavigationLink {
    label: string;
    href: string;
    is_external: boolean;
};

const navigation_bar_links: NavigationLink[] = [
    {
        label: "Home",
        href: "/",
        is_external: false
    }, {
        label: "Blog",
        href: "/blog/",
        is_external: false
    }, {
        label: "Games",
        href: "/games/",
        is_external: false
    }, {
        label: "Fiverr",
        href: "https://www.fiverr.com/s/1q9L96z",
        is_external: true
    }
]

export { type NavigationLink };
export default navigation_bar_links;