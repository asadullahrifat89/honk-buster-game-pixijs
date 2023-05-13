import { Constants } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { AirBombBaseSeekingBall } from './AirBombBaseSeekingBall';
import { SoundManager } from '../managers/SoundManager';
import { TextureType, SoundType } from '../Enums';


export class UfoBossAirBombSeekingBall extends AirBombBaseSeekingBall {

	constructor(speed: number) {
		super(speed);
		super.autoBlastDelayDefault = 25;
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(TextureType.UFO_BOSS_AIR_BOMB_SEEKING));
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

