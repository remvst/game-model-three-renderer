import { Entity } from "@remvst/game-model";

import { EntityViewController } from "../entities/entity-view-controller";

import { EntityViewControllerFactory } from "./entity-view-controller-factory";

export class CompositeEntityViewControllerFactory
    implements EntityViewControllerFactory
{
    private readonly factories: EntityViewControllerFactory[];

    constructor(factories: EntityViewControllerFactory[]) {
        this.factories = factories;
    }

    viewControllersForEntity(entity: Entity): EntityViewController<any>[] {
        const viewControllers: EntityViewController<any>[] = [];

        for (const factory of this.factories) {
            viewControllers.push(...factory.viewControllersForEntity(entity));
        }

        return viewControllers;
    }
}
