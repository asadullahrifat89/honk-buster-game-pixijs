import { Constants, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';


export class RocketBase extends GameObjectContainer {

    public autoBlastDelay: number = 0;
    public autoBlastDelayDefault: number = 9;  

    constructor(speed: number) {
        super(speed);
    }

    accelerate() {
        if (this.speed < Constants.DEFAULT_CONSTRUCT_SPEED + 7)
            this.speed += 0.5;
    }

    decelerate() {
        if (this.speed > 3)
            this.speed -= 0.5;
    }

    setBlast() {
        this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;
        this.isBlasting = true;
        SoundManager.play(SoundType.ROCKET_BLAST);
    }

    autoBlast() {
        this.autoBlastDelay -= 0.1;

        if (this.autoBlastDelay <= 0)
            return true;

        return false;
    }
}
