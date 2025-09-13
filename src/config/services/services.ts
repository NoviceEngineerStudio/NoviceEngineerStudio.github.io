import type { Language } from "../language";
import type { ServiceExample, ServiceTier } from "./service_tier";

import buildNoviceTier from "./novice_tier";
import buildApprenticeTier from "./apprentice_tier";
import buildAdeptTier from "./adept_tier";
import buildExpertTier from "./expert_tier";
import buildMasterTier from "./master_tier";

function getServices(language: Language): ServiceTier[] {
    return [
        buildNoviceTier(language),
        buildApprenticeTier(language),
        buildAdeptTier(language),
        buildExpertTier(language),
        buildMasterTier(language)
    ];
}

export { type ServiceExample, type ServiceTier };
export default getServices;