import { Constants, ConstructType, PlayerAirBombTemplate, SoundType } from '../Constants';
import { PlayerRide } from './PlayerRide';
import { SoundManager } from '../managers/SoundManager';
import { SeekingRocketBase } from './SeekingRocketBase';


export class PlayerAirBomb extends SeekingRocketBase {

	public playerAirBombTemplate: PlayerAirBombTemplate = PlayerAirBombTemplate.GRAVITY_BALL;
	private PlayerAirBombUris: string[] = [];

	constructor(speed: number) {
		super(speed);
	}

	setTemplate(playerAirBombTemplate: PlayerAirBombTemplate) {
		this.playerAirBombTemplate = playerAirBombTemplate;

		switch (this.playerAirBombTemplate) {
			case PlayerAirBombTemplate.GRAVITY_BALL: {
				this.PlayerAirBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_ROCKET && x.tag == PlayerAirBombTemplate.GRAVITY_BALL).map(x => x.uri);
				this.autoBlastDelayDefault = 6;
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				this.PlayerAirBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_ROCKET && x.tag == PlayerAirBombTemplate.MISSILE).map(x => x.uri);
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
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 20; // starts with high speed and slows down
				SoundManager.play(SoundType.BALL_LAUNCH, 0.6);
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				this.speed = 0; // starts with slow speed then gets fast
				SoundManager.play(SoundType.ROCKET_LAUNCH, 0.3);
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

	override accelerate() {
		switch (this.playerAirBombTemplate) {
			case PlayerAirBombTemplate.GRAVITY_BALL: {
				super.decelerate();
			} break;
			case PlayerAirBombTemplate.MISSILE: {
				super.accelerate();
			} break;
			default: break;
		}
	}

	reposition(source: PlayerRide) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}
}
