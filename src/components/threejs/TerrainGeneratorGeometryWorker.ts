import computeNoise from "./TerrainNoise";
import Perlin from "../../utils/math/Perlin";

interface TerrainWorkerData {
    width: number;
    height: number;
    spacing: number;
    start_amplitude: number;
    start_frequency: number;
    octaves: number;
    persistence: number;
    lacunarity: number;
    carve_amplitude: number;
    carve_frequency: number;
    terrain_scale: number;
    min_height: number;
    max_height: number;
    random_seed: number;
    prior_positions: Float32Array | number[];
}

interface TerrainWorkerResponse {
    prior_heights: Float32Array;
    positions: Float32Array;
    indices: Uint32Array;
}

self.onmessage = (ev: MessageEvent) => {
    const data: TerrainWorkerData = ev.data as TerrainWorkerData;

    const prior_heights: Float32Array = new Float32Array(data.width * data.height);
    const positions: Float32Array = new Float32Array(prior_heights.length * 3);
    const indices: Uint32Array = new Uint32Array((data.width - 1) * (data.height - 1) * 6);

    // ? Compute Prior Heights List

    if (data.prior_positions.length === 0) {
        for (let idx = 0; idx < prior_heights.length; ++idx) {
            prior_heights[idx] = 0.0;
        }
    }
    else {
        let idx = 0;
        const min_length: number = Math.min(
            Math.floor(data.prior_positions.length / 3),
            prior_heights.length
        );
        for (; idx < min_length; ++idx) {
            prior_heights[idx] = data.prior_positions[(idx * 3) + 1];
        }

        for (; idx < prior_heights.length; ++idx) {
            prior_heights[idx] = 0.0;
        }
    }

    // ? Compute New Vertex Positions

    const perlin: Perlin = new Perlin(data.random_seed);

    let position_idx: number = 0;
    for (let x_idx = 0; x_idx < data.width; ++x_idx) {
        const x_position: number = data.width * data.spacing * (x_idx / (data.width - 1.0) - 0.5);

        for (let z_idx = 0; z_idx < data.height; ++z_idx) {
            const z_position: number = data.height * data.spacing * (z_idx / (data.height - 1.0) - 0.5);

            positions[position_idx++] = x_position;
            positions[position_idx++] = computeNoise(
                x_position,
                z_position,
                data.start_amplitude,
                data.start_frequency,
                data.octaves,
                data.persistence,
                data.lacunarity,
                data.carve_amplitude,
                data.carve_frequency,
                data.terrain_scale,
                data.min_height,
                data.max_height,
                perlin
            );
            positions[position_idx++] = z_position;
        }
    }

    // ? Compute Model Indices

    let indices_idx: number = 0;
    for (let x_idx = 0; x_idx < data.width - 1; ++x_idx) {
        const x_offset: number = x_idx * data.height;
        const x_offset_p1: number = (x_idx + 1) * data.height;

        for (let z_idx = 0; z_idx < data.height - 1; ++z_idx) {
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

    self.postMessage({
        indices: indices,
        positions: positions,
        prior_heights: prior_heights
    } as TerrainWorkerResponse);
};

export { type TerrainWorkerData, type TerrainWorkerResponse };