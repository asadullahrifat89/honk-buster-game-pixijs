﻿import { Rectangle } from 'pixi.js';
import { Constants } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SceneManager } from '../managers/SceneManager';


export class SeekingRocketBase extends GameObjectContainer {

	private readonly grace: number = 10;
	private readonly lag: number = 50;
	public targetHitbox: Rectangle = new Rectangle();

	setTarget(target: Rectangle) {
		let rocketX = this.getLeft() + this.width / 2;
		let rocketY = this.getTop() + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		var scaling = SceneManager.scaling;

		// move up
		if (targetY < rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.targetHitbox.y = targetY - distance;

			if (this.targetHitbox.y > 0)
				this.targetHitbox.y -= distance;
		}

		// move down
		if (targetY > rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.targetHitbox.y = targetY + distance;

			if (this.targetHitbox.y < Constants.DEFAULT_GAME_VIEW_HEIGHT * scaling)
				this.targetHitbox.y += distance;
		}

		// move left
		if (targetX < rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.targetHitbox.x = targetX - distance;

			if (this.targetHitbox.x > 0)
				this.targetHitbox.x -= distance;
		}

		// move right
		if (targetX > rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.targetHitbox.x = targetX + distance;

			if (this.targetHitbox.x < Constants.DEFAULT_GAME_VIEW_WIDTH * scaling)
				this.targetHitbox.x += distance;
		}
	}

	seek(target: Rectangle) {

		let left = this.getLeft();
		let top = this.getTop();

		let rocketX = left + this.width / 2;
		let rocketY = top + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		// move up
		if (targetY < rocketY - this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.calculateSpeed(distance);

			this.y = (top - speed);
		}

		// move down
		if (targetY > rocketY + this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.calculateSpeed(distance);

			this.y = (top + speed);
		}

		// move left
		if (targetX < rocketX - this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.calculateSpeed(distance);

			this.x = (left - speed);
		}
		
		// move right
		if (targetX > rocketX + this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.calculateSpeed(distance);

			this.x = (left + speed);
		}
	}

	private calculateSpeed(distance: number): number {
		var speed = distance / this.lag;
		return speed;
	}
}

