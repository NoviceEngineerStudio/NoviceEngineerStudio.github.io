import type NumberRange from "../utils/number_range";

// *=================================================
// *
// * Type Declarations
// *
// *=================================================

export interface ServiceDeliverable {
    tag: string;
    description: string;
}

export interface ServiceExamples {
    // TODO:
}

export interface ServiceData {
    tier: string;
    tier_icon: ImageMetadata;
    price: NumberRange;
    time: NumberRange;
    deliverables: ServiceDeliverable[];
    examples: ServiceExamples[];
}

// *=================================================
// *
// * Services Dictionary
// *
// *=================================================

import threejs_services from "./threejs_services";

const allServices = {
    threejs: threejs_services,
}

export default allServices;