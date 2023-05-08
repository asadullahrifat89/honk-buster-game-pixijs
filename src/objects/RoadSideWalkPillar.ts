import { Constants, ConstructType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';


export class RoadSideWalkPillar extends GameObjectContainer {

    constructor(speed: number) {
        super(speed);
    }

    reset() {
        this.setTexture(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_BOTTOM_PILLARS));
    }
}
