import type { ServiceData } from "./services";

import tier_icon_1 from "../assets/icons/tiers/tier_icon_1.webp";
import tier_icon_2 from "../assets/icons/tiers/tier_icon_2.webp";
import tier_icon_3 from "../assets/icons/tiers/tier_icon_3.webp";
import tier_icon_4 from "../assets/icons/tiers/tier_icon_4.webp";
import tier_icon_5 from "../assets/icons/tiers/tier_icon_5.webp";

import novice_preview from "../assets/previews/threejs_novice.webp";apprentice_preview
import apprentice_preview from "../assets/previews/threejs_apprentice.webp";
import adept_preview from "../assets/previews/threejs_adept.webp";

export const threejs_services: ServiceData[] = [
    { // ? Novice Tier ////////////////////////////////////////////////////////
        tier: "Novice",
        tier_icon: tier_icon_1,
        price: {
            low: 30.00,
            high: 85.00,
        },
        time: {
            low: 1,
            high: undefined,
        },
        deliverables: [
            {
                tag: "Tag",
                description: "I will embed a 3D model into your website",
            }, {
                tag: "Animation",
                description: "Simple Repetitive Loops or None",
            }, {
                tag: "Interactivity",
                description: "Minimal or None",
            }, {
                tag: "3D Models",
                description: "Primitive Geometry or Provided Model",
            }, {
                tag: "Revisions",
                description: "1 Round",
            },
        ],
        examples: [
            {
                title: "Hero Globe",
                preview: novice_preview,
                month: "August",
                year: 2025,
                href: "https://noviceengineerstudio.github.io/portfolio/threejs/novice_tier",
                description: "This project serves as a fun example of what you can expect from our Novice Tier. Showcasing a 3D model of the earth in a made-up companies hero section, you can see the subtle animations looping in the background to give the page a more whimsical feeling.",
            },
        ],
    }, { // ? Apprentice Tier /////////////////////////////////////////////////
        tier: "Apprentice",
        tier_icon: tier_icon_2,
        price: {
            low: 100.00,
            high: 300.00,
        },
        time: {
            low: 1,
            high: 3,
        },
        deliverables: [
            {
                tag: "Tag",
                description: "I will embed a dynamic 3D model into your website",
            }, {
                tag: "Animation",
                description: "Simple Property Changes",
            }, {
                tag: "Interactivity",
                description: "Model Movement and Property Changes",
            }, {
                tag: "3D Models",
                description: "1 Custom Model and Primitive Geometry",
            }, {
                tag: "Revisions",
                description: "2 Rounds",
            },
        ],
        examples: [
            {
                title: "MyArcade",
                preview: apprentice_preview,
                month: "September",
                year: 2025,
                href: "https://noviceengineerstudio.github.io/portfolio/threejs/apprentice_tier",
                description: "MyArcade is a product customizer for a hypothetical arcade cabinet building company. Giving users the ability to tweak their cabinet to exactly what they'd like, this example project showcases what clients can get from our Apprentice Tier.",
            },
        ],
    }, { // ? Adept Tier //////////////////////////////////////////////////////
        tier: "Adept",
        tier_icon: tier_icon_3,
        price: {
            low: 400.00,
            high: 700.00,
        },
        time: {
            low: 4,
            high: 7,
        },
        deliverables: [
            {
                tag: "Tag",
                description: "I will create an interactive 3D website experience",
            }, {
                tag: "Animation",
                description: "Simple Property Changes or Minimal Complex Animation",
            }, {
                tag: "Interactivity",
                description: "Integrated and Complex Input",
            }, {
                tag: "3D Models",
                description: "3 Custom Models",
            }, {
                tag: "Revisions",
                description: "3 Rounds",
            },
        ],
        examples: [
            {
                title: "Lofty Living Cabin",
                preview: adept_preview,
                month: "September",
                year: 2025,
                href: "https://noviceengineerstudio.github.io/portfolio/threejs/adept_tier",
                description: "This project gives an idea for what you can expect from our Adept Tier. Showcasing a lovely two-story home, we explore the Lofty Living house from both a dollhouse view and a first-person perspective (on desktop only). As you traverse the home, see updates from the architects about each room, giving the design a more personable charm.",
            },
        ],
    }, { // ? Expert Tier /////////////////////////////////////////////////////
        tier: "Expert",
        tier_icon: tier_icon_4,
        price: {
            low: 800.00,
            high: 1400.00,
        },
        time: {
            low: 8,
            high: 14,
        },
        deliverables: [
            {
                tag: "Tag",
                description: "I will create a highly-interactive 3D website experience",
            }, {
                tag: "Animation",
                description: "As Requested",
            }, {
                tag: "Interactivity",
                description: "As Requested",
            }, {
                tag: "3D Models",
                description: "8 Custom Models",
            }, {
                tag: "Revisions",
                description: "4 Rounds",
            },
        ],
        examples: [

        ],
    }, { // ? Master Tier /////////////////////////////////////////////////////
        tier: "Master",
        tier_icon: tier_icon_5,
        price: {
            low: 1500.00,
            high: "+",
        },
        time: {
            low: 15,
            high: "+",
        },
        deliverables: [
            {
                tag: "Tag",
                description: "I will create a fully-featured 3D website experience",
            }, {
                tag: "Animation",
                description: "As Requested",
            }, {
                tag: "Interactivity",
                description: "As Requested",
            }, {
                tag: "3D Models",
                description: "As Requested",
            }, {
                tag: "Revisions",
                description: "5 Rounds",
            },
        ],
        examples: [

        ],
    },
];

export default threejs_services;