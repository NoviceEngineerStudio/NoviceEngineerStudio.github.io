export interface SiteMetaData {
    title: string;
    description: string;
    authors: string[];
    icon_path: string;
}

export default function buildMetaData(page_title?: string): SiteMetaData {
    return {
        title: page_title
            ? `Novice Engineer - ${page_title}`
            : 'Novice Engineering Studio',
        description: (
            "Welcome to the Novice Engineering Studio! This website serves as a " +
            "hub for all of our current and prior projects; A fun place to document " +
            "our continued growth as a studio, as well as announce what we're up to. " +
            "Hope to see you there!"
        ),
        authors: [
            "Novice Engineer",
        ],
        icon_path: "/favicon.ico",
    }
}