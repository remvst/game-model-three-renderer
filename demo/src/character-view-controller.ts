import { EntityViewController } from "@remvst/game-model-three-renderer";
import * as THREE from "three";
import { CharacterTrait } from "./character-trait";

export class CharacterViewController extends EntityViewController<THREE.Mesh> {
    readonly layerId = "characters";

    private characterTrait: CharacterTrait;

    postBind(): void {
        super.postBind();
        this.characterTrait = this.entity.traitOfType(CharacterTrait);
    }

    protected createView(): THREE.Mesh {
        return new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
            new THREE.MeshBasicMaterial({
                color: this.characterTrait.color,
            }),
        );
    }

    protected updateView(view: THREE.Object3D, elapsed: number): void {
        view.position.set(
            this.entity.position.x,
            this.entity.position.y,
            this.entity.position.z,
        );
        view.scale.set(50, 50, 50);
    }
}
