import { Constants, ConstructType, PlayerHonkBombTemplate, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';


export class PlayerHonkBomb extends GameObjectContainer {

	public playerHonkBombTemplate: PlayerHonkBombTemplate = PlayerHonkBombTemplate.EXPLOSIVE_BOMB;
	private playerHonkBombUris: string[] = [];

	private blastDelay: number = 0;
	private readonly blastDelayDefault: number = 25;

	private dropDelay: number = 0;
	private readonly dropDelayDefault: number = 25;

	constructor(speed: number) {
		super(speed);
		this.gravitatesDown = true;
	}

	reset() {
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTextureFromUris(this.playerHonkBombUris));
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

	reposition(source: GameObjectContainer) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 40);
	}

	move() {
		this.setPosition(this.x + this.speed, this.y + this.speed * 1.5);
	}

	setHonkBombTemplate(honkBombTemplate: PlayerHonkBombTemplate) {
		this.playerHonkBombTemplate = honkBombTemplate;

		switch (this.playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.EXPLOSIVE_BOMB: {
				this.playerHonkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.uri.includes("explosive")).map(x => x.uri);
			} break;
			case PlayerHonkBombTemplate.TRASH_BOMB: {
				this.playerHonkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.uri.includes("trash")).map(x => x.uri);
			} break;
			case PlayerHonkBombTemplate.STICKY_BOMB: {
				this.playerHonkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.uri.includes("sticky")).map(x => x.uri);
			} break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.playerHonkBombUris));
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
		switch (this.playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.STICKY_BOMB: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;
			} break;
			default: break;
		}
	}

	setBlast() {
		switch (this.playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.EXPLOSIVE_BOMB: { SoundManager.play(SoundType.CRACKER_BLAST, 0.8); } break;
			case PlayerHonkBombTemplate.TRASH_BOMB: { SoundManager.play(SoundType.TRASH_CAN_HIT); } break;
			case PlayerHonkBombTemplate.STICKY_BOMB: { SoundManager.play(SoundType.CRACKER_BLAST, 0.8); } break;
			default: break;
		}

		this.isBlasting = true;

		switch (this.playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.EXPLOSIVE_BOMB: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 2;
			} break;
			case PlayerHonkBombTemplate.TRASH_BOMB: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 2;
			} break;
			case PlayerHonkBombTemplate.STICKY_BOMB: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 3;
			} break;
			default: break;
		}
	}
}
