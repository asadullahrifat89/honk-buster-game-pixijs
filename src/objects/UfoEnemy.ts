import { Constants, ConstructType, RotationDirection, SoundType } from '../Constants';
import { SoundManager } from '../managers/SoundManager';
import { VehicleBase } from './VehicleBase';


export class UfoEnemy extends VehicleBase {

	public isDeflectionComplete: boolean = false;

	private attackDelay: number = 0;
	private destructionDelay: number = 0;
	private destructionDelayDefault: number = 50;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.isDeflectionComplete = false;
		this.health = this.hitPoint * Constants.getRandomNumber(0, 3);
		this.scale.set(1);
		this.alpha = 1;
		this.angle = 0;
		this.willHonk = !!Constants.getRandomNumber(0, 1);
		this.isHonking = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_ENEMY));
		this.speed = Constants.getRandomNumber(2, 4);

		if (this.willHonk) {
			this.setHonkDelay();
		}
	}

	attack(): boolean {
		if (!this.isDead()) {
			this.attackDelay--;

			if (this.attackDelay < 0) {
				this.setAttackDelay();
				return true;
			}
		}

		return false;
	}

	setAttackDelay() {
		this.attackDelay = Constants.getRandomNumber(50, 80);
	}

	looseHealth() {
		this.health -= this.hitPoint;
		SoundManager.play(SoundType.DAMAGE_TAKEN);
	}

	setDestruction() {
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;
		this.destructionDelay = this.destructionDelayDefault;
		this.isDeflectionComplete = false;
	}

	deflect() {
		if (!this.isDeflectionComplete) {
			this.destructionDelay--;

			this.rotate(RotationDirection.Backward, 0, 1);

			if (this.speed > 0) {
				this.speed -= 0.2;
				this.y -= this.speed / 2;
				this.x -= this.speed;
			}

			if (this.destructionDelay <= 0) {
				this.isDeflectionComplete = true;
			}
		}
	}
}
