import { Texture } from 'pixi.js';
import { Constants, ConstructType, MovementDirection, PlayerRideStance, PlayerRideTemplate, RotationDirection, SoundType } from '../Constants';
import { GameController } from '../controls/GameController';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { GameObjectSprite } from '../core/GameObjectSprite';
import { SoundManager } from '../managers/SoundManager';


export class PlayerRide extends GameObjectContainer {

	//#region Properties

	public playerBalloonStance: PlayerRideStance = PlayerRideStance.Idle;
	public playerRideTemplate: PlayerRideTemplate = 0;

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

	private playerIdleTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_RIDE_IDLE);
	private playerWinTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_RIDE_WIN);
	private playerHitTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_RIDE_HIT);
	private playerAttackTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_RIDE_ATTACK);

	private chopperBladesHoverDelay: number = 10;
	private chopperBladesOpacityEffect: number = 0;
	private chopperBladesTexture: Texture = Constants.getRandomTexture(ConstructType.CHOPPER_BLADES);
	private chopperBladesSprite: GameObjectSprite = new GameObjectSprite(this.chopperBladesTexture);

	//#endregion

	//#region Methods

	constructor() {
		super();
	}

	reset() {
		this.health = (this.hitPoint * 10) + (Constants.HEALTH_LEVEL_MAX * this.hitPoint); // add health upgrades
		this.movementDirection = MovementDirection.None;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = 0;
		this.rotation = 0;
	}

	reposition() {
		this.setPosition((Constants.DEFAULT_GAME_VIEW_WIDTH / 2 - this.width / 2), (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2 - this.height / 2));
	}

	setPlayerRideTemplate(playerRideTemplate: PlayerRideTemplate) {

		this.playerRideTemplate = playerRideTemplate;

		let playerIdleUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_RIDE_IDLE).map(x => x.uri);
		let playerWinUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_RIDE_WIN).map(x => x.uri);
		let playerHitUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_RIDE_HIT).map(x => x.uri);
		let playerAttackUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.constructType == ConstructType.PLAYER_RIDE_ATTACK).map(x => x.uri);

		switch (playerRideTemplate) {
			case PlayerRideTemplate.AIR_BALLOON: {
				this.playerIdleTexture = Texture.from(playerIdleUris[0]);
				this.playerWinTexture = Texture.from(playerWinUris[0]);
				this.playerHitTexture = Texture.from(playerHitUris[0]);
				this.playerAttackTexture = Texture.from(playerAttackUris[0]);
			} break;
			case PlayerRideTemplate.CHOPPER: {
				this.playerIdleTexture = Texture.from(playerIdleUris[1]);
				this.playerWinTexture = Texture.from(playerWinUris[1]);
				this.playerHitTexture = Texture.from(playerHitUris[1]);
				this.playerAttackTexture = Texture.from(playerAttackUris[1]);
			} break;
			default: break;
		}

		this.setTexture(this.playerIdleTexture);

		// add chopper animation sprite

		switch (playerRideTemplate) {
			case PlayerRideTemplate.AIR_BALLOON: {

			} break;
			case PlayerRideTemplate.CHOPPER: {
				this.addTexture(this.chopperBladesTexture);
				this.chopperBladesSprite = this.getSpriteAt(1);
			} break;
			default: break;
		}
	}

	setIdleStance() {
		this.playerBalloonStance = PlayerRideStance.Idle;
		this.setTexture(this.playerIdleTexture);
	}

	setAttackStance() {
		this.playerBalloonStance = PlayerRideStance.Attack;
		this.setTexture(this.playerAttackTexture);
		this.attackStanceDelay = this.attackStanceDelayDefault;
	}

	setWinStance() {
		this.playerBalloonStance = PlayerRideStance.Win;
		this.setTexture(this.playerWinTexture);
		this.winStanceDelay = this.winStanceDelayDefault;
	}

	setHitStance() {
		if (this.playerBalloonStance != PlayerRideStance.Win) {
			this.playerBalloonStance = PlayerRideStance.Hit;
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

	move(sceneWidth: number, sceneHeight: number, controller: GameController) {

		switch (this.playerRideTemplate) {
			case PlayerRideTemplate.AIR_BALLOON: {
				this.speed = (Constants.DEFAULT_CONSTRUCT_SPEED + 0.5) * controller.power;
			} break;
			case PlayerRideTemplate.CHOPPER: {
				this.speed = (Constants.DEFAULT_CONSTRUCT_SPEED + 2) * controller.power; // chopper grants extra speed
			} break;
			default: break;
		}

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

		this.animateChopperBlades();
	}

	private animateChopperBlades() {
		if (this.playerRideTemplate == PlayerRideTemplate.CHOPPER) {

			this.chopperBladesHoverDelay--; // chopper blades hover effect

			if (this.chopperBladesHoverDelay >= 0) {
				this.chopperBladesSprite.y += 0.4;
			}
			else {
				this.chopperBladesSprite.y -= 0.4;

				if (this.chopperBladesHoverDelay <= -10) {
					this.chopperBladesHoverDelay = 10;
				}
			}

			this.chopperBladesOpacityEffect++; // chopper blades blinking effect

			if (this.chopperBladesOpacityEffect > 2) {
				if (this.chopperBladesSprite.alpha != 1) {
					this.chopperBladesSprite.alpha = 1;
				}
				else {
					this.chopperBladesSprite.alpha = 0.3;
				}

				this.chopperBladesOpacityEffect = 0;
			}
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

	gainhealth() {
		this.health += this.hitPoint * 2;
	}

	looseHealth() {
		if (this.healthLossRecoveryDelay <= 0) // only loose health if recovery delay is less that 0 as upon taking damage this is set to 10
		{
			this.health -= this.hitPoint;
			this.alpha = 0.7;
			this.healthLossRecoveryDelay = 5;

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
					this.alpha = 0.4;
				}

				this.healthLossOpacityEffect = 0;
			}
		}

		if (this.healthLossRecoveryDelay <= 0 && this.alpha != 1) {
			this.alpha = 1;
		}
	}

	//#endregion
}

