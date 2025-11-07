import { type TranslationFileKey } from "../utils/content/translation";

interface DevService {
    tier_title: TranslationFileKey["dev_services"];
    usd_cost: number;
    days_to_deliver: number;
    tag_line: TranslationFileKey["dev_services"];
    descriptors: TranslationFileKey["dev_services"][];

    dark_color: string;
    bright_color: string;
};

const NOVICE_DAYS: number = 2;
const ADEPT_DAYS: number = 4;
const EXPERT_DAYS: number = 8;

const HOURS_PER_DAY: number = 8;
const COST_PER_HOUR: number = 7.25;

const dev_services: DevService[] = [
    {
        tier_title: "novice_tier",
        usd_cost: Math.ceil(NOVICE_DAYS * HOURS_PER_DAY * COST_PER_HOUR),
        days_to_deliver: NOVICE_DAYS,
        tag_line: "novice_tag_line",
        descriptors: [
            "novice_descriptor_1",
            "novice_descriptor_2",
            "novice_descriptor_3",
            "novice_descriptor_4"
        ],

        dark_color: "#F0B100",
        bright_color: "#FFDF20"
    }, {
        tier_title: "adept_tier",
        usd_cost: Math.ceil(ADEPT_DAYS * HOURS_PER_DAY * COST_PER_HOUR),
        days_to_deliver: ADEPT_DAYS,
        tag_line: "adept_tag_line",
        descriptors: [
            "adept_descriptor_1",
            "adept_descriptor_2",
            "adept_descriptor_3",
            "adept_descriptor_4"
        ],

        dark_color: "#615FFF",
        bright_color: "#A3B3FF"
    }, {
        tier_title: "expert_tier",
        usd_cost: Math.ceil(EXPERT_DAYS * HOURS_PER_DAY * COST_PER_HOUR),
        days_to_deliver: EXPERT_DAYS,
        tag_line: "expert_tag_line",
        descriptors: [
            "expert_descriptor_1",
            "expert_descriptor_2",
            "expert_descriptor_3",
            "expert_descriptor_4"
        ],

        dark_color: "#00BC7D",
        bright_color: "#5EE9B5"
    }
];

export { type DevService };
export default dev_services;