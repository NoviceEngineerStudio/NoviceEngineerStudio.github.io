import type { ServiceData } from "./services";

import tier_icon_1 from "../assets/icons/tiers/tier_icon_1.webp";
import tier_icon_2 from "../assets/icons/tiers/tier_icon_2.webp";
import tier_icon_3 from "../assets/icons/tiers/tier_icon_3.webp";
import tier_icon_4 from "../assets/icons/tiers/tier_icon_4.webp";
import tier_icon_5 from "../assets/icons/tiers/tier_icon_5.webp";

import novice_preview from "../assets/previews/threejs_novice.webp";
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
                tag: "Scene",
                description: "Single 3D model with basic lighting and material.",
            }, {
                tag: "Animation",
                description: "Single simple animation.",
            }, {
                tag: "Interactivity",
                description: "Simple camera controls.",
            }, {
                tag: "Support",
                description: "1 revision round.",
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
                tag: "Scene",
                description: "Multiple assets in a simple 3D environment.",
            }, {
                tag: "Animation",
                description: "Basic static animations.",
            }, {
                tag: "Interactivity",
                description: "Simple camera controls and basic UI inputs.",
            }, {
                tag: "Support",
                description: "1 revision round.",
            },
        ],
        examples: [
            {
                title: "3D Floorplan Viewer",
                preview: apprentice_preview,
                month: "September",
                year: 2025,
                href: "https://noviceengineerstudio.github.io/portfolio/threejs/apprentice_tier",
                description: "Explore a cozy home layout using this 3D architecture viewer. Using the togglable controls, you can get a good look at the design using the orbiting camera, or feel how the space would be at-scale by walking around using the first-person camera. The project also features toggles for the home's roof, the world grid, and a floorplan overlay.",
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
                tag: "Scene",
                description: "Dynamic scene with numerous 3D assets.",
            }, {
                tag: "Animation",
                description: "Basic dynamic animations.",
            }, {
                tag: "Interactivity",
                description: "Complex camera controls and UI inputs.",
            }, {
                tag: "Support",
                description: "2-3 revision rounds with minor integration support.",
            },
        ],
        examples: [
            {
                title: "MyArcade",
                preview: adept_preview,
                month: "September",
                year: 2025,
                href: "https://noviceengineerstudio.github.io/portfolio/threejs/adept_tier",
                description: "MyArcade is a product customizer for a hypothetical arcade cabinet building company. Giving users the ability to tweak their cabinet to exactly what they'd like, this example project showcases what clients can get from our Adept Tier.",
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
                tag: "Scene",
                description: "Complex scene with numerous assets and interactions.",
            }, {
                tag: "Animation",
                description: "Dynamic and complex animations.",
            }, {
                tag: "Interactivity",
                description: "Complex keyboard, mouse, mobile, or browser input management.",
            }, {
                tag: "Support",
                description: "4 revision rounds with documentation and full integration support.",
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
                tag: "Scene",
                description: "Fully populated scene with highly dynamic lighting and rendering effects.",
            }, {
                tag: "Animation",
                description: "Dynamic and complex animations.",
            }, {
                tag: "Interactivity",
                description: "Complex input management with any device support.",
            }, {
                tag: "Support",
                description: "Full documentation, unlimited revisions, and long-term maintenance during project window.",
            },
        ],
        examples: [

        ],
    },
];

export default threejs_services;