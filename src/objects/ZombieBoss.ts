import { Texture } from 'pixi.js';
import { Constants } from '../Constants';
import { TextureType, MovementDirection, BossStance } from '../Enums';
import { UfoBossBase } from './UfoBossBase';


export class ZombieBoss extends UfoBossBase {

	private zombieBossIdleTexture: Texture = Constants.getRandomTexture(TextureType.ZOMBIE_BOSS_IDLE);
	private zombieBossWinTexture: Texture = Constants.getRandomTexture(TextureType.ZOMBIE_BOSS_WIN);
	private zombieBossHitTexture: Texture = Constants.getRandomTexture(TextureType.ZOMBIE_BOSS_HIT);

	private changeMovementPatternDelay: number = 0;

	private hitStanceDelay: number = 0;
	private readonly hitStanceDelayDefault: number = 1.5;

	private winStanceDelay: number = 0;
	private readonly winStanceDelayDefault: number = 8;

	private movementDirection: MovementDirection = MovementDirection.None;

	private zombieBossStance: BossStance = BossStance.Idle;

	constructor(speed: number) {
		super(speed);
	}

	override reset() {
		super.reset();
		this.zombieBossStance = BossStance.Idle;
		this.setTexture(this.zombieBossIdleTexture);
		this.scale.set(1);
		this.randomizeMovementPattern();
	}

	private randomizeMovementPattern() {
		this.changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
		this.movementDirection = MovementDirection.None;
		this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED / 2, Constants.DEFAULT_CONSTRUCT_SPEED + 1);
	}

	setHitStance() {
		if (this.zombieBossStance != BossStance.Win) {
			this.zombieBossStance = BossStance.Hit;

			this.setTexture(this.zombieBossHitTexture);

			this.hitStanceDelay = this.hitStanceDelayDefault;
		}
	}

	setWinStance() {
		this.zombieBossStance = BossStance.Win;
		this.setTexture(this.zombieBossWinTexture);
		this.winStanceDelay = this.winStanceDelayDefault;
	}

	setIdleStance() {
		this.zombieBossStance = BossStance.Idle;
		this.setTexture(this.zombieBossIdleTexture);
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

	moveUpRightDownLeft(sceneWidth: number, sceneHeight: number) {
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
}

