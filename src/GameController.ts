import { Container, Texture } from 'pixi.js';
import { Button } from './Button';
import { SoundType } from './Constants';
import { GameObjectSprite } from './GameObjectSprite';
import { Direction, Joystick } from './Joystick';
import { SceneManager } from './SceneManager';
import { SoundManager } from './SoundManager';


export class GameController extends Container {

	private keyboard: any = require('pixi.js-keyboard');

	public isMoveUp: boolean = false;
	public isMoveDown: boolean = false;
	public isMoveLeft: boolean = false;
	public isMoveRight: boolean = false;
	public isAttacking: boolean = false;
	public isPaused: boolean = false;

	private joystickActivated: boolean = false;
	public power: number = 1;

	constructor() {
		super();

		this.interactive = true;
		this.keyboard.events.on('pressed', null, () => {

			if (!this.isPaused && this.keyboard.isKeyPressed('Space')) {
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
				if (!this.isPaused) {
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

		const attackButtonSpritebg: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		attackButtonSpritebg.height = 130;
		attackButtonSpritebg.width = 130;

		const attackButtonSprite: GameObjectSprite = new GameObjectSprite(Texture.from("attack_button"));
		attackButtonSprite.height = 80;
		attackButtonSprite.width = 80;
		attackButtonSprite.x = attackButtonSpritebg.width / 2 - attackButtonSprite.width / 2;
		attackButtonSprite.y = attackButtonSpritebg.height / 2 - attackButtonSprite.height / 2;

		const attackButtonGraphics = new Container();
		attackButtonGraphics.addChild(attackButtonSpritebg);
		attackButtonGraphics.addChild(attackButtonSprite);

		const attackButton = new Button(attackButtonGraphics, () => {
			this.isAttacking = true;
		});
		attackButton.x = attackButtonSpritebg.width / 1.3;
		attackButton.y = SceneManager.height - attackButtonSpritebg.height * 1.7;

		this.addChild(attackButton);

		const pauseButtonSpritebg: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		pauseButtonSpritebg.height = 100;
		pauseButtonSpritebg.width = 100;

		const pauseButtonSprite: GameObjectSprite = new GameObjectSprite(Texture.from("pause_button"));
		pauseButtonSprite.height = 50;
		pauseButtonSprite.width = 50;
		pauseButtonSprite.x = pauseButtonSpritebg.width / 2 - pauseButtonSprite.width / 2;
		pauseButtonSprite.y = pauseButtonSpritebg.height / 2 - pauseButtonSprite.height / 2;

		const pauseButtonGraphics = new Container();
		pauseButtonGraphics.addChild(pauseButtonSpritebg);
		pauseButtonGraphics.addChild(pauseButtonSprite);

		const pauseButton = new Button(pauseButtonGraphics, () => {
			this.isPaused = !this.isPaused;

			if (this.isPaused) {
				pauseButtonSprite.setTexture(Texture.from("resume_button"));
				SoundManager.play(SoundType.GAME_PAUSE);
			}
			else {
				pauseButtonSprite.setTexture(Texture.from("pause_button"));
				SoundManager.play(SoundType.GAME_START);
			}
		});
		pauseButton.x = SceneManager.width - pauseButtonSpritebg.width;
		pauseButton.y = pauseButtonSpritebg.height / 2.5;

		this.addChild(pauseButton);
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
