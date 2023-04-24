import { Rectangle } from 'pixi.js';
import { Constants, ConstructType } from './Constants';
import { GameObject } from './GameObject';
import { Manager } from './Manager';
import { SeekingRocketBase } from './SeekingRocketBase';


export class MafiaBossRocketBullsEye extends SeekingRocketBase {

	private _autoBlastDelay: number = 0;
	private readonly _autoBlastDelayDefault: number = 15;
	private _targetHitbox: Rectangle = new Rectangle();

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
	}

	autoBlast() {
		this._autoBlastDelay -= 0.1;

		if (this._autoBlastDelay <= 0)
			return true;

		return false;
	}

	setTarget(target: Rectangle) {
		let left = this.getLeft();
		let top = this.getTop();

		let rocketMiddleX = left + this.width / 2;
		let rocketMiddleY = top + this.height / 2;

		var scaling = Manager.scaling;

		// move up
		if (target.y < rocketMiddleY) {
			var distance = Math.abs(target.y - rocketMiddleY);
			this._targetHitbox.y = target.y - distance;

			if (this._targetHitbox.y > 0)
				this._targetHitbox.y -= distance;
		}

		// move left
		if (target.x < rocketMiddleX) {
			var distance = Math.abs(target.x - rocketMiddleX);
			this._targetHitbox.x = target.x - distance;

			if (this._targetHitbox.x > 0)
				this._targetHitbox.x -= distance;
		}

		// move down
		if (target.y > rocketMiddleY) {
			var distance = Math.abs(target.y - rocketMiddleY);
			this._targetHitbox.y = target.y + distance;

			if (this._targetHitbox.y < Constants.DEFAULT_GAME_VIEW_HEIGHT * scaling)
				this._targetHitbox.y += distance;

		}

		// move right
		if (target.x > rocketMiddleX) {
			var distance = Math.abs(target.x - rocketMiddleX);
			this._targetHitbox.x = target.x + distance;

			if (this._targetHitbox.x < Constants.DEFAULT_GAME_VIEW_WIDTH * scaling)
				this._targetHitbox.x += distance;
		}
	}

	move() {
		this.seek(this._targetHitbox);
	}
}
