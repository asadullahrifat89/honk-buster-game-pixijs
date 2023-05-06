﻿import { Constants, ConstructType, PlayerAirBombTemplate, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { PlayerRide } from './PlayerRide';
import { SoundManager } from '../managers/SoundManager';


export class PlayerRocket extends GameObjectContainer {

	public playerRocketTemplate: PlayerAirBombTemplate = PlayerAirBombTemplate.BALL;
	private playerRocketUris: string[] = [];

	private autoBlastDelay: number = 0;
	private readonly autoBlastDelayDefault: number = 8;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTextureFromUris(this.playerRocketUris));
		this.scale.set(1);

		switch (this.playerRocketTemplate) {
			case PlayerAirBombTemplate.BALL: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 9; // starts with high speed and slows down
				SoundManager.play(SoundType.BALL_LAUNCH);
			} break;
			case PlayerAirBombTemplate.ROCKET: {
				this.speed = 0; // starts with slow speed then gets fast
				SoundManager.play(SoundType.ROCKET_LAUNCH, 0.4);
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

	setTemplate(playerRocketTemplate: PlayerAirBombTemplate) {
		this.playerRocketTemplate = playerRocketTemplate;

		switch (this.playerRocketTemplate) {
			case PlayerAirBombTemplate.BALL: {
				this.playerRocketUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_ROCKET && x.tag == PlayerAirBombTemplate.BALL).map(x => x.uri);
			} break;
			case PlayerAirBombTemplate.ROCKET: {
				this.playerRocketUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_ROCKET && x.tag == PlayerAirBombTemplate.ROCKET).map(x => x.uri);
			} break;
			default: break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.playerRocketUris));
	}

	accelerate() {
		switch (this.playerRocketTemplate) {
			case PlayerAirBombTemplate.BALL: {
				if (this.speed > 1)
					this.speed -= 0.5; // balls loose speed with time
			} break;
			case PlayerAirBombTemplate.ROCKET: {
				if (this.speed < Constants.DEFAULT_CONSTRUCT_SPEED + 9)
					this.speed += 0.5; // rockets gain speed with time
			} break;
			default: break;
		}
	}

	reposition(source: PlayerRide) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}

	setBlast() {
		// this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		// this.angle = 0;
		// this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;
		this.isBlasting = true;
		SoundManager.play(SoundType.ROCKET_BLAST);
	}

	autoBlast() {
		this.autoBlastDelay -= 0.1;
		if (this.autoBlastDelay <= 0) {
			return true;
		}
		return false;
	}
}
