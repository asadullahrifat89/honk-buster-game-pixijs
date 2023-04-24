import { Texture } from 'pixi.js';
import { BossStance, Constants, ConstructType, MovementDirection } from './Constants';
import { UfoBossBase } from './UfoBossBase';


export class ZombieBoss extends UfoBossBase {

	private _zombieBossIdleTexture: Texture = Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_IDLE);
	private _zombieBossWinTexture: Texture = Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_WIN);
	private _zombieBossHitTexture: Texture = Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_HIT);

	private _changeMovementPatternDelay: number = 0;

	private _hitStanceDelay: number = 0;
	private readonly _hitStanceDelayDefault: number = 1.5;

	private _winStanceDelay: number = 0;
	private readonly _winStanceDelayDefault: number = 8;

	private _movementDirection: MovementDirection = MovementDirection.None;

	private zombieBossStance: BossStance = BossStance.Idle;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.zombieBossStance = BossStance.Idle;
		this.setTexture(this._zombieBossIdleTexture);
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	randomizeMovementPattern() {
		this._changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this._movementDirection = MovementDirection.None;
		this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED / 2, Constants.DEFAULT_CONSTRUCT_SPEED + 1);
	}

	setHitStance() {
		if (this.zombieBossStance != BossStance.Win) {
			this.zombieBossStance = BossStance.Hit;

			this.setTexture(this._zombieBossHitTexture);

			this._hitStanceDelay = this._hitStanceDelayDefault;
		}
	}

	setWinStance() {
		this.zombieBossStance = BossStance.Win;
		this.setTexture(this._zombieBossWinTexture);
		this._winStanceDelay = this._winStanceDelayDefault;
	}

	setIdleStance() {
		this.zombieBossStance = BossStance.Idle;
		this.setTexture(this._zombieBossIdleTexture);
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

	moveUpRightDownLeft(sceneWidth: number, sceneHeight: number) {
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

				if (this.getTop() < 0 || this.getLeft() > sceneWidth) {
					this._movementDirection = MovementDirection.DownLeft;
				}
			}
			else {
				if (this._movementDirection == MovementDirection.DownLeft) {
					this.moveDownLeft();

					if (this.getLeft() < 0 || this.getBottom() > sceneHeight) {
						this._movementDirection = MovementDirection.UpRight;
					}
				}
			}
		}

		return false;
	}
}
