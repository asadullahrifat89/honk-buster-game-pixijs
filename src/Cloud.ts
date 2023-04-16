import { Constants } from './Constants';
import { GameObject } from './GameObject';


export class Cloud extends GameObject {

    constructor(speed: number) {
        super(speed);
    }

    reposition() {
        var topOrLeft = Constants.getRandomNumber(0, 2);

        switch (topOrLeft) {
            case 0: {
                var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;

                this.x = Constants.getRandomNumber(0, xLaneWidth - this.width);
                this.y = this.height * -1;

                break;
            }
            case 1: {
                var yLaneWidth = (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2) / 2;

                this.x = this.width * -1;
                this.y = Constants.getRandomNumber(0, yLaneWidth);

                break;
            }
            default:
                break;
        }
    }
}
