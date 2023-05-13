import { Constants, TextureType, SoundType } from '../Constants';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { SoundManager } from '../managers/SoundManager';


export class UfoEnemyAirBomb extends GameObjectContainer {

	private autoBlastDelay: number = 0;
	private readonly autoBlastDelayDefault: number = 12;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 3;
		this.scale.set(1);
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTexture(TextureType.UFO_ENEMY_AIR_BOMB));
		this.autoBlastDelay = this.autoBlastDelayDefault;
		SoundManager.play(SoundType.ORB_LAUNCH, 0.4);
	}

	reposition(source: GameObjectContainer) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}

	setBlast() {
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;
		this.isBlasting = true;
		SoundManager.play(SoundType.AIR_BOMB_BLAST);
	}

	autoBlast() {
		this.autoBlastDelay -= 0.1;

		if (this.autoBlastDelay <= 0)
			return true;

		return false;
	}
}
