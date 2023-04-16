import { Constants, ConstructType } from './Constants';
import { VehicleBase } from './VehicleBase';


export class VehicleEnemy extends VehicleBase {

	constructor(speed: number) {
		super(speed);

		var vehicleType = Constants.getRandomNumber(0, 2);

		switch (vehicleType) {
			case 0: {

				this.changeTexture(Constants.getRandomTexture(ConstructType.VEHICLE_ENEMY_SMALL));

				break;
			}
			case 1: {

				this.changeTexture(Constants.getRandomTexture(ConstructType.VEHICLE_ENEMY_LARGE));

				break;
			}
			default: break;
		}
	}

	reset() {

		this.speed = Constants.getRandomNumber(2, 4);
		this.willHonk = !!Constants.getRandomNumber(0, 1);

		if (this.willHonk) {
			this.health = this.hitPoint * Constants.getRandomNumber(0, 3);
			this.setHonkDelay();
		}
	}
}
