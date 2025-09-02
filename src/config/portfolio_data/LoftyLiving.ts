import * as THREE from "three";
import type { FloorParams } from "./FloorPlan";

import wood_plank_color from "../../assets/materials/wood_planks/color.jpg";

function FeetVector2(x: number, y: number): THREE.Vector2 {
    return new THREE.Vector2(
        x / 3.280839895,
        y / 3.280839895
    );
}

const texture_loader: THREE.TextureLoader = new THREE.TextureLoader();

const wood_plank_flooring: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    map: texture_loader.load(wood_plank_color.src),
});

wood_plank_flooring.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
        `#include <common>`,
        `#include <common>
        varying vec2 vUv;`
    ).replace(
        '#include <uv_vertex>',
        `vUv = (modelMatrix * vec4(position, 1.0)).xz; // world XZ plane`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `#include <common>
        varying vec2 vUv;
        uniform float scale_factor`
    ).replace(
        '#include <map_fragment>',
        `vec2 uv = vUv * scale_factor; // scale = tiles per meter
        vec4 texelColor = texture2D(map, mod(uv, 1.0));
        diffuseColor *= texelColor;`
    );

    shader.uniforms.scale_factor = { value: 1.0 / 1.0 };
};

const lofty_living: FloorParams[] = [
    {
        title: "First Floor",
        details: "The first floor is where the majority of the action happens! Sporting a spacious single-bedroom design, this layout works great for small families and vaction homes.",
        rooms: [
            {
                title: "Great Room",
                details: "To be written...",
                floor: {
                    position: FeetVector2(0.0, 0.0),
                    scale: FeetVector2(20.0, 16.0),
                    material: wood_plank_flooring,
                },
            }, {
                title: "Master Bedroom",
                details: "To be written...",
                floor: {
                    position: FeetVector2(16.0, 5.0),
                    scale: FeetVector2(12.0, 14.0),
                    material: wood_plank_flooring,
                },
            },
        ],
    }, {
        title: "Second Floor",
        details: "Welcome to the second floor loft! In this area, homeowners can easily assemble a fun game room or append an additional guest bedroom.",
        rooms: [],
    }, {
        title: "Exterior",
        details: "The lovely cabin exterior gives a cozy atmosphere for those seasonal nature getaways. We hope you'll consider this layout for your next construction adventure!",
        rooms: [],
    },
];

export default lofty_living;