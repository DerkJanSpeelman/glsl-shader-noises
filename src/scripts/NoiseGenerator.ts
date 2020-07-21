import * as THREE from 'three';

import { vertexShader } from './shaders/vertexShader.js';
import { fragmentShader } from './shaders/fragmentShader.js';

export interface NoiseAlgorithm {
    id: number;
    alive: boolean;
    name: string;
}

export class NoiseGenerator {
    private wrapper: HTMLElement;
    public noiseAlgorithms: NoiseAlgorithm[];
    private uniforms: {
        [uniform: string]: THREE.IUniform;
    };

    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;

    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor(
        wrapper: HTMLElement,
        defaultNoiseAlgorithms: NoiseAlgorithm[]
    ) {
        this.wrapper = wrapper;

        this.noiseAlgorithms = defaultNoiseAlgorithms;

        this.uniforms = {
            u_resolution: { value: new THREE.Vector2() },
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_functions_length: {
                value: this.noiseAlgorithms.filter(
                    (value: NoiseAlgorithm) => value.alive
                ).length,
            },
            u_functions: { value: this.noiseAlgorithms },
        };

        this.camera = new THREE.Camera();
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this.geometry = new THREE.PlaneBufferGeometry(2, 2);
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.init();
        this.resize();

        if (this.wrapper) {
            this.wrapper.prepend(this.renderer.domElement);
        }

        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('mousemove', this.mousemove.bind(this), false);

        this.update();
    }

    private readonly init: () => void = (): void => {
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.scene.add(this.mesh);
    };

    private readonly resize: () => void = (): void => {
        this.renderer.setSize(window.innerWidth + 1, window.innerHeight + 1);
        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    };

    private readonly mousemove: (e: MouseEvent) => void = (
        e: MouseEvent
    ): void => {
        this.uniforms.u_mouse.value.x = e.x;
        this.uniforms.u_mouse.value.y = e.y;
    };

    private readonly render: () => void = (): void => {
        this.uniforms.u_time.value += 0.005;
        this.renderer.render(this.scene, this.camera);
    };

    private readonly update: () => void = (): void => {
        window.requestAnimationFrame(this.update.bind(this));
        this.render();
    };

    public readonly updateUniformFunctions: () => void = (): void => {
        this.uniforms.u_functions_length.value = this.noiseAlgorithms.filter(
            (value: NoiseAlgorithm) => value.alive
        ).length;
        this.uniforms.u_functions.value = this.noiseAlgorithms;
    };
}
