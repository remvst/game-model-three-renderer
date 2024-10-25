import { InterpolationPool } from "@remvst/animate.js";
import { WorldEvent } from "@remvst/game-model";
import * as THREE from "three";
import { ViewController } from "../view-controller";
import { WorldViewController } from "../world/world-view-controller";

export abstract class EventViewController<
    ViewType extends THREE.Object3D,
    EventType extends WorldEvent,
> extends ViewController<ViewType> {
    protected event: EventType | null = null;
    protected bindWorldAge: number = 0;
    protected lastUpdate: number = 0;

    bind(
        worldViewController: WorldViewController,
        interpolationPool: InterpolationPool,
        event: EventType,
    ) {
        super.internalBind(worldViewController, interpolationPool);
        this.event = event;
        this.bindWorldAge = this.worldViewController!.age;
    }

    postBind() {}

    isVisible() {
        return true;
    }

    tearDown() {
        super.tearDown();
        this.event = null;
    }

    update() {
        super.update();
        this.lastUpdate = this.age;
    }

    get age(): number {
        return this.worldViewController!.age - this.bindWorldAge;
    }
}
