import { Constants, ConstructType } from './Constants';
import { VehicleBase } from './VehicleBase';


export class UfoEnemy extends VehicleBase {

	private _attackDelay: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.scale.set(1);
		this.health = this.hitPoint * Constants.getRandomNumber(0, 3);
		this.willHonk = !!Constants.getRandomNumber(0, 1);

		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_ENEMY));

		this.speed = Constants.getRandomNumber(2, 4);

		if (this.willHonk) {
			this.setHonkDelay();
		}
	}

	attack(): boolean {
		if (!this.isDead()) {
			this._attackDelay--;

			if (this._attackDelay < 0) {
				this.setAttackDelay();
				return true;
			}
		}

		return false;
	}

	setAttackDelay() {
		this._attackDelay = Constants.getRandomNumber(50, 80);
	}

	looseHealth() {
		this.health -= this.hitPoint;
	}
}
