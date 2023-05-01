import { Constants, ConstructType, PlayerHonkBombTemplate, SoundType } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';
import { SoundManager } from './managers/SoundManager';


export class PlayerHonkBomb extends GameObjectContainer {

	public playerHonkBombTemplate: PlayerHonkBombTemplate = PlayerHonkBombTemplate.Cracker;
	private playerHonkBombUris: string[] = [];
	private blastDelay: number = 0;
	private readonly blastDelayDefault: number = 25;

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
		this.speed = 4;

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
			case PlayerHonkBombTemplate.Cracker: {
				this.playerHonkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.uri.includes("cracker")).map(x => x.uri);
			} break;
			case PlayerHonkBombTemplate.TrashCan: {
				this.playerHonkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.uri.includes("trash")).map(x => x.uri);
			} break;
			default: break;
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

	setBlast() {

		switch (this.playerHonkBombTemplate) {
			case 0: { SoundManager.play(SoundType.CRACKER_BLAST, 0.8); } break;
			case 1: { SoundManager.play(SoundType.TRASH_CAN_HIT); } break;
			default: break;
		}

		this.isBlasting = true;

		switch (this.playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.Cracker: {
				this.angle = 0;
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED;
			} break;
			case PlayerHonkBombTemplate.TrashCan: {
				this.speed = Constants.DEFAULT_CONSTRUCT_SPEED / 1.5;
			} break;
			default: break;
		}
	}
}
