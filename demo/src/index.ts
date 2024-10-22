import { InterpolationPool } from "@remvst/animate.js";
import { WorldViewController } from "@remvst/game-model-three-renderer";
import * as THREE from "three";
import { EmptyEventViewControllerFactory } from "../../lib/factory/empty-event-view-controller-factory";
import { TestEntityViewControllerFactory } from "./test-entity-view-controller-factory";
import { testWorld } from "./test-world";
import { CameraTrait } from "@remvst/game-model";

const world = testWorld();

const renderer = new THREE.WebGLRenderer({});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(800, 600);

const stage = new THREE.Group();

const interpolationPool = new InterpolationPool();
const eventViewControllerFactory = new EmptyEventViewControllerFactory();
const entityViewControllerFactory = new TestEntityViewControllerFactory();
const worldViewController = new WorldViewController({
    world,
    renderer,
    interpolationPool,
    entityViewControllerFactory,
    eventViewControllerFactory,
    layers: ["characters", "debug-foreground"],
});
worldViewController.view.scale.set(0.01, 0.01, 0.01);
stage.add(worldViewController.view);
worldViewController.start();

const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);

let lastFrame = performance.now();
let age = 0;

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;
    age += elapsed;

    world.cycle(elapsed);
    worldViewController.update(elapsed);

    for (const cameraEntity of world.entities.bucket(CameraTrait.key)) {
        camera.position.set(
            cameraEntity.position.x * worldViewController.view.scale.x,
            cameraEntity.position.y * worldViewController.view.scale.y,
            cameraEntity.position.z * worldViewController.view.scale.z,
        );
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(stage, camera);

    requestAnimationFrame(frame);
}

window.addEventListener("load", async () => {
    document.body.appendChild(renderer.domElement);
    frame();
});
