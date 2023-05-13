import { Constants } from '../Constants';
import { MovementDirection, TextureType } from '../Enums';
import { VehicleBossBase } from './VehicleBossBase';


export class VehicleBoss extends VehicleBossBase {

	private movementDirection: MovementDirection = MovementDirection.None;
	private changeMovementPatternDelay: number = 0;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.setDillyDallySpeed(0.1);
		this.setTexture(Constants.getRandomTexture(TextureType.VEHICLE_BOSS));
		this.setHonkDelay();
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	move(sceneWidth: number, sceneHeight: number) {
		this.moveUpLeftDownRight(sceneWidth, sceneHeight);
	}

	private randomizeMovementPattern() {
		this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED, Constants.DEFAULT_CONSTRUCT_SPEED + 2);
		this.changeMovementPatternDelay = Constants.getRandomNumber(50, 60);
		this.movementDirection = MovementDirection.None;
	}

	private moveUpLeftDownRight(sceneWidth: number, sceneHeight: number) {
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
