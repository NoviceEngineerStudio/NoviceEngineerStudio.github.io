export interface NavLink {
    tag: string;
    href: string;
}

const nav_links: NavLink[] = [
    {
        tag: "Home",
        href: "/",
    }, {
        tag: "ThreeJS Services",
        href: "/services/threejs",
    },
];

export default nav_links;