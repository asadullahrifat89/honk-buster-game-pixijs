import { Sprite, Texture } from 'pixi.js';

export class GameObjectSprite extends Sprite {

	public isAnimating: boolean = false;

	constructor(texture: Texture) {
		super();
		this.texture = texture;
	}

	setTexture(texture: Texture) {
		this.texture = texture;
	}

	getTexture(): Texture {
		return this.texture;
	}	

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
