import { CameraTrait, Entity } from "@remvst/game-model";
import {
    EntityViewController,
    EntityViewControllerFactory,
} from "@remvst/game-model-three-renderer";
import { CameraViewController } from "./camera-view-controller";
import { CharacterTrait } from "./character-trait";
import { CharacterViewController } from "./character-view-controller";

export class TestEntityViewControllerFactory
    implements EntityViewControllerFactory
{
    readonly cameraViewController = new CameraViewController();

    viewControllersForEntity(entity: Entity): EntityViewController<any>[] {
        const viewControllers: EntityViewController<any>[] = [];

        if (entity.trait(CharacterTrait.key)) {
            viewControllers.push(new CharacterViewController());
        }

        if (entity.trait(CameraTrait.key)) {
            viewControllers.push(this.cameraViewController);
        }

        return viewControllers;
    }
}
