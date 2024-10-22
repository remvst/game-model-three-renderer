import { Entity } from "@remvst/game-model";
import { EntityViewController } from "../entities/entity-view-controller";

export interface EntityViewControllerFactory {
    viewControllersForEntity(entity: Entity): EntityViewController<any>[];
}
