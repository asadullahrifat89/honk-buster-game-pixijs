﻿import { Constants, ConstructType } from './Constants';
import { GameObject } from './GameObject';


export class UfoBossRocket extends GameObject {

	private _autoBlastDelay: number = 0;
	private readonly _autoBlastDelayDefault: number = 9;

	constructor(speed: number) {
		super(speed);
	}

	reset() {
		this.alpha = 1;
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED + 2;
		this.scale.set(1);
		this.isBlasting = false;
		this.setTexture(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET));

		this.awaitMoveDownLeft = false;
		this.awaitMoveUpRight = false;

		this.awaitMoveUpLeft = false;
		this.awaitMoveDownRight = false;

		this._autoBlastDelay = this._autoBlastDelayDefault;
	}

	reposition(source: GameObject) {
		this.setPosition(source.getLeft() + 15 - this.width / 2, source.getTop() + this.height + 15);
	}

	setBlast() {
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED - 1;

		this.scale.set(Constants.DEFAULT_BLAST_SHRINK_SCALE);
		this.angle = 0;

		this.setTexture(Constants.getRandomTexture(ConstructType.BLAST));

		this.isBlasting = true;
	}

	autoBlast() {
		this._autoBlastDelay -= 0.1;

		if (this._autoBlastDelay <= 0)
			return true;

		return false;
	}
}

