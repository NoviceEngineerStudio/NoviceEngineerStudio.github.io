// *=================================================
// *
// * 3D Effects
// *
// *=================================================

import * as THREE from "three";

const CLEAR_COLOR: THREE.ColorRepresentation = 0x171717;

class HomePageCanvas extends HTMLElement {
    private scene: THREE.Scene = new THREE.Scene();
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });

    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        70.0, // FOV
        1.0, // Aspect ASSIGNED DYNAMICALLY
        0.1, // Near Plane
        100.0 // Far Plane
    );

    constructor() {
        super();

        this.scene.fog = new THREE.FogExp2(CLEAR_COLOR, 0.06);

        this.renderer.setClearColor(CLEAR_COLOR);
        this.renderer.setAnimationLoop(this.render.bind(this));
        
        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";
        this.appendChild(this.renderer.domElement);

        this.onResize();
        window.addEventListener("resize", this.onResize.bind(this));
    }

    private onResize(): void {
        const width: number = this.clientWidth;
        const height: number = this.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    private render(): void {
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