import { SmoothTargetFollowingTrait } from "@remvst/game-model";
import { EntityViewController } from "@remvst/game-model-three-renderer";
import * as THREE from "three";

export class CameraViewController extends EntityViewController<THREE.PerspectiveCamera> {
    readonly layerId = "characters";

    private smoothTargetFollowingTrait: SmoothTargetFollowingTrait;

    private readonly target = new THREE.Vector3();

    postBind(): void {
        super.postBind();
        this.smoothTargetFollowingTrait = this.entity.traitOfType(
            SmoothTargetFollowingTrait,
        );
    }

    protected createView(): THREE.PerspectiveCamera {
        return new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    }

    protected updateView(view: THREE.PerspectiveCamera, elapsed: number): void {
        view.position.set(
            this.entity.position.x,
            this.entity.position.y,
            this.entity.position.z,
        );

        const { target } = this.smoothTargetFollowingTrait;
        if (target) {
            this.target.set(
                target.position.x,
                target.position.y,
                target.position.z,
            );
        }

        view.lookAt(this.target);
    }
}
