import { Constants, ConstructType, PlayerHonkBombTemplate } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class Explosion extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
	}

	reset(playerHonkBombTemplate: PlayerHonkBombTemplate) {
		this.alpha = 1.0;
		switch (playerHonkBombTemplate) {
			case PlayerHonkBombTemplate.Cracker: { this.setTexture(Constants.getRandomTexture(ConstructType.BLAST)); } break;
			case PlayerHonkBombTemplate.TrashCan: { this.setTexture(Constants.getRandomTexture(ConstructType.BANG)); } break;
			default:
		}		
	}

	reposition(source: GameObjectContainer) {		
		this.x = source.x;
		this.y = source.y;
	}
}
