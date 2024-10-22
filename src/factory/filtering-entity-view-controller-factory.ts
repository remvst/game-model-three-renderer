import { Entity } from "@remvst/game-model";
import { EntityViewController } from "../entities/entity-view-controller";
import { EntityViewControllerFactory } from "./entity-view-controller-factory";

export class FilteringEntityViewControllerFactory
    implements EntityViewControllerFactory
{
    constructor(
        private readonly wrapped: EntityViewControllerFactory,
        private readonly filter: (entity: Entity) => boolean,
    ) {}

    viewControllersForEntity(entity: Entity): EntityViewController<any>[] {
        if (!this.filter(entity)) {
            return [];
        }

        return this.wrapped.viewControllersForEntity(entity);
    }
}
