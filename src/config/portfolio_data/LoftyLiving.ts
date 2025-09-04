import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface POIData {
    title: string;
    details: string;
    index: number;
}

interface FloorPlan {
    getOrbitHome: (floor_index: number) => THREE.Vector3;
    getFirstPersonHome: (floor_index: number) => THREE.Vector3;

    loadModel: (scene: THREE.Scene) => THREE.Object3D[];
    
    getFloorPOI: (floor_index: number) => POIData;
    getRoomPOI: (floor_index: number, position: THREE.Vector3) => POIData;
}

const METER2FEET: number = 1.0 / 3.280839895;
const FLOOR_HEIGHT: number = 2.4384;

const floor_pois: POIData[] = [
    {
        title: "First Floor",
        details: "The first floor is where the majority of the action happens! Sporting a spacious single-bedroom design, this layout works great for small families and vaction homes.",
        index: 0x0000,
    }, {
        title: "Second Floor",
        details: "Welcome to the second floor loft! In this area, homeowners can easily assemble a fun game room or append an additional guest bedroom.",
        index: 0x0100,
    }, {
        title: "Exterior",
        details: "The lovely cabin exterior gives a cozy atmosphere for those seasonal nature getaways. We hope you'll consider this layout for your next construction adventure!",
        index: 0x0200,
    },
];

const room_pois: {
    position: THREE.Vector2;
    sqr_distance: number; // ? All distances must be squared (removes a runtime multiplication)
    poi: POIData;
}[][] = [
    // ? First Floor
    [], // TODO:

    // ? Second Floor
    [], // TODO:

    // ? Exterior (NO POIs)
    [],
];

const model_srcs: string[] = [
    "/models/portfolio/threejs/adept/first_floor.glb",
    "/models/portfolio/threejs/adept/second_floor.glb",
    "/models/portfolio/threejs/adept/roof.glb",
];

const lofty_living: FloorPlan = {
    getOrbitHome: (floor_index: number) => {
        return new THREE.Vector3(-10.0, (floor_index * FLOOR_HEIGHT) + 10.0, 10.0);
    },
    getFirstPersonHome: (floor_index: number) => {
        return new THREE.Vector3(0.0, (floor_index * FLOOR_HEIGHT) + 1.5, 0.0);
    },

    loadModel: (scene: THREE.Scene): THREE.Object3D[] => {
        const model_loader: GLTFLoader = new GLTFLoader();
        const floors: THREE.Object3D[] = Array(model_srcs.length) as THREE.Object3D[];

        for (let idx = 0; idx < model_srcs.length; ++idx) {
            floors[idx] = new THREE.Object3D();

            const floor = floors[idx];
            floor.scale.set(METER2FEET, METER2FEET, METER2FEET);
            floor.visible = false;

            scene.add(floor);

            model_loader.load(model_srcs[idx], (data: GLTF) => floor.add(data.scene));
        }

        return floors;
    },

    getFloorPOI: (floor_index: number) => {
        return floor_pois[floor_index];
    },
    getRoomPOI: (floor_index: number, position: THREE.Vector3) => {
        const rooms = room_pois[floor_index];

        for (let idx = 0; idx < rooms.length; ++idx) {
            const room = rooms[idx];

            const dx: number = position.x - room.position.x;
            const dz: number = position.z - room.position.y;

            if ((dx * dx) + (dz * dz) <= room.sqr_distance) {
                return room.poi;
            }
        }

        return lofty_living.getFloorPOI(floor_index);
    },
}

export default lofty_living;