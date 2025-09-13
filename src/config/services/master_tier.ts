import { Language } from "../language";
import type { ServiceTier } from "./service_tier";

function buildMasterTier(language: Language): ServiceTier {
    const tier: ServiceTier = {
        title: "",
        price: {
            min_cost: 1500.00,
            max_cost: undefined,
        },
        time: {
            min_days: 15,
            max_days: undefined,
        },
        examples: [],
        scene_tag: "",
        animation_tag: "",
        interaction_tag: "",
        support_tag: "",
    }

    switch (language) {
        case Language.ENGLISH:
            tier.title = "Master";

            tier.scene_tag = "Fully populated scene with highly dynamic lighting and rendering effects.";
            tier.animation_tag = "Dynamic and complex animations.";
            tier.interaction_tag = "Complex input management with any device support.";
            tier.support_tag = "Full documentation, unlimited revisions, and long-term maintenance during project window.";
            
            break;
    }

    return tier;
}

export default buildMasterTier;