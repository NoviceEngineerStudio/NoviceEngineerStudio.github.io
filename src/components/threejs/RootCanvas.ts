import * as THREE from "three";
import CameraManager from "./CameraManager";
import SceneManager, { type UpdateCallback } from "./SceneManager";
import type { OrthographicCameraCreateInfo, PerspectiveCameraCreateInfo } from "./CameraManager";

interface RootCanvasCreateInfo {
    camera: PerspectiveCameraCreateInfo | OrthographicCameraCreateInfo;
    renderer: {
        antialias: boolean;
        clear_color: number;
        clear_alpha: number;
        tone_mapping: THREE.ToneMapping;
    }
}

abstract class RootCanvas {
    protected scene_manager: SceneManager;
    protected camera_manager: CameraManager;

    protected renderer: THREE.WebGLRenderer;
    private last_frame_time: number;

    constructor(create_info: RootCanvasCreateInfo) {
        this.scene_manager = new SceneManager();
        this.camera_manager = new CameraManager(create_info.camera);

        this.renderer = new THREE.WebGLRenderer({ antialias: create_info.renderer.antialias });

        this.last_frame_time = Date.now() * 0.001;
        this.renderer.setAnimationLoop(this.__mainLoop.bind(this));

        const clear_color: THREE.Color = new THREE.Color(create_info.renderer.clear_color);
        this.renderer.setClearColor(clear_color, create_info.renderer.clear_alpha);
        this.renderer.toneMapping = create_info.renderer.tone_mapping;

        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";

        window.addEventListener("resize", this.__onResize.bind(this));
    }

    public setParent(parent: HTMLElement): void {
        const render_parent: HTMLElement | null = this.renderer.domElement.parentElement;
        if (render_parent !== null) {
            render_parent.removeChild(this.renderer.domElement);
        }

        parent.appendChild(this.renderer.domElement);
        this.__onResize();
    }

    public add(...objects: THREE.Object3D[]): void {
        this.scene_manager.add(...objects);
    }

    public registerUpdateCallback(callback: UpdateCallback): number {
        return this.scene_manager.registerUpdateCallback(callback);
    }

    public unregisterUpdateCallback(id: number): void {
        this.scene_manager.unregisterUpdateCallback(id);
    }

    public setCameraPosition(x: number, y: number, z: number): void {
        this.camera_manager.getCamera().position.set(x, y, z);
    }

    public setCameraRotation(x: number, y: number, z: number): void {
        this.camera_manager.getCamera().rotation.set(x, y, z);
    }

    private __onResize(): void {
        const render_parent: HTMLElement | null = this.renderer.domElement.parentElement;
        if (render_parent === null) return;

        const width: number = render_parent.clientWidth;
        const height: number = render_parent.clientHeight;

        this.camera_manager.onResize(width, height);

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.onResize(width, height);
    }

    private __mainLoop(): void {
        const cur_frame_time: number = Date.now() * 0.001;
        const delta_time: number = cur_frame_time - this.last_frame_time;
        this.last_frame_time = cur_frame_time;

        this.scene_manager.update(delta_time);
        this.render(delta_time);
    }

    protected abstract onResize(width: number, height: number): void;
    protected abstract render(delta_time: number): void;
}

export { type RootCanvasCreateInfo };
export default RootCanvas;