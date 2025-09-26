import Perlin from "../../utils/math/Perlin";

function computeNoise(
    x: number,
    z: number,
    start_amplitude: number,
    start_frequency: number,
    octaves: number,
    persistence: number,
    lacunarity: number,
    carve_amplitude: number,
    carve_frequency: number,
    terrain_scale: number,
    min_height: number,
    max_height: number,
    perlin: Perlin
): number {
    let amplitude: number = start_amplitude;
    let total_amplitude: number = 0.0;

    let frequency: number = start_frequency;
    
    let value: number = 0.0;

    for (let idx = 0; idx < octaves; ++idx) {
        value += perlin.noise(x * frequency, z * frequency) * amplitude;
        total_amplitude += amplitude;

        amplitude *= persistence;
        frequency *= lacunarity;
    }

    const river_noise: number = perlin.noise(x * carve_frequency, z * carve_frequency);
    const river: number = 1.0 - Math.abs(river_noise * 2.0 - 1.0);
    value *= 1.0 - river * carve_amplitude;

    const height: number = Math.max(0.0, Math.min(value / total_amplitude, 1.0)) * terrain_scale;

    return Math.max(min_height, Math.min(height, max_height));
}

export default computeNoise;