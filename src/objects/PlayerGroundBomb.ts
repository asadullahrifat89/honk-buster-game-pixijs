import { Constants, ConstructType, PlayerGroundBombTemplate, PlayerRideTemplate, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';
import { PlayerRide } from './PlayerRide';


export class PlayerGroundBomb extends GameObjectContainer {

	public playerGroundBombTemplate: PlayerGroundBombTemplate = PlayerGroundBombTemplate.GRENADE;

	private playerGroundBombUris: string[] = [];
	private playerGroundBombBlastUris: string[] = [];

	private blastDelay: number = 0;
	private blastDelayDefault: number = 25;

	private dropOnGroundDelay: number = 0;
	private readonly dropDelayDefault: number = 25;

	private uriIndex: number = 0;

	constructor(speed: number) {
		super(speed);
		this.gravitatesDown = true;
	}

	setTemplate(honkBombTemplate: PlayerGroundBombTemplate) {
		this.playerGroundBombTemplate = honkBombTemplate;

		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.GRENADE: {
				this.playerGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_GROUND_BOMB && x.tag == PlayerGroundBombTemplate.GRENADE).map(x => x.uri);
				this.playerGroundBombBlastUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.GRENADE_BLAST && x.tag == PlayerGroundBombTemplate.GRENADE).map(x => x.uri);
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				this.playerGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_GROUND_BOMB && x.tag == PlayerGroundBombTemplate.TRASH_BIN).map(x => x.uri);
				this.playerGroundBombBlastUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.TRASH_BIN_BLAST && x.tag == PlayerGroundBombTemplate.TRASH_BIN).map(x => x.uri);
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				this.playerGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_GROUND_BOMB && x.tag == PlayerGroundBombTemplate.DYNAMITE).map(x => x.uri);
				this.blastDelayDefault = 45;
			} break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.playerGroundBombUris));
	}

	reset() {
		this.isBlasting = false;

		this.uriIndex = Constants.getRandomNumber(0, this.playerGroundBombUris.length - 1);
		this.setTexture(Constants.getTextureFromUri(this.playerGroundBombUris[this.uriIndex]));

		this.alpha = 1;
		this.scale.set(1);

		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.GRENADE: {
				this.angle = -45;
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				this.angle = 0;
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				this.angle = 0;// Constants.getRandomNumber(33, 213);
			} break;
		}

		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 3.2;
		this.isDroppedOnGround = false;

		this.awaitMoveDownLeft = false;
		this.awaitMoveDownRight = false;
		this.awaitMoveUpLeft = false;
		this.awaitMoveUpRight = false;

		this.blastDelay = this.blastDelayDefault;
		this.dropOnGroundDelay = this.dropDelayDefault;

		SoundManager.play(SoundType.GROUND_BOMB_DROP, 0.5);
	}

	reposition(source: PlayerRide) {
		switch (source.playerRideTemplate) {
			case PlayerRideTemplate.AIR_BALLOON: {
				this.setPosition(source.getLeft(), source.getTop() + 95);
			} break;
			case PlayerRideTemplate.CHOPPER: {
				this.setPosition(source.getLeft(), source.getTop() + 70);
			} break;
			default:
		}
	}

	move() {
		this.setPosition(this.x + this.speed, this.y + this.speed * 1.5);
	}

	awaitBlast(): boolean {
		this.blastDelay--;

		if (this.blastDelay <= 0) {

			this.setBlast();

			return true;
		}

		return false;
	}

	awaitToDropOnGround(): boolean {
		this.dropOnGroundDelay--;

		if (this.dropOnGroundDelay <= 0) {
			this.setDropOnGround();
			this.isDroppedOnGround = true;
			return true;
		}

		return false;
	}

	private setDropOnGround() {
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;
	}

	setBlast() {
		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.GRENADE: {
				SoundManager.play(SoundType.GROUND_BOMB_BLAST, 0.8);
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				SoundManager.play(SoundType.TRASH_BIN_BLAST);
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				SoundManager.play(SoundType.GROUND_BOMB_BLAST, 0.8);
			} break;
			default: break;
		}

		this.isBlasting = true;

		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.GRENADE: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 2;
				this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
				this.setTexture(Constants.getTextureFromUri(this.playerGroundBombBlastUris[this.uriIndex]));
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 1.5;
				this.setTexture(Constants.getTextureFromUri(this.playerGroundBombBlastUris[this.uriIndex]));
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 3;
				//this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
			} break;
			default: break;
		}
	}
}
