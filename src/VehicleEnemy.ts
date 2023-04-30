import { Constants, ConstructType, SoundType } from './Constants';
import { VehicleBase } from './VehicleBase';
import { GrayscaleFilter } from '@pixi/filter-grayscale';
import { SoundManager } from './SoundManager';
import { Texture } from 'pixi.js';

export class VehicleEnemy extends VehicleBase {

	private grayScaleFilter: GrayscaleFilter = new GrayscaleFilter();
	public vehicleType: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.speed = Constants.getRandomNumber(2, 4);
		this.willHonk = !!Constants.getRandomNumber(0, 1);
		this.filters = null;

		this.vehicleType = Constants.getRandomNumber(0, 1);

		let uri: string = "";
		switch (this.vehicleType) {
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
		this.setTexture(texture);

		if (this.willHonk) {
			this.health = this.hitPoint * Constants.getRandomNumber(0, 1);
			this.setHonkDelay();
			this.setDillyDallySpeed(Constants.getRandomNumber(0.50, 0.1));
		}
		else {
			this.setDillyDallySpeed(0);
		}
	}

	looseHealth() {
		this.health -= this.hitPoint;
	}

	setBlast() {
		this.willHonk = false;
		this.speed = this.speed * 1.3;
		this.filters = [this.grayScaleFilter];
		SoundManager.play(SoundType.HONK_BUST_REACTION, 0.8);
	}
}

