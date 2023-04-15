import { Sprite, Texture } from 'pixi.js';
import { ConstructType } from './Constants';

export class GameObject extends Sprite {

	public isAnimating: boolean = false;
	public ConstructType: ConstructType = 0;	

	constructor(texture: Texture, constructType: ConstructType) {
		super();
		this.texture = texture;
		this.ConstructType = constructType;
	}

	setContent(texture: Texture) {
		this.texture = texture;
	}
}
