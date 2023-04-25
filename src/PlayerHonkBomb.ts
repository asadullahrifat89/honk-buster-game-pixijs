import { Constants, ConstructType, PlayerHonkBombTemplate } from './Constants';
import { GameObject } from './GameObject';


export class PlayerHonkBomb extends GameObject {

	private honkBombTemplate: PlayerHonkBombTemplate = PlayerHonkBombTemplate.Cracker;
	private honkBombUris: string[] = [];
	private blastDelay: number = 0;
	private readonly blastDelayDefault: number = 25;

	constructor(speed: number) {
		super(speed);
		this.gravitatesDown = true;
	}

	reset() {
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTextureFromUris(this.honkBombUris));
		this.alpha = 1;
		this.scale.set(1);
		this.angle = 0;
		this.blastDelay = this.blastDelayDefault;
	}

	reposition(source: GameObject) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 40);
	}

	move() {
		this.setPosition(this.x + this.speed, this.y + this.speed * 1.5);
	}

	setHonkBombTemplate(honkBombTemplate: PlayerHonkBombTemplate) {
		this.honkBombTemplate = honkBombTemplate;

		switch (this.honkBombTemplate) {
			case PlayerHonkBombTemplate.Cracker: {
				this.honkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == ConstructType.PLAYER_HONK_BOMB && x.Uri.includes("cracker")).map(x => x.Uri);
				break;
			}
			case PlayerHonkBombTemplate.TrashCan: {
				this.honkBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == ConstructType.PLAYER_HONK_BOMB && x.Uri.includes("trash")).map(x => x.Uri);
				break;
			}
			default: break;
		}

		this.setTexture(Constants.getRandomTextureFromUris(this.honkBombUris));
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
		this.isBlasting = true;
		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);

		switch (this.honkBombTemplate) {
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
