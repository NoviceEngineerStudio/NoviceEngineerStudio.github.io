import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";

interface ShapeParticleSystemCreateInfo {
    particles: {
        count: number;
        size: number;
        color: number;
    }
    animation: {
        bob_height: number;
    }
    interaction: {
        mouse_radius: number;
        mouse_displacement: number;
    }
}

class ShapeParticleSystem extends THREE.Points {
    private particle_count: number;
    private shader_uniforms: { [uniform: string]: THREE.IUniform<any> };

    constructor(create_info: ShapeParticleSystemCreateInfo) {
        const particle_color: THREE.Color = new THREE.Color(create_info.particles.color);

        const data_count: number = create_info.particles.count * 3;
        const initial_positions: Float32Array = new Float32Array(data_count);
        const initial_targets: Float32Array = new Float32Array(data_count);

        for (let idx = 0; idx < data_count; ++idx) {
            initial_positions[idx] = 0.0;
            initial_targets[idx] = 0.0;
        }

        const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(initial_positions, 3));
        geometry.setAttribute("target", new THREE.BufferAttribute(initial_targets, 3));

        const material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false,
            uniforms: {
                u_progress: { value: 0.0 },
                u_time: { value: 0.0 },
                u_mouse: { value: [2.0, 2.0] },
            },
            vertexShader: (
                "attribute vec3 target;" +
                "uniform float u_progress;" +
                "uniform float u_time;" +
                "uniform vec2 u_mouse;" +
                "void main() {" +
                    "vec3 new_pos = mix(position, target, u_progress);" +
                    "new_pos.y += sin(u_time + new_pos.x + new_pos.z) *" +
                        `${create_info.animation.bob_height.toFixed(4)};` +
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4(new_pos, 1.0);" +
                    "vec2 ndc_position = gl_Position.xy / gl_Position.w;" +
                    "vec2 mouse_dir = u_mouse - ndc_position;" +
                    "float mouse_dist_sqr = dot(mouse_dir, mouse_dir);" +
                    `if (mouse_dist_sqr < ${create_info.interaction.mouse_radius.toFixed(4)}) {` +
                        `float mouse_strength = 1.0 - mouse_dist_sqr / ${create_info.interaction.mouse_radius.toFixed(4)};` +
                        `ndc_position -= mouse_strength * ${create_info.interaction.mouse_displacement.toFixed(4)} * normalize(mouse_dir);` +
                        "gl_Position.xy = ndc_position * gl_Position.w;" +
                    "}" +
                    `gl_PointSize = ${create_info.particles.size.toFixed(4)};` +
                "}"
            ),
            fragmentShader: (
                "void main() {" +
                    "vec2 uv = gl_PointCoord.xy - 0.5;" +
                    "float sqr_dist = dot(uv, uv);" +
                    "float alpha = exp(-sqr_dist * 24.0);" +
                    "if (alpha < 0.4) discard;" +
                    "gl_FragColor = vec4(" +
                        `${(particle_color.r).toFixed(4)},` +
                        `${(particle_color.g).toFixed(4)},` +
                        `${(particle_color.b).toFixed(4)},` +
                    "alpha);" +
                "}"
            ),
        });

        super(geometry, material);

        this.particle_count = create_info.particles.count;
        this.shader_uniforms = material.uniforms;

        window.addEventListener("pointermove", (pointer_event: PointerEvent) => {
            this.shader_uniforms.u_mouse.value[0] = (2.0 * pointer_event.clientX / window.innerWidth) - 1.0;
            this.shader_uniforms.u_mouse.value[1] = 1.0 - (2.0 * pointer_event.clientY / window.innerHeight);
        });
    }

    public update(delta_time: number): void {
        this.shader_uniforms.u_progress.value = Math.min(
            this.shader_uniforms.u_progress.value + delta_time,
            1.0
        );
        this.shader_uniforms.u_time.value += delta_time;
    }

    public async setMeshTargets(mesh: THREE.Mesh): Promise<void> {
        const sampler: MeshSurfaceSampler = new MeshSurfaceSampler(mesh).build();

        const old_positions: Float32Array = this.geometry.getAttribute("position").array as Float32Array;
        const old_targets: Float32Array = this.geometry.getAttribute("target").array as Float32Array;

        const new_positions: Float32Array = new Float32Array(this.particle_count * 3);
        const new_targets: Float32Array = new Float32Array(this.particle_count * 3);

        const tmp_position: THREE.Vector3 = new THREE.Vector3();

        for (let idx = 0; idx < this.particle_count; ++idx) {
            sampler.sample(tmp_position);

            new_positions[(idx * 3)]     = (
                old_positions[(idx * 3)] + this.shader_uniforms.u_progress.value * (
                    old_targets[(idx * 3)] - old_positions[(idx * 3)]
                )
            );
            new_positions[(idx * 3) + 1] = (
                old_positions[(idx * 3) + 1] + this.shader_uniforms.u_progress.value * (
                    old_targets[(idx * 3) + 1] - old_positions[(idx * 3) + 1]
                )
            );
            new_positions[(idx * 3) + 2] = (
                old_positions[(idx * 3) + 2] + this.shader_uniforms.u_progress.value * (
                    old_targets[(idx * 3) + 2] - old_positions[(idx * 3) + 2]
                )
            );

            new_targets[(idx * 3)]     = tmp_position.x;
            new_targets[(idx * 3) + 1] = tmp_position.y;
            new_targets[(idx * 3) + 2] = tmp_position.z;
        }

        this.geometry.setAttribute("position", new THREE.BufferAttribute(new_positions, 3));
        this.geometry.setAttribute("target", new THREE.BufferAttribute(new_targets, 3));
        this.shader_uniforms.u_progress.value = 0.0;
    }
}

export { type ShapeParticleSystemCreateInfo };
export default ShapeParticleSystem;