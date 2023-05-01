import { Constants, ConstructType, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SeekingRocketBase } from './SeekingRocketBase';
import { SoundManager } from '../managers/SoundManager';


export class UfoBossRocketSeeking extends SeekingRocketBase {

	private autoBlastDelay: number = 0;
	private readonly autoBlastDelayDefault: number = 25;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET_SEEKING));
		this.scale.set(1);
		this.angle = 0;
		this.isBlasting = false;
		this.autoBlastDelay = this.autoBlastDelayDefault;

		SoundManager.play(SoundType.SEEKER_ROCKET_LAUNCH, 0.8);
	}

	reposition(source: GameObjectContainer) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}

	setBlast() {
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;

		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		this.angle = 0;

		this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));

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

