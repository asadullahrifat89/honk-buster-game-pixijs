import { Constants, ConstructType } from '../Constants';
import { VehicleBase } from './VehicleBase';


export class UfoEnemy extends VehicleBase {

	private attackDelay: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.health = this.hitPoint * Constants.getRandomNumber(0, 3);
		this.scale.set(1);
		this.alpha = 1;
		this.willHonk = !!Constants.getRandomNumber(0, 1);
		this.isHonking = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_ENEMY));
		this.speed = Constants.getRandomNumber(2, 4);

		if (this.willHonk) {
			this.setHonkDelay();
		}
	}

	attack(): boolean {
		if (!this.isDead()) {
			this.attackDelay--;

			if (this.attackDelay < 0) {
				this.setAttackDelay();
				return true;
			}
		}

		return false;
	}

	setAttackDelay() {
		this.attackDelay = Constants.getRandomNumber(50, 80);
	}

	looseHealth() {
		this.health -= this.hitPoint;
	}
}
