import * as THREE from "three";
import CabinetView from "./CabinetView";
import getConstraints, { CabinetModelType } from "./CabinetModelTypes";
import SUPPORTED_LANGUAGES, { DEFAULT_LANGUAGE, type Language } from "../../config/language";
import CabinetModel, { CabinetControlOrigin, JoystickBallShape, type CabinetModelConstraints } from "./CabinetModel";

const RENDER_PARENT_ID: string = "my-arcade-render-parent";
const COST_ID: string = "my-arcade-cost";

function getElement(id: string): HTMLElement {
    const element: HTMLElement | null = document.getElementById(id);

    if (element === null) {
        throw new Error(`HTMLElement with id ${id} could not be found!`);
    }

    return element;
}

class CabinetController extends HTMLElement {
    private texture_loader: THREE.TextureLoader;

    private type: CabinetModelType;

    private model: CabinetModel;
    private view: CabinetView;

    private cost_element: HTMLElement;

    constructor() {
        super();

        let language: Language = (this.dataset.language ?? DEFAULT_LANGUAGE) as Language;

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            language = DEFAULT_LANGUAGE;
        }

        const render_parent: HTMLElement = getElement(RENDER_PARENT_ID);

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
            model: this.model,
            model_type: this.type,
            canvas_parent: render_parent,
            canvas_create_info: {
                camera: {
                    fov: 70.0,
                    near: 0.1,
                    far: 100.0
                },
                renderer: {
                    antialias: true,
                    clear_color: 0xafafaf,
                    clear_alpha: 1.0,
                    tone_mapping: THREE.ACESFilmicToneMapping,
                    shadow_map: THREE.PCFShadowMap
                }
            },
            camera_initial_position: new THREE.Vector3(5.0, 2.0, 5.0),
            orbit_controls: {
                min_distance: 1.0,
                max_distance: 20.0,
                min_vertical_angle: 0.0,
                max_vertical_angle: 90.0,
                damping_enabled: true,
                pan_enabled: false
            }
        });

        this.cost_element = getElement(COST_ID);
    }
}

customElements.define("my-arcade-cabinet-controller", CabinetController);

export default CabinetController;