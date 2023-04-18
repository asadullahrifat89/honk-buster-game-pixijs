import { Constants, ConstructType, PlayerHonkBombTemplate } from './Constants';
import { GameObject } from './GameObject';


export class PlayerHonkBomb extends GameObject {

	public isBlasting: boolean = false;

	private honkBombTemplate: PlayerHonkBombTemplate = PlayerHonkBombTemplate.Cracker;
	private honkBombUris: string[] = [];

	//#region Ctor
	constructor(speed: number) {
		super(speed);
	}

	//#endregion
	reset() {
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTextureFromUris(this.honkBombUris));
		this.alpha = 1;
		this.scale.set(1);
		this.angle = 0;
	}

	reposition(source: GameObject) {
		this.setPosition(source.x + source.width / 2 - this.width / 2, source.y + source.height - 35);
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
