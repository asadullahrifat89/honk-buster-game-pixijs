import { Sprite, Texture } from 'pixi.js';
import { ConstructType } from './Constants';

export class GameObject extends Sprite {

	public isAnimating: boolean = false;
	public speed: number = 3;
	public ConstructType: ConstructType = 0;

	constructor(texture: Texture, constructType: ConstructType, speed: number) {
		super();
		this.texture = texture;
		this.ConstructType = constructType;
		this.speed = speed;
	}

	setContent(texture: Texture) {
		this.texture = texture;
	}
}
