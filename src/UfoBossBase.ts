import { GameObject } from './GameObject';


export class UfoBossBase extends GameObject {

	public isAttacking: boolean = false;

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
	}
}
