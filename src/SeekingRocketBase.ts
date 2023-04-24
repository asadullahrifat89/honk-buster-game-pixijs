import { Rectangle } from 'pixi.js';
import { GameObject } from './GameObject';


export class SeekingRocketBase extends GameObject {

	private readonly _grace: number = 7;
	private readonly _lag: number = 60;

	seek(target: Rectangle, doubleSpeed: boolean) {
		let left = this.getLeft();
		let top = this.getTop();

		let playerMiddleX = left + this.width / 2;
		let playerMiddleY = top + this.height / 2;

		// move up
		if (target.y < playerMiddleY - this._grace) {
			var distance = Math.abs(target.y - playerMiddleY);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.y = (top - speed);
		}

		// move left
		if (target.x < playerMiddleX - this._grace) {
			var distance = Math.abs(target.x - playerMiddleX);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.x = (left - speed);
		}

		// move down
		if (target.y > playerMiddleY + this._grace) {
			var distance = Math.abs(target.y - playerMiddleY);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.y = (top + speed);
		}

		// move right
		if (target.x > playerMiddleX + this._grace) {
			var distance = Math.abs(target.x - playerMiddleX);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.x = (left + speed);
		}
	}

	private calculateSpeed(distance: number, doubleSpeed: boolean = false): number {
		var speed = distance / (doubleSpeed ? this._lag * 0.5 : this._lag);
		speed = speed < 4 ? 4 : speed;
		return speed;
	}
}

