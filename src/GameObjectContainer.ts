import { Container } from 'pixi.js';

export class GameObjectContainer extends Container {

	public isAnimating: boolean = false;
	public speed: number = 3;

	constructor(speed: number) {
		super();
		this.speed = speed;
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
