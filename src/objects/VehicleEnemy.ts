import { Constants, ConstructType } from '../Constants';
import { VehicleBase } from './VehicleBase';
import { GrayscaleFilter } from '@pixi/filter-grayscale';
import { Texture } from 'pixi.js';

export class VehicleEnemy extends VehicleBase {

	private grayScaleFilter: GrayscaleFilter = new GrayscaleFilter();
	public vehicleType: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.isBlasting = false;
		this.speed = Constants.getRandomNumber(2, 4);
		this.willHonk = !!Constants.getRandomNumber(0, 1);
		this.isHonking = false;
		this.filters = null;		

		this.vehicleType = Constants.getRandomNumber(ConstructType.VEHICLE_ENEMY_SMALL, ConstructType.VEHICLE_ENEMY_LARGE);

		let uri: string = "";
		switch (this.vehicleType) {
			case ConstructType.VEHICLE_ENEMY_SMALL: {
				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);
				break;
			}
			case ConstructType.VEHICLE_ENEMY_LARGE: {
				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);
				break;
			}
			default: break;
		}

		const texture = Texture.from(uri);
		this.setTexture(texture);

		if (this.willHonk) {
			this.health = this.hitPoint * Constants.getRandomNumber(0, 1);
			this.setHonkDelay();
			this.setDillyDallySpeed(Constants.getRandomNumber(0.1, 0.2));
		}
	}

	looseHealth() {
		this.health -= this.hitPoint;
	}

	setBlast() {
		this.isBlasting = true;
		this.willHonk = false;
		this.isHonking = false;
		this.speed = this.speed * 1.4;

		if (this.speed > Constants.DEFAULT_CONSTRUCT_SPEED)
			this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;

		this.filters = [this.grayScaleFilter];
		this.setDillyDallySpeed(0);
		this.setHopping();
	}	
}