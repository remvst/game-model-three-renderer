import { InterpolationPool } from "@remvst/animate.js";
import { CameraTrait, Entity, World, WorldEvent } from "@remvst/game-model";
import { Subscription } from "rxjs";
import * as THREE from "three";
import { EntityViewControllerFactory } from "../factory/entity-view-controller-factory";
import { EventViewControllerFactory } from "../factory/event-view-controller-factory";
import { ViewController } from "../view-controller";
import { WorldLayer } from "./world-layer";

export class WorldViewController {
    readonly world: World;
    readonly renderer: THREE.Renderer;
    readonly entityViewControllerFactory: EntityViewControllerFactory;
    private readonly eventViewControllerFactory: EventViewControllerFactory;
    private readonly interpolationPool: InterpolationPool;
    private subscriptions: Subscription[] = [];

    private cachedCamera: CameraTrait;

    private readonly viewControllers: ViewController<any>[] = [];
    private readonly collapsableViewControllers = new Map<
        string,
        ViewController<any>
    >();

    readonly view = new THREE.Group();
    private readonly layers = new Map<string, THREE.Group>();

    age: number = 0;

    constructor(options: {
        world: World;
        entityViewControllerFactory: EntityViewControllerFactory;
        eventViewControllerFactory: EventViewControllerFactory;
        interpolationPool: InterpolationPool;
        renderer: THREE.Renderer;
        layers: string[];
    }) {
        this.world = options.world;
        this.renderer = options.renderer;
        this.entityViewControllerFactory = options.entityViewControllerFactory;
        this.eventViewControllerFactory = options.eventViewControllerFactory;
        this.interpolationPool = options.interpolationPool;

        for (const layerId of options.layers) {
            const layer = this.createLayer(layerId);
            this.layers.set(layerId, layer);
            this.view.add(layer);
        }
    }

    protected createLayer(layerId: WorldLayer): THREE.Group {
        return new THREE.Group();
    }

    get camera(): CameraTrait {
        if (!this.cachedCamera) {
            for (const camera of this.world.entities.bucket(CameraTrait.key)) {
                this.cachedCamera = camera.traitOfType(CameraTrait)!;
                return this.cachedCamera;
            }
            throw new Error("No camera found");
        }
        return this.cachedCamera;
    }

    start() {
        this.destroy();

        // Adding/removing view controllers when entities are updated
        this.subscriptions = [
            this.world.chunked.entities.additions.subscribe((entity) =>
                this.entityAdded(entity),
            ),
            this.world.events.subscribe((event) => this.onEvent(event)),
        ];
        this.world.chunked.entities.forEach((entity) =>
            this.entityAdded(entity),
        );
    }

    update(elapsed: number) {
        this.age += elapsed;

        for (const viewController of this.viewControllers) {
            viewController.update();
        }
    }

    addViewController(viewController: ViewController<any>) {
        this.viewControllers.push(viewController);
        viewController.update();

        const { collapseGroup } = viewController;
        if (collapseGroup) {
            const existing = this.collapsableViewControllers.get(collapseGroup);
            if (existing) {
                this.removeViewController(existing);
            }
            this.collapsableViewControllers.set(collapseGroup, viewController);
        }

        viewController.removeEmitter().then(() => {
            this.removeViewController(viewController);
        });
    }

    private entityAdded(entity: Entity) {
        this.entityViewControllerFactory
            .viewControllersForEntity(entity)
            .forEach((viewController) => {
                viewController.bind(this, this.interpolationPool, entity);
                viewController.postBind();

                this.addViewController(viewController);
            });
    }

    private onEvent(event: WorldEvent) {
        this.eventViewControllerFactory
            .viewControllersForEvent(event, this.world)
            .forEach((viewController) => {
                viewController.bind(this, this.interpolationPool, event);
                viewController.postBind();

                this.addViewController(viewController);
            });
    }

    removeViewController(viewController: ViewController<any>) {
        const index = this.viewControllers.indexOf(viewController);
        if (index >= 0) {
            this.viewControllers.splice(index, 1);
        }

        const { collapseGroup } = viewController;
        if (collapseGroup) {
            this.collapsableViewControllers.delete(collapseGroup);
        }

        viewController.tearDown();
    }

    addViewControllerView(view: THREE.Object3D, layerId: WorldLayer) {
        const layer = this.provideLayer(layerId);
        if (!layer) {
            window.console.error(`Invalid layer ID: ${layerId}`);
            return;
        }

        layer.add(view);
    }

    provideLayer(layerId: WorldLayer): THREE.Object3D {
        if (!this.layers.has(layerId)) {
            throw new Error(`Unknown layer ${layerId}`);
        }

        return this.layers.get(layerId)!;
    }

    get viewControllerCount(): number {
        return this.viewControllers.length;
    }

    get visibleViewControllerCount(): number {
        return this.viewControllers.reduce((acc, vc) => {
            return acc + (vc.isVisible() ? 1 : 0);
        }, 0);
    }

    get viewControllerWithViewCount(): number {
        return this.viewControllers.reduce((acc, vc) => {
            return acc + (vc.hasView() ? 1 : 0);
        }, 0);
    }

    destroy() {
        for (const viewController of this.viewControllers.slice(0)) {
            this.removeViewController(viewController);
        }

        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }
}
