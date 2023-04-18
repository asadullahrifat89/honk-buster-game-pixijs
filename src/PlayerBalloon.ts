import { Texture } from 'pixi.js';
import { Constants, ConstructType, MovementDirection, PlayerBalloonStance, PlayerBalloonTemplate } from './Constants';
import { GameObject } from './GameObject';


export class PlayerBalloon extends GameObject {

	public playerBalloonStance: PlayerBalloonStance = PlayerBalloonStance.Idle;

	private _movementStopDelay: number = 0;
	private readonly _movementStopSpeedLoss: number = 0.5;
	private readonly _movementStopDelayDefault: number = 6;	

	private _lastSpeed: number = 0;
	private readonly _rotationThreadhold: number = 9;
	private readonly _unrotationSpeed: number = 1.1;
	private readonly _rotationSpeed: number = 0.5;

	private _attackStanceDelay: number = 0;
	private readonly _attackStanceDelayDefault: number = 1.5;

	private _winStanceDelay: number = 0;
	private readonly _winStanceDelayDefault: number = 15;

	private _hitStanceDelay: number = 0;
	private readonly _hitStanceDelayDefault: number = 1.5;

	private _movementDirection: MovementDirection = MovementDirection.None;

	private _healthLossRecoveryDelay: number = 0;
	private _healthLossOpacityEffect: number = 0;

	private _playerIdleTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_IDLE);
	private _playerWinTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_WIN);
	private _playerHitTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_HIT);
	private _playerAttackTexture: Texture = Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_ATTACK);

	constructor(speed: number) {
		super(speed);
	}

	reset() {

		this.health = 100;
		this._movementDirection = MovementDirection.None;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = 0;

		this.rotation = 0;
	}

	reposition() {
		this.setPosition((Constants.DEFAULT_GAME_VIEW_WIDTH / 2 - this.width / 2), (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2 - this.height / 2));
	}

	setPlayerTemplate(playerTemplate: PlayerBalloonTemplate) {

		let playerIdleUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == ConstructType.PLAYER_BALLOON_IDLE).map(x => x.Uri);
		let playerWinUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == ConstructType.PLAYER_BALLOON_WIN).map(x => x.Uri);
		let playerHitUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == ConstructType.PLAYER_BALLOON_HIT).map(x => x.Uri);
		let playerAttackUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.ConstructType == ConstructType.PLAYER_BALLOON_ATTACK).map(x => x.Uri);

		switch (playerTemplate) {
			case PlayerBalloonTemplate.Blue: {

				this._playerIdleTexture = Texture.from(playerIdleUris[0]);
				this._playerWinTexture = Texture.from(playerWinUris[0]);
				this._playerHitTexture = Texture.from(playerHitUris[0]);
				this._playerAttackTexture = Texture.from(playerAttackUris[0]);

				break;
			}
			case PlayerBalloonTemplate.Red: {

				this._playerIdleTexture = Texture.from(playerIdleUris[1]);
				this._playerWinTexture = Texture.from(playerWinUris[1]);
				this._playerHitTexture = Texture.from(playerHitUris[1]);
				this._playerAttackTexture = Texture.from(playerAttackUris[1]);

				break;
			}
			default: break;
		}

		this.changeTexture(this._playerIdleTexture);
	}

	setIdleStance() {
		this.playerBalloonStance = PlayerBalloonStance.Idle;
		this.changeTexture(this._playerIdleTexture);
	}

	setAttackStance() {
		this.playerBalloonStance = PlayerBalloonStance.Attack;
		this.changeTexture(this._playerAttackTexture);
		this._attackStanceDelay = this._attackStanceDelayDefault;
	}

	setWinStance() {
		this.playerBalloonStance = PlayerBalloonStance.Win;
		this.changeTexture(this._playerWinTexture);
		this._winStanceDelay = this._winStanceDelayDefault;
	}

	setHitStance() {
		if (this.playerBalloonStance != PlayerBalloonStance.Win) {
			this.playerBalloonStance = PlayerBalloonStance.Hit;
			this.changeTexture(this._playerHitTexture);
			this._hitStanceDelay = this._hitStanceDelayDefault;
		}
	}

	depleteHitStance() {
		if (this._hitStanceDelay > 0) {
			this._hitStanceDelay -= 0.1;

			if (this._hitStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteAttackStance() {
		if (this._attackStanceDelay > 0) {
			this._attackStanceDelay -= 0.1;

			if (this._attackStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	depleteWinStance() {
		if (this._winStanceDelay > 0) {
			this._winStanceDelay -= 0.1;

			if (this._winStanceDelay <= 0) {
				this.setIdleStance();
			}
		}
	}

	override moveUp() {
		super.moveUp();
		this._movementDirection = MovementDirection.Up;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveDown() {
		super.moveDown();
		this._movementDirection = MovementDirection.Down;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveLeft() {
		super.moveLeft();
		this._movementDirection = MovementDirection.Left;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveRight() {
		super.moveRight();
		this._movementDirection = MovementDirection.Right;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveUpRight() {
		super.moveUpRight();
		this._movementDirection = MovementDirection.UpRight;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveUpLeft() {
		super.moveUpLeft();
		this._movementDirection = MovementDirection.UpLeft;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveDownRight() {
		super.moveDownRight();
		this._movementDirection = MovementDirection.DownRight;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	override moveDownLeft() {
		super.moveDownLeft();
		this._movementDirection = MovementDirection.DownLeft;
		this._movementStopDelay = this._movementStopDelayDefault;
		this._lastSpeed = this.speed;
	}

	gainhealth() {
		this.health += this.hitPoint * 3;
	}

	looseHealth() {
		if (this._healthLossRecoveryDelay <= 0) // only loose health if recovery delay is less that 0 as upon taking damage this is set to 10
		{
			this.health -= this.hitPoint;
			this.alpha = 0.7;
			this._healthLossRecoveryDelay = 10;
		}
	}

	recoverFromHealthLoss() {
		if (this._healthLossRecoveryDelay > 0) {
			this._healthLossRecoveryDelay -= 0.1;

			this._healthLossOpacityEffect++; // blinking effect

			if (this._healthLossOpacityEffect > 2) {
				if (this.alpha != 1) {
					this.alpha = 1;
				}
				else {
					this.alpha = 0.7;
				}

				this._healthLossOpacityEffect = 0;
			}
		}

		if (this._healthLossRecoveryDelay <= 0 && this.alpha != 1)
			this.alpha = 1;
	}
}
