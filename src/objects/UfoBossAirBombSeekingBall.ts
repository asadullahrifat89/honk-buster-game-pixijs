import { Constants, ConstructType, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SeekingRocketBase } from './SeekingRocketBase';
import { SoundManager } from '../managers/SoundManager';


export class UfoBossAirBombSeekingBall extends SeekingRocketBase {

	constructor(speed: number) {
		super(speed);
		super.autoBlastDelayDefault = 25;
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET_SEEKING));
		this.scale.set(1);
		this.angle = 0;
		this.isBlasting = false;
		this.autoBlastDelay = this.autoBlastDelayDefault;

		SoundManager.play(SoundType.SEEKER_ROCKET_LAUNCH, 0.8);
	}

	reposition(source: GameObjectContainer) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}	
}

