﻿import { Rectangle } from 'pixi.js';
import { Constants } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { AirBombBaseSeekingBall } from './AirBombBaseSeekingBall';
import { SoundManager } from '../managers/SoundManager';
import { TextureType, SoundType } from '../Enums';


export class PlayerAirBombHurlingBall extends AirBombBaseSeekingBall {

	constructor(speed: number) {
		super(speed);
		super.autoBlastDelayDefault = 8;
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(TextureType.PLAYER_AIR_BOMB_HURLING_BALLS));
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
