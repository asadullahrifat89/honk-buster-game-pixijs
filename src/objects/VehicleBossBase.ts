import { Constants } from '../Constants';
import { VehicleBase } from './VehicleBase';


export class VehicleBossBase extends VehicleBase {

	public isAttacking: boolean = false;

	reset() {
		this.alpha = 1;
		this.health = 100;
		this.isAttacking = false;
		this.willHonk = true;
	}

	looseHealth() {
		this.health -= this.hitPoint;

		if (this.isDead()) {
			this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;
			this.isAttacking = false;
		}
	}
}