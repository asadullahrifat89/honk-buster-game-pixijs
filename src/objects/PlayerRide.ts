import { Texture } from 'pixi.js';
import { Constants } from '../Constants';
import { GameController } from '../controls/GameController';
import { GameObjectContainer } from '../core/GameObjectContainer';
import { GameObjectSprite } from '../core/GameObjectSprite';
import { PlayerRideStance, PlayerRideTemplate, MovementDirection, TextureType, RotationDirection, SoundType } from '../Enums';
import { SceneManager } from '../managers/SceneManager';
import { SoundManager } from '../managers/SoundManager';


export class PlayerRide extends GameObjectContainer {

	//#region Properties

	public playerRideStance: PlayerRideStance = PlayerRideStance.Idle;
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

	private playerIdleTexture: Texture = Constants.getRandomTexture(TextureType.PLAYER_RIDE_IDLE);
	private playerWinTexture: Texture = Constants.getRandomTexture(TextureType.PLAYER_RIDE_WIN);
	private playerHitTexture: Texture = Constants.getRandomTexture(TextureType.PLAYER_RIDE_HIT);
	private playerAttackTexture: Texture = Constants.getRandomTexture(TextureType.PLAYER_RIDE_ATTACK);

	private chopperBladesHoverDelay: number = 10;
	private chopperBladesOpacityEffect: number = 0;
	private chopperBladesTexture: Texture = Constants.getRandomTexture(TextureType.CHOPPER_BLADES);
	private chopperBladesSprite: GameObjectSprite = new GameObjectSprite(this.chopperBladesTexture);

	//#endregion

	//#region Methods

	constructor() {
		super();
	}

	setPlayerRideTemplate(playerRideTemplate: PlayerRideTemplate) {

		this.playerRideTemplate = playerRideTemplate;

		let playerIdleTemplate = Constants.CONSTRUCT_TEMPLATES.find(x => x.textureType == TextureType.PLAYER_RIDE_IDLE && x.tag == playerRideTemplate);
		let playerWinTemplate = Constants.CONSTRUCT_TEMPLATES.find(x => x.textureType == TextureType.PLAYER_RIDE_WIN && x.tag == playerRideTemplate);
		let playerHitTemplate = Constants.CONSTRUCT_TEMPLATES.find(x => x.textureType == TextureType.PLAYER_RIDE_HIT && x.tag == playerRideTemplate);
		let playerAttackTemplate = Constants.CONSTRUCT_TEMPLATES.find(x => x.textureType == TextureType.PLAYER_RIDE_ATTACK && x.tag == playerRideTemplate);

		if (playerIdleTemplate) {
			this.playerIdleTexture = Texture.from(playerIdleTemplate.uri);
		}

		if (playerHitTemplate) {
			this.playerHitTexture = Texture.from(playerHitTemplate.uri);
		}

		if (playerWinTemplate) {
			this.playerWinTexture = Texture.from(playerWinTemplate.uri);
		}

		if (playerAttackTemplate) {
			this.playerAttackTexture = Texture.from(playerAttackTemplate.uri);
		}

		this.setTexture(this.playerIdleTexture);

		switch (playerRideTemplate) {
			case PlayerRideTemplate.CHOPPER: {
				this.addTexture(this.chopperBladesTexture);
				this.chopperBladesSprite = this.getSpriteAt(1);
				this.chopperBladesSprite.alpha = 1;
			} break;
			case PlayerRideTemplate.SPHERE: {
				this.setHoverSpeed(0.9);
				this.setHoverIntensity(20);
			} break;
			default: break;
		}
	}

	reset() {
		this.health = this.hitPoint * 10; // base health
		this.health += Constants.SELECTED_PLAYER_RIDE_TEMPLATE * 5; // add extra health by 5 multiples for ride template
		this.health += (Constants.HEALTH_LEVEL_MAX * this.hitPoint); // add extra health for health unlocks

		this.movementDirection = MovementDirection.None;
		this.movementStopDelay = this.movementStopDelayDefault;
		this.lastSpeed = 0;
		this.rotation = 0;
	}

	reposition() {
		this.setPosition(((Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling) / 2 - this.width / 2), ((Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling) / 2 - this.height / 2));
	}

	setIdleStance() {
		this.playerRideStance = PlayerRideStance.Idle;
		this.setTexture(this.playerIdleTexture);
	}

	setAttackStance() {
		if (this.playerRideStance != PlayerRideStance.Win) {
			this.playerRideStance = PlayerRideStance.Attack;
			this.setTexture(this.playerAttackTexture);
			this.attackStanceDelay = this.attackStanceDelayDefault;
		}
	}

