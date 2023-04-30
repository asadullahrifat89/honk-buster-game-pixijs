import { Constants, ConstructType } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';


export class RoadSideWalk extends GameObjectContainer {

    constructor(speed: number) {
        super(speed);
    }

    reset() {
        this.setTexture(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_TOP));
    }
}
