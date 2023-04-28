import { Container, Texture } from 'pixi.js';
import { Button } from './Button';
import { SoundType } from './Constants';
import { GameObjectSprite } from './GameObjectSprite';
import { Direction, Joystick } from './Joystick';
import { SceneManager } from './SceneManager';
import { SoundManager } from './SoundManager';

export interface GameControllerSettings {
	onPause?: (isPaused: boolean) => void;
}

export class GameController extends Container {

	private keyboard: any = require('pixi.js-keyboard');

	public isMoveUp: boolean = false;
	public isMoveDown: boolean = false;
	public isMoveLeft: boolean = false;
	public isMoveRight: boolean = false;
	public isAttacking: boolean = false;
	public isPaused: boolean = false;

	private joystickActivated: boolean = false;
	private keyboardActivated: boolean = false;
	public power: number = 1;
	private settings: GameControllerSettings;

	private attackButton: Button;
	private pauseButton: Button;
	private joystick: Joystick;

	private pauseButtonSprite: GameObjectSprite;

	constructor(settings: GameControllerSettings) {
		super();

		this.settings = settings;

		this.interactive = true;

		this.on("pointertap", () => {
			this.joystick.alpha = 1;
			this.attackButton.alpha = 1;
		});
		this.keyboard.events.on('pressed', null, () => {

			if (!this.isPaused && this.keyboard.isKeyPressed('Space')) {
				this.isAttacking = true;
			}

			this.keyboardActivated = true;

			if (this.keyboardActivated) {
				this.joystick.alpha = 0;
				this.attackButton.alpha = 0;
			}
		});

		const pauseButtonSpritebg: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		pauseButtonSpritebg.height = 100;
		pauseButtonSpritebg.width = 100;

		this.pauseButtonSprite = new GameObjectSprite(Texture.from("pause_button"));
		this.pauseButtonSprite.height = 50;
		this.pauseButtonSprite.width = 50;
		this.pauseButtonSprite.x = pauseButtonSpritebg.width / 2 - this.pauseButtonSprite.width / 2;
		this.pauseButtonSprite.y = pauseButtonSpritebg.height / 2 - this.pauseButtonSprite.height / 2;

		const pauseButtonGraphics = new Container();
		pauseButtonGraphics.addChild(pauseButtonSpritebg);
		pauseButtonGraphics.addChild(this.pauseButtonSprite);

		this.pauseButton = new Button(pauseButtonGraphics, () => {
			if (this.isPaused)
				this.resumeGame();
			else
				this.pauseGame();
		});
		this.setPauseButtonPosition();
		this.addChild(this.pauseButton);

		const joystickOuterSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick"));
		joystickOuterSprite.height = 278;
		joystickOuterSprite.width = 278;

		const joystickInnerSprite: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		joystickInnerSprite.height = 132;
		joystickInnerSprite.width = 132;

		this.joystick = new Joystick({
			outer: joystickOuterSprite,
			inner: joystickInnerSprite,

			width: 278,
			height: 278,
			outerScale: { x: 0.5, y: 0.5 },
			innerScale: { x: 0.8, y: 0.8 },

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

				//console.log(data.direction);
				//console.log(data.power); // Power from 0 to 1
				//console.log(data.angle); // Angle from 0 to 360
			},

			onStart: () => {
				this.joystickActivated = true;
				this.power = 0.1;
				this.keyboardActivated = false;
				this.joystick.alpha = 1;
				this.attackButton.alpha = 1;
			},

			onEnd: () => {
				this.joystickActivated = false;
				this.power = 1;
			},
		});

		this.setJoystickPosition();
		this.addChild(this.joystick);

		const attackButtonSpritebg: GameObjectSprite = new GameObjectSprite(Texture.from("joystick_handle"));
		attackButtonSpritebg.height = 125;
		attackButtonSpritebg.width = 125;

		const attackButtonSprite: GameObjectSprite = new GameObjectSprite(Texture.from("attack_button"));
		attackButtonSprite.height = 65;
		attackButtonSprite.width = 65;
		attackButtonSprite.x = attackButtonSpritebg.width / 2 - attackButtonSprite.width / 2;
		attackButtonSprite.y = attackButtonSpritebg.height / 2 - attackButtonSprite.height / 2;

		const attackButtonGraphics = new Container();
		attackButtonGraphics.addChild(attackButtonSpritebg);
		attackButtonGraphics.addChild(attackButtonSprite);

		this.attackButton = new Button(attackButtonGraphics, () => {
			if (!this.isPaused) {
				this.isAttacking = true;
			}
		});
		this.setAttackButtonPosition();
		this.addChild(this.attackButton);
	}

	public pauseGame() {
		this.isPaused = true;

		this.pauseButtonSprite.setTexture(Texture.from("resume_button"));
		SoundManager.play(SoundType.GAME_PAUSE);

		this.settings.onPause?.(this.isPaused);
	}

	private resumeGame() {
		this.isPaused = false;

		this.pauseButtonSprite.setTexture(Texture.from("pause_button"));
		SoundManager.play(SoundType.GAME_START);

		this.settings.onPause?.(this.isPaused);
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

	resize() {
		this.setJoystickPosition();
		this.setAttackButtonPosition();
		this.setPauseButtonPosition();
	}

	private setPauseButtonPosition() {
		this.pauseButton.x = SceneManager.width - this.pauseButton.width * 1.1;
		this.pauseButton.y = this.pauseButton.height / 2.2;
	}

	private setAttackButtonPosition() {
		this.attackButton.x = this.attackButton.width / 2;
		this.attackButton.y = SceneManager.height - this.attackButton.height * 1.3;
	}

	private setJoystickPosition() {
		this.joystick.x = SceneManager.width - this.joystick.width / 1.4;
		this.joystick.y = SceneManager.height - this.joystick.height / 1.4;
	}
}