	setWinStance() {
		this.playerRideStance = PlayerRideStance.Win;
		this.setTexture(this.playerWinTexture);
		this.winStanceDelay = this.winStanceDelayDefault;
	}

	setHitStance() {
		if (this.playerRideStance != PlayerRideStance.Win) {
			this.playerRideStance = PlayerRideStance.Hit;
			this.setTexture(this.playerHitTexture);
			this.hitStanceDelay = this.hitStanceDelayDefault;
		}
	}

	depleteHitStance() {
		if (this.hitStanceDelay > 0 && this.playerRideStance != PlayerRideStance.Win) {
			this.hitStanceDelay -= 0.1;

			if (this.hitStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteAttackStance() {
		if (this.attackStanceDelay > 0 && this.playerRideStance != PlayerRideStance.Win) {
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

	move(sceneWidth: number, sceneHeight: number, controller: GameController) {

		if (controller.joystickActivated) {

			switch (this.playerRideTemplate) {
				case PlayerRideTemplate.AIR_BALLOON: {
					this.moveWithJoystick(sceneWidth, sceneHeight, controller, 1);
				} break;
				case PlayerRideTemplate.CHOPPER: {
					this.moveWithJoystick(sceneWidth, sceneHeight, controller, 2);
					this.animateChopperBlades();
				} break;
				case PlayerRideTemplate.SPHERE: {
					this.moveWithJoystick(sceneWidth, sceneHeight, controller, 3);
				} break;
				default: break;
			}
		}
		else {
			switch (this.playerRideTemplate) {
				case PlayerRideTemplate.AIR_BALLOON: {
					this.speed = controller.velocity.x;
				} break;
				case PlayerRideTemplate.CHOPPER: {
					this.speed = controller.velocity.x + 1;
					this.animateChopperBlades();
				} break;
				case PlayerRideTemplate.SPHERE: {
					this.speed = controller.velocity.x + 2;
				} break;
				default: break;
			}

			this.moveWithKeyboard(controller, sceneWidth, sceneHeight);
		}
	}	

	private moveWithJoystick(sceneWidth: number, sceneHeight: number, controller: GameController, xyModifier: number = 0) {

		if (controller.velocity.x < 0 && this.getLeft() > 0) { // left
			this.x += controller.velocity.x - xyModifier; 
		}
		if (controller.velocity.x > 0 && this.getRight() < sceneWidth) { // right
			this.x += controller.velocity.x + xyModifier;
		}
		if (controller.velocity.y < 0 && this.getTop() > 0) { // up
			this.y += controller.velocity.y - xyModifier;
		}
		if (controller.velocity.y > 0 && this.getBottom() < sceneHeight) {
			this.y += controller.velocity.y + xyModifier;
		}
	}

	private moveWithKeyboard(controller: GameController, sceneWidth: number, sceneHeight: number) {

		if (controller.isMoveUp && controller.isMoveLeft) {
			if (this.getTop() > 0 && this.getLeft() > 0)
				this.moveUpLeft();
		}
		else if (controller.isMoveUp && controller.isMoveRight) {
			if (this.getRight() < sceneWidth && this.getTop() > 0)
				this.moveUpRight();
		}
		else if (controller.isMoveUp) {
			if (this.getTop() > 0)
				this.moveUp();
		}
		else if (controller.isMoveDown && controller.isMoveRight) {
			if (this.getBottom() < sceneHeight && this.getRight() < sceneWidth)
				this.moveDownRight();
		}
		else if (controller.isMoveDown && controller.isMoveLeft) {
			if (this.getLeft() > 0 && this.getBottom() < sceneHeight)
				this.moveDownLeft();
		}
		else if (controller.isMoveDown) {
			if (this.getBottom() < sceneHeight)
				this.moveDown();
		}
		else if (controller.isMoveRight) {
			if (this.getRight() < sceneWidth)
				this.moveRight();
		}
		else if (controller.isMoveLeft) {
			if (this.getLeft() > 0)
				this.moveLeft();
		}
		else {
			this.stopMovement(sceneWidth, sceneHeight);
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

	private animateChopperBlades() {

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

	stopMovement(sceneWidth: number, sceneHeight: number) {
		if (this.getLeft() > 0 && this.getRight() < sceneWidth && this.getTop() > 0 && this.getBottom() < sceneHeight) {
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
		else {
			if (this.movementStopDelay > 0) {
				this.movementStopDelay--;
				this.unRotate(this.unrotationSpeed);
			}
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

			SoundManager.play(SoundType.DAMAGE_TAKEN);
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

