import { Container, Texture } from 'pixi.js';
import { GameObjectSprite } from './GameObjectSprite';

export class GameObject extends Container {

	//#region Properties

	private isPoppingComplete: boolean = false;
	private readonly popUpScalingLimit: number = 1.5;

	private hoverDelay: number = 0;
	private readonly hoverDelayDefault: number = 25;
	private readonly hoverSpeed: number = 0.7;

	private dillyDallyDelay: number = 0;
	private readonly dillyDallyDelayDefault: number = 25;
	private readonly dillyDallySpeed: number = 0.9;

	private vibrateDelay: number = 0;
	private readonly vibrateDelayDefault: number = 8;
	private readonly vibrateSpeed: number = 0.3;

	private readonly expandSpeed: number = 0.07;

	public isAnimating: boolean = false;
	public speed: number = 3;
	public health: number = 100;
	public hitPoint: number = 5;

	public isAwaitingPop: boolean = false;
	public isBlasting: boolean = false;

	public awaitMoveUp: boolean = false;
	public awaitMoveDown: boolean = false;
	public awaitMoveLeft: boolean = false;
	public awaitMoveRight: boolean = false;
	public awaitMoveUpRight: boolean = false;
	public awaitMoveDownLeft: boolean = false;
	public awaitMoveUpLeft: boolean = false;
	public awaitMoveDownRight: boolean = false;

	//#endregion

	//#region Ctor

	constructor(speed: number) {
		super();
		this.speed = speed;
	}

	//#endregion

	//#region Methods

	public getTop(): number {
		return this.y;
	}

	public getBottom(): number {
		return this.y + this.height;
	}

	public getLeft(): number {
		return this.x;
	}

	public getRight(): number {
		return this.x + this.width;
	}

	isDead(): boolean {

		return this.health <= 0;
	}

	disableRendering() {
		this.x = -1500;
		this.y = -1500;
		this.renderable = false;
		this.isAnimating = false;
	}

	enableRendering() {
		this.isAnimating = true;
		this.renderable = true;
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

	getGameObjectSprite(): GameObjectSprite {
		return this.children[0] as GameObjectSprite;
	}

	setTexture(texture: Texture) {
		let child = this.getGameObjectSprite();

		if (child)
			child.setTexture(texture);
		else
			this.addChild(new GameObjectSprite(texture));
	}

	setPopping() {

		if (!this.isAwaitingPop) {
			this.scale.set(1);
			this.isPoppingComplete = false;
			this.isAwaitingPop = true;
		}
	}

	expand() {
		this.scale.x += this.expandSpeed;
		this.scale.y += this.expandSpeed;
	}

	shrink() {
		this.scale.x -= this.expandSpeed;
		this.scale.y -= this.expandSpeed;
	}

	pop() {
		if (this.isAwaitingPop) {
			if (!this.isPoppingComplete && this.scale.x < this.popUpScalingLimit)
				this.expand();

			if (this.scale.x >= this.popUpScalingLimit)
				this.isPoppingComplete = true;

			if (this.isPoppingComplete) {
				this.shrink();

				if (this.scale.x <= 1) {
					this.isPoppingComplete = false;
					this.isAwaitingPop = false; // stop popping effect                        
				}
			}
		}
	}

	hover() {
		this.hoverDelay--;

		if (this.hoverDelay >= 0) {
			this.y += this.hoverSpeed;
		}
		else {
			this.y -= this.hoverSpeed;

			if (this.hoverDelay <= this.hoverDelayDefault * -1)
				this.hoverDelay = this.hoverDelayDefault;
		}
	}

	dillyDally() {
		this.dillyDallyDelay--;

		if (this.dillyDallyDelay >= 0) {
			this.x = (this.getLeft() + this.dillyDallySpeed);
		}
		else {
			this.x = (this.getLeft() - this.dillyDallySpeed);

			if (this.dillyDallyDelay <= this.dillyDallyDelayDefault * -1)
				this.dillyDallyDelay = this.dillyDallyDelayDefault;
		}
	}

	vibrate() {
		this.vibrateDelay--;

		if (this.vibrateDelay >= 0) {
			this.y += this.vibrateSpeed;
		}
		else {
			this.y -= this.vibrateSpeed;

			if (this.vibrateDelay <= this.vibrateDelayDefault * -1)
				this.vibrateDelay = this.vibrateDelayDefault;
		}
	}

	fade() {
		this.alpha -= 0.02;
	}

	hasFaded(): boolean {
		return this.alpha <= 0.0;
	}

	//#endregion
}

