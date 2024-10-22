import { InterpolationPool } from "@remvst/animate.js";
import { WorldViewController } from "@remvst/game-model-three-renderer";
import * as THREE from "three";
import { EmptyEventViewControllerFactory } from "../../lib/factory/empty-event-view-controller-factory";
import { TestEntityViewControllerFactory } from "./test-entity-view-controller-factory";
import { testWorld } from "./test-world";
import { CameraTrait } from "@remvst/game-model";
import { factory } from "typescript";

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
stage.add(worldViewController.view);
worldViewController.start();

const cameraTarget = new THREE.Object3D();
worldViewController.view.add(cameraTarget);

let lastFrame = performance.now();
let age = 0;

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;
    age += elapsed;

    world.cycle(elapsed);
    worldViewController.update(elapsed);

    renderer.render(
        stage,
        entityViewControllerFactory.cameraViewController.getOrCreateView(),
    );

    requestAnimationFrame(frame);
}

window.addEventListener("load", async () => {
    document.body.appendChild(renderer.domElement);
    frame();
});
