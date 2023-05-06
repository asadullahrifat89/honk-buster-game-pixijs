import { Constants, ConstructType, PlayerGroundBombTemplate, PlayerRideTemplate, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';
import { PlayerRide } from './PlayerRide';


export class PlayerGroundBomb extends GameObjectContainer {

	public playerGroundBombTemplate: PlayerGroundBombTemplate = PlayerGroundBombTemplate.EXPLOSIVE;
	private playerGroundBombUris: string[] = [];

	private blastDelay: number = 0;
	private blastDelayDefault: number = 25;

	private dropDelay: number = 0;
	private readonly dropDelayDefault: number = 25;

	constructor(speed: number) {
		super(speed);
		this.gravitatesDown = true;
	}

	reset() {
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTextureFromUris(this.playerGroundBombUris));
		this.alpha = 1;
		this.scale.set(1);
		this.angle = 0;
		this.blastDelay = this.blastDelayDefault;
		this.dropDelay = this.dropDelayDefault;
		this.speed = 4;
		this.isDropped = false;

		this.awaitMoveDownLeft = false;
		this.awaitMoveDownRight = false;
		this.awaitMoveUpLeft = false;
		this.awaitMoveUpRight = false;

		SoundManager.play(SoundType.CRACKER_DROP, 0.5);
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

	setTemplate(honkBombTemplate: PlayerGroundBombTemplate) {
		this.playerGroundBombTemplate = honkBombTemplate;

		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.EXPLOSIVE: {
				this.playerGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.tag == PlayerGroundBombTemplate.EXPLOSIVE).map(x => x.uri);
			} break;
			case PlayerGroundBombTemplate.TRASH: {
				this.playerGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.tag == PlayerGroundBombTemplate.TRASH).map(x => x.uri);
			} break;
			case PlayerGroundBombTemplate.STICKY: {
				this.playerGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.tag == PlayerGroundBombTemplate.STICKY).map(x => x.uri);
				this.blastDelayDefault = 45;
			} break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.playerGroundBombUris));
	}

	awaitBlast(): boolean {
		this.blastDelay--;

		if (this.blastDelay <= 0) {

			this.setBlast();

			return true;
		}

		return false;
	}

	awaitDrop(): boolean {
		this.dropDelay--;

		if (this.dropDelay <= 0) {

			this.setDrop();
			this.isDropped = true;
			return true;
		}

		return false;
	}

	setDrop() {
		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.STICKY: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;
			} break;
			default: break;
		}
	}

	setBlast() {
		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.EXPLOSIVE: {
				SoundManager.play(SoundType.CRACKER_BLAST, 0.8);
			} break;
			case PlayerGroundBombTemplate.TRASH: {
				SoundManager.play(SoundType.TRASH_CAN_HIT);
			} break;
			case PlayerGroundBombTemplate.STICKY: {
				SoundManager.play(SoundType.CRACKER_BLAST, 0.8);
			} break;
			default: break;
		}

		this.isBlasting = true;

		switch (this.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.EXPLOSIVE: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 2;
				this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
			} break;
			case PlayerGroundBombTemplate.TRASH: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 1.5;
				this.setTexture(Constants.getRandomTexture(ConstructType.TRASH_BIN_OPEN));
			} break;
			case PlayerGroundBombTemplate.STICKY: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 3;
				this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
			} break;
			default: break;
		}
	}
}
