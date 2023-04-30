import { SoundType } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';
import { SoundManager } from './SoundManager';


export class HealthPickup extends GameObjectContainer {

	public isPickedUp: boolean = false;

	constructor(speed: number) {
		super(speed);
	}

	public static shouldGenerate(playerHealth: number): boolean {
		return playerHealth <= 40; // generate health if health is below 40 %
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

