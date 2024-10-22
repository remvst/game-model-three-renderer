import { Trait } from "@remvst/game-model";

export class CharacterTrait extends Trait {
    static readonly key = "character";
    readonly key = CharacterTrait.key;

    constructor(readonly color: number) {
        super();
    }
}
