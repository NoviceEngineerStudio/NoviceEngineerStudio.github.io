import * as THREE from "three";
import getSources from "./CabinetModelSources";
import type CabinetModel from "./CabinetModel";
import type { CabinetModelType } from "./CabinetModelTypes";
import { OBJLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import type { CabinetMeshSources } from "./CabinetModelSources";
import RenderCanvas, { type RenderCanvasCreateInfo } from "../threejs/RenderCanvas";

import retro_game_screen from "../../assets/images/my_arcade_retro_game.webp";

const GROUND_PLANE_SIZE: number = 500.0;

const AMBIENT_COLOR: THREE.ColorRepresentation = 0xffffff;
const AMBIENT_INSTENSITY: number = 0.5;

const DIRECTIONAL_COLOR: THREE.ColorRepresentation = 0xffffff;
const DIRECTIONAL_INTENSITY: number = 1.0;
const DIRECTIONAL_POSITION: THREE.Vector3 = new THREE.Vector3(10.0, 10.0, -10.0);

const GROUND_COLOR: THREE.ColorRepresentation = 0xffffff;
const GROUND_DEPTH: number = -2.0;

interface CabinetViewCreateInfo {
    model: CabinetModel;
    model_type: CabinetModelType;

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

    private model_loader: OBJLoader;

    private left_panel: THREE.Mesh;
    private right_panel: THREE.Mesh;
    private front_panel: THREE.Mesh;

    private screen: THREE.Mesh;
    private sign: THREE.Mesh;
    private sign_light: THREE.RectAreaLight;

    private trim: THREE.Mesh;

    private misc_panels: THREE.Mesh;

    constructor(create_info: CabinetViewCreateInfo) {
        this.canvas = new RenderCanvas(create_info.canvas_create_info);
        this.canvas.copyCameraPosition(create_info.camera_initial_position);
        this.canvas.registerUpdateCallback(this.onUpdate.bind(this));
        this.canvas.setParent(create_info.canvas_parent);

        const ambient_light: THREE.AmbientLight = new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INSTENSITY);

        const directional_light: THREE.DirectionalLight = new THREE.DirectionalLight(DIRECTIONAL_COLOR, DIRECTIONAL_INTENSITY);
        directional_light.position.copy(DIRECTIONAL_POSITION);
        directional_light.castShadow = true;

        this.orbit_controls = new OrbitControls(this.canvas.getCamera(), this.canvas.getDomElement());
        
        this.orbit_controls.minDistance = create_info.orbit_controls.min_distance;
        this.orbit_controls.maxDistance = create_info.orbit_controls.max_distance;
        this.orbit_controls.minPolarAngle = create_info.orbit_controls.min_vertical_angle * Math.PI / 180.0;
        this.orbit_controls.maxPolarAngle = create_info.orbit_controls.max_vertical_angle * Math.PI / 180.0;
        this.orbit_controls.enableDamping = create_info.orbit_controls.damping_enabled;
        this.orbit_controls.enablePan = create_info.orbit_controls.pan_enabled;

        this.model_loader = new OBJLoader();
        const texture_loader: THREE.TextureLoader = new THREE.TextureLoader();

        const ground_plane = new THREE.Mesh(
            new THREE.PlaneGeometry(GROUND_PLANE_SIZE, GROUND_PLANE_SIZE),
            new THREE.MeshStandardMaterial({
                color: GROUND_COLOR
            })
        );
        ground_plane.rotation.set(Math.PI * -0.5, 0.0, 0.0);
        ground_plane.position.setY(GROUND_DEPTH);
        ground_plane.receiveShadow = true;

        this.left_panel = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
        this.right_panel = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
        this.front_panel = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

        this.screen = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({
            map: texture_loader.load(retro_game_screen.src)
        }));
        this.sign = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

        this.trim = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

        this.misc_panels = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

        this.updateModelType(create_info.model_type);
        this.updateBaseColor(create_info.model);
        this.updateTrimColor(create_info.model);
        this.updateLeftPanelDecal(create_info.model);
        this.updateRightPanelDecal(create_info.model);
        this.updateFrontPanelDecal(create_info.model);
        this.updateSignLightColor(create_info.model);
        this.updateSignDecal(create_info.model);
        this.setSignEnable(create_info.model);

        this.left_panel.castShadow = true;
        this.right_panel.castShadow = true;
        this.front_panel.castShadow = true;
        this.screen.castShadow = true;
        this.sign.castShadow = true;
        this.sign_light.castShadow = true;
        this.trim.castShadow = true;
        this.misc_panels.castShadow = true;

        this.canvas.add(
            ambient_light,
            directional_light,
            ground_plane,
            this.left_panel,
            this.right_panel,
            this.front_panel,
            this.screen,
            this.sign,
            this.sign_light,
            this.trim,
            this.misc_panels
        );
    }

    private onUpdate(delta_time: number): void {
        this.orbit_controls.update(delta_time);
    }

    private async loadGeometries(type: CabinetModelType): Promise<void> {
        const sources: CabinetMeshSources = getSources(type);

        const left_panel_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.left_panel);
        const right_panel_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.right_panel);
        const front_panel_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.front_panel);
        const screen_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.screen);
        const sign_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.sign);
        const trim_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.trim);
        const misc_panels_group: THREE.Group<THREE.Object3DEventMap> = await this.model_loader.loadAsync(sources.misc_panels);

        const left_panel_mesh: THREE.Mesh = left_panel_group.getObjectByProperty("isMesh", true) as THREE.Mesh;
        const right_panel_mesh: THREE.Mesh = right_panel_group.getObjectByProperty("isMesh", true) as THREE.Mesh;
        const front_panel_mesh: THREE.Mesh = front_panel_group.getObjectByProperty("isMesh", true) as THREE.Mesh;
        const screen_mesh: THREE.Mesh = screen_group.getObjectByProperty("isMesh", true) as THREE.Mesh;
        const sign_mesh: THREE.Mesh = sign_group.getObjectByProperty("isMesh", true) as THREE.Mesh;
        const trim_mesh: THREE.Mesh = trim_group.getObjectByProperty("isMesh", true) as THREE.Mesh;
        const misc_panels_mesh: THREE.Mesh = misc_panels_group.getObjectByProperty("isMesh", true) as THREE.Mesh;

        this.left_panel.geometry = left_panel_mesh.geometry;
        this.right_panel.geometry = right_panel_mesh.geometry;
        this.front_panel.geometry = front_panel_mesh.geometry;
        this.screen.geometry = screen_mesh.geometry;
        this.sign.geometry = sign_mesh.geometry;
        this.trim.geometry = trim_mesh.geometry;
        this.misc_panels.geometry = misc_panels_mesh.geometry;
    }

    public updateModelType(type: CabinetModelType): void {
        this.loadGeometries(type);
    }

    public updateBaseColor(model: CabinetModel): void {
        const base_color: THREE.Color = model.getBaseColor();

        (this.left_panel.material as THREE.MeshStandardMaterial).color.copy(base_color);
        (this.right_panel.material as THREE.MeshStandardMaterial).color.copy(base_color);
        (this.front_panel.material as THREE.MeshStandardMaterial).color.copy(base_color);
        (this.misc_panels.material as THREE.MeshStandardMaterial).color.copy(base_color);
    }

    public updateTrimColor(model: CabinetModel): void {
        const trim_color: THREE.Color = model.getTrimColor();

        (this.trim.material as THREE.MeshStandardMaterial).color.copy(trim_color);
    }

    public updateLeftPanelDecal(model: CabinetModel): void {
        if (!model.hasLeftPanelDecal()) {
            (this.left_panel.material as THREE.MeshStandardMaterial).map = null;
            return;
        }

        (this.left_panel.material as THREE.MeshStandardMaterial).map = model.getLeftPanelDecal();
    }

    public updateRightPanelDecal(model: CabinetModel): void {
        if (!model.hasRightPanelDecal()) {
            (this.right_panel.material as THREE.MeshStandardMaterial).map = null;
            return;
        }

        (this.right_panel.material as THREE.MeshStandardMaterial).map = model.getRightPanelDecal();
    }

    public updateFrontPanelDecal(model: CabinetModel): void {
        if (!model.hasFrontPanelDecal()) {
            (this.front_panel.material as THREE.MeshStandardMaterial).map = null;
            return;
        }

        (this.front_panel.material as THREE.MeshStandardMaterial).map = model.getFrontPanelDecal();
    }

    public setSignEnable(model: CabinetModel): void {
        if (model.hasSign()) {
            this.sign_light.visible = true;
        }
        else {
            this.sign_light.visible = false;
        }
    }

    public updateSignDecal(model: CabinetModel): void {
        if (!model.hasSign()) {

        }
    }

    public updateSignLightColor(model: CabinetModel): void {
        const light_color: THREE.Color = model.getSignLightColor();

        this.sign_light.color.copy(light_color);
    }
}

export default CabinetView;