import { Constants, ConstructType, SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SoundManager } from './SoundManager';

export class Honk extends GameObject {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1.0;
		this.setTexture(Constants.getRandomTexture(ConstructType.HONK));
		SoundManager.play(SoundType.HONK, 0.5);
	}

	reposition(source: GameObject) {
		this.x = (source.x - this.width / 2);
		this.y = source.y;
	}
}
