import { Constants, ConstructType, PlayerHonkBombTemplate, SoundType } from './Constants';
import { GameObject } from './GameObject';
import { SoundManager } from './SoundManager';


export class PlayerHonkBomb extends GameObject {

	private playerHonkBombTemplate: PlayerHonkBombTemplate = PlayerHonkBombTemplate.Cracker;
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

		SoundManager.play(SoundType.CRACKER_DROP, 0.5);
	}

	reposition(source: GameObject) {
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
				break;
			}
			case PlayerHonkBombTemplate.TrashCan: {
				this.playerHonkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_HONK_BOMB && x.uri.includes("trash")).map(x => x.uri);
				break;
			}
			default: break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.playerHonkBombUris));
	}

	depleteBlastDelay(): boolean {

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
		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);

		switch (this.playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.Cracker: {
				this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));
				break;
			}
			case PlayerHonkBombTemplate.TrashCan: {
				this.setTexture(Constants.getRandomTexture(ConstructType.BANG));
				break;
			}
			default: break;
		}
	}
}
