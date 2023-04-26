import { SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SoundManager } from './SoundManager';


export class HealthPickup extends GameObject {

	public isPickedUp: boolean = false;

	constructor(speed: number) {
		super(speed);
	}

	public static shouldGenerate(playerHealth: number): boolean {
		return playerHealth <= 50;
	}

	reset() {
		this.isPickedUp = false;
		this.scale.set(1);
	}

	pickedUp() {
		this.isPickedUp = true;
		SoundManager.play(SoundType.HEALTH_PICKUP);
	}
}

