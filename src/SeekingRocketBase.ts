import { Rectangle } from 'pixi.js';
import { Constants } from './Constants';
import { GameObject } from './GameObject';
import { Manager } from './Manager';


export class SeekingRocketBase extends GameObject {

	private readonly _grace: number = 7;
	private readonly _lag: number = 60;
	public _targetHitbox: Rectangle = new Rectangle();

	setTarget(target: Rectangle) {

		let rocketMiddleX = this.getLeft() + this.width / 2;
		let rocketMiddleY = this.getTop() + this.height / 2;

		let targetMiddleX = target.x + target.width / 2;
		let targetMiddleY = target.y + target.height / 2;

		var scaling = Manager.scaling;

		// move up
		if (targetMiddleY < rocketMiddleY) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			this._targetHitbox.y = targetMiddleY - distance;

			if (this._targetHitbox.y > 0)
				this._targetHitbox.y -= distance;
		}

		// move left
		if (targetMiddleX < rocketMiddleX) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			this._targetHitbox.x = targetMiddleX - distance;

			if (this._targetHitbox.x > 0)
				this._targetHitbox.x -= distance;
		}

		// move down
		if (targetMiddleY > rocketMiddleY) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			this._targetHitbox.y = targetMiddleY + distance;

			if (this._targetHitbox.y < Constants.DEFAULT_GAME_VIEW_HEIGHT * scaling)
				this._targetHitbox.y += distance;
		}

		// move right
		if (targetMiddleX > rocketMiddleX) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			this._targetHitbox.x = targetMiddleX + distance;

			if (this._targetHitbox.x < Constants.DEFAULT_GAME_VIEW_WIDTH * scaling)
				this._targetHitbox.x += distance;
		}
	}

	seek(target: Rectangle, doubleSpeed: boolean = false) {
		let left = this.getLeft();
		let top = this.getTop();

		let rocketMiddleX = left + this.width / 2;
		let rocketMiddleY = top + this.height / 2;

		let targetMiddleX = target.x + target.width / 2;
		let targetMiddleY = target.y + target.height / 2;

		// move up
		if (targetMiddleY < rocketMiddleY - this._grace) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.y = (top - speed);
		}

		// move left
		if (targetMiddleX < rocketMiddleX - this._grace) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.x = (left - speed);
		}

		// move down
		if (targetMiddleY > rocketMiddleY + this._grace) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.y = (top + speed);
		}

		// move right
		if (targetMiddleX > rocketMiddleX + this._grace) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.x = (left + speed);
		}
	}

	private calculateSpeed(distance: number, doubleSpeed: boolean = false): number {
		var speed = distance / (doubleSpeed ? this._lag * 0.5 : this._lag);
		//speed = speed < 4 ? 4 : speed;
		return speed;
	}
}

