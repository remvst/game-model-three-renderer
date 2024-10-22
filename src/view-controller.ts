import { InterpolationPool } from "@remvst/animate.js";
import { CameraTrait } from "@remvst/game-model";
import { Rectangle } from "@remvst/geometry";
import { ReusablePool, ReusablePoolBindable } from "@remvst/optimization";
import * as THREE from "three";
import { WorldViewController } from "./world/world-view-controller";

interface Timeout {
    age: number;
    action: () => void;
}

export abstract class ViewController<
    ViewType extends THREE.Object3D = THREE.Mesh,
> implements ReusablePoolBindable
{
    protected view: ViewType | null = null;
    protected worldViewController: WorldViewController | null = null;
    protected interpolationPool: InterpolationPool | null = null;
    private viewCreated: boolean = false;
    private viewAdded: boolean = false;
    protected lastUpdate: number = 0;
    private worldViewControllerAgeAtCreation: number = 0;
    protected visibleAge: number = 0;
    readonly visibilityRectangle = new Rectangle(0, 0, 0, 0);
    protected lastVisible = 0;
    private timeouts: Timeout[] = [];

    pool: ReusablePool<this>;

    protected get age(): number {
        return (
            this.worldViewController!.age -
            this.worldViewControllerAgeAtCreation
        );
    }

    protected get camera(): CameraTrait {
        return this.worldViewController!.camera;
    }

    protected internalBind(
        worldViewController: WorldViewController,
        interpolationPool: InterpolationPool,
    ) {
        this.worldViewController = worldViewController;
        this.interpolationPool = interpolationPool;
        this.worldViewControllerAgeAtCreation = worldViewController.age;
    }

    postBind() {}

    protected abstract createView(): ViewType;

    protected abstract updateView(view: ViewType, elapsed: number): void;

    abstract get layerId(): string;

    isVisible(): boolean {
        return this.visibilityRectangle.intersects(
            this.camera.visibleRectangle,
        );
    }

    hasView(): boolean {
        return !!this.view;
    }

    protected needsCleanup(): boolean {
        return this.age - this.lastVisible > 10;
    }

    getOrCreateView(): ViewType | null {
        if (!this.viewCreated) {
            this.viewCreated = true;
            this.view = this.createView();
        }
        if (!this.viewAdded) {
            this.viewAdded = true;
            this.installView();
        }
        return this.view!;
    }

    protected installView() {
        if (this.view) {
            this.worldViewController!.addViewControllerView(
                this.view,
                this.layerId,
            );
        }
    }

    updateVisibilityRectangle() {
        this.visibilityRectangle.centerAround(
            0,
            0,
            Number.MAX_SAFE_INTEGER / 2,
            Number.MAX_SAFE_INTEGER / 2,
        );
    }

    update() {
        const elapsed = this.age - this.lastUpdate;

        this.updateVisibilityRectangle();

        if (!this.isVisible()) {
            this.visibleAge = 0;

            if (this.view) {
                this.view.visible = false;

                if (this.needsCleanup()) {
                    this.destroyView(this.view);
                }
            }

            this.lastUpdate = this.age;
            return;
        }

        this.lastVisible = this.age;
        this.visibleAge += elapsed;

        const view = this.getOrCreateView();
        if (view) {
            view.visible = true;
            this.updateView(view, elapsed);
        }

        for (let i = this.timeouts.length - 1; i >= 0; i--) {
            if (this.timeouts[i].age <= this.age) {
                const { action } = this.timeouts[i];
                this.timeouts.splice(i, 1);
                action();
            }
        }

        this.lastUpdate = this.age;
    }

    tearDown() {
        if (this.view) {
            this.destroyView(this.view);
        }
        this.pool?.give(this);
    }

    protected destroyView(view: ViewType) {
        this.viewAdded = false;
        this.viewCreated = false;
        this.view = null;

        view.removeFromParent();

        // Give the view back to its pool (if any)
        (view as unknown as ReusablePoolBindable).pool?.give(view);
    }

    abstract removeEmitter(): Promise<void>;

    protected whenAgeIs(targetAge: number): Promise<void> {
        return new Promise((resolve) =>
            this.timeouts.push({
                age: targetAge,
                action: resolve,
            }),
        );
    }

    readonly collapseGroup: string | null = null;
}
