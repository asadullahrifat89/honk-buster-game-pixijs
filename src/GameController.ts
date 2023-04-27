import { Container, Sprite } from 'pixi.js';
import { Joystick } from './Joystick';
//import { SceneManager } from './SceneManager';

export class GameController extends Container {

	private keyboard: any = require('pixi.js-keyboard');

	public isMoveUp: boolean = false;
	public isMoveDown: boolean = false;
	public isMoveLeft: boolean = false;
	public isMoveRight: boolean = false;
	public isAttacking: boolean = false;

	private joystickActivated: boolean = false;

	constructor() {
		super();

		this.interactive = true;
		this.keyboard.events.on('pressed', null, () => {

			if (this.keyboard.isKeyPressed('Space')) {
				this.isAttacking = true;
			}
		});

		let outerSprite = Sprite.from("joystick.png");
		let innerSprite = Sprite.from("joystick-handle.png");

		const joystick = new Joystick({
			outer: outerSprite,
			inner: innerSprite,

			outerScale: { x: 0.5, y: 0.5 },
			innerScale: { x: 0.8, y: 0.8 },

			onChange: (data) => {
				//console.log(data.angle); // Angle from 0 to 360
				console.log(data.direction); // 'left', 'top', 'bottom', 'right', 'top_left', 'top_right', 'bottom_left' or 'bottom_right'.
				//console.log(data.power); // Power from 0 to 1
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


		//joystick.x = SceneManager.width - joystick.width * 1.5;
		//joystick.y = SceneManager.height - joystick.height * 1.5;
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
