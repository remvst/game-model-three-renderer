import { Trait, Vector2 } from "@remvst/game-model";

export class SpinningTrait extends Trait {
    static readonly key = "spinning";
    readonly key = SpinningTrait.key;

    constructor(
        private readonly center: Vector2,
        private readonly radius: number,
        private readonly angularVelocity: number,
    ) {
        super();
    }

    cycle(): void {
        const angle = this.entity.age * this.angularVelocity;
        this.entity.position.x = this.center.x + Math.cos(angle) * this.radius;
        this.entity.position.y = this.center.y + Math.sin(angle) * this.radius;
    }
}
