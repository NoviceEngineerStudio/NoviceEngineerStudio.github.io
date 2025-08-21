import type { ServiceTier } from "../types/ServiceTier";

import bronze from "../../assets/icons/Bronze_Outline.png";
import silver from "../../assets/icons/Silver_Outline.png";
import gold from "../../assets/icons/Gold_Outline.png";

const resume_tiers: ServiceTier[] = [
    { href: "/services/web/resume/tier-I", emblem: bronze },
    { href: "/services/web/resume/tier-II", emblem: silver },
    { href: "/services/web/resume/tier-III", emblem: gold },
];

export default resume_tiers;