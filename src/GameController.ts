import { Container } from 'pixi.js';


export class GameController extends Container {

	private keyboard: any = require('pixi.js-keyboard');

	public isMoveUp: boolean = false;
	public isMoveDown: boolean = false;
	public isMoveLeft: boolean = false;
	public isMoveRight: boolean = false;
	public isAttacking: boolean = false;

	constructor() {
		super();

		this.interactive = true;
		this.keyboard.events.on('pressed', null, () => {

			if (this.keyboard.isKeyPressed('Space')) {
				this.isAttacking = true;
			}
		});
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
	}
}
