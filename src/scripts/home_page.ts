// *=================================================
// *
// * 3D Effects
// *
// *=================================================

import * as THREE from "three";
import { randFloat } from "three/src/math/MathUtils.js";
import { OBJLoader } from "three/examples/jsm/Addons.js";

const CHEST_MODEL_PATH: string = "/models/home_page/Chest.obj";
const OCEAN_FLOOR_MODEL_PATH: string = "/models/home_page/OceanFloor.obj";
const LEAFY_PLANT_MODEL_PATH: string = "/models/home_page/LeafyPlant.obj";
const LOW_POLY_FISH_MODEL_PATH: string = "/models/home_page/LowPolyFish.obj";

const CLEAR_COLOR: THREE.ColorRepresentation = 0x171717;
const OCEAN_COLOR: THREE.ColorRepresentation = 0x00bc7d;

const CAMERA_DEPTH: number = 10.0;

const CAMERA_START_Y: number = 0.0;
const CAMERA_END_Y: number = -50.0;

const VEGETATION_PLACEMENTS: THREE.Vector3[] = [
    new THREE.Vector3(-4.0,  -4.25,  0.0),
    new THREE.Vector3(-3.0,  -4.25, -1.5),
    new THREE.Vector3(-8.0,  -4.5,  -1.0),
    new THREE.Vector3(-3.0,  -4.5,   1.5),
    new THREE.Vector3(-6.0,  -4.25,  2.0),
    new THREE.Vector3( 0.0,  -4.5,  -6.0),
    new THREE.Vector3( 5.0,  -4.5,  -3.5),
    new THREE.Vector3( 2.0,  -4.25, -3.0),
    new THREE.Vector3( 3.5,  -4.25, -1.0),
];

class HomePageCanvas extends HTMLElement {
    private scene: THREE.Scene = new THREE.Scene();
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });

    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        70.0, // FOV
        1.0, // Aspect ASSIGNED DYNAMICALLY
        0.1, // Near Plane
        50.0 // Far Plane
    );

    private ocean_surface: THREE.Mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(100.0, 100.0, 50, 50),
        new THREE.MeshBasicMaterial({
            wireframe: true,
            color: OCEAN_COLOR
        })
    );

    private ocean_surface_program: THREE.WebGLProgramParametersWithUniforms | null = null;

    private last_frame_time: number = 0.0;

    constructor() {
        super();

        const obj_loader: OBJLoader = new OBJLoader();

        const chest_material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0x765545, wireframe: true });
        const ocean_floor_material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0xffdb84, wireframe: true });
        const leafy_plant_material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0x8ace53, wireframe: true });

        obj_loader.load(CHEST_MODEL_PATH, (data: THREE.Group<THREE.Object3DEventMap>) => {
            data.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = chest_material;
                }
            });
            
            this.scene.add(data);
            data.rotateY(Math.PI * 0.75);
            data.position.set(7.0, CAMERA_END_Y - 4.7, -1.0);
        });

        obj_loader.load(OCEAN_FLOOR_MODEL_PATH, (data: THREE.Group<THREE.Object3DEventMap>) => {
            data.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = ocean_floor_material;
                }
            });

            this.scene.add(data);
            data.position.set(0.0, CAMERA_END_Y - 5.0, -30.0);
        });OCEAN_FLOOR_MODEL_PATH

        obj_loader.load(LEAFY_PLANT_MODEL_PATH, (data: THREE.Group<THREE.Object3DEventMap>) => {
            data.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = leafy_plant_material;
                }
            });

            VEGETATION_PLACEMENTS.forEach((position: THREE.Vector3) => {
                const plant: THREE.Group<THREE.Object3DEventMap> = data.clone();
                
                this.scene.add(plant);
                plant.position.set(position.x, position.y + CAMERA_END_Y, position.z);
                plant.rotateY(randFloat(0.0, 2.0 * Math.PI));
            });
        });

        obj_loader.load(LOW_POLY_FISH_MODEL_PATH, (data: THREE.Group<THREE.Object3DEventMap>) => {
            // TODO: Create Particle Effect
        });

        this.camera.position.set(0.0, CAMERA_START_Y, CAMERA_DEPTH);

        this.scene.fog = new THREE.FogExp2(CLEAR_COLOR, 0.06);

        const directional_light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directional_light.position.set(1.0, 1.0, 0.5)
        directional_light.target.position.set(0.0, 0.0, 0.0);
        this.scene.add(directional_light);

        (this.ocean_surface.material as THREE.MeshBasicMaterial).onBeforeCompile = (shader: THREE.WebGLProgramParametersWithUniforms) => {
            this.ocean_surface_program = shader;

            shader.uniforms.u_time = { value: 0.0 };
            shader.vertexShader = `
                uniform float u_time;
                #define WAVE_TIME_SCALE 0.5
                #define WAVE_HEIGHT_VARIATION 0.5
                #define WAVE_X_SCALE 0.2
                #define WAVE_Y_SCALE 0.5
                ` + shader.vertexShader.replace(
                "#include <begin_vertex>",
                `
                vec3 transformed = vec3(position);

                float wave_time = u_time * WAVE_TIME_SCALE;
                transformed.z += sin(position.x * WAVE_X_SCALE + wave_time) * WAVE_HEIGHT_VARIATION;
                transformed.z += cos(position.y * WAVE_Y_SCALE + wave_time) * WAVE_HEIGHT_VARIATION;
                `
            );
        }

        this.ocean_surface.position.set(0.0, -4.0, -40.0);
        this.ocean_surface.rotateX(Math.PI * -0.5)
        this.scene.add(this.ocean_surface);

        this.renderer.setClearColor(CLEAR_COLOR);
        this.renderer.setAnimationLoop(this.render.bind(this));
        
        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";
        this.appendChild(this.renderer.domElement);

        this.onResize();
        window.addEventListener("resize", this.onResize.bind(this));

        this.last_frame_time = Date.now() * 0.001;
    }

    private onResize(): void {
        const width: number = this.clientWidth;
        const height: number = this.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    private getScrollPercentage(): number {
        const scroll_top: number = window.scrollY || document.documentElement.scrollTop || 0;
        const scroll_height: number = document.documentElement.scrollHeight - window.innerHeight;

        if (scroll_height <= 0) {
            return 0.0;
        }

        return Math.min(1.0, Math.max(0.0, scroll_top / scroll_height));
    }

    private render(): void {
        const current_frame_time: number = Date.now() * 0.001;
        const delta_time: number = current_frame_time - this.last_frame_time;
        this.last_frame_time = current_frame_time;

        if (this.ocean_surface_program !== null) {
            this.ocean_surface_program.uniforms.u_time.value += delta_time;
        }

        this.camera.position.y = CAMERA_START_Y + (CAMERA_END_Y - CAMERA_START_Y) * this.getScrollPercentage();

        this.renderer.render(this.scene, this.camera);
    }
};

