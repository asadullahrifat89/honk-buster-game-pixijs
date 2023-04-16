import { Container, Texture } from 'pixi.js';
import { GameObjectSprite } from './GameObjectSprite';

export class GameObject extends Container {

	public isAnimating: boolean = false;
	public speed: number = 3;
	public health: number = 100;
	public hitPoint: number = 5;

	constructor(speed: number) {
		super();
		this.speed = speed;
	}

	isDead(): boolean {

		return this.health <= 0;
	}

	moveOutOfSight() {
		this.x = -1500;
		this.y = -1500;
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	moveUp() {
		this.y -= this.speed;
	}

	moveDown() {
		this.y += this.speed;
	}

	moveLeft() {
		this.x -= this.speed;
	}

	moveRight() {
		this.x += this.speed;
	}

	moveUpRight() {
		this.x += this.speed;
		this.y -= this.speed / 2;
	}

	moveUpLeft() {
		this.x -= this.speed;
		this.y -= this.speed / 2;
	}

	moveDownLeft() {
		this.x -= this.speed;
		this.y += this.speed / 2;
	}

	moveDownRight() {
		this.x += this.speed;
		this.y += this.speed / 2;
	}

	getFirstChild(): GameObjectSprite {
		return this.children[0] as GameObjectSprite;
	}

	changeTexture(texture: Texture) {
		this.getFirstChild().setTexture(texture);
	}
}

