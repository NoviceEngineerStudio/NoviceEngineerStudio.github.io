interface ServiceExample {
    title: string;
    description: string;
    href: string;
    preview_image: ImageMetadata;
}

interface ServiceTier {
    title: string;
    price: {
        min_cost: number;
        max_cost?: number;
    };
    time: {
        min_days: number;
        max_days?: number
    };
    examples: ServiceExample[];
    scene_tag: string;
    animation_tag: string;
    interaction_tag: string;
    support_tag: string;
}

export { type ServiceExample, type ServiceTier };