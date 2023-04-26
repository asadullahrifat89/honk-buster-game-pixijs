import { Rectangle } from 'pixi.js';
import { Constants, ConstructType, SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SeekingRocketBase } from './SeekingRocketBase';
import { SoundManager } from './SoundManager';


export class MafiaBossRocketBullsEye extends SeekingRocketBase {

	private _autoBlastDelay: number = 0;
	private readonly _autoBlastDelayDefault: number = 15;	

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET_BULLS_EYE));
		this.scale.set(1);
		this.angle = 0;
		this.isBlasting = false;
		this._autoBlastDelay = this._autoBlastDelayDefault;
		this._targetHitbox = new Rectangle();

		SoundManager.play(SoundType.BULLS_EYE_ROCKET_LAUNCH);
	}

	reposition(source: GameObject) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height);
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

	move() {
		this.seek(this._targetHitbox);
	}
}

