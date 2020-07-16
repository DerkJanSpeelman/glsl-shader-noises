import * as THREE from 'three';

import { vertexShader } from './vertexShader.js';

interface Algorithm {
    id: number;
    alive: boolean;
}

export class Canvas {
    private container: HTMLElement;
    private algorithms: Algorithm[];
    private uniforms: {
        [uniform: string]: THREE.IUniform;
    };

    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;

    constructor(container: HTMLElement) {
        this.container = container;

        this.algorithms = [
            {
                id: 0,
                alive: true,
            },
            {
                id: 1,
                alive: false,
            },
        ];

        this.uniforms = {
            u_resolution: { value: new THREE.Vector2() },
            u_time: { value: 0.0 },
            u_mouse: { value: new THREE.Vector2() },
            u_functions: { value: this.algorithms },
        };

        this.camera = new THREE.Camera();
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();

        this.init();
        this.resize();

        if (this.container) {
            this.container.prepend(this.renderer.domElement);
        }

        window.addEventListener('resize', this.resize.bind(this), false);

        window.requestAnimationFrame(this.update.bind(this));

        console.log(vertexShader, 'wew');
    }

    init() {
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.PlaneBufferGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            // vertexShader: vertexShader,
            // fragmentShader: document.getElementById('fragmentShader').textContent,
        });

        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }

    resize() {
        this.renderer.setSize(window.innerWidth + 1, window.innerHeight + 1);
        this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    }

    render() {
        this.uniforms.u_time.value += 0.001;
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        window.requestAnimationFrame(this.update.bind(this));
        this.render();
    }
}
