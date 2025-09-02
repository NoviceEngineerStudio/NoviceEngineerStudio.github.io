import * as THREE from "three";

export interface RoomParams {
    title: string;
    details: string;
    floor: {
        position: THREE.Vector2;
        scale: THREE.Vector2;
        material: THREE.Material;
    };
}

export interface FloorParams {
    title: string;
    details: string;
    rooms: RoomParams[];
}

export interface DetailsPair {
    name: string;
    details: string;
    index: number;
}

const FLOOR_HEIGHT: number = 8.0 / 3.280839895;
const OFF_SCREEN_HEIGHT: number = 20.0;
const FLY_ANIMATION_TIME: number = 0.5;

const DEG2RAD: number = Math.PI / 180.0;

interface FlyAnimation {
    object: THREE.Object3D;
    delay: number;
    t_step: number;
    direction: number;
}

class Floor extends THREE.Object3D {
    private details: DetailsPair;
    private room_details: DetailsPair[];
    private room_regions: THREE.Vector4[];

    private is_active: boolean = false;

    private height: number;
    private fly_animations: FlyAnimation[] = [];
    
    constructor(params: FloorParams, floor_index: number) {
        super();

        this.details = {
            name: params.title,
            details: params.details,
            index: 1000 * floor_index,
        };

        this.room_details = new Array(params.rooms.length) as DetailsPair[];
        this.room_regions = new Array(params.rooms.length) as THREE.Vector4[];

        this.height = FLOOR_HEIGHT * floor_index;

        for (let idx = 0; idx < params.rooms.length; ++idx) {
            const room_info = params.rooms[idx];

            this.room_details[idx] = {
                name: room_info.title,
                details: room_info.details,
                index: this.details.index + idx + 1,
            };

            this.room_regions[idx] = new THREE.Vector4(
                room_info.floor.position.x - room_info.floor.scale.x * 0.5,
                room_info.floor.position.y - room_info.floor.scale.y * 0.5,
                room_info.floor.scale.x,
                room_info.floor.scale.y
            );

            // ? Create Floor

            const floor_root: THREE.Object3D = new THREE.Object3D();

            const floor_mesh: THREE.Mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(
                    room_info.floor.scale.x,
                    room_info.floor.scale.y
                ),
                room_info.floor.material
            );

            floor_root.add(floor_mesh);

            floor_mesh.rotation.set(-90.0 * DEG2RAD, 0.0, 0.0);
            floor_mesh.position.set(
                room_info.floor.position.x,
                this.height - FLOOR_HEIGHT * 0.5,
                room_info.floor.position.y
            );

            // ? Create Walls

            // TODO: Build Rooms

            this.add(floor_root);
        }
    }

    public getHeight(): number {
        return this.height;
    }

    public getDetails(): DetailsPair {
        return this.details;
    }

    public getRoomDetails(camera_position: THREE.Vector3): DetailsPair {
        for (let idx = 0; idx < this.room_regions.length; ++idx) {
            const room = this.room_regions[idx];

            if (
                room.x <= camera_position.x &&
                room.y <= camera_position.y &&
                camera_position.x < room.x + room.z &&
                camera_position.y < room.y + room.w
            ) {
                return this.room_details[idx];
            }
        }

        return this.details;
    }

    public setActive(active: boolean): void {
        if (this.is_active === active) return;
        this.is_active = active;

        const animation_direction: number = active ? -1.0 : 1.0;
        while (this.fly_animations.length > 0) this.fly_animations.pop();

        let animation_delay = 0.0;
        this.children.forEach((child: THREE.Object3D) => {
            child.visible = true;

            this.fly_animations.push({
                object: child,
                delay: animation_delay,
                t_step: 0.0,
                direction: animation_direction,
            });

            animation_delay += 0.1;
        });
    }

    public tickAnimations(delta_time: number): void {
        for (let idx = 0; idx < this.fly_animations.length; ++idx) {
            const animation = this.fly_animations[idx];

            if (animation.delay > 0.0) {
                animation.delay -= delta_time;
                continue;
            }

            animation.t_step += delta_time;

            if (animation.t_step >= FLY_ANIMATION_TIME) {
                this.fly_animations.splice(idx, 1);
                --idx;

                if (this.is_active) {
                    animation.object.position.setY(
                        (
                            (OFF_SCREEN_HEIGHT - this.height) *
                            0.5 *
                            (animation.direction + 1.0)
                        ) + this.height
                    );
                    
                    continue;
                }
                
                animation.object.visible = false;

                continue;
            }

            animation.object.position.setY(
                (
                    (OFF_SCREEN_HEIGHT - this.height) *
                    0.5 *
                    (animation.direction * (2.0 * (animation.t_step / FLY_ANIMATION_TIME) - 1.0) + 1.0)
                ) + this.height
            );
        }
    }
}

export default class FloorPlan extends THREE.Object3D {
    private floors: Floor[];

    constructor(floors: FloorParams[]) {
        super();
        
        this.floors = new Array(floors.length) as Floor[];

        for (let idx = 0; idx < floors.length; ++idx) {
            this.floors[idx] = new Floor(floors[idx], idx);
            this.add(this.floors[idx]);
        }

        this.floors[0].setActive(true);
    }

    public getFloorCount(): number {
        return this.floors.length;
    }

    public getFloorHeight(floor_index: number): number {
        return this.floors[floor_index].getHeight();
    }

    public getFloorDetails(floor_index: number): DetailsPair {
        return this.floors[floor_index].getDetails();
    }

    public getRoomDetails(floor_index: number, camera_position: THREE.Vector3): DetailsPair {
        return this.floors[floor_index].getRoomDetails(camera_position);
    }

    public setFloor(floor_index: number): void {
        for (let idx = 0; idx < this.floors.length; ++idx) {
            this.floors[idx].setActive(idx <= floor_index);
        }
    }

    public tickAnimations(delta_time: number): void {
        for (let idx = 0; idx < this.floors.length; ++idx) {
            this.floors[idx].tickAnimations(delta_time);
        }
    }
}