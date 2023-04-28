import { Rectangle } from 'pixi.js';
import { Constants } from './Constants';
import { GameObject } from './GameObject';
import { SceneManager } from './SceneManager';


export class SeekingRocketBase extends GameObject {

	private readonly grace: number = 7;
	private readonly lag: number = 60;
	public targetHitbox: Rectangle = new Rectangle();

	setTarget(target: Rectangle) {

		let rocketMiddleX = this.getLeft() + this.width / 2;
		let rocketMiddleY = this.getTop() + this.height / 2;

		let targetMiddleX = target.x + target.width / 2;
		let targetMiddleY = target.y + target.height / 2;

		var scaling = SceneManager.scaling;

		// move up
		if (targetMiddleY < rocketMiddleY) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			this.targetHitbox.y = targetMiddleY - distance;

			if (this.targetHitbox.y > 0)
				this.targetHitbox.y -= distance;
		}

		// move left
		if (targetMiddleX < rocketMiddleX) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			this.targetHitbox.x = targetMiddleX - distance;

			if (this.targetHitbox.x > 0)
				this.targetHitbox.x -= distance;
		}

		// move down
		if (targetMiddleY > rocketMiddleY) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			this.targetHitbox.y = targetMiddleY + distance;

			if (this.targetHitbox.y < Constants.DEFAULT_GAME_VIEW_HEIGHT * scaling)
				this.targetHitbox.y += distance;
		}

		// move right
		if (targetMiddleX > rocketMiddleX) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			this.targetHitbox.x = targetMiddleX + distance;

			if (this.targetHitbox.x < Constants.DEFAULT_GAME_VIEW_WIDTH * scaling)
				this.targetHitbox.x += distance;
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
		if (targetMiddleY < rocketMiddleY - this.grace) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.y = (top - speed);
		}

		// move left
		if (targetMiddleX < rocketMiddleX - this.grace) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.x = (left - speed);
		}

		// move down
		if (targetMiddleY > rocketMiddleY + this.grace) {
			var distance = Math.abs(targetMiddleY - rocketMiddleY);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.y = (top + speed);
		}

		// move right
		if (targetMiddleX > rocketMiddleX + this.grace) {
			var distance = Math.abs(targetMiddleX - rocketMiddleX);
			let speed = this.calculateSpeed(distance, doubleSpeed);

			this.x = (left + speed);
		}
	}

	private calculateSpeed(distance: number, doubleSpeed: boolean = false): number {
		var speed = distance / (doubleSpeed ? this.lag * 0.5 : this.lag);
		//speed = speed < 4 ? 4 : speed;
		return speed;
	}
}

