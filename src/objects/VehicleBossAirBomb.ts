import { Constants, ConstructType, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';
import { VehicleBoss } from './VehicleBoss';


export class VehicleBossAirBomb extends GameObjectContainer {

	private autoBlastDelay: number = 0;
	private readonly autoBlastDelayDefault: number = 8;

	constructor(speed: number) {
		super(speed);
		this.gravitatesUp = true;
	}

	reset() {
		this.isBlasting = false;
		this.alpha = 1;
		this.scale.set(1);
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED * 1.2;		
		this.setTexture(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS_ROCKET));
		this.autoBlastDelay = this.autoBlastDelayDefault;

		SoundManager.play(SoundType.ROCKET_LAUNCH, 0.3);
	}

	reposition(vehicleBoss: VehicleBoss) {
		this.setPosition((vehicleBoss.getLeft()), vehicleBoss.getTop());
	}

	setBlast() {		
		this.isBlasting = true;
		SoundManager.play(SoundType.AIR_BOMB_BLAST);
	}

	autoBlast(): boolean {
		this.autoBlastDelay -= 0.1;
		if (this.autoBlastDelay <= 0)
			return true;

		return false;
	}

	decelerate() {
		if (this.speed > 0) {
			this.speed -= 0.1; // showly decrease the speed
		}
	}
}

