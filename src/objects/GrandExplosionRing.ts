import { SoundType } from '../Enums';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';


export class GrandExplosionRing extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
		this.expandSpeed = 0.6;
	}

	reset() {
		this.alpha = 1.0;
		this.scale.set(1);		
		SoundManager.play(SoundType.GRAND_EXPLOSION_RING, 0.8);
	}

	reposition(source: GameObjectContainer) {
		this.x = (source.getRight() - source.width / 2) - this.width / 2;
		this.y = (source.getBottom() - source.height / 2) - this.height / 2;
	}
}
