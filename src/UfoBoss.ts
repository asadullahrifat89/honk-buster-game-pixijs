import { Rectangle, Texture } from 'pixi.js';
import { BossStance, Constants, ConstructType, MovementDirection, UfoBossMovementPattern } from './Constants';
import { UfoBossBase } from './UfoBossBase';


export class UfoBoss extends UfoBossBase {

	private _ufoBossIdleTexture: Texture = Constants.getRandomTexture(ConstructType.UFO_BOSS_IDLE);
	private _ufoBossWinTexture: Texture = Constants.getRandomTexture(ConstructType.UFO_BOSS_WIN);
	private _ufoBossHitTexture: Texture = Constants.getRandomTexture(ConstructType.UFO_BOSS_HIT);

	private readonly _grace: number = 7;
	private readonly _lag: number = 125;

	private _changeMovementPatternDelay: number = 0;

	private _hitStanceDelay: number = 0;
	private readonly _hitStanceDelayDefault: number = 1.5;

	private _winStanceDelay: number = 0;
	private readonly _winStanceDelayDefault: number = 8;

	private _movementDirection: MovementDirection = MovementDirection.None;

	private ufoBossStance: BossStance = BossStance.Idle;
	public movementPattern: UfoBossMovementPattern = UfoBossMovementPattern.ISOMETRIC_SQUARE;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.ufoBossStance = BossStance.Idle;
		this.setTexture(this._ufoBossIdleTexture);
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	randomizeMovementPattern() {
		this._changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this._movementDirection = MovementDirection.None;
		this.movementPattern = Constants.getRandomNumber(0, 5);
	}

	setHitStance() {
		if (this.ufoBossStance != BossStance.Win) {
			this.ufoBossStance = BossStance.Hit;

			this.setTexture(this._ufoBossHitTexture);

			this._hitStanceDelay = this._hitStanceDelayDefault;
		}
	}

	setWinStance() {
		this.ufoBossStance = BossStance.Win;
		this.setTexture(this._ufoBossWinTexture);
		this._winStanceDelay = this._winStanceDelayDefault;
	}

	setIdleStance() {
		this.ufoBossStance = BossStance.Idle;
		this.setTexture(this._ufoBossIdleTexture);
	}

	depleteWinStance() {
		if (this._winStanceDelay > 0) {
			this._winStanceDelay -= 0.1;

			if (this._winStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteHitStance() {
		if (this._hitStanceDelay > 0) {
			this._hitStanceDelay -= 0.1;

			if (this._hitStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	seekPlayer(playerPoint: Rectangle) {
		this._changeMovementPatternDelay -= 0.1;

		if (this._changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
		}

		let left = this.getLeft();
		let top = this.getTop();

		let playerMiddleX = left + this.width / 2;
		let playerMiddleY = top + this.height / 2;

		// move up
		if (playerPoint.y < playerMiddleY - this._grace) {
			var distance = Math.abs(playerPoint.y - playerMiddleY);
			let speed = this.getFlightSpeed(distance);

			this.y = (top - speed);
		}

		// move left
		if (playerPoint.x < playerMiddleX - this._grace) {
			var distance = Math.abs(playerPoint.x - playerMiddleX);
			let speed = this.getFlightSpeed(distance);

			this.x = (left - speed);
		}

		// move down
		if (playerPoint.y > playerMiddleY + this._grace) {
			var distance = Math.abs(playerPoint.y - playerMiddleY);
			let speed = this.getFlightSpeed(distance);

			this.y = (top + speed);
		}

		// move right
		if (playerPoint.x > playerMiddleX + this._grace) {
			var distance = Math.abs(playerPoint.x - playerMiddleX);
			let speed = this.getFlightSpeed(distance);

			this.x = (left + speed);
		}
	}

	getFlightSpeed(distance: number) {
		var flightSpeed = distance / this._lag;
		return flightSpeed;
	}

	moveInIsometricSquares(sceneWidth: number, sceneHeight: number) {
		this._changeMovementPatternDelay -= 0.1;

		if (this._changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this._movementDirection == MovementDirection.None) {
			this._movementDirection = MovementDirection.UpRight;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this._movementDirection == MovementDirection.UpRight) {
				this.moveUpRight();

				if (this.getTop() < 0) {
					this._movementDirection = MovementDirection.DownRight;
				}
			}
			else {
				if (this._movementDirection == MovementDirection.DownRight) {
					this.moveDownRight();

					if (this.getRight() > sceneWidth || this.getBottom() > sceneHeight) {
						this._movementDirection = MovementDirection.DownLeft;
					}
				}
				else {
					if (this._movementDirection == MovementDirection.DownLeft) {
						this.moveDownLeft();

						if (this.getLeft() < 0 || this.getBottom() > sceneHeight) {
							this._movementDirection = MovementDirection.UpLeft;
						}
					}
					else {
						if (this._movementDirection == MovementDirection.UpLeft) {
							this.moveUpLeft();

							if (this.getTop() < 0 || this.getLeft() < 0) {
								this._movementDirection = MovementDirection.UpRight;
							}
						}
					}
				}
			}
		}

		return false;
	}
}
