import { Rectangle, Texture } from 'pixi.js';
import { BossStance, Constants, ConstructType, MafiaBossMovementPattern, MovementDirection } from './Constants';
import { UfoBossBase } from './UfoBossBase';


export class MafiaBoss extends UfoBossBase {

	private _mafiaBossIdleTexture: Texture = Constants.getRandomTexture(ConstructType.MAFIA_BOSS_IDLE);
	private _mafiaBossWinTexture: Texture = Constants.getRandomTexture(ConstructType.MAFIA_BOSS_WIN);
	private _mafiaBossHitTexture: Texture = Constants.getRandomTexture(ConstructType.MAFIA_BOSS_HIT);

	private _changeMovementPatternDelay: number = 0;

	private _hitStanceDelay: number = 0;
	private readonly _hitStanceDelayDefault: number = 1.5;

	private _winStanceDelay: number = 0;
	private readonly _winStanceDelayDefault: number = 8;

	private _movementDirection: MovementDirection = MovementDirection.None;

	private mafiaBossStance: BossStance = BossStance.Idle;
	private movementPattern: MafiaBossMovementPattern = MafiaBossMovementPattern.PLAYER_SEEKING;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.mafiaBossStance = BossStance.Idle;
		this.setTexture(this._mafiaBossIdleTexture);
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	randomizeMovementPattern() {
		this._changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this._movementDirection = MovementDirection.None;
		this.movementPattern = Constants.getRandomNumber(0, 3);
	}

	setHitStance() {
		if (this.mafiaBossStance != BossStance.Win) {
			this.mafiaBossStance = BossStance.Hit;

			this.setTexture(this._mafiaBossHitTexture);

			this._hitStanceDelay = this._hitStanceDelayDefault;
		}
	}

	setWinStance() {
		this.mafiaBossStance = BossStance.Win;
		this.setTexture(this._mafiaBossWinTexture);
		this._winStanceDelay = this._winStanceDelayDefault;
	}

	setIdleStance() {
		this.mafiaBossStance = BossStance.Idle;
		this.setTexture(this._mafiaBossIdleTexture);
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

	override seekPlayer(target: Rectangle) {
		this._changeMovementPatternDelay -= 0.1;

		if (this._changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
		}

		super.seekPlayer(target);
	}	

	moveRightLeft(sceneWidth: number) {
		this._changeMovementPatternDelay -= 0.1;

		if (this._changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this._movementDirection == MovementDirection.None) {
			this._movementDirection = MovementDirection.Right;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this._movementDirection == MovementDirection.Right) {
				this.moveRight();

				if (this.getRight() > sceneWidth) {
					this._movementDirection = MovementDirection.Left;
				}
			}
			else {
				if (this._movementDirection == MovementDirection.Left) {
					this.moveLeft();

					if (this.getLeft() < 0) {
						this._movementDirection = MovementDirection.Right;
					}
				}
			}
		}

		return false;
	}

	moveUpDown(sceneHeight: number) {
		this._changeMovementPatternDelay -= 0.1;

		if (this._changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this._movementDirection == MovementDirection.None) {
			this._movementDirection = MovementDirection.Up;
		}
		else {
			this.isAttacking = true;
		}

		if (this.isAttacking) {
			if (this._movementDirection == MovementDirection.Up) {
				this.moveUp();

				if (this.getTop() - this.height / 2 < 0) {
					this._movementDirection = MovementDirection.Down;
				}
			}
			else {
				if (this._movementDirection == MovementDirection.Down) {
					this.moveDown();

					if (this.getBottom() > sceneHeight) {
						this._movementDirection = MovementDirection.Up;
					}
				}
			}
		}

		return false;
	}

	moveInRectangularSquares(sceneWidth: number, sceneHeight: number) {
		this._changeMovementPatternDelay -= 0.1;

		if (this._changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
			return true;
		}

		if (this.isAttacking && this._movementDirection == MovementDirection.None) {
			this._movementDirection = MovementDirection.Up;
		}
		else {
			this.isAttacking = true;
		}

		if (this._movementDirection == MovementDirection.Up) {
			this.moveUp();

			if (this.getTop() - this.height / 2 < 0) {
				this._movementDirection = MovementDirection.Right;
			}
		}
		else {
			if (this._movementDirection == MovementDirection.Right) {
				this.moveRight();

				if (this.getRight() > sceneWidth) {
					this._movementDirection = MovementDirection.Down;
				}
			}
			else {
				if (this._movementDirection == MovementDirection.Down) {
					this.moveDown();

					if (this.getBottom() > sceneHeight) {
						this._movementDirection = MovementDirection.Left;
					}
				}
				else {
					if (this._movementDirection == MovementDirection.Left) {
						this.moveLeft();

						if (this.getLeft() - this.width < 0) {
							this._movementDirection = MovementDirection.Up;
						}
					}
				}
			}
		}

		return false;
	}

	move(sceneWidth: number, sceneHeight: number, playerPoint: Rectangle) {
		switch (this.movementPattern) {
			case MafiaBossMovementPattern.PLAYER_SEEKING:
				this.seekPlayer(playerPoint);
				break;
			case MafiaBossMovementPattern.RECTANGULAR_SQUARE:
				this.moveInRectangularSquares(sceneWidth, sceneHeight);
				break;
			case MafiaBossMovementPattern.RIGHT_LEFT:
				this.moveRightLeft(sceneWidth);
				break;
			case MafiaBossMovementPattern.UP_DOWN:
				this.moveUpDown(sceneHeight);
				break;
		}
	}
}

