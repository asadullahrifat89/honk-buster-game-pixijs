import { Container } from 'pixi.js';

export class GameObjectContainer extends Container {

	public isAnimating: boolean = false;
	public speed: number = 3;

	constructor(speed: number) {
		super();
		this.speed = speed;
	}
}
