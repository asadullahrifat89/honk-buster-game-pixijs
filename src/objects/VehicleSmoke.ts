import { Constants, ConstructType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class VehicleSmoke extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1.0;
		this.setTexture(Constants.getRandomTexture(ConstructType.VEHICLE_SMOKE));
		this.setDillyDallySpeed(0.4);
	}

	reposition(source: GameObjectContainer) {
		this.x = (source.x + source.width / 2 + this.width / 2);
		this.y = source.y + source.height / 3;
		this.speed = source.speed;
	}
}
