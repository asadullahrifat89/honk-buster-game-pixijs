import { Sprite, Texture } from 'pixi.js';

export class GameObject extends Sprite {

	public isAnimating: boolean = false;

	constructor(texture: Texture) {
		super();
		this.texture = texture;

	}

	setContent(texture: Texture) {
		this.texture = texture;
	}
}
