import * as THREE from "three";

interface PerspectiveCameraCreateInfo {
    fov: number;
    near: number;
    far: number;
}

interface OrthographicCameraCreateInfo {
    near: number;
    far: number;
}

function isPerspectiveCameraCreateInfo(obj: unknown): obj is PerspectiveCameraCreateInfo {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "fov" in obj &&
        typeof (obj as PerspectiveCameraCreateInfo).fov === "number" &&
        "near" in obj &&
        typeof (obj as PerspectiveCameraCreateInfo).near === "number" &&
        "far" in obj &&
        typeof (obj as PerspectiveCameraCreateInfo).far === "number"
    );
}

abstract class CameraBackend {
    public abstract onResize(width: number, height: number): void;
    public abstract getCamera(): THREE.Camera;
}

class PerspectiveBackend extends CameraBackend {
    private camera: THREE.PerspectiveCamera;

    constructor(create_info: PerspectiveCameraCreateInfo) {
        super();

        this.camera = new THREE.PerspectiveCamera(
            create_info.fov,
            1.0,
            create_info.near,
            create_info.far
        );
    }

    public override onResize(width: number, height: number): void {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    public override getCamera(): THREE.Camera {
        return this.camera;
    }
}

class OrthographicBackend extends CameraBackend {
    private camera: THREE.OrthographicCamera;

    constructor(create_info: OrthographicCameraCreateInfo) {
        super();

        this.camera = new THREE.OrthographicCamera(
            -1.0, 1.0, 1.0, -1.0,
            create_info.near,
            create_info.far
        );
    }

    public override onResize(width: number, height: number): void {
        this.camera.top = height / width;
        this.camera.bottom = - this.camera.top;
        this.camera.updateProjectionMatrix();
    }

    public override getCamera(): THREE.Camera {
        return this.camera;
    }
}

class CameraManager {
    private backend: CameraBackend;

    constructor(create_info: PerspectiveCameraCreateInfo | OrthographicCameraCreateInfo) {
        if (isPerspectiveCameraCreateInfo(create_info)) {
            this.backend = new PerspectiveBackend(create_info);
        }
        else {
            this.backend = new OrthographicBackend(create_info);
        }
    }

    public onResize(width: number, height: number): void {
        this.backend.onResize(width, height);
    }

    public getCamera(): THREE.Camera {
        return this.backend.getCamera();
    }
}

export { type PerspectiveCameraCreateInfo, type OrthographicCameraCreateInfo };
export default CameraManager;