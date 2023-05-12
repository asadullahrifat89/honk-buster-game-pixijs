import { Constants, ConstructType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SceneManager } from '../managers/SceneManager';


export class Leaf extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.setTexture(Constants.getRandomTexture(ConstructType.LEAF));
		this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED + 2, Constants.DEFAULT_CONSTRUCT_SPEED + 4);
	}

	reposition() {
		//var topOrLeft = Constants.getRandomNumber(0, 2);

		//switch (topOrLeft) {
		//	case 0: {
		//		var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;

		//		this.x = Constants.getRandomNumber(0, xLaneWidth - this.width);
		//		this.y = this.height * -1;

		//	} break;
		//	case 1: {
		//		var yLaneWidth = (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2) / 2;

		//		this.x = this.width * -1;
		//		this.y = Constants.getRandomNumber(0, yLaneWidth);

		//	} break;
		//	default:
		//		break;
		//}

		this.x = Constants.getRandomNumber(this.width * -1, SceneManager.width - this.width);
		this.y = this.height * -1;
	}
}

