import { Constants, ConstructType } from './Constants';
import { GameObject } from './GameObject';
import { SeekingRocketBase } from './SeekingRocketBase';


export class UfoBossRocketSeeking extends SeekingRocketBase {

	private _autoBlastDelay: number = 0;
	private readonly _autoBlastDelayDefault: number = 25;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET_SEEKING));
		this.scale.set(1);
		this.angle = 0;
		this.isBlasting = false;
		this._autoBlastDelay = this._autoBlastDelayDefault;
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
	}

	autoBlast() {
		this._autoBlastDelay -= 0.1;

		if (this._autoBlastDelay <= 0)
			return true;

		return false;
	}
}

