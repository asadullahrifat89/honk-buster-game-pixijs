import { Constants, ConstructType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SceneManager } from '../managers/SceneManager';


export class Leaf extends GameObjectContainer {

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.angle = 0;
		this.setTexture(Constants.getRandomTexture(ConstructType.LEAF));
		this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED + 3, Constants.DEFAULT_CONSTRUCT_SPEED + 5);
	}

	reposition() {
		this.x = Constants.getRandomNumber(SceneManager.width * -1, SceneManager.width / 2);
		this.y = this.height * -1;
	}
}

