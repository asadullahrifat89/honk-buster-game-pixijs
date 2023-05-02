import { Constants, ConstructType, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SceneManager } from '../managers/SceneManager';
import { SoundManager } from '../managers/SoundManager';


export class ZombieBossRocketBlock extends GameObjectContainer {

    private autoBlastDelay: number = 0;
    private readonly autoBlastDelayDefault: number = 9;

    constructor(speed: number) {
        super(speed);
    }

    reset() {

        this.alpha = 1;
        this.scale.set(1);

        this.isBlasting = false;
        this.setTexture(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK));

        this.health = this.hitPoint * Constants.getRandomNumber(0, 2);
        this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 1.5;

        this.autoBlastDelay = this.autoBlastDelayDefault;

        SoundManager.play(SoundType.ORB_LAUNCH, 0.4);
    }

    looseHealth() {
        this.health -= this.hitPoint;

        if (this.isDead()) {
            this.setBlast();
        }
    }

    setBlast() {
        this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;
        // this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE - 0.2);
        // this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));
        this.isBlasting = true;

        SoundManager.play(SoundType.ROCKET_BLAST);
    }

    autoBlast(): boolean {
        this.autoBlastDelay -= 0.1;
        if (this.autoBlastDelay <= 0)
            return true;

        return false;
    }

    reposition() {
        var topOrLeft = Constants.getRandomNumber(0, 1); // generate top and left corner lane wise vehicles
        var lane = SceneManager.height < 450 ? Constants.getRandomNumber(0, 2) : Constants.getRandomNumber(0, 3); // generate number of lanes based on screen height
        var randomY = Constants.getRandomNumber(-10, 10);

        switch (topOrLeft) {
            case 0:
                {
                    var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;

                    switch (lane) {
                        case 0:
                            {
                                this.setPosition(
                                    0 - this.width / 2,
                                    (this.height * -1) + randomY);
                            }
                            break;
                        case 1:
                            {
                                this.setPosition(
                                    (xLaneWidth - this.width / 1.5),
                                    (this.height * -1) + randomY);
                            }
                            break;
                        case 2:
                            {
                                this.setPosition(
                                    (xLaneWidth * 2 - this.width / 1.5),
                                    (this.height * -1) + randomY);
                            }
                            break;
                        case 3:
                            {
                                this.setPosition(
                                    (xLaneWidth * 3 - this.width / 1.5),
                                    (this.height * -1) + randomY);
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 1:
                {
                    var yLaneHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT / 6;

                    switch (lane) {
                        case 0:
                            {
                                this.setPosition(
                                    this.width * -1,
                                    (0 - this.height / 2) + randomY);
                            }
                            break;
                        case 1:
                            {
                                this.setPosition(
                                    this.width * -1,
                                    (yLaneHeight - this.height / 3) + randomY);
                            }
                            break;
                        case 2:
                            {
                                this.setPosition(
                                    this.width * -1,
                                    (yLaneHeight * 2 - this.height / 3) + randomY);
                            }
                            break;
                        case 3:
                            {
                                this.setPosition(
                                    this.width * -1,
                                    (yLaneHeight * 3 - this.height / 3) + randomY);
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    }
}
