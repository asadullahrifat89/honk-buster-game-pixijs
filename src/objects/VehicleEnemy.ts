import { Constants, TextureType } from '../Constants';
import { VehicleBase } from './VehicleBase';
import { Texture } from 'pixi.js';

export class VehicleEnemy extends VehicleBase {

	public vehicleType: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.isBlasting = false;
		this.speed = Constants.getRandomNumber(2, 4);
		this.willHonk = !!Constants.getRandomNumber(0, 1);

		if (!this.willHonk)
			this.willHonk = !!Constants.getRandomNumber(0, 1);

		this.isHonking = false;
		this.filters = null;

		this.vehicleType = Constants.getRandomNumber(TextureType.VEHICLE_ENEMY_SMALL, TextureType.VEHICLE_ENEMY_LARGE);

		let uri: string = "";
		switch (this.vehicleType) {
			case TextureType.VEHICLE_ENEMY_SMALL: {
				uri = Constants.getRandomUri(TextureType.VEHICLE_ENEMY_SMALL);
			} break;
			case TextureType.VEHICLE_ENEMY_LARGE: {
				uri = Constants.getRandomUri(TextureType.VEHICLE_ENEMY_LARGE);

			} break;
			default: break;
		}

		var template = Constants.CONSTRUCT_TEMPLATES.find(x => x.constructType == this.vehicleType && x.uri == uri);
		if (template?.tag) // check if this vehicle has disabled honking by default
			this.willHonk = false;

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

		this.setDestroyed();
		this.setDillyDallySpeed(0);
	}
}