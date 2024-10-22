import { World, WorldEvent } from "@remvst/game-model";

import { EventViewController } from "../events/event-view-controller";
import { EventViewControllerFactory } from "./event-view-controller-factory";

export class CompositeEventViewControllerFactory
    implements EventViewControllerFactory
{
    private readonly factories: EventViewControllerFactory[];

    constructor(factories: EventViewControllerFactory[]) {
        this.factories = factories;
    }

    viewControllersForEvent(
        event: WorldEvent,
        world: World,
    ): EventViewController<any, any>[] {
        const viewControllers: EventViewController<any, any>[] = [];

        for (const factory of this.factories) {
            viewControllers.push(
                ...factory.viewControllersForEvent(event, world),
            );
        }

        return viewControllers;
    }
}
