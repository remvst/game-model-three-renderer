import { World, WorldEvent } from "@remvst/game-model";
import { EventViewController } from "../events/event-view-controller";

export interface EventViewControllerFactory {
    viewControllersForEvent(
        event: WorldEvent,
        world: World,
    ): EventViewController<any, any>[];
}
