import { Constants, ConstructType, SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SoundManager } from './SoundManager';


export class UfoEnemyRocket extends GameObject {

	private _autoBlastDelay: number = 0;
	private readonly _autoBlastDelayDefault: number = 12;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 2;
		this.scale.set(1);
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_ENEMY_ROCKET));

		this._autoBlastDelay = this._autoBlastDelayDefault;

		SoundManager.play(SoundType.ORB_LAUNCH, 0.8);
	}

	reposition(source: GameObject) {
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
		this._autoBlastDelay -= 0.1;

		if (this._autoBlastDelay <= 0)
			return true;

		return false;
	}
}
