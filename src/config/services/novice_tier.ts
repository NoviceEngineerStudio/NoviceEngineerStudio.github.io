import { Language } from "../language";
import type { ServiceExample, ServiceTier } from "./service_tier";

import global_hero_preview from "../../assets/previews/global_hero.webp";

function buildNoviceTier(language: Language): ServiceTier {
    const global_hero: ServiceExample = {
        title: "Global Hero",
        description: "",
        href: `/${language}/examples/novice_tier/global_hero`,
        preview_image: global_hero_preview
    }

    const tier: ServiceTier = {
        title: "",
        price: {
            min_cost: 30.00,
            max_cost: 85.00,
        },
        time: {
            min_days: 1,
            max_days: 1,
        },
        examples: [
            global_hero
        ],
        scene_tag: "",
        animation_tag: "",
        interaction_tag: "",
        support_tag: "",
    }

    switch (language) {
        case Language.ENGLISH:
            tier.title = "Novice";

            tier.scene_tag = "Single 3D model with basic lighting and materials.";
            tier.animation_tag = "Single simple animation.";
            tier.interaction_tag = "Simple camera controls.";
            tier.support_tag = "1 revision round.";

            global_hero.description = "This project serves as a fun example of what you can expect from our Novice Tier. Showcasing a 3D model of the earth in a made-up companies hero section, you can see the subtle animations looping in the background to give the page a more whimsical feeling.";

            break;
    }

    return tier;
}

export default buildNoviceTier;