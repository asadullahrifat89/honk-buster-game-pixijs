import { Sprite, Texture } from 'pixi.js';
import { ConstructType } from './Constants';

export class GameObjectSprite extends Sprite {

	public isAnimating: boolean = false;
	public speed: number = 3;
	public ConstructType: ConstructType = 0;

	constructor(texture: Texture, constructType: ConstructType, speed: number) {
		super();
		this.texture = texture;
		this.ConstructType = constructType;
		this.speed = speed;
	}

	setTexture(texture: Texture) {
		this.texture = texture;
	}

	moveOutOfSight() {
		this.x = -1500;
		this.y = -1500;
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
