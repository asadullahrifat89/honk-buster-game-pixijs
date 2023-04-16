import { Texture } from 'pixi.js';
import { Constants, ConstructType } from './Constants';
import { VehicleBase } from './VehicleBase';


export class VehicleEnemy extends VehicleBase {

	constructor(speed: number) {
		super(speed);		
	}

	reset() {

		this.speed = Constants.getRandomNumber(1, 2);
		this.willHonk = !!Constants.getRandomNumber(0, 1);

		var vehicleType = Constants.getRandomNumber(0, 1);

		let uri: string = "";
		switch (vehicleType) {
			case 0: {

				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);

				break;
			}
			case 1: {

				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);

				break;
			}
			default: break;
		}

		const texture = Texture.from(uri);
		this.changeTexture(texture);

		if (this.willHonk) {
			this.health = this.hitPoint * Constants.getRandomNumber(0, 3);
			this.setHonkDelay();
		}
	}
}
