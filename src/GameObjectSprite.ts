import { Sprite, Texture } from 'pixi.js';

export class GameObjectSprite extends Sprite {

	public isAnimating: boolean = false;
	public speed: number = 3;

	constructor(texture: Texture, speed: number) {
		super();
		this.texture = texture;
		this.speed = speed;
	}

	setTexture(texture: Texture) {
		this.texture = texture;
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
