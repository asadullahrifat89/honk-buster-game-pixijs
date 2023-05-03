import { Rectangle, Texture } from 'pixi.js';
import { BossStance, Constants, ConstructType, MovementDirection, UfoBossMovementPattern } from '../Constants';
import { UfoBossBase } from './UfoBossBase';


export class UfoBoss extends UfoBossBase {

	private ufoBossIdleTexture: Texture = Constants.getRandomTexture(ConstructType.UFO_BOSS_IDLE);
	private ufoBossWinTexture: Texture = Constants.getRandomTexture(ConstructType.UFO_BOSS_WIN);
	private ufoBossHitTexture: Texture = Constants.getRandomTexture(ConstructType.UFO_BOSS_HIT);

	private changeMovementPatternDelay: number = 0;

	private hitStanceDelay: number = 0;
	private readonly hitStanceDelayDefault: number = 1.5;

	private winStanceDelay: number = 0;
	private readonly winStanceDelayDefault: number = 8;

	private movementDirection: MovementDirection = MovementDirection.None;

	private ufoBossStance: BossStance = BossStance.Idle;
	public movementPattern: UfoBossMovementPattern = UfoBossMovementPattern.ISOMETRIC_SQUARE;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.ufoBossStance = BossStance.Idle;
		this.setTexture(this.ufoBossIdleTexture);
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	private randomizeMovementPattern() {
		this.changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this.movementDirection = MovementDirection.None;
		this.movementPattern = Constants.getRandomNumber(0, 5);
	}

	setHitStance() {
		if (this.ufoBossStance != BossStance.Win) {
			this.ufoBossStance = BossStance.Hit;

			this.setTexture(this.ufoBossHitTexture);

			this.hitStanceDelay = this.hitStanceDelayDefault;
		}
	}

	setWinStance() {
		this.ufoBossStance = BossStance.Win;
		this.setTexture(this.ufoBossWinTexture);
		this.winStanceDelay = this.winStanceDelayDefault;
	}

	setIdleStance() {
		this.ufoBossStance = BossStance.Idle;
		this.setTexture(this.ufoBossIdleTexture);
	}

	depleteWinStance() {
		if (this.winStanceDelay > 0) {
			this.winStanceDelay -= 0.1;

			if (this.winStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteHitStance() {
		if (this.hitStanceDelay > 0) {
			this.hitStanceDelay -= 0.1;

			if (this.hitStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	override seekPlayer(target: Rectangle) {
		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
		}

		super.seekPlayer(target);
	}	

	private moveInIsometricSquares(sceneWidth: number, sceneHeight: number) {
		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this.movementDirection == MovementDirection.None) {
			this.movementDirection = MovementDirection.UpRight;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this.movementDirection == MovementDirection.UpRight) {
				this.moveUpRight();

				if (this.getTop() < 0) {
					this.movementDirection = MovementDirection.DownRight;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.DownRight) {
					this.moveDownRight();

					if (this.getRight() > sceneWidth || this.getBottom() > sceneHeight) {
						this.movementDirection = MovementDirection.DownLeft;
					}
				}
				else {
					if (this.movementDirection == MovementDirection.DownLeft) {
						this.moveDownLeft();

						if (this.getLeft() < 0 || this.getBottom() > sceneHeight) {
							this.movementDirection = MovementDirection.UpLeft;
						}
					}
					else {
						if (this.movementDirection == MovementDirection.UpLeft) {
							this.moveUpLeft();

							if (this.getTop() < 0 || this.getLeft() < 0) {
								this.movementDirection = MovementDirection.UpRight;
							}
						}
					}
				}
			}
		}

		return false;
	}

	private moveUpRightDownLeft(sceneWidth: number, sceneHeight: number) {
		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this.movementDirection == MovementDirection.None) {
			this.movementDirection = MovementDirection.UpRight;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this.movementDirection == MovementDirection.UpRight) {
				this.moveUpRight();

				if (this.getTop() < 0 || this.getLeft() > sceneWidth) {
					this.movementDirection = MovementDirection.DownLeft;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.DownLeft) {
					this.moveDownLeft();

					if (this.getLeft() < 0 || this.getBottom() > sceneHeight) {
						this.movementDirection = MovementDirection.UpRight;
					}
				}
			}
		}

		return false;
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

				if (this.getTop() < 0 || this.getLeft() < 0) {
					this.movementDirection = MovementDirection.DownRight;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.DownRight) {
					this.moveDownRight();

					if (this.getRight() > sceneWidth || this.getBottom() > sceneHeight) {
						this.movementDirection = MovementDirection.UpLeft;
					}
				}
			}
		}

		return false;
	}

	private moveRightLeft(sceneWidth: number) {
		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this.movementDirection == MovementDirection.None) {
			this.movementDirection = MovementDirection.Right;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this.movementDirection == MovementDirection.Right) {
				this.moveRight();

				if (this.getRight() > sceneWidth) {
					this.movementDirection = MovementDirection.Left;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.Left) {
					this.moveLeft();

					if (this.getLeft() < 0) {
						this.movementDirection = MovementDirection.Right;
					}
				}
			}
		}

		return false;
	}

	private moveUpDown(sceneHeight: number) {
		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this.movementDirection == MovementDirection.None) {
			this.movementDirection = MovementDirection.Up;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this.movementDirection == MovementDirection.Up) {
				this.moveUp();

				if (this.getTop() - this.height / 2 < 0) {
					this.movementDirection = MovementDirection.Down;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.Down) {
					this.moveDown();

					if (this.getBottom() > sceneHeight) {
						this.movementDirection = MovementDirection.Up;
					}
				}
			}
		}

		return false;
	}

	move(sceneWidth: number, sceneHeight: number, playerPoint: Rectangle) {
		switch (this.movementPattern) {
			case UfoBossMovementPattern.PLAYER_SEEKING:
				this.seekPlayer(playerPoint);
				break;
			case UfoBossMovementPattern.ISOMETRIC_SQUARE:
				this.moveInIsometricSquares(sceneWidth, sceneHeight);
				break;
			case UfoBossMovementPattern.UPRIGHT_DOWNLEFT:
				this.moveUpRightDownLeft(sceneWidth, sceneHeight);
				break;
			case UfoBossMovementPattern.UPLEFT_DOWNRIGHT:
				this.moveUpLeftDownRight(sceneWidth, sceneHeight);
				break;
			case UfoBossMovementPattern.RIGHT_LEFT:
				this.moveRightLeft(sceneWidth);
				break;
			case UfoBossMovementPattern.UP_DOWN:
				this.moveUpDown(sceneHeight);
				break;
		}
	}
}

