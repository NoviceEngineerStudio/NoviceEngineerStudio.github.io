import * as THREE from "three";
import Perlin from "../../utils/math/Perlin";
import { OBJExporter } from "three/examples/jsm/Addons.js";

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

        float mid = (H + h) * 0.5;
        float halfRange = (H - h) * 0.5;
        float dist = abs(v_height - mid) / halfRange;

        return exp(-dist * dist * 4.0);
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
    private width: number = 0.0;
    private height: number = 0.0;
    private spacing: number = 0.0;

    private morph_time: number;

    private perlin: Perlin;
    private exporter: OBJExporter;
    private texture_loader: THREE.TextureLoader;

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

    constructor(create_info: TerrainGeneratorCreateInfo) {
        const texture_loader: THREE.TextureLoader = new THREE.TextureLoader();

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

        this.perlin = new Perlin(create_info.random_seed);
        this.exporter = new OBJExporter();
        this.texture_loader = texture_loader;

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

    private computeNoise(x: number, z: number): number {
        let amplitude: number = this.start_amplitude;
        let total_amplitude: number = 0.0;

        let frequency: number = this.start_frequency;
        
        let value: number = 0.0;

        for (let idx = 0; idx < this.octaves; ++idx) {
            value += this.perlin.noise(x * frequency, z * frequency) * amplitude;
            total_amplitude += amplitude;

            amplitude *= this.persistence;
            frequency *= this.lacunarity;
        }

        const river_noise: number = this.perlin.noise(x * this.carve_frequency, z * this.carve_frequency);
        const river: number = 1.0 - Math.abs(river_noise * 2.0 - 1.0);
        value *= 1.0 - river * this.carve_amplitude;

        const height: number = Math.max(0.0, Math.min(value / total_amplitude, 1.0)) * this.terrain_scale;

        return Math.max(this.min_height, Math.min(height, this.max_height));
    }

    private async updateGeometry(width: number, height: number, spacing: number): Promise<void> {
        this.perlin.resetSeedCounter();

        // ? Compute Prior Heights List

        const prior_heights: Float32Array = new Float32Array(width * height);
        const prior_positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined = (
            this.geometry.getAttribute(GRID_POSITION_ATTRIBUTE)
        );

        if (prior_positions === undefined) {
            for (let idx = 0; idx < prior_heights.length; ++idx) {
                prior_heights[idx] = 0.0;
            }
        }
        else {
            const prior_positions_array: Float32Array = prior_positions.array as Float32Array;

            let idx = 0;
            const min_length: number = Math.min(this.width * this.height, prior_heights.length);
            for (; idx < min_length; ++idx) {
                prior_heights[idx] = prior_positions_array[(idx * 3) + 1];
            }

            for (; idx < prior_heights.length; ++idx) {
                prior_heights[idx] = 0.0;
            }
        }

        this.width = width;
        this.height = height;
        this.spacing = spacing;

        this.geometry.dispose();
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(PRIOR_HEIGHT_ATTRIBUTE, new THREE.BufferAttribute(prior_heights, 1));

        // ? Compute New Vertex Positions

        const positions: Float32Array = new Float32Array(prior_heights.length * 3);

        let position_idx: number = 0;
        for (let x_idx = 0; x_idx < width; ++x_idx) {
            const x_position: number = width * spacing * (x_idx / (width - 1.0) - 0.5);

            for (let z_idx = 0; z_idx < height; ++z_idx) {
                const z_position: number = height * spacing * (z_idx / (height - 1.0) - 0.5);

                positions[position_idx++] = x_position;
                positions[position_idx++] = this.computeNoise(x_position, z_position),
                positions[position_idx++] = z_position;
            }
        }

        this.geometry.setAttribute(GRID_POSITION_ATTRIBUTE, new THREE.BufferAttribute(positions, 3));

        // ? Compute Model Indices

        const indices: Uint32Array = new Uint32Array((width - 1) * (height - 1) * 6);

        let indices_idx: number = 0;
        for (let x_idx = 0; x_idx < width - 1; ++x_idx) {
            const x_offset: number = x_idx * height;
            const x_offset_p1: number = (x_idx + 1) * height;

            for (let z_idx = 0; z_idx < height - 1; ++z_idx) {
                const tl: number = x_offset + z_idx;
                const bl: number = x_offset_p1 + z_idx;
                const tr: number = tl + 1;
                const br: number = bl + 1;

                indices[indices_idx++] = tl;
                indices[indices_idx++] = tr;
                indices[indices_idx++] = bl;

                indices[indices_idx++] = tr;
                indices[indices_idx++] = br;
                indices[indices_idx++] = bl;
            }
        }

        this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        this.geometry.computeVertexNormals();
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

        this.perlin.resetSeedCounter();

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

        for (let idx = 0; idx < prior_heights.array.length; ++idx) {
            const x_position: number = positions.array[(idx * 3)];
            const z_position: number = positions.array[(idx * 3) + 2];

            positions.array[(idx * 3) + 1] = this.computeNoise(x_position, z_position);
        }

        positions.needsUpdate = true;
        prior_heights.needsUpdate = true;

        this.geometry.computeVertexNormals();
        this.geometry.attributes.normal.needsUpdate = true;

        this.position.setY(-0.5 * (this.max_height - this.min_height));
    }
}

export { type TerrainGeneratorCreateInfo, MAX_TEXTURE_LAYERS };
export default TerrainGenerator;