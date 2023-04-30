﻿import { Constants, ConstructType, SoundType } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';
import { SoundManager } from './SoundManager';

export class Honk extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1.0;
		this.setTexture(Constants.getRandomTexture(ConstructType.HONK));
		SoundManager.play(SoundType.HONK, 0.5);
	}

	reposition(source: GameObjectContainer) {
		this.x = (source.x - this.width / 2);
		this.y = source.y;
	}
}

