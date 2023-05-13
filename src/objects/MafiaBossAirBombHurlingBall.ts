import { Rectangle } from 'pixi.js';
import { Constants, TextureType, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { AirBombBaseSeekingBall } from './AirBombBaseSeekingBall';
import { SoundManager } from '../managers/SoundManager';


export class MafiaBossAirBombHurlingBall extends AirBombBaseSeekingBall {

	constructor(speed: number) {
		super(speed);
		super.autoBlastDelayDefault = 15;
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(TextureType.MAFIA_BOSS_AIR_BOMB_HURLING_BALLS));
		this.scale.set(1);
		this.angle = 0;
		this.isBlasting = false;
		this.autoBlastDelay = this.autoBlastDelayDefault;
		this.hurlingTarget = new Rectangle();

		SoundManager.play(SoundType.BALL_LAUNCH);
	}

	reposition(source: GameObjectContainer) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height);
	}
}

