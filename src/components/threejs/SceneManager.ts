import * as THREE from "three";

type UpdateCallback = ((delta_time: number) => void);

class SceneManager {
    private cur_scene: THREE.Scene;

    private next_system_id: number;
    private update_systems: UpdateCallback[];

    private id_to_idx: Map<number, number>;
    private idx_to_id: Map<number, number>;

    constructor() {
        this.cur_scene = new THREE.Scene();

        this.next_system_id = 0;
        this.update_systems = [];

        this.id_to_idx = new Map<number, number>();
        this.idx_to_id = new Map<number, number>();
    }

    public getScene(): THREE.Scene {
        return this.cur_scene;
    }

    public update(delta_time: number): void {
        for (let idx = 0; idx < this.update_systems.length; ++idx) {
            this.update_systems[idx](delta_time);
        }
    }
    
    public add(...objects: THREE.Object3D[]): void {
        this.cur_scene.add(...objects);
    }

    public registerUpdateCallback(callback: UpdateCallback): number {
        const callback_idx: number = this.update_systems.length;
        this.update_systems.push(callback);

        this.id_to_idx.set(this.next_system_id, callback_idx);
        this.idx_to_id.set(callback_idx, this.next_system_id);
        
        return this.next_system_id++;
    }

    public unregisterUpdateCallback(id: number): void {
        const remove_idx = this.id_to_idx.get(id);
        if (remove_idx === undefined) return;

        const last_idx = this.update_systems.length - 1;
        const last_id = this.idx_to_id.get(last_idx);
        if (last_id === undefined) return;

        this.id_to_idx.delete(id);
        this.idx_to_id.delete(last_idx);
        this.update_systems[remove_idx] = this.update_systems[last_idx];
        this.update_systems.pop();

        if (this.update_systems.length === 0) {
            this.idx_to_id.delete(remove_idx);
            return;
        };

        this.id_to_idx.set(last_id, remove_idx);
        this.idx_to_id.set(remove_idx, last_id);
    }
}

export { type UpdateCallback };
export default SceneManager;