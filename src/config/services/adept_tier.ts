import { Language } from "../language";
import type { ServiceExample, ServiceTier } from "./service_tier";

import my_arcade_preview from "../../assets/previews/global_hero.webp";

function buildAdeptTier(language: Language): ServiceTier {
    const my_arcade: ServiceExample = {
        title: "MyArcade",
        description: "",
        href: `/${language}/examples/adept_tier/my_arcade`,
        preview_image: my_arcade_preview
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
            my_arcade
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

            my_arcade.description = "TO BE WRITTEN...";
            
            break;
    }

    return tier;
}

export default buildAdeptTier;