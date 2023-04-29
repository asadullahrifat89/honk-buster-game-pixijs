import { Constants, ConstructType } from './Constants';
import { GameObject } from './GameObject';


export class RoadSideWalk extends GameObject {

    constructor(speed: number) {
        super(speed);
    }

    reset() {
        this.setTexture(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_TOP));
    }
}
