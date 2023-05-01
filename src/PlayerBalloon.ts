import { Texture } from 'pixi.js';
import { Constants, ConstructType, MovementDirection, PlayerBalloonStance, PlayerBalloonTemplate, RotationDirection, SoundType } from './Constants';
import { GameController } from './GameController';
import { GameObjectContainer } from './core/GameObjectContainer';
import { SoundManager } from './managers/SoundManager';


export class PlayerBalloon extends GameObjectContainer {

	//#region Properties

	public playerBalloonStance: PlayerBalloonStance = PlayerBalloonStance.Idle;

	private movementStopDelay: number = 0;
	private readonly movementStopSpeedLoss: number = 0.5;
	private readonly movementStopDelayDefault: number = 6;

	private lastSpeed: number = 0;
	private readonly rotationThreadhold: number = 9;
	private readonly unrotationSpeed: number = 1.1;
	private readonly rotationSpeed: number = 0.5;

	private attackStanceDelay: number = 0;
	private readonly attackStanceDelayDefault: number = 1.5;

	private winStanceDelay: number = 0;
	private readonly winStanceDelayDefault: number = 15;

	private hitStanceDelay: number = 0;
	private readonly hitStanceDelayDefault: number = 1.5;

	private movementDirection: MovementDirection = MovementDirection.None;

	private healthLossRecoveryDelay: number = 0;
	private healthLossOpacityEffect: number = 0;

