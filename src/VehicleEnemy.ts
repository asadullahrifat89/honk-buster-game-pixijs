import { Constants } from './Constants';
import { VehicleBase } from './VehicleBase';


export class VehicleEnemy extends VehicleBase {

	constructor(speed: number) {
		super(speed);		
	}

	reset() {

		this.speed = Constants.getRandomNumber(1, 2);
		this.willHonk = !!Constants.getRandomNumber(0, 1);

		if (this.willHonk) {
			this.health = this.hitPoint * Constants.getRandomNumber(0, 3);
			this.setHonkDelay();
		}
	}
}
