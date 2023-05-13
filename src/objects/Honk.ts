import { Constants } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { TextureType, SoundType } from '../Enums';
import { SoundManager } from '../managers/SoundManager';

export class Honk extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1.0;
		this.setTexture(Constants.getRandomTexture(TextureType.HONK));
		SoundManager.play(SoundType.HONK, 0.5);
		this.setDillyDallySpeed(0.3);
	}

	reposition(source: GameObjectContainer) {
		this.x = (source.x - this.width / 2);
		this.y = source.y;
	}
}

