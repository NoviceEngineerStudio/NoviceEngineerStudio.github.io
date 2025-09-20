import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import RenderCanvas, { type RenderCanvasCreateInfo } from "../threejs/RenderCanvas";

const GROUND_PLANE_SIZE: number = 500.0;

const FOG_COLOR: THREE.ColorRepresentation = 0xffffff;
const FOG_DENSITY: number = 0.02;

const AMBIENT_COLOR: THREE.ColorRepresentation = 0xffffff;
const AMBIENT_INSTENSITY: number = 1.0;

interface CabinetViewCreateInfo {
    canvas_parent: HTMLElement;
    canvas_create_info: RenderCanvasCreateInfo;
    camera_initial_position: THREE.Vector3;

    orbit_controls: {
        min_distance: number;
        max_distance: number;
        min_vertical_angle: number;
        max_vertical_angle: number;
        damping_enabled: boolean;
        pan_enabled: boolean;
    };
}

class CabinetView {
    private canvas: RenderCanvas;
    private orbit_controls: OrbitControls;

    private ground_plane: THREE.Mesh;

    private left_panel: THREE.Mesh;

    constructor(create_info: CabinetViewCreateInfo) {
        this.canvas = new RenderCanvas(create_info.canvas_create_info);
        this.canvas.copyCameraPosition(create_info.camera_initial_position);
        this.canvas.registerUpdateCallback(this.onUpdate.bind(this));
        this.canvas.setParent(create_info.canvas_parent);

        const scene: THREE.Scene = this.canvas.getScene();
        scene.fog = new THREE.FogExp2(FOG_COLOR, FOG_DENSITY);

        const ambient_light: THREE.AmbientLight = new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INSTENSITY);

        this.orbit_controls = new OrbitControls(this.canvas.getCamera(), this.canvas.getDomElement());
        
        this.orbit_controls.minDistance = create_info.orbit_controls.min_distance;
        this.orbit_controls.maxDistance = create_info.orbit_controls.max_distance;
        this.orbit_controls.minPolarAngle = create_info.orbit_controls.min_vertical_angle * Math.PI / 180.0;
        this.orbit_controls.maxPolarAngle = create_info.orbit_controls.max_vertical_angle * Math.PI / 180.0;
        this.orbit_controls.enableDamping = create_info.orbit_controls.damping_enabled;
        this.orbit_controls.enablePan = create_info.orbit_controls.pan_enabled;

        this.ground_plane = new THREE.Mesh(
            new THREE.PlaneGeometry(GROUND_PLANE_SIZE, GROUND_PLANE_SIZE),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );
        this.ground_plane.rotation.set(Math.PI * -0.5, 0.0, 0.0);

        this.left_panel = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());

        this.canvas.add(
            ambient_light,
            this.ground_plane,
            this.left_panel
        );
    }

    private onUpdate(delta_time: number): void {
        this.orbit_controls.update(delta_time);
    }
}

export default CabinetView;