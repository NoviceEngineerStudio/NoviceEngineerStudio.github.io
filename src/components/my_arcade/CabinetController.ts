import * as THREE from "three";
import CabinetView from "./CabinetView";
import getConstraints, { CabinetModelType } from "./CabinetModelTypes";
import SUPPORTED_LANGUAGES, { DEFAULT_LANGUAGE, type Language } from "../../config/language";
import CabinetModel, { CabinetControlOrigin, JoystickBallShape, type CabinetModelConstraints } from "./CabinetModel";

const RENDER_PARENT_CLASS: string = "my-arcade-render-parent";
const UI_PARENT_CLASS: string = "my-arcade-ui-parent";

const UI_PANEL_CLASS: string = "my-arcade-ui-panel"
const UI_PANEL_BUTTON_CLASS: string = "my-arcade-ui-panel-button";

const CABINET_PANEL_CLASS: string = "my-arcade-cabinet-panel";
const DETAILS_PANEL_CLASS: string = "my-arcade-details-panel";
const CONTROLS_PANEL_CLASS: string = "my-arcade-controls-panel";

function getElement(
    class_name: string,
    parent: HTMLElement,
    element_tag: keyof HTMLElementTagNameMap,
    ...element_classes: string[]
): HTMLElement {
    let element: HTMLElement | null = parent.getElementsByClassName(
        class_name
    ).item(0) as HTMLElement;

    if (element !== null) return element;

    element = document.createElement(element_tag);
    element.classList.add(...element_classes, class_name);
    parent.appendChild(element);

    return element;
}

class CabinetController extends HTMLElement {
    private texture_loader: THREE.TextureLoader;

    private type: CabinetModelType;

    private model: CabinetModel;
    private view: CabinetView;

    private cabinet_panel_open: boolean;
    private details_panel_open: boolean;
    private controls_panel_open: boolean;

    constructor() {
        super();

        let language: Language = (this.dataset.language ?? DEFAULT_LANGUAGE) as Language;

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            language = DEFAULT_LANGUAGE;
        }

        const render_parent: HTMLElement = getElement(RENDER_PARENT_CLASS, this, "div");
        const ui_parent: HTMLElement = getElement(UI_PARENT_CLASS, this, "div");

        this.texture_loader = new THREE.TextureLoader();

        this.type = CabinetModelType.CLASSIC;
        const constraints: CabinetModelConstraints = getConstraints(this.type);

        this.model = new CabinetModel({
            base_color: 0x0c0c54,
            trim_color: 0xf5f700,
            left_panel_decal: undefined,
            right_panel_decal: undefined,
            front_panel_decal: undefined,
            sign: undefined,
            under_light_color: undefined,
            has_coin_slot: false,
            player_create_infos: Array.from({ length: constraints.min_players }).map(() => ({
                joystick: {
                    origin: CabinetControlOrigin.LEFT,
                    ball_shape: JoystickBallShape.SPHERE,
                    ball_color: 0xff0000,
                },
                buttons_origin: CabinetControlOrigin.RIGHT,
                button_create_infos: Array.from({ length: constraints.player_constraints.min_buttons }).map(() => ({
                    base_color: 0xff0000,
                    light_color: undefined,
                    face_decal: undefined
                }))
            }))
        }, constraints, this.texture_loader);

        this.view = new CabinetView({
            canvas_parent: render_parent,
            canvas_create_info: {
                camera: {
                    fov: 70.0,
                    near: 0.1,
                    far: 100.0
                },
                renderer: {
                    antialias: true,
                    clear_color: 0xffffff,
                    clear_alpha: 1.0,
                    tone_mapping: THREE.ACESFilmicToneMapping,
                }
            },
            camera_initial_position: new THREE.Vector3(5.0, 5.0, 5.0),
            orbit_controls: {
                min_distance: 1.0,
                max_distance: 20.0,
                min_vertical_angle: 0.0,
                max_vertical_angle: 90.0,
                damping_enabled: true,
                pan_enabled: false
            }
        });

        this.cabinet_panel_open = false;
        this.details_panel_open = false;
        this.controls_panel_open = false;

        this.setupUI(ui_parent);
    }

    private setupUI(ui_parent: HTMLElement): void {
        const cabinet_panel: HTMLElement = getElement(CABINET_PANEL_CLASS, ui_parent, "div", UI_PANEL_CLASS);
        const details_panel: HTMLElement = getElement(DETAILS_PANEL_CLASS, ui_parent, "div", UI_PANEL_CLASS);
        const controls_panel: HTMLElement = getElement(CONTROLS_PANEL_CLASS, ui_parent, "div", UI_PANEL_CLASS);

        const cabinet_button: HTMLElement = getElement(UI_PANEL_BUTTON_CLASS, cabinet_panel, "button");
        const details_button: HTMLElement = getElement(UI_PANEL_BUTTON_CLASS, details_panel, "button");
        const controls_button: HTMLElement = getElement(UI_PANEL_BUTTON_CLASS, controls_panel, "button");

        cabinet_button.addEventListener("click", () => {
            this.cabinet_panel_open = !this.cabinet_panel_open;

            if (this.cabinet_panel_open) {
                cabinet_panel.style.maxHeight = "none";
            }
            else {
                cabinet_panel.style.maxHeight = "";
            }
        });

        details_button.addEventListener("click", () => {
            this.details_panel_open = !this.details_panel_open;

            if (this.details_panel_open) {
                details_panel.style.maxHeight = "none";
            }
            else {
                details_panel.style.maxHeight = "";
            }
        });

        controls_button.addEventListener("click", () => {
            this.controls_panel_open = !this.controls_panel_open;

            if (this.controls_panel_open) {
                controls_panel.style.maxHeight = "none";
            }
            else {
                controls_panel.style.maxHeight = "";
            }
        });
    }
}

customElements.define("my-arcade-cabinet-controller", CabinetController);

export default CabinetController;