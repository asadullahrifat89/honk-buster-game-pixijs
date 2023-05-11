import { Constants, SoundType } from '../Constants';
import { SoundManager } from '../managers/SoundManager';
import { VehicleBase } from './VehicleBase';


export class VehicleBossBase extends VehicleBase {

	public isAttacking: boolean = false;

	private healthLossRecoveryDelay: number = 0;
	private healthLossOpacityEffect: number = 0;	

	reset() {
		this.alpha = 1;
		this.health = 100;
		this.isAttacking = false;
		this.willHonk = true;
		this.filters = null;
		this.isBlasting = false;
	}

	looseHealth() {
		this.health -= this.hitPoint;

		if (this.isDead()) {
			this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;
			this.isAttacking = false;			
		}
		else {
			this.alpha = 0.7;
			this.healthLossRecoveryDelay = 5;
		}
		SoundManager.play(SoundType.DAMAGE_TAKEN);
	}

	recoverFromHealthLoss() {
		if (this.healthLossRecoveryDelay > 0) {
			this.healthLossRecoveryDelay -= 0.1;

			this.healthLossOpacityEffect++; // blinking effect

			if (this.healthLossOpacityEffect > 2) {
				if (this.alpha != 1) {
					this.alpha = 1;
				}
				else {
					this.alpha = 0.4;
				}

				this.healthLossOpacityEffect = 0;
			}
		}

		if (this.healthLossRecoveryDelay <= 0 && this.alpha != 1) {
			this.alpha = 1;
		}
	}
}