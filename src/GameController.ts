import { Container, Texture } from 'pixi.js';
import { Button } from './Button';
import { GameObjectSprite } from './GameObjectSprite';
import { Direction, Joystick } from './Joystick';
import { SceneManager } from './SceneManager';


export class GameController extends Container {

	private keyboard: any = require('pixi.js-keyboard');

	public isMoveUp: boolean = false;
	public isMoveDown: boolean = false;
	public isMoveLeft: boolean = false;
	public isMoveRight: boolean = false;
	public isAttacking: boolean = false;

	private joystickActivated: boolean = false;
	public power: number = 1;

	constructor() {
		super();

		this.interactive = true;
		this.keyboard.events.on('pressed', null, () => {

			if (this.keyboard.isKeyPressed('Space')) {
				this.isAttacking = true;
			}
		});

		const outerSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick"));
		outerSprite.height = 278;
		outerSprite.width = 278;

		const innerSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		innerSprite.height = 132;
		innerSprite.width = 132;

		const joystick = new Joystick({
			outer: outerSprite,
			inner: innerSprite,

			width: 278,
			height: 278,
			outerScale: { x: 0.6, y: 0.6 },
			innerScale: { x: 0.9, y: 0.9 },

			onChange: (data) => {
				//console.log(data.direction);

				this.power = data.power;

				switch (data.direction) {
					case Direction.TOP: {
						this.isMoveUp = true;
						this.isMoveLeft = false;
						this.isMoveDown = false;
						this.isMoveRight = false;
					} break;
					case Direction.BOTTOM: {
						this.isMoveUp = false;
						this.isMoveLeft = false;
						this.isMoveDown = true;
						this.isMoveRight = false;
					} break;
					case Direction.LEFT: {
						this.isMoveUp = false;
						this.isMoveLeft = true;
						this.isMoveDown = false;
						this.isMoveRight = false;
					} break;
					case Direction.RIGHT: {
						this.isMoveUp = false;
						this.isMoveLeft = false;
						this.isMoveDown = false;
						this.isMoveRight = true;
					} break;
					case Direction.TOP_LEFT: {
						this.isMoveUp = true;
						this.isMoveLeft = true;
						this.isMoveDown = false;
						this.isMoveRight = false;
					} break;
					case Direction.TOP_RIGHT: {
						this.isMoveUp = true;
						this.isMoveLeft = false;
						this.isMoveDown = false;
						this.isMoveRight = true;
					} break;
					case Direction.BOTTOM_LEFT: {
						this.isMoveUp = false;
						this.isMoveLeft = true;
						this.isMoveDown = true;
						this.isMoveRight = false;
					} break;
					case Direction.BOTTOM_RIGHT: {
						this.isMoveUp = false;
						this.isMoveLeft = false;
						this.isMoveDown = true;
						this.isMoveRight = true;
					} break;
					default:
				}
				//console.log(data.power); // Power from 0 to 1
				//console.log(data.angle); // Angle from 0 to 360
			},

			onStart: () => {
				this.joystickActivated = true;
				this.power = 0.1;
			},

			onEnd: () => {
				this.joystickActivated = false;
				this.power = 1;
			},
		});

		joystick.x = SceneManager.width - joystick.width;
		joystick.y = SceneManager.height - joystick.height;
		this.addChild(joystick);

		const attackButtonSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		attackButtonSprite.height = 132;
		attackButtonSprite.width = 132;

		const attackButton = new Button(attackButtonSprite, () => {
			this.isAttacking = true;
		});
		attackButton.scale.set(0.9);
		attackButton.x = attackButton.width / 1.3;
		attackButton.y = SceneManager.height - attackButton.height * 1.7;

		this.addChild(attackButton);
	}

	update() {
		this.keyboard.update();

		if (!this.joystickActivated) {
			if (this.keyboard.isKeyDown('ArrowLeft', 'KeyA')) {
				this.isMoveLeft = true; this.isMoveRight = false;
			}
			else {
				this.isMoveLeft = false;
			}

			if (this.keyboard.isKeyDown('ArrowRight', 'KeyD')) {
				this.isMoveRight = true; this.isMoveLeft = false;
			}
			else {
				this.isMoveRight = false;
			}

			if (this.keyboard.isKeyDown('ArrowUp', 'KeyW')) {
				this.isMoveUp = true; this.isMoveDown = false;
			}
			else {
				this.isMoveUp = false;
			}

			if (this.keyboard.isKeyDown('ArrowDown', 'KeyS')) {
				this.isMoveDown = true; this.isMoveUp = false;
			}
			else {
				this.isMoveDown = false;
			}
		}
	}
}
