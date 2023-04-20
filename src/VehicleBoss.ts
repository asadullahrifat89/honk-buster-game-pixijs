import { Texture } from 'pixi.js';
import { Constants, ConstructType, MovementDirection } from './Constants';
import { VehicleBossBase } from './VehicleBossBase';


export class VehicleBoss extends VehicleBossBase {

    private _movementDirection: MovementDirection = MovementDirection.None;
    private _changeMovementPatternDelay: number = 0;

    constructor(speed: number) {
        super(speed);

        var vehicleType = Constants.getRandomNumber(0, 1);

        let uri: string = "";
        switch (vehicleType) {
            case 0: {
                uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);
                break;
            }
            case 1: {
                uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);
                break;
            }
            default: break;
        }

        const texture = Texture.from(uri);
        this.setTexture(texture);
    }

    override reset() {
        super.reset();

        this.setHonkDelay();
        this.scale.set(1);
        this.randomizeMovementPattern();
    }

    randomizeMovementPattern() {
        this.speed = Constants.getRandomNumber(Constants.DEFAULT_CONSTRUCT_SPEED, Constants.DEFAULT_CONSTRUCT_SPEED + 2);
        this._changeMovementPatternDelay = Constants.getRandomNumber(40, 60);
        this._movementDirection = MovementDirection.None;
    }

    move(
        sceneWidth: number,
        sceneHeight: number) {
        this.moveUpLeftDownRight(sceneWidth, sceneHeight);
    }

    moveUpLeftDownRight(sceneWidth: number, sceneHeight: number) {

        this._changeMovementPatternDelay -= 0.1;

        if (this._changeMovementPatternDelay < 0) {
            this.randomizeMovementPattern();
            return true;
        }

        if (this.isAttacking && this._movementDirection == MovementDirection.None) {
            this._movementDirection = MovementDirection.UpLeft;
        }
        else {
            this.isAttacking = true;
        }

        if (this.isAttacking) {
            if (this._movementDirection == MovementDirection.UpLeft) {
                this.moveUpLeft();

                if (this.getBottom() < 0 || this.getRight() < 0) {
                    this.reposition();
                    this._movementDirection = MovementDirection.DownRight;
                }
            }
            else {
                if (this._movementDirection == MovementDirection.DownRight) {
                    this.moveDownRight();

                    if (this.getLeft() > sceneWidth || this.getTop() > sceneHeight) {
                        this._movementDirection = MovementDirection.UpLeft;
                    }
                }
            }
        }

        return false;
    }
}
