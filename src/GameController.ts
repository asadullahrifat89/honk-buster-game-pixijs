import { Container, Texture } from 'pixi.js';
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
	//public direction: Direction = Direction.NONE;

	constructor() {
		super();

		this.interactive = true;
		this.keyboard.events.on('pressed', null, () => {

			if (this.keyboard.isKeyPressed('Space')) {
				this.isAttacking = true;
			}
		});

		const outerSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick"));
		//outerSprite.x = 0;
		//outerSprite.y = 0;
		outerSprite.height = 278;
		outerSprite.width = 278;

		const innerSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		//innerSprite.x = 0;
		//innerSprite.y = 0;
		innerSprite.height = 132;
		innerSprite.width = 132;

		const joystick = new Joystick({
			outer: outerSprite,
			inner: innerSprite,

			width: 278,
			height: 278,
			outerScale: { x: 0.5, y: 0.5 },
			innerScale: { x: 0.8, y: 0.8 },

			onChange: (data) => {				
				//console.log(data.direction);

				switch (data.direction) {
					case Direction.TOP: { this.isMoveUp = true; this.isMoveDown = false; } break;
					case Direction.BOTTOM: { this.isMoveDown = true; this.isMoveUp = false; } break;
					case Direction.LEFT: { this.isMoveLeft = true; this.isMoveRight = false; } break;
					case Direction.RIGHT: { this.isMoveRight = true; this.isMoveLeft = false; } break;
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
				/*	console.log('start')*/
				this.joystickActivated = true;
			},

			onEnd: () => {
				//console.log('end')
				this.joystickActivated = false;
			},
		});

		joystick.x = SceneManager.width - joystick.width;
		joystick.y = SceneManager.height - joystick.height;
		this.addChild(joystick);
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
