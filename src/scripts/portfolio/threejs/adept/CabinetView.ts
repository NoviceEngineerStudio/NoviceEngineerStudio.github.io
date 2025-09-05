import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

interface CabinetViewCreateInfo {
    camera_initial_distance: number;
}

class CabinetView {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;

    private last_time: number;
    private orbit_controls: OrbitControls;

    private resize_handler: (() => void) | null = null;

    constructor(create_info: CabinetViewCreateInfo) {
        // ? Create and Configure the Scene

        this.scene = new THREE.Scene();

        const blah = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(blah);

        // ? Create and Configure the Camera

        this.camera = new THREE.PerspectiveCamera(
            70.0, // ? FOV
            1.0, // ! Set Dynamically, Leave Default
            0.1, // ? Near Plane
            1000.0 // ? Far Plane
        );

        this.camera.position.copy(
            new THREE.Vector3(1.0, 1.0, 1.0)
            .normalize()
            .multiplyScalar(create_info.camera_initial_distance)
        );

        // ? Create and Configure the Renderer

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setAnimationLoop(this.render.bind(this));

        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";

        // ? Create and Configure the Orbit Controls

        this.last_time = this.getFrameTime();
        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.orbit_controls.enablePan = false;
        this.orbit_controls.enableDamping = true;
    }

    // *=================================================
    // *
    // * Public Methods
    // *
    // *=================================================

    public attachCanvas(parent: HTMLElement) {
        parent.appendChild(this.renderer.domElement);

        if (this.resize_handler !== null) {
            window.removeEventListener("resize", this.resize_handler);
        }

        this.onResize(parent);
        this.resize_handler = this.onResize.bind(this, parent);
        window.addEventListener("resize", this.resize_handler);
    }

    // *=================================================
    // *
    // * Private Methods
    // *
    // *=================================================

    private onResize(canvas_parent: HTMLElement): void {
        const width: number = canvas_parent.clientWidth;
        const height: number = canvas_parent.clientHeight;

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    private getFrameTime(): number {
        return Date.now() * 0.001;
    }

    private render(): void {
        const cur_time: number = this.getFrameTime();
        const delta_time: number = cur_time - this.last_time;
        this.last_time = cur_time;

        this.orbit_controls.update(delta_time);

        this.renderer.render(this.scene, this.camera);
    }
}

export { type CabinetViewCreateInfo };
export default CabinetView;