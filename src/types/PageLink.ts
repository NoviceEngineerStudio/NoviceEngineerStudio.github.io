interface PageLink {
    rel: string;
    href: string;
    as?: string;
    type?: string;
    crossorigin: "anonymous" | "use-credentials";
};

export { type PageLink };