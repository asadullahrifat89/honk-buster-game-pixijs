import { Container, Rectangle, Texture } from 'pixi.js';
import { Constants } from '../Constants';
import { RotationDirection } from '../Enums';
import { GameObjectSprite } from './GameObjectSprite';

export class GameObjectContainer extends Container {

	//#region Properties

	private isPoppingComplete: boolean = false;
	private readonly popUpScalingLimit: number = 1.5;

	private hoverDelay: number = 0;
	private hoverDelayDefault: number = 28;
	private hoverSpeed: number = 0.3;
	private hopAngle: number = 0;

	private hopDelay: number = 0;
	private readonly hopDelayDefault: number = 10;
	private hopSpeed: number = 7;
	private hopIntensity: number = 7;

	private dillyDallyDelay: number = 0;
	private dillyDallyDelayDefault: number = 55;
	private dillyDallySpeed: number = 0.2;

	public expandSpeed: number = 0.07;

	public isAnimating: boolean = false;
	public speed: number = Constants.DEFAULT_CONSTRUCT_SPEED;
	public health: number = 100;
	public hitPoint: number = 5;

	public isAwaitingPop: boolean = false;
	public isAwaitingHop: boolean = false;
	public isBlasting: boolean = false;
	public isDroppedOnGround: boolean = false;

	public awaitMoveUp: boolean = false;
	public awaitMoveDown: boolean = false;
	public awaitMoveLeft: boolean = false;
	public awaitMoveRight: boolean = false;
	public awaitMoveUpRight: boolean = false;
	public awaitMoveDownLeft: boolean = false;
	public awaitMoveUpLeft: boolean = false;
	public awaitMoveDownRight: boolean = false;

	public castShadowDistance: number = Constants.DEFAULT_DROP_SHADOW_DISTANCE;
	public gravitatesUp: boolean = false;
	public gravitatesDown: boolean = false;

	private readonly distantBoundsXplier = 1.2;
	//private readonly closeBoundsDivider = 4;

	//#endregion

	//#region Methods

	constructor(speed: number = 0) {
		super();
		this.speed = speed;
		this.cullable = true;
	}

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
		//this.x = -1500;
		//this.y = -1500;
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

	getFirstSprite(): GameObjectSprite {
		return this.children[0] as GameObjectSprite;
	}

	getSpriteAt(index: number): GameObjectSprite {
		return this.children[index] as GameObjectSprite;
	}

	setTexture(texture: Texture) {
		let child = this.getFirstSprite();

		if (child) {
			child.setTexture(texture);
		}
		else {
			let sprite = new GameObjectSprite(texture);
			sprite.x = 0;
			sprite.y = 0;
			sprite.height = this.height;
			sprite.width = this.width;
			sprite.anchor.set(0.5, 0.5);
			this.addChild(sprite);
		}
	}

	addTexture(texture: Texture) {
		let sprite = new GameObjectSprite(texture);
		sprite.x = 0;
		sprite.y = 0;
		sprite.height = this.height;
		sprite.width = this.width;
		sprite.anchor.set(0.5, 0.5);
		this.addChild(sprite);
	}

	expand() {
		this.scale.x += this.expandSpeed;
		this.scale.y += this.expandSpeed;
	}

	shrink() {
		if (this.scale.x > 0)
			this.scale.x -= this.expandSpeed;

		if (this.scale.y > 0)
			this.scale.y -= this.expandSpeed;
	}

	setPopping() {
		if (!this.isAwaitingPop) {
			this.scale.set(1);
			this.isPoppingComplete = false;
			this.isAwaitingPop = true;
		}
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

	setHoverSpeed(speed: number) {
		this.hoverSpeed = speed;
	}

	setHoverIntensity(intensity: number) {
		this.hoverDelayDefault = intensity;
		this.hoverDelay = this.hoverDelayDefault;
	}

	hover() {
		if (this.hoverSpeed > 0) {
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
	}

	setHoppingIntensity(intensity: number) {
		this.hopIntensity = intensity;
	}

	setHopping() {
		if (!this.isAwaitingHop) {

			this.isAwaitingHop = true;
			this.hopDelay = this.hopDelayDefault;

			this.hopSpeed = this.hopIntensity;

			let draw = Constants.getRandomNumber(0, 1);
			this.hopAngle = draw == 0 ? -0.5 : 0.5;
		}
	}

	hop() {
		if (this.isAwaitingHop) {

			this.hopDelay--;

			if (this.hopDelay >= 0) {
				this.y -= this.hopSpeed;
				this.angle -= this.hopAngle;

				if (this.hopSpeed > 0)
					this.hopSpeed -= 0.1; // decrease speed
			}
			else {
				this.y += this.hopSpeed;
				this.angle += this.hopAngle;

				if (this.hopSpeed <= this.hopIntensity)
					this.hopSpeed += 0.2;

				if (this.hopDelay <= this.hopDelayDefault * -1) {
					this.hopDelay = this.hopDelayDefault;
					this.isAwaitingHop = false;
				}
			}
		}
	}

	setDillyDallySpeed(speed: number) {
		this.dillyDallySpeed = speed;
	}

	dillyDally() {
		if (this.dillyDallySpeed > 0) {
			this.dillyDallyDelay--;

			if (this.dillyDallyDelay >= 0) {
				this.x = (this.x + this.dillyDallySpeed);
			}
			else {
				this.x = (this.x - this.dillyDallySpeed);

				if (this.dillyDallyDelay <= this.dillyDallyDelayDefault * -1) {
					this.dillyDallyDelay = this.dillyDallyDelayDefault;
				}
			}
		}
	}

	fade() {
		this.alpha -= 0.02;
	}

	hasFaded(): boolean {
		return this.alpha <= 0.0;
	}

	hasShrinked(): boolean {
		return this.scale.x <= 0 || this.scale.y <= 0;
	}

	setRotation(angle: number) {
		this.angle = angle;
	}

	rotate(rotationDirection: RotationDirection = RotationDirection.Forward, threadhold: number = 0, rotationSpeed: number = 0.1) {

		switch (rotationDirection) {
			case RotationDirection.Forward:
				{
					if (threadhold == 0) {
						this.angle += rotationSpeed;
					}
					else {
						if (this.angle <= threadhold)
							this.angle += rotationSpeed;
					}
				}
				break;
			case RotationDirection.Backward:
				{
					if (threadhold == 0) {
						this.angle -= rotationSpeed;
					}
					else {
						if (this.angle >= threadhold * -1)
							this.angle -= rotationSpeed;
					}

				}
				break;
		}
	}

	unRotate(rotationSpeed: number = 0.1) {
		if (this.angle != 0) {
			if (this.angle < 0) {
				this.angle += rotationSpeed;
				return;
			}

			if (this.angle > 0) {
				this.angle -= rotationSpeed;
			}
		}
	}

	getCloseBounds(): Rectangle {
		let bounds = this.getBounds(true);
		//return new Rectangle(
		//	bounds.left + (this.width / this.closeBoundsDivider),
		//	bounds.top + (this.height / this.closeBoundsDivider),
		//	bounds.right - (this.width / this.closeBoundsDivider),
		//	bounds.bottom - (this.height / this.closeBoundsDivider));
		return bounds;
	}

	getDistantBounds(): Rectangle {
		let bounds = this.getBounds(true);
		return new Rectangle(
			bounds.left - (this.width * this.distantBoundsXplier),
			bounds.top - (this.height * this.distantBoundsXplier),
			bounds.right + (this.width * this.distantBoundsXplier),
			bounds.bottom + (this.height * this.distantBoundsXplier));
	}

	//#endregion
}

