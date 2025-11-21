import astro_icon from "../assets/logos/astro.svg";
import figma_icon from "../assets/logos/figma.svg";
import github_icon from "../assets/logos/github.svg";
import chn_site from "../assets/images/chn_site.webp";
import { type TranslationFileKey } from "../utils/content/translation";

interface PriorWorkTag {
    icon?: ImageMetadata;
    label: TranslationFileKey["prior_works"];
    color: string;
};

interface PriorWork {
    project_preview: ImageMetadata;
    title: TranslationFileKey["prior_works"];
    client: string;
    tags: PriorWorkTag[];
    description: TranslationFileKey["prior_works"];
    project_href?: string;
};

const tags = {
    figma: {
        icon: figma_icon,
        label: "figma_tag",
        color: "#874fff"
    },
    astro: {
        icon: astro_icon,
        label: "astro_tag",
        color: "#de5303"
    },
    github_pages: {
        icon: github_icon,
        label: "github_pages_tag",
        color: "#1dece6"
    }
} as const satisfies Record<string, PriorWorkTag>;

const prior_works: PriorWork[] = [
    {
        project_preview: chn_site,
        title: "work_title_1",
        client: "Country Hideaway Nails",
        tags: [
            tags.figma,
            tags.astro,
            tags.github_pages
        ],
        description: "work_description_1",
        project_href: "https://countryhideawaynails.github.io/"
    }
];

export { type PriorWork, type PriorWorkTag, tags };
export default prior_works;