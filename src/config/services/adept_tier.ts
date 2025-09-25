import { Language } from "../language";
import type { ServiceExample, ServiceTier } from "./service_tier";

import map_maker_preview from "../../assets/previews/map_maker.webp";

function buildAdeptTier(language: Language): ServiceTier {
    const map_maker: ServiceExample = {
        title: "MapMaker",
        description: "",
        href: `/${language}/examples/adept_tier/map_maker`,
        preview_image: map_maker_preview
    }

    const tier: ServiceTier = {
        title: "",
        price: {
            min_cost: 400.00,
            max_cost: 700.00,
        },
        time: {
            min_days: 4,
            max_days: 7,
        },
        examples: [
            map_maker
        ],
        scene_tag: "",
        animation_tag: "",
        interaction_tag: "",
        support_tag: "",
    }

    switch (language) {
        case Language.ENGLISH:
            tier.title = "Adept";

            tier.scene_tag = "Dynamic scene with numerous 3D assets.";
            tier.animation_tag = "Basic dynamic animations.";
            tier.interaction_tag = "Complex camera controls and UI inputs.";
            tier.support_tag = "2-3 revision rounds with minor integration support.";

            map_maker.description = "Map-Maker is a perlin-noise based terrain generator with adjustable parameters for frequency, amplitude, persistence, and more. Users can customize the terrain generation process to create unique textured landscapes.";
            
            break;
    }

    return tier;
}

export default buildAdeptTier;