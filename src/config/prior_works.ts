import { type TranslationFileKey } from "../utils/content/translation";

interface PriorWork {
    project_preview: ImageMetadata;
    title: TranslationFileKey["prior_works"];
    client: string;
    tags: {
        icon?: ImageMetadata;
        label: TranslationFileKey["prior_works"];
        color: string;
    }[];
    description: TranslationFileKey["prior_works"];
    project_href?: string;
};

const prior_works: PriorWork[] = [
    
];

export { type PriorWork };
export default prior_works;