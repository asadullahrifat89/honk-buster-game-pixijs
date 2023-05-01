import { Rectangle } from 'pixi.js';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class UfoBossBase extends GameObjectContainer {

	public isAttacking: boolean = false;

	private readonly grace: number = 7;
	private readonly lag: number = 125;

	private healthLossRecoveryDelay: number = 0;
	private healthLossOpacityEffect: number = 0;

	reset() {
		this.alpha = 1;
		this.health = 100;
		this.isAttacking = false;
	}

	looseHealth() {
		this.health -= this.hitPoint;

		if (this.isDead()) {
			this.isAttacking = false;
		}
		else {
			this.alpha = 0.7;
			this.healthLossRecoveryDelay = 5;
		}
	}

	recoverFromHealthLoss() {
		if (this.healthLossRecoveryDelay > 0) {
			this.healthLossRecoveryDelay -= 0.1;

			this.healthLossOpacityEffect++; // blinking effect

			if (this.healthLossOpacityEffect > 2) {
				if (this.alpha != 1) {
					this.alpha = 1;
				}
				else {
					this.alpha = 0.7;
				}

				this.healthLossOpacityEffect = 0;
			}
		}

		if (this.healthLossRecoveryDelay <= 0 && this.alpha != 1) {
			this.alpha = 1;
		}
	}

	seekPlayer(target: Rectangle) {
		
		let left = this.getLeft();
		let top = this.getTop();

		let bossMiddleX = left + this.width / 2;
		let bossMiddleY = top + this.height / 2;

		let targetMiddleX = target.x + target.width / 2;
		let targetMiddleY = target.y + target.height / 2;

		// move up
		if (targetMiddleY < bossMiddleY - this.grace) {
			var distance = Math.abs(targetMiddleY - bossMiddleY);
			let speed = this.getFlightSpeed(distance);

			this.y = (top - speed);
		}

		// move left
		if (targetMiddleX < bossMiddleX - this.grace) {
			var distance = Math.abs(targetMiddleX - bossMiddleX);
			let speed = this.getFlightSpeed(distance);

			this.x = (left - speed);
		}

		// move down
		if (targetMiddleY > bossMiddleY + this.grace) {
			var distance = Math.abs(targetMiddleY - bossMiddleY);
			let speed = this.getFlightSpeed(distance);

			this.y = (top + speed);
		}

		// move right
		if (targetMiddleX > bossMiddleX + this.grace) {
			var distance = Math.abs(targetMiddleX - bossMiddleX);
			let speed = this.getFlightSpeed(distance);

			this.x = (left + speed);
		}
	}

	getFlightSpeed(distance: number) {
		var flightSpeed = distance / this.lag;
		return flightSpeed;
	}
}

