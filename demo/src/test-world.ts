import { CameraTrait, Entity, SmoothTargetFollowingTrait, World } from "@remvst/game-model";
import { Vector2 } from "@remvst/geometry";
import { CharacterTrait } from "./character-trait";
import { SpinningTrait } from "./spinning-trait";

export function testWorld() {
    const world = new World();

    world.entities.add(
        new Entity(undefined, [
            new SpinningTrait(new Vector2(100, 100), 50, Math.PI),
            new CharacterTrait(0xff0000),
        ]),
    );

    world.entities.add(
        new Entity(undefined, [
            new SpinningTrait(new Vector2(50, 150), 20, Math.PI * 4),
            new CharacterTrait(0x00ff00),
        ]),
    );

    world.entities.add(
        new Entity('main', [
            new SpinningTrait(new Vector2(250, 150), 35, Math.PI * 2),
            new CharacterTrait(0xffff00),
        ]),
    );

    const camera = new Entity(undefined, [new CameraTrait(), new SmoothTargetFollowingTrait()]);
    camera.position.z = 300;
    camera.traitOfType(SmoothTargetFollowingTrait).targetEntityIds = ['main'];
    camera.traitOfType(SmoothTargetFollowingTrait).maxSpeed = 100;
    world.entities.add(camera);

    return world;
}
