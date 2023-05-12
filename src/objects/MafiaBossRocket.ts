import { Constants, ConstructType, SoundType } from '../Constants';
import { SoundManager } from '../managers/SoundManager';
import { MafiaBoss } from './MafiaBoss';
import { AirBombBase } from './AirBombBase';

export class MafiaBossRocket extends AirBombBase {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.speed = 0;
		this.scale.set(1);
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET));

		this.awaitMoveDownLeft = false;
		this.awaitMoveUpRight = false;

		this.awaitMoveUpLeft = false;
		this.awaitMoveDownRight = false;

		this.autoBlastDelay = this.autoBlastDelayDefault;

		SoundManager.play(SoundType.ROCKET_LAUNCH, 0.3);
	}

	reposition(source: MafiaBoss) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}
}