customElements.define("home-page-canvas", HomePageCanvas);

// *=================================================
// *
// * Contact Form
// *
// *=================================================

import type { ContactFormData } from "../types/ContactFormData";

const CONTACT_FORM_ID: string = "home-contact-form";
const CONTACT_NAME_INPUT_ID: string = "contact-name-input";
const CONTACT_EMAIL_INPUT_ID: string = "contact-email-input";
const CONTACT_MESSAGE_INPUT_ID: string = "contact-message-input";

const contact_form: HTMLFormElement | null = document.getElementById(CONTACT_FORM_ID) as HTMLFormElement;
const contact_name_input: HTMLInputElement | null = document.getElementById(CONTACT_NAME_INPUT_ID) as HTMLInputElement;
const contact_email_input: HTMLInputElement | null = document.getElementById(CONTACT_EMAIL_INPUT_ID) as HTMLInputElement;
const contact_message_input: HTMLInputElement | null = document.getElementById(CONTACT_MESSAGE_INPUT_ID) as HTMLInputElement;

if (
    contact_form === null ||
    contact_name_input === null ||
    contact_email_input === null ||
    contact_message_input === null
) {
    throw new Error("Missing contact form element(s)!");
}

contact_form.addEventListener("submit", async (ev: SubmitEvent) => {
    ev.preventDefault();

    const name_value: string = contact_name_input.value.trim();
    const email_value: string = contact_email_input.value.trim();
    const message_value: string = contact_message_input.value.trim();

    if (!contact_form.checkValidity()) {
        alert("Invalid input given to contact form, please reevaluate and try again...");
        return;
    }

    const contact_data: ContactFormData = {
        subject: `Website Contact Form - ${name_value}`,
        email: email_value,
        message: message_value
    };

    const email_result = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact_data)
    });

    if (email_result.ok) {
        alert("Message successfully sent!");
        contact_form.reset();
    }
    else {
        alert("Message failed to send, please check form values and try again...");
    }
});