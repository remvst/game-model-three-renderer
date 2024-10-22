import { WorldEvent } from "@remvst/game-model";
import { EventViewController } from "../events/event-view-controller";
import { EventViewControllerFactory } from "./event-view-controller-factory";

export class EmptyEventViewControllerFactory
    implements EventViewControllerFactory
{
    viewControllersForEvent(
        event: WorldEvent,
    ): EventViewController<any, any>[] {
        return [];
    }
}
