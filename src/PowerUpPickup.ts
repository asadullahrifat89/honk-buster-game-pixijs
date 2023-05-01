import { Constants, ConstructType, PowerUpType, SoundType } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';
import { SoundManager } from './managers/SoundManager';


export class PowerUpPickup extends GameObjectContainer {

    public isPickedUp: boolean = false;
    public powerUpType: PowerUpType = PowerUpType.ARMOR;

    constructor(speed: number) {
        super(speed);
    }

    reset() {
        this.isPickedUp = false;
        this.scale.set(1);
        this.powerUpType = Constants.getRandomNumber(0, 1);

        switch (this.powerUpType) {
            case PowerUpType.ARMOR:
                {
                    this.setTexture(Constants.getRandomTexture(ConstructType.POWERUP_PICKUP_ARMOR));
                }
                break;
            case PowerUpType.BULLS_EYE:
                {
                    this.setTexture(Constants.getRandomTexture(ConstructType.POWERUP_PICKUP_BULLS_EYE));
                }
                break;
            default:
                break;
        }
    }

    pickedUp() {
        this.isPickedUp = true;
        SoundManager.play(SoundType.POWERUP_PICKUP);
    }
}
