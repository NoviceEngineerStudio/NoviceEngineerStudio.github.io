import { Language } from "../language";
import type { ServiceTier } from "./service_tier";

function buildExpertTier(language: Language): ServiceTier {
    const tier: ServiceTier = {
        title: "",
        price: {
            min_cost: 800.00,
            max_cost: 1400.00,
        },
        time: {
            min_days: 8,
            max_days: 14,
        },
        examples: [],
        scene_tag: "",
        animation_tag: "",
        interaction_tag: "",
        support_tag: "",
    }

    switch (language) {
        case Language.ENGLISH:
            tier.title = "Expert";

            tier.scene_tag = "Complex scene with numerous assets and interactions.";
            tier.animation_tag = "Dynamic and complex animations.";
            tier.interaction_tag = "Complex keyboard, mouse, mobile, or browser input management.";
            tier.support_tag = "4 revision rounds with documentation and full integration support.";
            
            break;
    }

    return tier;
}

export default buildExpertTier;