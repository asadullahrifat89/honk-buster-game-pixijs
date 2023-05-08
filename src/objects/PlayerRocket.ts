import { Constants, ConstructType, PlayerAirBombTemplate, SoundType } from '../Constants';
import { PlayerRide } from './PlayerRide';
import { SoundManager } from '../managers/SoundManager';
import { RocketBase } from './RocketBase';


export class PlayerRocket extends RocketBase {

	public playerRocketTemplate: PlayerAirBombTemplate = PlayerAirBombTemplate.BALL;
	private playerRocketUris: string[] = [];

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTextureFromUris(this.playerRocketUris));
		this.scale.set(1);

		switch (this.playerRocketTemplate) {
			case PlayerAirBombTemplate.BALL: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 20; // starts with high speed and slows down
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
				this.autoBlastDelayDefault = 6;
			} break;
			case PlayerAirBombTemplate.ROCKET: {
				this.playerRocketUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_ROCKET && x.tag == PlayerAirBombTemplate.ROCKET).map(x => x.uri);
			} break;
			default: break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.playerRocketUris));
	}

	override accelerate() {
		switch (this.playerRocketTemplate) {
			case PlayerAirBombTemplate.BALL: {
				super.decelerate();
			} break;
			case PlayerAirBombTemplate.ROCKET: {
				super.accelerate();
			} break;
			default: break;
		}
	}

	reposition(source: PlayerRide) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}
}
