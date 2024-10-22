import { Entity } from "@remvst/game-model";
import {
    EntityViewController,
    EntityViewControllerFactory,
} from "@remvst/game-model-three-renderer";
import { CharacterTrait } from "./character-trait";
import { CharacterViewController } from "./character-view-controller";

export class TestEntityViewControllerFactory
    implements EntityViewControllerFactory
{
    viewControllersForEntity(entity: Entity): EntityViewController<any>[] {
        const viewControllers: EntityViewController<any>[] = [];

        if (entity.trait(CharacterTrait.key)) {
            viewControllers.push(new CharacterViewController());
        }

        return viewControllers;
    }
}
