import { Texture } from 'pixi.js';
import { Constants, ConstructType, MovementDirection } from './Constants';
import { VehicleBossBase } from './VehicleBossBase';


export class VehicleBoss extends VehicleBossBase {

	private movementDirection: MovementDirection = MovementDirection.None;
	private changeMovementPatternDelay: number = 0;
	public vehicleType: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.setDillyDallySpeed(0.3);
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

		this.setHonkDelay();
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	randomizeMovementPattern() {
		this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED, Constants.DEFAULT_CONSTRUCT_SPEED + 2);
		this.changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this.movementDirection = MovementDirection.None;
	}

	move(
		sceneWidth: number,
		sceneHeight: number) {
		this.moveUpLeftDownRight(sceneWidth, sceneHeight);
	}

	moveUpLeftDownRight(sceneWidth: number, sceneHeight: number) {

		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this.movementDirection == MovementDirection.None) {
			this.movementDirection = MovementDirection.UpLeft;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this.movementDirection == MovementDirection.UpLeft) {
				this.moveUpLeft();

				if (this.getBottom() < 0 || this.getRight() < 0) {
					this.reposition();
					this.movementDirection = MovementDirection.DownRight;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.DownRight) {
					this.moveDownRight();

					if (this.getLeft() > sceneWidth || this.getTop() > sceneHeight) {
						this.movementDirection = MovementDirection.UpLeft;
					}
				}
			}
		}

		return false;
	}
}
