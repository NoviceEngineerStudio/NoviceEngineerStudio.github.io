import { Language } from "../language";
import type { ServiceExample, ServiceTier } from "./service_tier";

import floorplan_viewer_preview from "../../assets/previews/floorplan_viewer.webp";

function buildApprenticeTier(language: Language): ServiceTier {
    const floorplan_viewer: ServiceExample = {
        title: "Floorplan Viewer",
        description: "",
        href: `/${language}/examples/apprentice_tier/floorplan_viewer`,
        preview_image: floorplan_viewer_preview
    }

    const tier: ServiceTier = {
        title: "",
        price: {
            min_cost: 100.00,
            max_cost: 300.00,
        },
        time: {
            min_days: 1,
            max_days: 3,
        },
        examples: [
            floorplan_viewer
        ],
        scene_tag: "",
        animation_tag: "",
        interaction_tag: "",
        support_tag: "",
    }

    switch (language) {
        case Language.ENGLISH:
            tier.title = "Apprentice";

            tier.scene_tag = "Multiple assets in a simple 3D environment.";
            tier.animation_tag = "Basic static animations.";
            tier.interaction_tag = "Simple camera controls and basic UI inputs.";
            tier.support_tag = "1 revision round.";

            floorplan_viewer.description = "Explore a cozy home layout using this 3D architecture viewer. Using the togglable controls, you can get a good look at the design using the orbiting camera, or feel how the space would be at-scale by walking around using the first-person camera. The project also features toggles for the home's roof, the world grid, and a floorplan overlay.";
            
            break;
    }

    return tier;
}

export default buildApprenticeTier;