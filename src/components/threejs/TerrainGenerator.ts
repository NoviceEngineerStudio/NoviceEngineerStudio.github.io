import * as THREE from "three";
import computeNoise from "./TerrainNoise";
import Perlin from "../../utils/math/Perlin";
import { OBJExporter } from "three/examples/jsm/Addons.js";
import type { TerrainWorkerData, TerrainWorkerResponse } from "./TerrainGeneratorGeometryWorker";

interface TerrainTexture {
    texture_src: string,
    min_height: number;
    max_height: number;
    tile_size: number;
}

interface TerrainGeneratorCreateInfo {
    width: number;
    height: number;
    spacing: number;

    wireframe_enabled: boolean;
    morph_time: number;

    random_seed: number;

    min_height: number;
    max_height: number;
    terrain_scale: number;
    start_amplitude: number;
    start_frequency: number;

    carve_frequency: number;
    carve_amplitude: number;

    octaves: number;
    persistence: number;
    lacunarity: number;

    texture_layers: TerrainTexture[];
}

const GRID_POSITION_ATTRIBUTE: string = "position";
const PRIOR_HEIGHT_ATTRIBUTE: string = "a_prior_height";

const ANIMATION_PROGRESS_UNIFORM: string = "u_animation_progress";
const WIREFRAME_MODE_UNIFORM: string = "u_wireframe_mode";
const TEXTURE_RANGES_UNIFORM: string = "u_texture_ranges";
const TEXTURE_LAYERS_UNIFORM: string = "u_texture_layers";
const TEXTURE_LAYER_COUNT_UNIFORM: string = "u_texture_layer_count";
const TEXTURE_SIZE_UNIFORM: string = "u_texture_tile_size";

const TEXTURE_LAYER_PAD: number = 0.25;
const MAX_TEXTURE_LAYERS: number = 8;

const VERTEX_SHADER: string = `
    attribute float ${PRIOR_HEIGHT_ATTRIBUTE};
    uniform float ${ANIMATION_PROGRESS_UNIFORM};

    out float v_light;
    out float v_height;
    out vec2 v_uv;

    void main() {
        vec4 animated_position = vec4(
            ${GRID_POSITION_ATTRIBUTE}.x,
            mix(${PRIOR_HEIGHT_ATTRIBUTE}, ${GRID_POSITION_ATTRIBUTE}.y, ${ANIMATION_PROGRESS_UNIFORM}),
            ${GRID_POSITION_ATTRIBUTE}.z,
            1.0
        );

        gl_Position = projectionMatrix * modelViewMatrix * animated_position;
        v_height = animated_position.y;

        v_uv = animated_position.xz;

        vec3 normal = normalize(normalMatrix * normal);

        float sun_intensity = 1.0;
        vec3 sun_direction = vec3(1.0, 1.0, 1.0);
        
        float minimum_light = 0.25;
        
        v_light = max(dot(normal, normalize(sun_direction)) * sun_intensity, minimum_light);
    }
`;

