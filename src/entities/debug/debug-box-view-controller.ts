import * as THREE from "three";
import { EntityViewController } from "../entity-view-controller";

export class DebugBoxViewController extends EntityViewController<THREE.Mesh> {
    constructor(
        private readonly width: number,
        private readonly height: number,
        private readonly depth: number,
    ) {
        super();
    }

    createView(): THREE.Mesh {
        return new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.5,
            }),
        );
    }

    updateView(view: THREE.Mesh) {
        view.position.set(
            this.entity.position.x,
            this.entity.position.y,
            this.entity.position.z,
        );
        view.scale.set(this.width, this.height, this.depth);
    }

    readonly layerId = "debug-foreground";
}
