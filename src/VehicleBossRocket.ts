import { Constants, ConstructType, SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SoundManager } from './SoundManager';
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

		SoundManager.play(SoundType.ROCKET_LAUNCH, 0.8);
	}

	reposition(vehicleBoss: VehicleBoss) {
		this.setPosition((vehicleBoss.getRight() - vehicleBoss.width / 2) - this.width / 2, vehicleBoss.getTop());
	}

	setBlast() {
		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));
		this.isBlasting = true;

		SoundManager.play(SoundType.ROCKET_BLAST);
	}

	autoBlast(): boolean {
		this._autoBlastDelay -= 0.1;
		if (this._autoBlastDelay <= 0)
			return true;

		return false;
	}
}

