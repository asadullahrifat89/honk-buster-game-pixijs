import { Constants, ConstructType } from './Constants';
import { GameObject } from './GameObject';

export class Honk extends GameObject {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1.0;
		this.changeTexture(Constants.getRandomTexture(ConstructType.HONK));
	}

	reposition(source: GameObject) {

		this.x = (source.x - this.width / 2);
		this.y = source.y + source.height / 5;
	}
}
