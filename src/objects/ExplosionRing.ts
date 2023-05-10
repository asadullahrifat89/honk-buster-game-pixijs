import { SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';


export class ExplosionRing extends GameObjectContainer {

    constructor(speed: number) {
        super(speed);        
        this.expandSpeed = 0.6;
    }

    reset() {
        this.alpha = 1.0;
        this.scale.set(1);        
        SoundManager.play(SoundType.EXPLOSION_RING, 0.8);
    }

    reposition(source: GameObjectContainer) {
        this.x = source.x - this.width / 2;
        this.y = source.y - this.height / 2;
    }
}