const FRAGMENT_SHADER: string = `
    #define MAX_LAYERS ${MAX_TEXTURE_LAYERS}

    uniform bool ${WIREFRAME_MODE_UNIFORM};
    uniform vec2 ${TEXTURE_RANGES_UNIFORM}[MAX_LAYERS];
    uniform sampler2D ${TEXTURE_LAYERS_UNIFORM}[MAX_LAYERS];
    uniform int ${TEXTURE_LAYER_COUNT_UNIFORM};
    uniform float ${TEXTURE_SIZE_UNIFORM}[MAX_LAYERS];

    in float v_light;
    in float v_height;
    in vec2 v_uv;

    float computeTextureWeight(int idx) {
        float h = ${TEXTURE_RANGES_UNIFORM}[idx].x;
        float H = ${TEXTURE_RANGES_UNIFORM}[idx].y;

        if (v_height >= h && v_height <= H) {
            return 1.0;
        }

        float hL = h - ${TEXTURE_LAYER_PAD};
        float HL = H + ${TEXTURE_LAYER_PAD};

        if (v_height >= hL && v_height <= h) {
            return (v_height - hL) / (h - hL);
        }

        if (v_height >= H && v_height <= HL) {
            return (v_height - HL) / (H - HL);
        }

        return 0.0;
    }

    void main() {
        if (${WIREFRAME_MODE_UNIFORM}) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            return;
        }

        vec3 base_color = vec3(0.0, 0.0, 0.0);
        float total_weight = 0.0;

        ${((): string => {
            let result: string = "";

            for (let idx = 0; idx < MAX_TEXTURE_LAYERS; ++idx) {
                result += `
                    if (${TEXTURE_LAYER_COUNT_UNIFORM} > ${idx}) {
                        float weight = computeTextureWeight(${idx});
                        base_color += texture(
                            ${TEXTURE_LAYERS_UNIFORM}[${idx}],
                            mod(v_uv, ${TEXTURE_SIZE_UNIFORM}[${idx}]) / ${TEXTURE_SIZE_UNIFORM}[${idx}]
                        ).xyz * weight;
                        total_weight += weight;
                    }
                `
            }

            return result
        })()}

        if (total_weight > 0.0) {
            base_color /= total_weight;
        }
        else {
            base_color = vec3(0.5, 1.0, 0.0);    
        }

        gl_FragColor = vec4(v_light * base_color, 1.0);
    }
`;

class TerrainGenerator extends THREE.Mesh {
    private width: number;
    private height: number;
    private spacing: number;

    private morph_time: number;

    private exporter: OBJExporter;
    private texture_loader: THREE.TextureLoader;

    private next_texture_id: number;
    private texure_id_to_index: Map<number, number>;
    private texture_layers: TerrainTexture[];

    private min_height: number
    private max_height: number;
    private terrain_scale: number;
    private start_amplitude: number;
    private start_frequency: number;

    private carve_frequency: number;
    private carve_amplitude: number;

    private octaves: number;
    private persistence: number;
    private lacunarity: number;

    private random_seed: number;

    private worker: Worker | null = null;