	private playerIdleTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_IDLE);
	private playerWinTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_WIN);
	private playerHitTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_HIT);
	private playerAttackTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_ATTACK);

	//#endregion

	//#region Methods

	constructor(speed: number) {
		super(speed);
	}

	reset() {		
		this.health = this.hitPoint * 10;
		this.movementDirection = MovementDirection.None;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = 0;
		this.rotation = 0;
	}

	reposition() {
		this.setPosition((Constants.DEFAULT_GAME_VIEW_WIDTH / 2 - this.width / 2), (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2 - this.height / 2));
	}

	setPlayerTemplate(playerTemplate: PlayerBalloonTemplate) {

		let playerIdleUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_BALLOON_IDLE).map(x => x.uri);
		let playerWinUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_BALLOON_WIN).map(x => x.uri);
		let playerHitUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_BALLOON_HIT).map(x => x.uri);
		let playerAttackUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_BALLOON_ATTACK).map(x => x.uri);

		switch (playerTemplate) {
			case PlayerBalloonTemplate.Blue: {

				this.playerIdleTexture = Texture.from(playerIdleUris[0]);
				this.playerWinTexture = Texture.from(playerWinUris[0]);
				this.playerHitTexture = Texture.from(playerHitUris[0]);
				this.playerAttackTexture = Texture.from(playerAttackUris[0]);

				break;
			}
			case PlayerBalloonTemplate.Red: {

				this.playerIdleTexture = Texture.from(playerIdleUris[1]);
				this.playerWinTexture = Texture.from(playerWinUris[1]);
				this.playerHitTexture = Texture.from(playerHitUris[1]);
				this.playerAttackTexture = Texture.from(playerAttackUris[1]);

				break;
			}
			default: break;
		}

		this.setTexture(this.playerIdleTexture);
	}

	setIdleStance() {
		this.playerBalloonStance = PlayerBalloonStance.Idle;
		this.setTexture(this.playerIdleTexture);
	}

	setAttackStance() {
		this.playerBalloonStance = PlayerBalloonStance.Attack;
		this.setTexture(this.playerAttackTexture);
		this.attackStanceDelay = this.attackStanceDelayDefault;
	}

	setWinStance() {
		this.playerBalloonStance = PlayerBalloonStance.Win;
		this.setTexture(this.playerWinTexture);
		this.winStanceDelay = this.winStanceDelayDefault;
	}

	setHitStance() {
		if (this.playerBalloonStance != PlayerBalloonStance.Win) {
			this.playerBalloonStance = PlayerBalloonStance.Hit;
			this.setTexture(this.playerHitTexture);
			this.hitStanceDelay = this.hitStanceDelayDefault;
		}
	}

	depleteHitStance() {
		if (this.hitStanceDelay > 0) {
			this.hitStanceDelay -= 0.1;

			if (this.hitStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteAttackStance() {
		if (this.attackStanceDelay > 0) {
			this.attackStanceDelay -= 0.1;

			if (this.attackStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteWinStance() {
		if (this.winStanceDelay > 0) {
			this.winStanceDelay -= 0.1;

			if (this.winStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	override moveUp() {
		super.moveUp();
		this.movementDirection = MovementDirection.Up;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Backward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveDown() {
		super.moveDown();
		this.movementDirection = MovementDirection.Down;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Forward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveLeft() {
		super.moveLeft();
		this.movementDirection = MovementDirection.Left;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Backward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveRight() {
		super.moveRight();
		this.movementDirection = MovementDirection.Right;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Forward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveUpRight() {
		super.moveUpRight();
		this.movementDirection = MovementDirection.UpRight;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Forward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveUpLeft() {
		super.moveUpLeft();
		this.movementDirection = MovementDirection.UpLeft;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Backward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveDownRight() {
		super.moveDownRight();
		this.movementDirection = MovementDirection.DownRight;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Forward, this.rotationThreadhold, this.rotationSpeed);
	}

	override moveDownLeft() {
		super.moveDownLeft();
		this.movementDirection = MovementDirection.DownLeft;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = this.speed;
		this.rotate(RotationDirection.Backward, this.rotationThreadhold, this.rotationSpeed);
	}

	gainhealth() {
		this.health += this.hitPoint * 2;
	}

	looseHealth() {
		if (this.healthLossRecoveryDelay <= 0) // only loose health if recovery delay is less that 0 as upon taking damage this is set to 10
		{
			this.health -= this.hitPoint;
			this.alpha = 0.7;
			this.healthLossRecoveryDelay = 8;

			SoundManager.play(SoundType.PLAYER_HEALTH_LOSS);
		}
	}

	recoverFromHealthLoss() {
		if (this.healthLossRecoveryDelay > 0) {
			this.healthLossRecoveryDelay -= 0.1;

			this.healthLossOpacityEffect++; // blinking effect

			if (this.healthLossOpacityEffect > 2) {
				if (this.alpha != 1) {
					this.alpha = 1;
				}
				else {
					this.alpha = 0.7;
				}

				this.healthLossOpacityEffect = 0;
			}
		}

		if (this.healthLossRecoveryDelay <= 0 && this.alpha != 1) {
			this.alpha = 1;
		}
	}

	move(sceneWidth: number, sceneHeight: number, controller: GameController) {

		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED * controller.power;

		let halfHeight = this.height / 2;
		let halfWidth = this.width / 2;

		if (controller.isMoveUp && controller.isMoveLeft) {
			if (this.y + halfHeight > 0 && this.x + halfWidth > 0)
				this.moveUpLeft();
		}
		else if (controller.isMoveUp && controller.isMoveRight) {
			if (this.x - halfWidth < sceneWidth && this.y + halfHeight > 0)
				this.moveUpRight();
		}
		else if (controller.isMoveUp) {
			if (this.y + halfHeight > 0)
				this.moveUp();
		}
		else if (controller.isMoveDown && controller.isMoveRight) {
			if (this.getBottom() - halfHeight < sceneHeight && this.x - halfWidth < sceneWidth)
				this.moveDownRight();
		}
		else if (controller.isMoveDown && controller.isMoveLeft) {
			if (this.x + halfWidth > 0 && this.getBottom() - halfHeight < sceneHeight)
				this.moveDownLeft();
		}
		else if (controller.isMoveDown) {
			if (this.getBottom() - halfHeight < sceneHeight)
				this.moveDown();
		}
		else if (controller.isMoveRight) {
			if (this.x - halfWidth < sceneWidth)
				this.moveRight();
		}
		else if (controller.isMoveLeft) {
			if (this.x + halfWidth > 0)
				this.moveLeft();
		}
		else {
			this.stopMovement();
		}
	}

	stopMovement() {
		if (this.movementStopDelay > 0) {
			this.movementStopDelay--;

			let movementSpeedLoss = this.movementStopSpeedLoss;
			this.speed = this.lastSpeed - movementSpeedLoss;

			if (this.lastSpeed > 0) {
				switch (this.movementDirection) {
					case MovementDirection.None:
						break;
					case MovementDirection.Up:
						this.moveUp();
						break;
					case MovementDirection.UpLeft:
						this.moveUpLeft();
						break;
					case MovementDirection.UpRight:
						this.moveUpRight();
						break;
					case MovementDirection.Down:
						this.moveDown();
						break;
					case MovementDirection.DownLeft:
						this.moveDownLeft();
						break;
					case MovementDirection.DownRight:
						this.moveDownRight();
						break;
					case MovementDirection.Right:
						this.moveRight();
						break;
					case MovementDirection.Left:
						this.moveLeft();
						break;
					default:
						break;
				}
			}

			this.unRotate(this.unrotationSpeed);
		}
		else {
			this.movementDirection = MovementDirection.None;
		}
	}

	//#endregion
}

