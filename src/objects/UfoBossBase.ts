import { Rectangle } from 'pixi.js';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundType } from '../Enums';
import { SoundManager } from '../managers/SoundManager';


export class UfoBossBase extends GameObjectContainer {

	public isAttacking: boolean = false;

	//private readonly grace: number = 7;
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
			this.alpha = 0.4;
			this.healthLossRecoveryDelay = 5;
		}

		SoundManager.play(SoundType.DAMAGE_TAKEN);
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

	follow(target: Rectangle) {

		let left = this.getLeft();
		let top = this.getTop();

		let bossX = left + this.width / 2;
		let bossY = top + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		// move up
		if (targetY < bossY /*- this.grace*/) {
			var distance = Math.abs(targetY - bossY);
			let speed = this.getFollowingSpeed(distance);

			this.y = (top - speed);
		}

		// move down
		if (targetY > bossY /*+ this.grace*/) {
			var distance = Math.abs(targetY - bossY);
			let speed = this.getFollowingSpeed(distance);

			this.y = (top + speed);
		}

		// move left
		if (targetX < bossX /*- this.grace*/) {
			var distance = Math.abs(targetX - bossX);
			let speed = this.getFollowingSpeed(distance);

			this.x = (left - speed);
		}

		// move right
		if (targetX > bossX /*+ this.grace*/) {
			var distance = Math.abs(targetX - bossX);
			let speed = this.getFollowingSpeed(distance);

			this.x = (left + speed);
		}
	}

	getFollowingSpeed(distance: number) {
		var speed = distance / this.lag;
		return speed;
	}
}

