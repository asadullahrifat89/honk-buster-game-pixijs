import { Constants, ConstructType } from './Constants';
import { GameObject } from './GameObject';
import { VehicleBoss } from './VehicleBoss';


export class VehicleBossRocket extends GameObject {

	private _autoBlastDelay: number = 0;
	private readonly _autoBlastDelayDefault: number = 9;

	constructor(speed: number) {
		super(speed);
		this.gravitatesUp = true;
	}

	reset() {
		this.alpha = 1;
		this.scale.set(1);

		this.isBlasting = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS_ROCKET));
		this._autoBlastDelay = this._autoBlastDelayDefault;
	}

	reposition(vehicleBoss: VehicleBoss) {
		this.setPosition((vehicleBoss.getRight() - vehicleBoss.width / 2) - this.width / 2, vehicleBoss.getTop());
	}

	setBlast() {
		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));
		this.isBlasting = true;
	}

	autoBlast(): boolean {
		this._autoBlastDelay -= 0.1;
		if (this._autoBlastDelay <= 0)
			return true;

		return false;
	}
}

