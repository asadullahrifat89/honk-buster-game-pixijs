import { Constants, ConstructType, SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SoundManager } from './SoundManager';
import { VehicleBoss } from './VehicleBoss';


export class VehicleBossRocket extends GameObject {

	private autoBlastDelay: number = 0;
	private readonly autoBlastDelayDefault: number = 9;

	constructor(speed: number) {
		super(speed);
		this.gravitatesUp = true;
	}

	reset() {
		this.alpha = 1;
		this.scale.set(1);

		this.isBlasting = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS_ROCKET));
		this.autoBlastDelay = this.autoBlastDelayDefault;

		SoundManager.play(SoundType.ROCKET_LAUNCH, 0.4);
	}

	reposition(vehicleBoss: VehicleBoss) {
		this.setPosition((vehicleBoss.getLeft()), vehicleBoss.getTop());
	}

	setBlast() {
		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));
		this.isBlasting = true;

		SoundManager.play(SoundType.ROCKET_BLAST);
	}

	autoBlast(): boolean {
		this.autoBlastDelay -= 0.1;
		if (this.autoBlastDelay <= 0)
			return true;

		return false;
	}
}