    constructor(create_info: TerrainGeneratorCreateInfo) {
        const texture_loader: THREE.TextureLoader = new THREE.TextureLoader();

        create_info.texture_layers = create_info.texture_layers.slice(0, MAX_TEXTURE_LAYERS);

        super(
            new THREE.BufferGeometry(),
            new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: {
                    u_animation_progress: { value: 0.0 },
                    u_wireframe_mode: { value: create_info.wireframe_enabled },
                    u_texture_ranges: { value:
                        Array.from({ length: MAX_TEXTURE_LAYERS }).map(
                            (_, idx: number) => idx < create_info.texture_layers.length
                                ? new THREE.Vector2(
                                    create_info.texture_layers[idx].min_height,
                                    create_info.texture_layers[idx].max_height
                                )
                                : new THREE.Vector2(0.0, 0.0)) },
                    u_texture_layers: { value:
                        Array.from({ length: MAX_TEXTURE_LAYERS }).map(
                            (_, idx: number) => idx < create_info.texture_layers.length
                                ? texture_loader.load(create_info.texture_layers[idx].texture_src)
                                : new THREE.Texture()) },
                    u_texture_layer_count: { value:
                        Math.min(create_info.texture_layers.length, MAX_TEXTURE_LAYERS) },
                    u_texture_tile_size: { value:
                        Array.from({ length: MAX_TEXTURE_LAYERS }).map(
                            (_, idx: number) => idx < create_info.texture_layers.length
                                ? create_info.texture_layers[idx].tile_size
                                : 1.0) }
                },
                wireframe: create_info.wireframe_enabled,
                vertexShader: VERTEX_SHADER,
                fragmentShader: FRAGMENT_SHADER
            })
        );

        this.morph_time = create_info.morph_time;

        this.exporter = new OBJExporter();
        this.texture_loader = texture_loader;

        this.next_texture_id = create_info.texture_layers.length;

        this.texure_id_to_index = new Map<number, number>();
        for (let idx = 0; idx < create_info.texture_layers.length; ++idx) {
            this.texure_id_to_index.set(idx, idx);
        }

        this.texture_layers = structuredClone(create_info.texture_layers);
        
        this.width = create_info.width;
        this.height = create_info.height;
        this.spacing = create_info.spacing;

        this.min_height = create_info.min_height;
        this.max_height = create_info.max_height;
        this.terrain_scale = create_info.terrain_scale;
        this.start_amplitude = create_info.start_amplitude;
        this.start_frequency = create_info.start_frequency;

        this.carve_frequency = create_info.carve_frequency;
        this.carve_amplitude = create_info.carve_amplitude;

        this.octaves = create_info.octaves;
        this.persistence = create_info.persistence;
        this.lacunarity = create_info.lacunarity;

        this.random_seed = create_info.random_seed;

        this.position.setY(-0.5 * (this.max_height - this.min_height));

        this.updateGeometry(create_info.width, create_info.height, create_info.spacing);
    }

    public getWidth(): number { return this.width; }
    public getHeight(): number { return this.height; }
    public getSpacing(): number { return this.spacing; }

    public getMinHeight(): number { return this.min_height; }
    public getMaxHeight(): number { return this.max_height; }
    public getTerrainScale(): number { return this.terrain_scale; }

    public getStartAmplitude(): number { return this.start_amplitude; }
    public getStartFrequency(): number { return this.start_frequency; }
    public getCarveFrequency(): number { return this.carve_frequency; }
    public getCarveAmplitude(): number { return this.carve_amplitude; }
    public getOctaves(): number { return this.octaves; }

    public getPersistence(): number { return this.persistence; }
    public getLacunarity(): number { return this.lacunarity; }

    public canAddTextureLayer(): boolean {
        return this.texure_id_to_index.size < MAX_TEXTURE_LAYERS;
    }

    public getTextureIds(): number[] {
        return Array.from(this.texure_id_to_index.keys());
    }

    public getTextureLayer(texture_id: number): TerrainTexture | null {
        const texture_index: number | undefined = this.texure_id_to_index.get(texture_id);

        if (texture_index === undefined) {
            return null;
        }
        
        return this.texture_layers[texture_index];
    }

    public addTextureLayer(texture: TerrainTexture): number {
        if (this.texure_id_to_index.size >= MAX_TEXTURE_LAYERS) {
            throw new Error(`Cannot add more than ${MAX_TEXTURE_LAYERS} texture layers.`);
        }

        const texture_id: number = this.next_texture_id++;
        const texture_index: number = this.texure_id_to_index.size;

        this.texture_layers.push(texture);

        this.texure_id_to_index.set(texture_id, texture_index);

        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;

        material.uniforms[TEXTURE_LAYER_COUNT_UNIFORM].value = this.texure_id_to_index.size;
        material.uniforms[TEXTURE_RANGES_UNIFORM].value[texture_index] = new THREE.Vector2(texture.min_height, texture.max_height);
        material.uniforms[TEXTURE_LAYERS_UNIFORM].value[texture_index] = this.texture_loader.load(texture.texture_src);
        material.uniforms[TEXTURE_SIZE_UNIFORM].value[texture_index] = texture.tile_size;

        return texture_id;
    }

    public editTextureLayerTexture(texture_id: number, texture_src: string): void {
        const texture_index: number | undefined = this.texure_id_to_index.get(texture_id);

        if (texture_index === undefined) {
            throw new Error(`Texture ID ${texture_id} does not exist.`);
        }

        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;
        material.uniforms[TEXTURE_LAYERS_UNIFORM].value[texture_index] = this.texture_loader.load(texture_src);

        this.texture_layers[texture_index].texture_src = texture_src;
    }

    public editTextureLayerHeightRange(texture_id: number, min_height: number, max_height: number): void {
        const texture_index: number | undefined = this.texure_id_to_index.get(texture_id);

        if (texture_index === undefined) {
            throw new Error(`Texture ID ${texture_id} does not exist.`);
        }

        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;
        material.uniforms[TEXTURE_RANGES_UNIFORM].value[texture_index] = new THREE.Vector2(min_height, max_height);

        this.texture_layers[texture_index].min_height = min_height;
        this.texture_layers[texture_index].max_height = max_height;
    }

    public editTextureLayerTileSize(texture_id: number, tile_size: number): void {
        const texture_index: number | undefined = this.texure_id_to_index.get(texture_id);

        if (texture_index === undefined) {
            throw new Error(`Texture ID ${texture_id} does not exist.`);
        }

        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;
        material.uniforms[TEXTURE_SIZE_UNIFORM].value[texture_index] = tile_size;

        this.texture_layers[texture_index].tile_size = tile_size;
    }

    public removeTextureLayer(texture_id: number): void {
        const texture_index: number | undefined = this.texure_id_to_index.get(texture_id);

        if (texture_index === undefined) {
            throw new Error(`Texture ID ${texture_id} does not exist.`);
        }

        this.texure_id_to_index.delete(texture_id);
        this.texture_layers.splice(texture_index, 1);

        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;
        material.uniforms[TEXTURE_LAYER_COUNT_UNIFORM].value = this.texure_id_to_index.size;

        for (const [id, index] of this.texure_id_to_index) {
            if (index <= texture_index) {
                continue;
            }

            this.texure_id_to_index.set(id, index - 1);

            material.uniforms[TEXTURE_RANGES_UNIFORM].value[index - 1] =
                material.uniforms[TEXTURE_RANGES_UNIFORM].value[index];
            material.uniforms[TEXTURE_LAYERS_UNIFORM].value[index - 1] =
                material.uniforms[TEXTURE_LAYERS_UNIFORM].value[index];
            material.uniforms[TEXTURE_SIZE_UNIFORM].value[index - 1] =
                material.uniforms[TEXTURE_SIZE_UNIFORM].value[index];
        }
    }

    private computeNoise(x: number, z: number, perlin: Perlin): number {
        return computeNoise(
            x,
            z,
            this.start_amplitude,
            this.start_frequency,
            this.octaves,
            this.persistence,
            this.lacunarity,
            this.carve_amplitude,
            this.carve_frequency,
            this.terrain_scale,
            this.min_height,
            this.max_height,
            perlin
        );
    }

    private async updateGeometry(width: number, height: number, spacing: number): Promise<void> {
        if (this.worker !== null) {
            this.worker.terminate();
            this.worker = null;
        }

        this.worker = new Worker(new URL("./TerrainGeneratorGeometryWorker.ts", import.meta.url), { type: "module" });

        const message_data: TerrainWorkerData = {
            width: width,
            height: height,
            spacing: spacing,
            start_amplitude: this.start_amplitude,
            start_frequency: this.start_frequency,
            octaves: this.octaves,
            persistence: this.persistence,
            lacunarity: this.lacunarity,
            carve_amplitude: this.carve_amplitude,
            carve_frequency: this.carve_frequency,
            terrain_scale: this.terrain_scale,
            min_height: this.min_height,
            max_height: this.max_height,
            random_seed: this.random_seed,
            prior_positions: (this.geometry.getAttribute(GRID_POSITION_ATTRIBUTE)?.array as Float32Array) ?? []
        };

        this.worker.postMessage(message_data);

        new Promise<void>((resolve: () => void): void => {
            if (this.worker === null) {
                resolve();
                return;
            }

            this.worker.onmessage = (ev: MessageEvent) => {
                const data: TerrainWorkerResponse = ev.data as TerrainWorkerResponse;

                this.geometry.dispose();
                this.geometry = new THREE.BufferGeometry();
                this.geometry.setAttribute(PRIOR_HEIGHT_ATTRIBUTE, new THREE.BufferAttribute(data.prior_heights, 1));
                this.geometry.setAttribute(GRID_POSITION_ATTRIBUTE, new THREE.BufferAttribute(data.positions, 3));
                this.geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));

                this.geometry.computeVertexNormals();

                this.width = width;
                this.height = height;
                this.spacing = spacing;

                this.position.setY(-0.5 * (this.max_height - this.min_height));

                this.worker?.terminate();
                this.worker = null;

                resolve();
            };
        });
    }

    public onUpdate(delta_time: number): void {
        const animation_progress: THREE.IUniform<number> = (this.material as THREE.ShaderMaterial).uniforms[ANIMATION_PROGRESS_UNIFORM];

        animation_progress.value = Math.min(
            1.0,
            animation_progress.value + delta_time / this.morph_time
        );
    }

    public toggleWireframeMode(): void {
        const material: THREE.ShaderMaterial = this.material as THREE.ShaderMaterial;
        
        material.wireframe = !material.wireframe;
        material.uniforms[WIREFRAME_MODE_UNIFORM].value = material.wireframe;
    }

    public async downloadOBJ(): Promise<void> {
        const parsed_obj: string = this.exporter.parse(this);
        const blob: Blob = new Blob([parsed_obj], { type: "text/plain" });

        const download_link: HTMLAnchorElement = document.createElement("a");
        download_link.href = URL.createObjectURL(blob);
        download_link.download = "Terrain.obj";

        download_link.click();

        URL.revokeObjectURL(download_link.href);
    }

    public async regenerateTerrainGeometry(width: number, height: number, spacing: number): Promise<void> {
        (this.material as THREE.ShaderMaterial).uniforms[ANIMATION_PROGRESS_UNIFORM].value = 0.0;

        await this.updateGeometry(width, height, spacing);
    }

    public async regenerateTerrainNoise(
        min_height: number,
        max_height: number,
        terrain_scale: number,
        start_amplitude: number,
        start_frequency: number,
        carve_frequency: number,
        carve_amplitude: number,
        octaves: number,
        persistence: number,
        lacunarity: number
    ): Promise<void> {
        this.min_height = min_height;
        this.max_height = max_height;
        this.terrain_scale = terrain_scale;
        this.start_amplitude = start_amplitude;
        this.start_frequency = start_frequency;
        this.carve_frequency = carve_frequency;
        this.carve_amplitude = carve_amplitude;
        this.octaves = octaves;
        this.persistence = persistence;
        this.lacunarity = lacunarity;

        (this.material as THREE.ShaderMaterial).uniforms[ANIMATION_PROGRESS_UNIFORM].value = 0.0;

        const positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined = this.geometry.getAttribute(GRID_POSITION_ATTRIBUTE);
        const prior_heights: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined = this.geometry.getAttribute(PRIOR_HEIGHT_ATTRIBUTE);
        
        if (positions === undefined) {
            throw new Error("Positions attribute is undefined when regenerating terrain noise.");
        }

        if (prior_heights === undefined) {
            throw new Error("Prior heights attribute is undefined when regenerating terrain noise.");
        }

        for (let idx = 0; idx < prior_heights.array.length; ++idx) {
            prior_heights.array[idx] = positions.array[(idx * 3) + 1];
        }

        const perlin: Perlin = new Perlin(this.random_seed);

        for (let idx = 0; idx < prior_heights.array.length; ++idx) {
            const x_position: number = positions.array[(idx * 3)];
            const z_position: number = positions.array[(idx * 3) + 2];

            positions.array[(idx * 3) + 1] = this.computeNoise(x_position, z_position, perlin);
        }

        positions.needsUpdate = true;
        prior_heights.needsUpdate = true;

        this.geometry.computeVertexNormals();
        this.geometry.attributes.normal.needsUpdate = true;

        this.position.setY(-0.5 * (this.max_height - this.min_height));
    }
}

export { type TerrainGeneratorCreateInfo, type TerrainTexture, MAX_TEXTURE_LAYERS };
export default TerrainGenerator;