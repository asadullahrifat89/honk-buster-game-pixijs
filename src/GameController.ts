import { Container } from 'pixi.js';


export class GameController extends Container {

	private keyboard: any = require('pixi.js-keyboard');

	public isMoveUp: boolean = false;
	public isMoveDown: boolean = false;
	public isMoveLeft: boolean = false;
	public isMoveRight: boolean = false;

	constructor() {
		super();
	}

	update() {
		this.keyboard.update();

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

		//if (this.keyboard.isKeyReleased('ArrowLeft', 'KeyA')) {
		//	this.isMoveLeft = false;
		//}

		//if (this.keyboard.isKeyReleased('ArrowRight', 'KeyD')) {
		//	this.isMoveRight = false;
		//}

		//if (this.keyboard.isKeyReleased('ArrowUp', 'KeyW')) {
		//	this.isMoveUp = false;
		//}

		//if (this.keyboard.isKeyReleased('ArrowDown', 'KeyS')) {
		//	this.isMoveDown = false;
		//}
	}
}
