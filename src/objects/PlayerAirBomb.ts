﻿import { Constants } from '../Constants';
import { PlayerRide } from './PlayerRide';
import { SoundManager } from '../managers/SoundManager';
import { AirBombBaseSeekingBall } from './AirBombBaseSeekingBall';
import { PlayerAirBombTemplate, SoundType, TextureType } from '../Enums';


export class PlayerAirBomb extends AirBombBaseSeekingBall {

	public playerAirBombTemplate: PlayerAirBombTemplate = PlayerAirBombTemplate.GRAVITY_BALL;
	private PlayerAirBombUris: string[] = [];

	constructor(speed: number) {
		super(speed);
	}

	setTemplate(playerAirBombTemplate: PlayerAirBombTemplate) {
		this.playerAirBombTemplate = playerAirBombTemplate;

		switch (this.playerAirBombTemplate) {
			case PlayerAirBombTemplate.GRAVITY_BALL: {
				this.PlayerAirBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.textureType == TextureType.PLAYER_AIR_BOMB && x.tag == PlayerAirBombTemplate.GRAVITY_BALL).map(x => x.uri);
				this.autoBlastDelayDefault = 6;
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				this.PlayerAirBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.textureType == TextureType.PLAYER_AIR_BOMB && x.tag == PlayerAirBombTemplate.MISSILE).map(x => x.uri);
			} break;
			case PlayerAirBombTemplate.BULLET_BALL: {
				this.PlayerAirBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.textureType == TextureType.PLAYER_AIR_BOMB && x.tag == PlayerAirBombTemplate.BULLET_BALL).map(x => x.uri);
				this.autoBlastDelayDefault = 5;
			} break;
			default: break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.PlayerAirBombUris));
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTextureFromUris(this.PlayerAirBombUris));
		this.scale.set(1);

		switch (this.playerAirBombTemplate) {
			case PlayerAirBombTemplate.GRAVITY_BALL: {
				SoundManager.play(SoundType.BALL_LAUNCH, 0.6);
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED * 2.5; // starts with high speed and slows down 30
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				SoundManager.play(SoundType.ROCKET_LAUNCH, 0.3);
				this.speed = 0; // starts with slow speed then gets fast
			} break;
			case PlayerAirBombTemplate.BULLET_BALL: {
				SoundManager.play(SoundType.BULLET_LAUNCH);
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED * 2.2; // constant speed 26.4
			} break;
			default: break;
		}

		this.isBlasting = false;

		this.awaitMoveDownLeft = false;
		this.awaitMoveUpRight = false;

		this.awaitMoveUpLeft = false;
		this.awaitMoveDownRight = false;

		this.autoBlastDelay = this.autoBlastDelayDefault;
	}

	reposition(source: PlayerRide) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}
}
