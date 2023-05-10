//import { Constants, ConstructType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class ExplosionRing extends GameObjectContainer {

    constructor(speed: number) {
        super(speed);        
        this.expandSpeed = 0.6;
    }

    reset() {
        this.alpha = 1.0;
        this.scale.set(1);
        //this.setTexture(Constants.getRandomTexture(ConstructType.EXPLOSION_RING));
        //SoundManager.play(SoundType.HONK, 0.5);
    }

    reposition(source: GameObjectContainer) {
        this.x = source.x - this.width / 2;
        this.y = source.y - this.height / 2;
    }
}
