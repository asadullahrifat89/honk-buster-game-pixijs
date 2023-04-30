import { Constants, ConstructType, SoundType } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';
import { PlayerBalloon } from './PlayerBalloon';
import { SoundManager } from './SoundManager';


export class PlayerRocket extends GameObjectContainer {

	private autoBlastDelay: number = 0;
	private readonly autoBlastDelayDefault: number = 8;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.setTexture(Constants.getRandomTexture(ConstructType.PLAYER_ROCKET));
		this.scale.set(1);

		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 2;
		this.isBlasting = false;

		this.awaitMoveDownLeft = false;
		this.awaitMoveUpRight = false;

		this.awaitMoveUpLeft = false;
		this.awaitMoveDownRight = false;

		this.autoBlastDelay = this.autoBlastDelayDefault;

		SoundManager.play(SoundType.ROCKET_LAUNCH, 0.4);
	}

	reposition(source: PlayerBalloon) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}

	setBlast() {

		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		this.angle = 0;

		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;

		this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));

		this.isBlasting = true;

		SoundManager.play(SoundType.ROCKET_BLAST);
	}

	autoBlast() {
		this.autoBlastDelay -= 0.1;

		if (this.autoBlastDelay <= 0)
			return true;

		return false;
	}
}
