import { Rectangle, Texture } from 'pixi.js';
import { BossStance, Constants, ConstructType, MafiaBossMovementPattern, MovementDirection } from '../Constants';
import { UfoBossBase } from './UfoBossBase';


export class MafiaBoss extends UfoBossBase {

	private mafiaBossIdleTexture: Texture = Constants.getRandomTexture(ConstructType.MAFIA_BOSS_IDLE);
	private mafiaBossWinTexture: Texture = Constants.getRandomTexture(ConstructType.MAFIA_BOSS_WIN);
	private mafiaBossHitTexture: Texture = Constants.getRandomTexture(ConstructType.MAFIA_BOSS_HIT);

	private changeMovementPatternDelay: number = 0;

	private hitStanceDelay: number = 0;
	private readonly hitStanceDelayDefault: number = 1.5;

	private winStanceDelay: number = 0;
	private readonly winStanceDelayDefault: number = 8;

	private movementDirection: MovementDirection = MovementDirection.None;

	private mafiaBossStance: BossStance = BossStance.Idle;
	private movementPattern: MafiaBossMovementPattern = MafiaBossMovementPattern.PLAYER_SEEKING;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.mafiaBossStance = BossStance.Idle;
		this.setTexture(this.mafiaBossIdleTexture);
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	private randomizeMovementPattern() {
		this.changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this.movementDirection = MovementDirection.None;
		this.movementPattern = Constants.getRandomNumber(0, 3);
	}

	setHitStance() {
		if (this.mafiaBossStance != BossStance.Win) {
			this.mafiaBossStance = BossStance.Hit;

			this.setTexture(this.mafiaBossHitTexture);

			this.hitStanceDelay = this.hitStanceDelayDefault;
		}
	}

	setWinStance() {
		this.mafiaBossStance = BossStance.Win;
		this.setTexture(this.mafiaBossWinTexture);
		this.winStanceDelay = this.winStanceDelayDefault;
	}

	setIdleStance() {
		this.mafiaBossStance = BossStance.Idle;
		this.setTexture(this.mafiaBossIdleTexture);
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

	override follow(target: Rectangle) {
		this.changeMovementPatternDelay -= 0.1;

		if (this.changeMovementPatternDelay < 0) {
			this.randomizeMovementPattern();
		}

		super.follow(target);
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

	private moveInRectangularSquares(sceneWidth: number, sceneHeight: number) {
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

		if (this.movementDirection == MovementDirection.Up) {
			this.moveUp();

			if (this.getTop() - this.height / 2 < 0) {
				this.movementDirection = MovementDirection.Right;
			}
		}
		else {
			if (this.movementDirection == MovementDirection.Right) {
				this.moveRight();

				if (this.getRight() > sceneWidth) {
					this.movementDirection = MovementDirection.Down;
				}
			}
			else {
				if (this.movementDirection == MovementDirection.Down) {
					this.moveDown();

					if (this.getBottom() > sceneHeight) {
						this.movementDirection = MovementDirection.Left;
					}
				}
				else {
					if (this.movementDirection == MovementDirection.Left) {
						this.moveLeft();

						if (this.getLeft() - this.width < 0) {
							this.movementDirection = MovementDirection.Up;
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
				this.follow(playerPoint);
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

