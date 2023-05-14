import { BlurFilter, Container, Graphics, Texture } from "pixi.js";
import { GameObjectContainer } from '../core/GameObjectContainer';
import { Constants } from '../Constants';
import { GameOverScene } from "./GameOverScene";
import { IScene } from "../managers/IScene";
import { GameController } from "../controls/GameController";
import { OnScreenMessage } from "../controls/OnScreenMessage";
import { GameScoreBar } from "../controls/GameScoreBar";
import { GameCheckpoint } from "../core/GameCheckpoint";
import { HealthBar } from "../controls/HealthBar";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { CastShadow } from "../objects/CastShadow";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { RoadSideWalk } from "../objects/RoadSideWalk";
import { VehicleEnemy } from "../objects/VehicleEnemy";
import { VehicleBoss } from "../objects/VehicleBoss";
import { VehicleBossAirBomb } from "../objects/VehicleBossAirBomb";
import { UfoEnemy } from "../objects/UfoEnemy";
import { UfoEnemyAirBomb } from "../objects/UfoEnemyAirBomb";
import { UfoBoss } from "../objects/UfoBoss";
import { UfoBossAirBomb } from "../objects/UfoBossAirBomb";
import { UfoBossAirBombSeekingBall } from "../objects/UfoBossAirBombSeekingBall";
import { HealthPickup } from "../objects/HealthPickup";
import { Honk } from "../objects/Honk";
import { MafiaBoss } from "../objects/MafiaBoss";
import { MafiaBossAirBomb } from "../objects/MafiaBossAirBomb";
import { MafiaBossAirBombHurlingBall } from "../objects/MafiaBossAirBombHurlingBall";
import { PlayerRide } from "../objects/PlayerRide";
import { PlayerGroundBomb } from "../objects/PlayerGroundBomb";
import { Explosion } from "../objects/Explosion";
import { PlayerAirBomb } from "../objects/PlayerAirBomb";
import { PlayerAirBombHurlingBall } from "../objects/PlayerAirBombHurlingBall";
import { PowerUpPickup } from "../objects/PowerUpPickup";
import { ZombieBoss } from "../objects/ZombieBoss";
import { ZombieBossAirBombCube } from "../objects/ZombieBossAirBombCube";
import { MessageBubble } from "../controls/MessageBubble";
import { RoadMark } from "../objects/RoadMark";
import { GrandExplosionRing } from "../objects/GrandExplosionRing";
import { Leaf } from "../objects/Leaf";
import { VehicleSmoke } from "../objects/VehicleSmoke";
import { TextureType, PlayerGroundBombTemplate, PlayerRideTemplate, SoundType, PlayerAirBombTemplate, RotationDirection, ExplosionType, PowerUpType } from "../Enums";


export class GamePlayScene extends Container implements IScene {

	//#region Properties

	private stageOpeningCircle: GameObjectContainer;
	private stageBackgroundColors: number[] = [0x1e2a36, 0x4187ab];
	private stageBackgroundColor: Graphics;
	private stageBorder: Graphics;

	private sceneContainer: GameObjectContainer;

	private gameController: GameController;
	private gameScoreBar: GameScoreBar;
	private gameLevelBar: GameScoreBar;

	private onScreenMessage: OnScreenMessage;

	//TODO: reset these to the commented values after testing
	private readonly ufoEnemyRelease: { point: number, limit: number } = { limit: 15, point: 35 }; // 35
	private readonly vehicleBossRelease: { point: number, limit: number } = { limit: 15, point: 25 }; // 25
	private readonly ufoBossRelease: { point: number, limit: number } = { limit: 15, point: 50 }; // 50
	private readonly zombieBossRelease: { point: number, limit: number } = { limit: 15, point: 100 }; // 100
	private readonly mafiaBossRelease: { point: number, limit: number } = { limit: 15, point: 150 }; // 150

	private readonly ufoEnemyCheckpoint: GameCheckpoint;
	private readonly vehicleBossCheckpoint: GameCheckpoint;
	private readonly ufoBossCheckpoint: GameCheckpoint;
	private readonly zombieBossCheckpoint: GameCheckpoint;
	private readonly mafiaBossCheckpoint: GameCheckpoint;

	private playerHealthBar: HealthBar;
	private bossHealthBar: HealthBar;

	private powerUpBar: HealthBar;
	private soundPollutionBar: HealthBar;
	private ammunitionBar: HealthBar;

	//private selectedGroundBombUris: string[] = [];
	//private selectedAirBombUris: string[] = [];

	private behindBackIcon: Texture;
	private talkIcon: Texture;
	private cheerIcon: Texture;
	private interactIcon: Texture;
	//private playerHurlingBallIcon: Texture;

	private honkBustReactions: string[] = [];

	private sceneBoundaryWidth: number = Constants.DEFAULT_GAME_VIEW_WIDTH;
	private sceneBoundaryHeight: number = Constants.DEFAULT_GAME_VIEW_HEIGHT;

	//#endregion

	//#region Methods

	//#region Constructor

	constructor() {
		super();

		//this.playerHurlingBallIcon = Texture.from("player_hurling_ball");
		this.honkBustReactions = ["Hey!", "No!", "What?", "Oh no!", "What the hell?", "Why?", "What are you doing?", "OMG!", "Holy shit!", "Holy moly!"];

		// get textures for on screen message icons
		this.behindBackIcon = Texture.from("character_maleAdventurer_behindBack");
		this.cheerIcon = Texture.from("character_maleAdventurer_cheer0");
		this.talkIcon = Texture.from("character_maleAdventurer_talk");
		this.interactIcon = Texture.from("character_maleAdventurer_interact");

		// set the background color of the scene		
		let color = this.stageBackgroundColors[Constants.getRandomNumber(0, this.stageBackgroundColors.length - 1)];

		this.stageBackgroundColor = new Graphics().beginFill(color, 1).drawRect(0, 0, SceneManager.width, SceneManager.height).endFill();
		this.addChildAt(this.stageBackgroundColor, 0);

		// create the scene container
		this.sceneContainer = new GameObjectContainer();
		this.addChild(this.sceneContainer);

		// set the check points
		this.vehicleBossCheckpoint = new GameCheckpoint(this.vehicleBossRelease.point);
		this.ufoBossCheckpoint = new GameCheckpoint(this.ufoBossRelease.point);
		this.zombieBossCheckpoint = new GameCheckpoint(this.zombieBossRelease.point);
		this.mafiaBossCheckpoint = new GameCheckpoint(this.mafiaBossRelease.point);
		this.ufoEnemyCheckpoint = new GameCheckpoint(this.ufoEnemyRelease.point);

		// spawn the game objects
		this.spawnGameObjects();
		this.generatePlayerRide(); // player health is calculated here		

		// set the game score bar		
		this.gameScoreBar = new GameScoreBar(this, "Score ");
		this.repositionGameScoreBar();

		// set the game level bar		
		this.gameLevelBar = new GameScoreBar(this, "Lvl ", 1);
		this.repositionGameLevelBar();

		// set health bars		
		this.playerHealthBar = new HealthBar(Constants.getRandomUri(TextureType.HEALTH_PICKUP), this).setMaximumValue(this.player.health).setValue(this.player.health);
		this.repositionPlayerHealthBar();

		this.bossHealthBar = new HealthBar(Constants.getRandomUri(TextureType.VEHICLE_BOSS), this, 0x7200ff).setMaximumValue(100).setValue(0);
		this.repositionBossHealthBar();

		// set power up bar
		this.powerUpBar = new HealthBar(Constants.getRandomUri(TextureType.POWERUP_PICKUP_ARMOR), this, 0xffaa00).setMaximumValue(100).setValue(0);
		this.repositionPowerUpBar();

		// set sound pollution bar
		this.soundPollutionBar = new HealthBar(Constants.getRandomUri(TextureType.HONK), this, 0x7200ff).setMaximumValue(8).setValue(0);
		this.repositionSoundPollutionBar();

		// set ammunition bar
		const selectedGroundBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.textureType == TextureType.PLAYER_GROUND_BOMB && x.tag == Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE).map(x => x.uri);
		//this.selectedAirBombUris = Constants.CONSTRUCT_TEMPLATES.filter(x => x.textureType == TextureType.PLAYER_AIR_BOMB && x.tag == Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE).map(x => x.uri);

		this.ammunitionBar = new HealthBar(Constants.getRandomUriFromUris(selectedGroundBombUris), this, 0xf8cf26)
			.setToDisplayValue(true)
			.setDoNotHideOnZeroValue(true)
			.setMaximumValue(this.playerAmmoBeltSize)
			.setValue(this.playerAmmoBeltSize);

		this.repositionAmmunitionBar();

		// set the game controller
		this.gameController = new GameController({
			onPause: (isPaused) => {
				if (isPaused) {
					this.pauseGame();
				}
				else {
					this.resumeGame();
				}
			},
			onQuit: () => {
				this.gameOver();
			}
		});
		this.addChild(this.gameController);
		this.stageBorder = new Graphics().beginFill().drawRoundedRect(5, 5, SceneManager.width - 10, SceneManager.height - 10, 5).endFill();
		this.mask = this.stageBorder;

		// set the on screen message layer
		this.onScreenMessage = new OnScreenMessage(this);

		// progress the frames a little bit to avoid blank scene
		for (var i = 0; i < 350; i++) {
			this.processFrame();
		}

		// show message in the beginning
		switch (Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE) {
			case PlayerGroundBombTemplate.GRENADE: { this.generateOnScreenMessage("Drop granades on honkers!", this.talkIcon); } break;
			case PlayerGroundBombTemplate.TRASH_BIN: { this.generateOnScreenMessage("Drop trash bins on honkers!", this.talkIcon); } break;
			case PlayerGroundBombTemplate.DYNAMITE: { this.generateOnScreenMessage("Drop dynamites on honkers!", this.talkIcon); } break;
		}

		// start hovering sound for player ride
		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case PlayerRideTemplate.CHOPPER: { SoundManager.play(SoundType.CHOPPER_HOVERING, 0.1, true); } break;
			case PlayerRideTemplate.SPHERE: { SoundManager.play(SoundType.SPHERE_FLOATING, 0.6, true); } break;
			default:
		}

		// start background sounds
		SoundManager.stop(SoundType.GAME_INTRO_MUSIC);
		SoundManager.play(SoundType.AMBIENCE, 0.3, true);
		SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC, 0.3, true);
		SoundManager.play(SoundType.GAME_START);

		this.stageOpeningCircle = new GameObjectContainer();
		this.stageOpeningCircle.expandSpeed = 0.4;
		this.stageOpeningCircle.addChild(new Graphics().lineStyle(250, 0x1f2a36).drawCircle(0, 0, 165));
		this.stageOpeningCircle.setPosition(SceneManager.width / 2, SceneManager.height / 2);
		this.addChild(this.stageOpeningCircle);
	}

	//#endregion

	//#region Scene

	public update() {
		this.processFrame();

		if (this.stageOpeningCircle.scale.x <= 200) {
			this.stageOpeningCircle.expand();
		}

		//this.logCount();
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.gameController.pauseGame();
		}
		else {
			this.sceneContainer.scale.set(scale);
			this.gameController.resize();

			this.repositionGameScoreBar();
			this.repositionPlayerHealthBar();
			this.repositionBossHealthBar();
			this.repositionPowerUpBar();
			this.repositionSoundPollutionBar();
			this.repositionAmmunitionBar();

			let color = this.stageBackgroundColors[Constants.getRandomNumber(0, this.stageBackgroundColors.length - 1)];
			this.stageBackgroundColor.clear().beginFill(color, 1).drawRect(0, 0, SceneManager.width, SceneManager.height).endFill();
			this.stageBorder.clear().beginFill().drawRoundedRect(5, 5, SceneManager.width - 10, SceneManager.height - 10, 5).endFill();

			let xMultiplier = 1;
			let yMultiplier = 1;

			if (SceneManager.scaling != 1) {
				if (SceneManager.width > 900) {
					xMultiplier = 1.45;
					yMultiplier = 1.35;
				}
				else if (SceneManager.width > 800) {
					xMultiplier = 1.60;
					yMultiplier = 1.60;
				}
				else if (SceneManager.width > 600) {
					xMultiplier = 1.50;
					yMultiplier = 1.60;
				}
				else {
					xMultiplier = 1.45;
					yMultiplier = 1.60;
				}
			}
			else {
				xMultiplier = 1.08;
				yMultiplier = 1.30;
			}

			this.sceneBoundaryWidth = Constants.DEFAULT_GAME_VIEW_WIDTH * (SceneManager.scaling * xMultiplier);
			this.sceneBoundaryHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT * (SceneManager.scaling * yMultiplier);
		}
	}

	private processFrame() {

		if (!this.gameController.isPaused) {
			this.generateGameObjects();
			this.animateGameObjects();
			this.gameController.update();
		}
	}

	private spawnGameObjects() {

		this.spawnRoadMarks();
		this.spawnSideWalksTop();

		this.spawnVehicleSmokes();
		this.spawnVehicleEnemys();
		this.spawnVehicleBosss();

		this.spawnHonks();
		this.spawnVehicleBossAirBombs();

		this.spawnSideWalksBottom();
		this.spawnBlowSmokeExplosions();
		this.spawnRingSmokeExplosions();

		this.spawnPlayerGroundBombs();
		this.spawnPlayerAirBombs();
		this.spawnPlayerAirBombHurlingBalls();
		this.spawnPlayerArmorSpheres();
		this.spawnPlayerRide();

		this.spawnUfoBossAirBombs();
		this.spawnUfoBossAirBombSeekingBalls();
		this.spawnUfoBosss();

		this.spawnZombieBosss();
		this.spawnZombieBossAirBombCubes();

		this.spawnMafiaBosss();
		this.spawnMafiaBossAirBombs();
		this.spawnMafiaBossAirBombHurlingBalls();

		this.spawnUfoEnemyAirBombs();
		this.spawnUfoEnemys();

		this.spawnFlashExplosions();
		this.spawnRingFireExplosions();
		this.spawnGrandExplosionRings();

		this.spawnHealthPickups();
		this.spawnPowerUpPickups();

		this.spawnMessageBubbles();

		//this.spawnSideWalkPillarsBottom();
		this.spawnLeafs();
	}

	private generateGameObjects() {

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.generateRoadMarks();
			this.generateSideWalksTop();
		}

		this.generateVehicleEnemys();
		this.generateVehicleBoss();
		this.generateVehicleBossAirBombs();

		this.generateUfoBoss();
		this.generateUfoBossAirBombs();
		this.generateUfoBossAirBombSeekingBalls();

		this.generateZombieBoss();
		this.generateZombieBossAirBombCubes();

		this.generateMafiaBoss();
		this.generateMafiaBossAirBombs();
		this.generateMafiaBossAirBombHurlingBalls();

		this.generateUfoEnemys();

		this.generateHealthPickups();
		this.generatePowerUpPickups();

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.generateSideWalksBottom();
			//this.generateSideWalkPillarsBottom();
		}

		this.generateBossDeathExplosions();
		this.generateBossLowHealthExplosions();
		this.generatePlayerLowHealthExplosions();

		this.generateLeafs();
	}

	private animateGameObjects() {

		this.animatePlayerRide();
		this.animatePlayerArmorSpheres();

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.animateRoadMarks();
			this.animateSideWalksTop();
		}

		this.animateVehicleEnemys();
		this.animateVehicleSmokes();
		this.animateVehicleBoss();
		this.animateVehicleBossAirBombs();

		this.animateHonks();

		this.animateFlashExplosions();
		this.animateBlowSmokeExplosions();
		this.animateRingSmokeExplosions();
		this.animateRingFireExplosions();
		this.animateGrandExplosionRings();

		this.animatePlayerGroundBombs();
		this.animatePlayerAirBombs();
		this.animatePlayerAirBombHurlingBalls();

		this.animateUfoBoss();
		this.animateUfoBossAirBombs();
		this.animateUfoBossAirBombSeekingBalls();

		this.animateZombieBoss();
		this.animateZombieBossAirBombCubes();

		this.animateMafiaBoss();
		this.animateMafiaBossAirBombs();
		this.animateMafiaBossAirBombHurlingBalls();

		this.animateUfoEnemys();
		this.animateUfoEnemyAirBombs();

		this.animateHealthPickups();
		this.animatePowerUpPickups();

		this.animateCastShadows();

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.animateSideWalksBottom();
			//this.animateSideWalkPillarsBottom();
		}

		this.animateOnScreenMessage();
		this.animateMessageBubbles();

		this.animateLeafs();
	}

	//private countPrintDelay: number = 6;

	//private logCount() {
	//	this.countPrintDelay -= 0.1;

	//	if (this.countPrintDelay <= 0) {
	//		console.log("Total Count: " + this.sceneContainer.children.length + " Animating: " + this.sceneContainer.children.filter(x => x.renderable == true).length);
	//		this.countPrintDelay = 6;
	//	}
	//}

	//#endregion

	//#region Game

	private addScore(airEnemyBusted: boolean = true) {

		// TODO: set this to 0 after testing
		let score = 0;

		if (airEnemyBusted) {
			switch (Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE) {
				case PlayerAirBombTemplate.GRAVITY_BALL: { score += 1; } break;
				case PlayerAirBombTemplate.MISSILE: { score += 2; } break;
				case PlayerAirBombTemplate.BULLET_BALL: { score += 3; } break;
				default: { score += 1; } break;
			}
		}
		else {
			switch (Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE) {
				case PlayerGroundBombTemplate.TRASH_BIN: { score += 1; } break;
				case PlayerGroundBombTemplate.GRENADE: { score += 2; } break;
				case PlayerGroundBombTemplate.DYNAMITE: { score += 3; } break;
				default: { score += 1; } break;
			}
		}

		this.gameScoreBar.gainScore(score);
	}

	private pauseGame() {
		if (this.anyBossExists()) {
			SoundManager.pause(SoundType.BOSS_BACKGROUND_MUSIC);

			if (this.anyInAirBossExists()) {
				SoundManager.pause(SoundType.UFO_HOVERING);
			}
		}
		else {
			SoundManager.pause(SoundType.GAME_BACKGROUND_MUSIC);
		}

		if (this.ufoEnemyExists()) {
			SoundManager.pause(SoundType.UFO_HOVERING);
		}

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case PlayerRideTemplate.CHOPPER: { SoundManager.pause(SoundType.CHOPPER_HOVERING); } break;
			case PlayerRideTemplate.SPHERE: { SoundManager.pause(SoundType.SPHERE_FLOATING); } break;
			default:
		}

		SoundManager.pause(SoundType.AMBIENCE);

		this.generateOnScreenMessage("Game paused", this.behindBackIcon);

		this.sceneContainer.filters = [new BlurFilter()];
	}

	private resumeGame() {
		if (this.anyBossExists()) {
			SoundManager.resume(SoundType.BOSS_BACKGROUND_MUSIC);

			if (this.anyInAirBossExists()) {
				SoundManager.resume(SoundType.UFO_HOVERING);
			}
		}
		else {
			SoundManager.resume(SoundType.GAME_BACKGROUND_MUSIC);
		}

		if (this.ufoEnemyExists()) {
			SoundManager.resume(SoundType.UFO_HOVERING);
		}

		SoundManager.resume(SoundType.AMBIENCE);

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case PlayerRideTemplate.CHOPPER: { SoundManager.resume(SoundType.CHOPPER_HOVERING); } break;
			case PlayerRideTemplate.SPHERE: { SoundManager.resume(SoundType.SPHERE_FLOATING); } break;
			default:
		}

		if (this.onScreenMessage.isAnimating == true && this.onScreenMessage.getText() == "Game paused") {
			this.onScreenMessage.disableRendering();
		}

		this.sceneContainer.filters = null;
	}

	private gameOver() {
		SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
		SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
		SoundManager.stop(SoundType.UFO_HOVERING);
		SoundManager.stop(SoundType.UFO_BOSS_ENTRY);
		SoundManager.stop(SoundType.UFO_ENEMY_ENTRY);
		SoundManager.stop(SoundType.AMBIENCE);
		SoundManager.stop(SoundType.CHOPPER_HOVERING);
		SoundManager.stop(SoundType.SPHERE_FLOATING);

		Constants.GAME_SCORE = this.gameScoreBar.getScore();
		Constants.GAME_LEVEL = this.gameLevelBar.getScore();

		this.stageBorder.destroy();
		this.stageBackgroundColor.destroy();

		this.removeChild(this.sceneContainer);
		this.sceneContainer.destroy();
		SceneManager.changeScene(new GameOverScene());
	}

	private levelUp() {
		SoundManager.play(SoundType.LEVEL_UP);
		this.gameLevelBar.gainScore(1);
		this.generateOnScreenMessage("Gained Lvl " + this.gameLevelBar.getScore().toString(), this.cheerIcon);
	}

	//#endregion

	//#region CastShadow

	private castShadowGameObjects: Array<CastShadow> = [];

	spawnCastShadow(source: GameObjectContainer) {

		const gameObject: CastShadow = new CastShadow(source, 40, 15);
		gameObject.disableRendering();

		this.castShadowGameObjects.push(gameObject);
		this.sceneContainer.addChild(gameObject);
	}

	animateCastShadows() {
		var animatingCastShadows = this.castShadowGameObjects.filter(x => x.source.isAnimating == true);

		if (animatingCastShadows) {

			animatingCastShadows.forEach(dropShadow => {

				if (!dropShadow.isAnimating) {
					dropShadow.reset();
					dropShadow.enableRendering();
				}
				dropShadow.move();
			});
		}

		var nonAnimatingCastShadows = this.castShadowGameObjects.filter(x => x.source.isAnimating == false || x.source.isBlasting || x.source.isDroppedOnGround || x.source.isDead());

		if (nonAnimatingCastShadows) {

			nonAnimatingCastShadows.forEach(dropShadow => {
				if (dropShadow.isAnimating)
					dropShadow.disableRendering();
			});
		}
	}

	//#endregion

	//#region Honks

	private honkSize = { width: 90, height: 90 };
	private honkGameObjects: Array<Honk> = [];

	private spawnHonks() {

		for (let j = 0; j < 5; j++) {

			const honk: Honk = new Honk(Constants.DEFAULT_CONSTRUCT_SPEED);
			honk.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.HONK));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.honkSize.width;
			sprite.height = this.honkSize.height;
			sprite.anchor.set(0.5, 0.5);
			honk.addChild(sprite);

			this.honkGameObjects.push(honk);
			this.sceneContainer.addChild(honk);
		}
	}

	private generateHonk(source: GameObjectContainer) {

		if (source.getLeft() - 50 > 0 && source.getTop() - 50 > 0) {

			var honk = this.honkGameObjects.find(x => x.isAnimating == false);

			if (honk) {
				honk.reset();
				honk.reposition(source);
				honk.setPopping();
				honk.enableRendering();
			}
		}
	}

	private animateHonks() {

		var animatingHonks = this.honkGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonks) {

			animatingHonks.forEach(honk => {
				honk.dillyDally();
				honk.pop();
				honk.fade();

				if (honk.hasFaded()) {
					honk.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region MessageBubbles

	private messageBubbleGameObjects: Array<MessageBubble> = [];

	private spawnMessageBubbles() {

		for (let j = 0; j < 5; j++) {

			const gameObject: MessageBubble = new MessageBubble(0);
			gameObject.disableRendering();

			this.messageBubbleGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateMessageBubble(source: GameObjectContainer, message: string) {

		if (source.getLeft() > 0 && source.getTop() > 0) {

			var existingMessageBubble = this.messageBubbleGameObjects.find(x => x.isAnimating == true && x.source == source); // if a message bubble exists for the same source, reuse it

			if (existingMessageBubble) {
				existingMessageBubble.reset();
				existingMessageBubble.reposition(source, message, 22);
				existingMessageBubble.setPopping();
				existingMessageBubble.enableRendering();
			}
			else {
				var messageBubble = this.messageBubbleGameObjects.find(x => x.isAnimating == false);

				if (messageBubble) {
					messageBubble.reset();
					messageBubble.reposition(source, message, 22);
					messageBubble.setPopping();
					messageBubble.enableRendering();
				}
			}
		}
	}

	private animateMessageBubbles() {

		var animatingMessageBubbles = this.messageBubbleGameObjects.filter(x => x.isAnimating == true);

		if (animatingMessageBubbles) {

			animatingMessageBubbles.forEach(gameObject => {
				gameObject.pop();
				gameObject.depleteOnScreenDelay();
				gameObject.move();

				if (gameObject.isDepleted() || gameObject.source.isAnimating == false) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region Taunts

	private tauntDelay: number = 15;
	private ufoEnemyTaunts: string[] = ["Let the humans honk!", "We want more honks!", "We will stop you!", "You can't beat us!'.", "The city is ours!"];
	private vehicleBossTaunts: string[] = ["Catch me if you can!", "Too slow!", "You're no match for me!", "Let's see how you do.", "I am the boss!"];
	private ufoBossTaunts: string[] = ["You have met your doom.", "My logic is undeniable.", "You can't beat me!", "Ha! ha! ha! ha! ha!", "I am the boss!"];
	private zombieBossTaunts: string[] = ["You belong to the dead!", "I have arisen!", "You shall meet your grave", "Darkness awaits you!", "I am the boss!"];
	private mafiaBossTaunts: string[] = ["You are in big trouble now!", "Hah! crawl back to your hole!", "You're no match for me!", "You will go down!", "I am the boss!"];

	private generateTaunts(source: GameObjectContainer) {
		if (this.anyBossExists() || this.ufoEnemyExists()) {

			this.tauntDelay -= 0.1;

			if (this.tauntDelay <= 0) {

				let message: string = "";

				if (this.ufoEnemyExists()) {
					message = this.ufoEnemyTaunts[Constants.getRandomNumber(0, this.ufoEnemyTaunts.length - 1)];
					this.tauntDelay = Constants.getRandomNumber(25, 40);
				}
				else if (this.vehicleBossExists()) {
					message = this.vehicleBossTaunts[Constants.getRandomNumber(0, this.vehicleBossTaunts.length - 1)];
					this.tauntDelay = Constants.getRandomNumber(15, 30);
				}
				else if (this.ufoBossExists()) {
					message = this.ufoBossTaunts[Constants.getRandomNumber(0, this.ufoBossTaunts.length - 1)];
					this.tauntDelay = Constants.getRandomNumber(15, 30);
				}
				else if (this.zombieBossExists()) {
					message = this.zombieBossTaunts[Constants.getRandomNumber(0, this.zombieBossTaunts.length - 1)];
					this.tauntDelay = Constants.getRandomNumber(20, 35);
				}
				else if (this.mafiaBossExists()) {
					message = this.mafiaBossTaunts[Constants.getRandomNumber(0, this.mafiaBossTaunts.length - 1)];
					this.tauntDelay = Constants.getRandomNumber(15, 35);
				}

				this.generateMessageBubble(source, message);
			}
		}
	}

	//#endregion

	//#region Environment

	//#region RoadMarks

	private roadMarkXyAdjustment: number = 890;

	private roadMarkSize = { width: 1400, height: 1400 };
	private roadMarksGameObjects: Array<RoadMark> = [];

	private readonly roadMarkPopDelayDefault: number = 84.5 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadMarkPopDelay: number = 0;

	private spawnRoadMarks() {

		for (let j = 0; j < 3; j++) {

			const gameObject: RoadMark = new RoadMark(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.ROAD_MARK));
				sprite.x = (this.roadMarkSize.width * i) - (this.roadMarkXyAdjustment * i);
				sprite.y = ((this.roadMarkSize.height / 2) * i) - (((this.roadMarkXyAdjustment) / 2) * i);
				sprite.width = this.roadMarkSize.width;
				sprite.height = this.roadMarkSize.height;
				gameObject.addChild(sprite);
			}

			this.roadMarksGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateRoadMarks() {

		this.roadMarkPopDelay -= 0.1;

		if (this.roadMarkPopDelay < 0) {

			var gameObject = this.roadMarksGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				gameObject.setPosition((gameObject.width * -1) - 730, gameObject.height * -1);
				gameObject.enableRendering();

				this.roadMarkPopDelay = this.roadMarkPopDelayDefault;
			}
		}
	}

	private animateRoadMarks() {

		var animatingRoadMarks = this.roadMarksGameObjects.filter(x => x.isAnimating == true);

		if (animatingRoadMarks) {

			animatingRoadMarks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region SideWalks

	private sideWalkXyAdjustment: number = 192;
	private sideWalkSize = { width: 750, height: 750 };
	private sideWalkTopGameObjects: Array<RoadSideWalk> = [];
	private sideWalkBottomGameObjects: Array<RoadSideWalk> = [];

	private readonly sideWalkPopDelayDefault: number = 93 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private sideWalkPopDelayTop: number = 12;
	private sideWalkPopDelayBottom: number = 16;

	private spawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: RoadSideWalk = new RoadSideWalk(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.ROAD_SIDE_WALK_TOP));

				sprite.x = this.sideWalkSize.width * i - (this.sideWalkXyAdjustment * i);
				sprite.y = (this.sideWalkSize.height / 2) * i - ((this.sideWalkXyAdjustment / 2) * i);

				sprite.width = this.sideWalkSize.width;
				sprite.height = this.sideWalkSize.height;

				gameObject.addChild(sprite);
			}

			this.sideWalkTopGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private spawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: RoadSideWalk = new RoadSideWalk(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.ROAD_SIDE_WALK_BOTTOM));

				sprite.x = this.sideWalkSize.width * i - (this.sideWalkXyAdjustment * i);
				sprite.y = (this.sideWalkSize.height / 2) * i - ((this.sideWalkXyAdjustment / 2) * i);

				sprite.width = this.sideWalkSize.width;
				sprite.height = this.sideWalkSize.height;

				gameObject.addChild(sprite);
			}

			this.sideWalkBottomGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateSideWalksTop() {

		this.sideWalkPopDelayTop -= 0.1;

		if (this.sideWalkPopDelayTop < 0) {

			var gameObject = this.sideWalkTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = -2500;
				gameObject.y = gameObject.height * -1;
				gameObject.enableRendering();
				this.sideWalkPopDelayTop = this.sideWalkPopDelayDefault;
			}
		}
	}

	private generateSideWalksBottom() {

		this.sideWalkPopDelayBottom -= 0.1;

		if (this.sideWalkPopDelayBottom < 0) {

			var gameObject = this.sideWalkBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = gameObject.width * -1;
				gameObject.y = -1230;
				gameObject.enableRendering();
				this.sideWalkPopDelayBottom = this.sideWalkPopDelayDefault;
			}
		}
	}

	private animateSideWalksTop() {

		var animatingSideWalks = this.sideWalkTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - (this.sideWalkSize.width + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateSideWalksBottom() {

		var animatingSideWalks = this.sideWalkBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - (this.sideWalkSize.width + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - (this.sideWalkSize.width + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region SideWalkPillars

	//private sideWalkPillarXyAdjustment: number = 192;
	//private sideWalkPillarSize = { width: 750, height: 750 };
	//private sideWalkPillarBottomGameObjects: Array<RoadSideWalkPillar> = [];

	//private readonly sideWalkPillarPopDelayDefault: number = 93 / Constants.DEFAULT_CONSTRUCT_DELTA;
	//private sideWalkPillarPopDelayBottom: number = 16;

	//private spawnSideWalkPillarsBottom() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: RoadSideWalkPillar = new RoadSideWalkPillar(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		gameObject.disableRendering();

	//		for (let i = 0; i < 5; i++) {

	//			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_BOTTOM_PILLARS));

	//			sprite.x = this.sideWalkPillarSize.width * i - (this.sideWalkPillarXyAdjustment * i);
	//			sprite.y = (this.sideWalkPillarSize.height / 2) * i - ((this.sideWalkPillarXyAdjustment / 2) * i);

	//			sprite.width = this.sideWalkPillarSize.width;
	//			sprite.height = this.sideWalkPillarSize.height;

	//			gameObject.addChild(sprite);
	//		}

	//		this.sideWalkPillarBottomGameObjects.push(gameObject);
	//		this.sceneContainer.addChild(gameObject);
	//	}
	//}

	//private generateSideWalkPillarsBottom() {

	//	this.sideWalkPillarPopDelayBottom -= 0.1;

	//	if (this.sideWalkPillarPopDelayBottom < 0) {

	//		var gameObject = this.sideWalkPillarBottomGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {
	//			gameObject.x = gameObject.width * -1;
	//			gameObject.y = -1210;
	//			gameObject.enableRendering();
	//			this.sideWalkPillarPopDelayBottom = this.sideWalkPillarPopDelayDefault;
	//		}
	//	}
	//}

	//private animateSideWalkPillarsBottom() {

	//	var animatingSideWalkPillars = this.sideWalkPillarBottomGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingSideWalkPillars) {

	//		animatingSideWalkPillars.forEach(gameObject => {
	//			gameObject.moveDownRight();

	//			if (gameObject.x - (this.sideWalkPillarSize.width + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - (this.sideWalkPillarSize.width + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.disableRendering();
	//			}
	//		});
	//	}
	//}

	//#endregion

	//#region Leafs

	private leafSize = { width: 256 / 3, height: 256 / 3 };
	private leafGameObjects: Array<Leaf> = [];

	private leafPopDelayDefault: number = 30 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private leafPopDelay: number = 0;

	private spawnLeafs() {

		for (let j = 0; j < 5; j++) {

			const leaf: Leaf = new Leaf(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2));
			leaf.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.LEAF));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.leafSize.width;
			sprite.height = this.leafSize.height;
			leaf.addChild(sprite);

			leaf.setHoverSpeed(0.6);
			leaf.setDillyDallySpeed(0.6);

			this.leafGameObjects.push(leaf);
			this.sceneContainer.addChild(leaf);
		}
	}

	private generateLeafs() {

		this.leafPopDelay -= 0.1;

		if (this.leafPopDelay < 0) {

			var leaf = this.leafGameObjects.find(x => x.isAnimating == false);

			if (leaf) {
				leaf.reset();
				leaf.reposition();
				leaf.enableRendering();

				this.leafPopDelay = Constants.getRandomNumber(this.leafPopDelayDefault, this.leafPopDelayDefault + 20);
			}
		}
	}

	private animateLeafs() {

		var animatingLeafs = this.leafGameObjects.filter(x => x.isAnimating == true);

		if (animatingLeafs) {

			animatingLeafs.forEach(leaf => {
				leaf.hover();
				leaf.dillyDally();
				leaf.rotate(RotationDirection.Forward, 0, 0.6);
				leaf.moveDownRight();

				if (leaf.x - leaf.width > Constants.DEFAULT_GAME_VIEW_WIDTH || leaf.y - leaf.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					leaf.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region Explosions

	//#region GrandExplosionRings

	private grandExplosionRingSize = { width: 145, height: 145 };
	private grandExplosionRingGameObjects: Array<GrandExplosionRing> = [];

	private spawnGrandExplosionRings() {

		for (let j = 0; j < 1; j++) {

			const gameObject: GrandExplosionRing = new GrandExplosionRing(0);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.GRAND_EXPLOSION_RING));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.grandExplosionRingSize.width;
			sprite.height = this.grandExplosionRingSize.height;
			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.grandExplosionRingGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateGrandExplosionRing(source: GameObjectContainer) {

		var gameObject = this.grandExplosionRingGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.enableRendering();
		}
	}

	private animateGrandExplosionRings() {

		var animatingGrandExplosionRings = this.grandExplosionRingGameObjects.filter(x => x.isAnimating == true);

		if (animatingGrandExplosionRings) {

			animatingGrandExplosionRings.forEach(gameObject => {
				gameObject.fade();
				gameObject.expand();

				if (gameObject.hasFaded()) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region RingExplosions

	private ringFireExplosionGameObjects: Array<Explosion> = [];

	spawnRingFireExplosions() {

		for (let j = 0; j < 10; j++) {

			const gameObject: Explosion = new Explosion(Constants.DEFAULT_CONSTRUCT_SPEED - 2, ExplosionType.RING_EXPLOSION);
			gameObject.disableRendering();

			this.ringFireExplosionGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	generateRingFireExplosion(source: GameObjectContainer) {
		var gameObject = this.ringFireExplosionGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.setPopping();
			gameObject.enableRendering();
		}
	}

	animateRingFireExplosions() {
		var animatingHonkBombs = this.ringFireExplosionGameObjects.filter(x => x.isAnimating == true);
		if (animatingHonkBombs) {
			animatingHonkBombs.forEach(gameObject => {
				gameObject.pop();
				gameObject.fade();
				gameObject.moveDownRight();

				if (gameObject.hasFaded() || gameObject.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region FlashExplosions

	private flashExplosionGameObjects: Array<Explosion> = [];

	spawnFlashExplosions() {

		for (let j = 0; j < 10; j++) {

			const gameObject: Explosion = new Explosion(Constants.DEFAULT_CONSTRUCT_SPEED + 2, ExplosionType.FLASH_EXPLOSION);
			gameObject.disableRendering();

			this.flashExplosionGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	generateFlashExplosion(source: GameObjectContainer) {
		var gameObject = this.flashExplosionGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.setPopping();
			gameObject.enableRendering();
		}
	}

	animateFlashExplosions() {
		var animatingHonkBombs = this.flashExplosionGameObjects.filter(x => x.isAnimating == true);
		if (animatingHonkBombs) {
			animatingHonkBombs.forEach(gameObject => {
				gameObject.pop();
				gameObject.fade();

				if (gameObject.hasFaded() || gameObject.getRight() < 0 || gameObject.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region RingSmokeExplosions	

	private ringSmokeExplosionGameObjects: Array<Explosion> = [];

	spawnRingSmokeExplosions() {

		for (let j = 0; j < 10; j++) {

			const gameObject: Explosion = new Explosion(Constants.DEFAULT_CONSTRUCT_SPEED - 2, ExplosionType.RING_SMOKE_EXPLOSION);
			gameObject.disableRendering();

			this.ringSmokeExplosionGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	generateRingSmokeExplosion(source: GameObjectContainer) {
		var gameObject = this.ringSmokeExplosionGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.setPopping();
			gameObject.enableRendering();
		}
	}

	animateRingSmokeExplosions() {
		var animatingHonkBombs = this.ringSmokeExplosionGameObjects.filter(x => x.isAnimating == true);
		if (animatingHonkBombs) {
			animatingHonkBombs.forEach(gameObject => {
				gameObject.pop();
				gameObject.fade();
				gameObject.moveDownRight();

				if (gameObject.hasFaded() || gameObject.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region BlowSmokeExplosions	

	private blowSmokeExplosionGameObjects: Array<Explosion> = [];

	spawnBlowSmokeExplosions() {

		for (let j = 0; j < 10; j++) {

			const gameObject: Explosion = new Explosion(Constants.DEFAULT_CONSTRUCT_SPEED - 2, ExplosionType.BLOW_SMOKE_EXPLOSION);
			gameObject.disableRendering();

			this.blowSmokeExplosionGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	generateBlowSmokeExplosion(source: GameObjectContainer) {
		var gameObject = this.blowSmokeExplosionGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.setPopping();
			gameObject.enableRendering();
		}
	}

	animateBlowSmokeExplosions() {
		var animatingHonkBombs = this.blowSmokeExplosionGameObjects.filter(x => x.isAnimating == true);
		if (animatingHonkBombs) {
			animatingHonkBombs.forEach(gameObject => {
				gameObject.pop();
				gameObject.fade();
				gameObject.moveDownRight();

				if (gameObject.hasFaded() || gameObject.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region BossDeathExplosions

	private bossDeathExplosionDuration: number = 0;
	private readonly bossDeathExplosionDurationDefault: number = 10;

	private bossDeathExplosionDelay: number = 0;
	private readonly bossDeathExplosionDelayDefault: number = 2 / Constants.DEFAULT_CONSTRUCT_DELTA;

	private generateBossDeathExplosions() {

		if (this.anyBossExists()) {

			if (this.isBossDeathExploding()) {
				this.bossDeathExplosionDuration -= 0.1; // deplete the explosion duration
				this.bossDeathExplosionDelay -= 0.1; // deplete the explosion generation delay

				if (this.bossDeathExplosionDelay < 0) {

					// get all the bosses and check
					let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true);
					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true);
					let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true);
					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true);

					let anyBoss;

					if (vehicleBoss) {
						anyBoss = vehicleBoss;
					}
					else if (ufoBoss) {
						anyBoss = ufoBoss;
					}
					else if (zombieBoss) {
						anyBoss = zombieBoss;
					}
					else if (mafiaBoss) {
						anyBoss = mafiaBoss;
					}

					if (anyBoss) {
						this.generateRingFireExplosion(anyBoss);
						SoundManager.play(SoundType.AIR_BOMB_BLAST);

						if (this.bossDeathExplosionDuration <= 1) { // when duration depletes generate an explosion ring
							this.generateGrandExplosionRing(anyBoss);

							if (vehicleBoss) {
								vehicleBoss.setHopping(); // set it to hop just when explosion ring blasts
								vehicleBoss.setDestroyed(); // once blast explosion finishes set it to grayscale
							}
						}
					}

					this.bossDeathExplosionDelay = this.bossDeathExplosionDelayDefault;
				}
			}
		}
	}

	private isBossDeathExploding() {
		return this.bossDeathExplosionDuration > 0;
	}

	private setBossDeathExplosion() {
		this.bossDeathExplosionDelay = this.bossDeathExplosionDelayDefault;
		this.bossDeathExplosionDuration = this.bossDeathExplosionDurationDefault;
	}

	//#endregion

	//#region BossLowHealthExplosions

	private bossLowHealthExplosionDelay: number = 0;
	private readonly bossLowHealthExplosionDelayDefault: number = 7 / Constants.DEFAULT_CONSTRUCT_DELTA;

	private generateBossLowHealthExplosions() {

		let healthProgress = this.bossHealthBar.getProgress();

		if (this.anyBossExists() && healthProgress > 0 && healthProgress <= 50) {

			this.bossLowHealthExplosionDelay -= 0.1;

			if (this.bossLowHealthExplosionDelay < 0) {

				// get all the bosses and check

				let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true);
				let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true);
				let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true);
				let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true);

				let anyBoss;

				if (vehicleBoss) {
					anyBoss = vehicleBoss;
				}
				else if (ufoBoss) {
					anyBoss = ufoBoss;
				}
				else if (zombieBoss) {
					anyBoss = zombieBoss;
				}
				else if (mafiaBoss) {
					anyBoss = mafiaBoss;
				}

				if (anyBoss) {
					this.generateRingSmokeExplosion(anyBoss); // generate smoke at 50

					if (healthProgress <= 30) {
						this.generateRingFireExplosion(anyBoss); // generate fire at 30
					}
				}

				this.bossLowHealthExplosionDelay = this.bossLowHealthExplosionDelayDefault;
			}
		}
	}

	//#endregion

	//#region PlayerLowHealthExplosions

	private playerLowHealthExplosionDelay: number = 0;
	private readonly playerLowHealthExplosionDelayDefault: number = 7 / Constants.DEFAULT_CONSTRUCT_DELTA;

	private generatePlayerLowHealthExplosions() {

		let healthProgress = this.playerHealthBar.getProgress();

		if (healthProgress > 0 && healthProgress <= 50) {

			this.playerLowHealthExplosionDelay -= 0.1;

			if (this.playerLowHealthExplosionDelay < 0) {

				if (this.player) {
					this.generateRingSmokeExplosion(this.player); // generate smoke at 50

					if (healthProgress <= 30) {
						this.generateRingFireExplosion(this.player); // generate fire at 30
					}
				}

				this.playerLowHealthExplosionDelay = this.playerLowHealthExplosionDelayDefault;
			}
		}
	}

	//#endregion

	//#endregion

	//#region Player

	//#region PlayerRide

	private playerRideSize = { width: 512, height: 512 };
	private player: PlayerRide = new PlayerRide();

	spawnPlayerRide() {
		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.PLAYER_RIDE_IDLE));
		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.playerRideSize.width / 3.5;
		sprite.height = this.playerRideSize.height / 3.5;
		sprite.anchor.set(0.5, 0.5);
		this.player.addChild(sprite);

		this.player.setPlayerRideTemplate(Constants.SELECTED_PLAYER_RIDE_TEMPLATE);
		this.player.disableRendering();

		this.sceneContainer.addChild(this.player);
		this.spawnCastShadow(this.player);
	}

	generatePlayerRide() {
		this.player.reset();
		this.player.reposition();
		this.player.enableRendering();
	}

	animatePlayerRide() {
		this.player.pop();
		this.player.hover();

		if (Constants.SELECTED_PLAYER_RIDE_TEMPLATE == PlayerRideTemplate.AIR_BALLOON) {
			this.player.dillyDally();
		}

		this.player.depleteAttackStance();
		this.player.depleteWinStance();
		this.player.depleteHitStance();
		this.player.recoverFromHealthLoss();
		this.player.move(this.sceneBoundaryWidth, this.sceneBoundaryHeight, this.gameController);

		if (this.gameController.isAttacking) {

			if (this.anyInAirEnemyExists()) {

				if (this.powerUpBar.hasHealth()) {

					switch (this.powerUpBar.tag) {
						case PowerUpType.HURLING_BALLS:
							{
								this.generatePlayerAirBombHurlingBall();
							}
							break;
						case PowerUpType.ARMOR:
							{
								this.generatePlayerAirBomb();
							}
							break;
						default:
							break;
					}
				}
				else {
					this.generatePlayerAirBomb();
				}
			}
			else {
				this.generatePlayerGroundBomb();
			}

			this.gameController.isAttacking = false;
		}
	}

	loosePlayerHealth() {

		if (this.powerUpBar.hasHealth() && this.powerUpBar.tag == PowerUpType.ARMOR) {
			this.depletePowerUp();

			var animatingArmorSphere = this.armorSphereGameObjects.find(x => x.isAnimating == true);
			if (animatingArmorSphere)
				animatingArmorSphere.setPopping();

		}
		else {
			this.player.setPopping();
			this.player.looseHealth();
			this.player.setHitStance();
			this.playerHealthBar.setValue(this.player.health);

			if (this.player.isDead()) {
				this.gameOver();
			}
		}
	}

	//#endregion

	//#region PlayerGroundBombs

	private playerGroundBombSize = { width: 60, height: 60 };
	private playerGroundBombGameObjects: Array<PlayerGroundBomb> = [];

	private readonly playerAmmoBeltSize: number = 3 + Constants.ATTACK_LEVEL_MAX;

	spawnPlayerGroundBombs() {

		for (let j = 0; j < this.playerAmmoBeltSize; j++) {

			const gameObject: PlayerGroundBomb = new PlayerGroundBomb(4);
			gameObject.disableRendering();
			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.PLAYER_GROUND_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerGroundBombSize.width;
			sprite.height = this.playerGroundBombSize.height;

			switch (Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE) {
				case PlayerGroundBombTemplate.DYNAMITE: {
					sprite.width = this.playerGroundBombSize.width / 1.3;
					sprite.height = this.playerGroundBombSize.height / 1.3;
				} break;
				default: {
					sprite.width = this.playerGroundBombSize.width;
					sprite.height = this.playerGroundBombSize.height;
				} break;
			}

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			gameObject.setTemplate(Constants.SELECTED_PLAYER_GROUND_BOMB_TEMPLATE);

			this.playerGroundBombGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerGroundBomb() {

		var playerGroundBomb = this.playerGroundBombGameObjects.find(x => x.isAnimating == false);

		if (playerGroundBomb) {
			playerGroundBomb.reset();
			playerGroundBomb.reposition(this.player);
			playerGroundBomb.setPopping();
			playerGroundBomb.enableRendering();
			this.player.setAttackStance();
			this.generateFlashExplosion(playerGroundBomb);
		}

		this.setAmmunitionBarValue(this.playerGroundBombGameObjects);
	}

	animatePlayerGroundBombs() {

		var animatingHonkBombs = this.playerGroundBombGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonkBombs) {

			animatingHonkBombs.forEach(playerGroundBomb => {

				playerGroundBomb.pop();

				if (playerGroundBomb.isBlasting) {
					this.animatePlayerGroundBombBlast(playerGroundBomb);
				}
				else {
					this.animatePlayerGroundBombFall(playerGroundBomb);
				}

				if (playerGroundBomb.hasFaded() || playerGroundBomb.hasShrinked() /*|| playerGroundBomb.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || playerGroundBomb.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					playerGroundBomb.disableRendering();
					this.setAmmunitionBarValue(this.playerGroundBombGameObjects);
				}
			});
		}
	}

	private animatePlayerGroundBombFall(playerGroundBomb: PlayerGroundBomb) {

		switch (playerGroundBomb.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.GRENADE: {
				playerGroundBomb.move();

				if (playerGroundBomb.awaitBlast()) {

					let vehicleEnemy = this.vehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerGroundBomb));

					if (vehicleEnemy) {
						this.looseVehicleEnemyhealth(vehicleEnemy as VehicleEnemy);
					}

					let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerGroundBomb));

					if (vehicleBoss) {
						this.looseVehicleBosshealth(vehicleBoss as VehicleBoss);
					}

					let randomDir = Constants.getRandomNumber(0, 3);

					switch (randomDir) {
						case 0: { playerGroundBomb.awaitMoveDownLeft = true; } break;
						case 1: { playerGroundBomb.awaitMoveDownRight = true; } break;
						case 2: { playerGroundBomb.awaitMoveUpLeft = true; } break;
						case 3: { playerGroundBomb.awaitMoveUpRight = true; } break;
						default: break;
					}

					this.generateBlowSmokeExplosion(playerGroundBomb);
					this.generateRingFireExplosion(playerGroundBomb);
				}
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {

				playerGroundBomb.move();

				if (playerGroundBomb.awaitBlast()) {

					let vehicleEnemy = this.vehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerGroundBomb));

					if (vehicleEnemy) {
						this.looseVehicleEnemyhealth(vehicleEnemy as VehicleEnemy);
					}

					let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerGroundBomb));

					if (vehicleBoss) {
						this.looseVehicleBosshealth(vehicleBoss as VehicleBoss);
					}

					let randomDir = Constants.getRandomNumber(0, 1);

					switch (randomDir) {
						case 0: { playerGroundBomb.awaitMoveUp = true; } break;
						case 1: { playerGroundBomb.awaitMoveUpRight = true; } break;
						default: break;
					}

					this.generateBlowSmokeExplosion(playerGroundBomb);
				}
			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {

				if (playerGroundBomb.isDroppedOnGround) {

					if (!this.isBossDeathExploding()) { // do not move the bomb is boss death explosion is happening

						playerGroundBomb.hop();
						playerGroundBomb.moveDownRight();

						let vehicleEnemy = this.vehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerGroundBomb));

						if (vehicleEnemy) {
							this.looseVehicleEnemyhealth(vehicleEnemy as VehicleEnemy);
						}

						let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerGroundBomb));

						if (vehicleBoss) {
							this.looseVehicleBosshealth(vehicleBoss as VehicleBoss);
						}

						if (vehicleEnemy || vehicleBoss) {
							let randomDir = Constants.getRandomNumber(0, 1);

							switch (randomDir) {
								case 0: { playerGroundBomb.awaitMoveDownLeft = true; } break;
								case 1: { playerGroundBomb.awaitMoveUpRight = true; } break;
								default: break;
							}

							playerGroundBomb.setBlast();
							this.generateBlowSmokeExplosion(playerGroundBomb);
							this.generateFlashExplosion(playerGroundBomb);
							this.generateRingFireExplosion(playerGroundBomb);
						}
					}

					if (playerGroundBomb.awaitBlast()) {
						this.generateBlowSmokeExplosion(playerGroundBomb);
						this.generateFlashExplosion(playerGroundBomb);
						this.generateRingFireExplosion(playerGroundBomb);
					}
				}
				else {
					playerGroundBomb.move();
					if (playerGroundBomb.awaitToDropOnGround()) {
						playerGroundBomb.setHopping();
						playerGroundBomb.setPopping();
					}
				}
			} break;
			default: break;
		}
	}

	private animatePlayerGroundBombBlast(playerGroundBomb: PlayerGroundBomb) {
		playerGroundBomb.fade();

		switch (playerGroundBomb.playerGroundBombTemplate) {
			case PlayerGroundBombTemplate.GRENADE: {
				if (playerGroundBomb.awaitMoveDownLeft) {
					playerGroundBomb.moveDownLeft();
					playerGroundBomb.rotate(RotationDirection.Backward, 0, 15);
				}
				else if (playerGroundBomb.awaitMoveDownRight) {
					playerGroundBomb.moveDownRight();
					playerGroundBomb.moveDownRight();
					playerGroundBomb.moveDownRight();
					playerGroundBomb.rotate(RotationDirection.Forward, 0, 15);
				}
				else if (playerGroundBomb.awaitMoveUpLeft) {
					playerGroundBomb.moveUpLeft();
					playerGroundBomb.rotate(RotationDirection.Backward, 0, 15);
				}
				else if (playerGroundBomb.awaitMoveUpRight) {
					playerGroundBomb.moveUpRight();
					playerGroundBomb.moveUpRight();
					playerGroundBomb.rotate(RotationDirection.Forward, 0, 15);
				}
			} break;
			case PlayerGroundBombTemplate.TRASH_BIN: {
				if (playerGroundBomb.awaitMoveUpRight) {
					playerGroundBomb.moveUpRight();
					playerGroundBomb.rotate(RotationDirection.Forward, 0, 0.5);
				}
				else if (playerGroundBomb.awaitMoveUp) {
					playerGroundBomb.moveUp();
					playerGroundBomb.rotate(RotationDirection.Backward, 0, 0.5);
				}

			} break;
			case PlayerGroundBombTemplate.DYNAMITE: {
				if (playerGroundBomb.awaitMoveUpRight) {
					playerGroundBomb.moveUpRight();
					playerGroundBomb.moveUpRight();
					playerGroundBomb.rotate(RotationDirection.Forward, 0, 10);
				}
				else if (playerGroundBomb.awaitMoveDownLeft) {
					playerGroundBomb.moveDownLeft();
					playerGroundBomb.rotate(RotationDirection.Backward, 0, 10);
				}
			} break;
			default: break;
		}
	}

	//#endregion

	//#region PlayerAirBombs

	private playerAirBombSize = { width: 90, height: 90 };
	private playerAirBombGameObjects: Array<PlayerAirBomb> = [];

	spawnPlayerAirBombs() {

		for (let j = 0; j < this.playerAmmoBeltSize; j++) {

			const gameObject: PlayerAirBomb = new PlayerAirBomb(4);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.PLAYER_AIR_BOMB));
			sprite.x = 0;
			sprite.y = 0;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			switch (Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE) {
				case PlayerAirBombTemplate.GRAVITY_BALL: {
					sprite.width = this.playerAirBombSize.width / 2;
					sprite.height = this.playerAirBombSize.height / 2;
					gameObject.setTemplate(PlayerAirBombTemplate.GRAVITY_BALL);
				} break;
				case PlayerAirBombTemplate.MISSILE: {
					sprite.width = this.playerAirBombSize.width;
					sprite.height = this.playerAirBombSize.height;
					gameObject.setTemplate(PlayerAirBombTemplate.MISSILE);
				} break;
				case PlayerAirBombTemplate.BULLET_BALL: {
					sprite.width = this.playerAirBombSize.width / 2;
					sprite.height = this.playerAirBombSize.height / 2;
					gameObject.setTemplate(PlayerAirBombTemplate.BULLET_BALL);
				} break;
				default: break;
			}

			this.playerAirBombGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerAirBomb() {

		var playerAirBomb = this.playerAirBombGameObjects.find(x => x.isAnimating == false);

		if (playerAirBomb) {
			playerAirBomb.reset();
			playerAirBomb.reposition(this.player);

			this.player.setAttackStance();

			let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

			let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating);
			let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating);

			let anyTarget: any = undefined;

			if (ufoBossRocketSeeking) {
				anyTarget = ufoBossRocketSeeking;
			}
			else if (ufoEnemy) {
				anyTarget = ufoEnemy;
			}
			else if (ufoBoss) {
				anyTarget = ufoBoss;
			}
			else if (zombieBoss) {
				anyTarget = zombieBoss;
			}
			else if (mafiaBoss) {
				anyTarget = mafiaBoss;
			}

			if (anyTarget) {
				this.setPlayerAirBombDirection(this.player, playerAirBomb, anyTarget);
				playerAirBomb.setPopping();
				playerAirBomb.enableRendering();
				this.generateFlashExplosion(playerAirBomb);
			}
		}

		this.setAmmunitionBarValue(this.playerAirBombGameObjects);
	}

	animatePlayerAirBombs() {

		var animatingHonkBombs = this.playerAirBombGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonkBombs) {

			animatingHonkBombs.forEach(playerAirBomb => {

				playerAirBomb.pop();

				if (playerAirBomb) {

					if (playerAirBomb.isBlasting) {
						playerAirBomb.shrink();
						playerAirBomb.fade();
					}
					else {

						switch (Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE) {
							case PlayerAirBombTemplate.GRAVITY_BALL: {

								playerAirBomb.decelerate();
								playerAirBomb.hover();

								if (playerAirBomb.awaitMoveDownLeft) {
									playerAirBomb.moveDownLeft();
								}
								else if (playerAirBomb.awaitMoveUpRight) {
									playerAirBomb.moveUpRight();
								}
								else if (playerAirBomb.awaitMoveUpLeft) {
									playerAirBomb.moveUpLeft();
								}
								else if (playerAirBomb.awaitMoveDownRight) {
									playerAirBomb.moveDownRight();
								}

							} break;
							case PlayerAirBombTemplate.MISSILE: {

								playerAirBomb.accelerate();
								playerAirBomb.hover();

								if (playerAirBomb.awaitMoveDownLeft) {
									playerAirBomb.moveDownLeft();
								}
								else if (playerAirBomb.awaitMoveUpRight) {
									playerAirBomb.moveUpRight();
								}
								else if (playerAirBomb.awaitMoveUpLeft) {
									playerAirBomb.moveUpLeft();
								}
								else if (playerAirBomb.awaitMoveDownRight) {
									playerAirBomb.moveDownRight();
								}

							} break;
							case PlayerAirBombTemplate.BULLET_BALL: {
								playerAirBomb.shoot();
								playerAirBomb.rotate(RotationDirection.Forward, 0, 2.0);
							} break;
							default: break;
						}

						let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerAirBomb));
						let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerAirBomb));

						let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerAirBomb));
						let zombieBossRocketBlock = this.zombieBossRocketBlockGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerAirBomb));

						let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerAirBomb));

						let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating == true && !x.isDead() && Constants.checkCloseCollision(x, playerAirBomb));

						let anyTarget: any = undefined;

						if (ufoBossRocketSeeking) {
							anyTarget = ufoBossRocketSeeking;
							ufoBossRocketSeeking.setBlast();
						}
						else if (ufoEnemy) {
							anyTarget = ufoEnemy;
							this.looseUfoEnemyhealth(ufoEnemy as UfoEnemy);
						}
						else if (ufoBoss) {
							anyTarget = ufoBoss;
							this.looseUfoBosshealth(ufoBoss as UfoBoss);
						}
						else if (zombieBossRocketBlock) {
							anyTarget = zombieBossRocketBlock;
							zombieBossRocketBlock.looseHealth();
						}
						else if (zombieBoss) {
							anyTarget = zombieBoss;
							this.looseZombieBosshealth(zombieBoss as ZombieBoss);
						}
						else if (mafiaBoss) {
							anyTarget = mafiaBoss;
							this.looseMafiaBosshealth(mafiaBoss as MafiaBoss);
						}

						if (anyTarget) {
							playerAirBomb.setBlast();
							this.generateRingFireExplosion(playerAirBomb);
							this.generateFlashExplosion(playerAirBomb);
						}

						if (playerAirBomb.autoBlast()) {
							playerAirBomb.setBlast();
							this.generateRingFireExplosion(playerAirBomb);
						}
					}
				}

				if (playerAirBomb.hasFaded() /*|| playerAirBomb.x > Constants.DEFAULT_GAME_VIEW_WIDTH || playerAirBomb.getRight() < 0 || playerAirBomb.getBottom() < 0 || playerAirBomb.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					playerAirBomb.disableRendering();
					this.setAmmunitionBarValue(this.playerAirBombGameObjects);
				}
			});
		}
	}

	setPlayerAirBombDirection(source: GameObjectContainer, playerAirBomb: PlayerAirBomb, target: GameObjectContainer) {

		if (playerAirBomb.playerAirBombTemplate == PlayerAirBombTemplate.BULLET_BALL) { // if bullet ball set the target
			playerAirBomb.setShootingTarget(target.getCloseBounds());
		}

		// rocket target is on the bottom right side of the UfoBoss
		if (target.getTop() > source.getTop() && target.getLeft() > source.getLeft()) {
			playerAirBomb.awaitMoveDownRight = true;
			playerAirBomb.setRotation(33);
		}
		// rocket target is on the bottom left side of the UfoBoss
		else if (target.getTop() > source.getTop() && target.getLeft() < source.getLeft()) {
			playerAirBomb.awaitMoveDownLeft = true;
			playerAirBomb.setRotation(-213);
		}
		// if rocket target is on the top left side of the UfoBoss
		else if (target.getTop() < source.getTop() && target.getLeft() < source.getLeft()) {
			playerAirBomb.awaitMoveUpLeft = true;
			playerAirBomb.setRotation(213);
		}
		// if rocket target is on the top right side of the UfoBoss
		else if (target.getTop() < source.getTop() && target.getLeft() > source.getLeft()) {
			playerAirBomb.awaitMoveUpRight = true;
			playerAirBomb.setRotation(-33);
		}
		else {
			playerAirBomb.awaitMoveUpLeft = true;
			playerAirBomb.setRotation(213);
		}
	}

	//#endregion

	//#region PlayerAirBombHurlingBalls

	private playerAirBombBullsEyeSize = { width: 60, height: 60 };
	private playerAirBombHurlingBallGameObjects: Array<PlayerAirBombHurlingBall> = [];

	spawnPlayerAirBombHurlingBalls() {

		for (let j = 0; j < this.playerAmmoBeltSize; j++) {

			const gameObject: PlayerAirBombHurlingBall = new PlayerAirBombHurlingBall(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.PLAYER_AIR_BOMB_HURLING_BALLS));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerAirBombBullsEyeSize.width;
			sprite.height = this.playerAirBombBullsEyeSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.playerAirBombHurlingBallGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerAirBombHurlingBall() {

		let playerAirBombBullsEye = this.playerAirBombHurlingBallGameObjects.find(x => x.isAnimating == false);

		if (playerAirBombBullsEye) {
			playerAirBombBullsEye.reset();
			playerAirBombBullsEye.reposition(this.player);
			playerAirBombBullsEye.setPopping();

			this.player.setAttackStance();

			let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

			let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating);
			let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating);

			let anyTarget: any = undefined;

			if (ufoBossRocketSeeking) {
				anyTarget = ufoBossRocketSeeking;
			}
			else if (ufoEnemy) {
				anyTarget = ufoEnemy;
			}
			else if (ufoBoss) {
				anyTarget = ufoBoss;
			}
			else if (zombieBoss) {
				anyTarget = zombieBoss;
			}
			else if (mafiaBoss) {
				anyTarget = mafiaBoss;
			}

			if (anyTarget) {
				playerAirBombBullsEye.setHurlingTarget(anyTarget.getCloseBounds());
				playerAirBombBullsEye.enableRendering();
				this.generateFlashExplosion(playerAirBombBullsEye);

				if (this.powerUpBar.hasHealth() && this.powerUpBar.tag == PowerUpType.HURLING_BALLS)
					this.depletePowerUp();
			}
		}

		this.setAmmunitionBarValue(this.playerAirBombHurlingBallGameObjects);
	}

	animatePlayerAirBombHurlingBalls() {

		let animatingPlayerAirBombHurlingBalls = this.playerAirBombHurlingBallGameObjects.filter(x => x.isAnimating == true);

		if (animatingPlayerAirBombHurlingBalls) {

			animatingPlayerAirBombHurlingBalls.forEach(playerAirBombBullsEye => {

				if (playerAirBombBullsEye.isBlasting) {
					playerAirBombBullsEye.shrink();
					playerAirBombBullsEye.fade();
					playerAirBombBullsEye.moveDownRight();
				}
				else {

					playerAirBombBullsEye.pop();
					playerAirBombBullsEye.rotate(RotationDirection.Forward, 0, 2.5);
					playerAirBombBullsEye.hurl();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerAirBombBullsEye));
					let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerAirBombBullsEye));

					let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerAirBombBullsEye));
					let zombieBossRocketBlock = this.zombieBossRocketBlockGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerAirBombBullsEye));

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerAirBombBullsEye));

					let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating == true && !x.isDead() && Constants.checkCloseCollision(x, playerAirBombBullsEye));

					let anyTarget: any = undefined;

					if (ufoBossRocketSeeking) {
						anyTarget = ufoBossRocketSeeking;
						ufoBossRocketSeeking.setBlast();
					}
					else if (ufoBoss) {
						anyTarget = ufoBoss;
						this.looseUfoBosshealth(ufoBoss as UfoBoss);
					}
					else if (ufoEnemy) {
						anyTarget = ufoEnemy;
						this.looseUfoEnemyhealth(ufoEnemy as UfoEnemy);
					}
					else if (zombieBossRocketBlock) {
						anyTarget = zombieBossRocketBlock;
						zombieBossRocketBlock.looseHealth();
					}
					else if (zombieBoss) {
						anyTarget = zombieBoss;
						this.looseZombieBosshealth(zombieBoss as ZombieBoss);
					}
					else if (mafiaBoss) {
						anyTarget = mafiaBoss;
						this.looseMafiaBosshealth(mafiaBoss as MafiaBoss);
					}

					if (anyTarget) {
						playerAirBombBullsEye.setBlast();
						this.generateRingFireExplosion(playerAirBombBullsEye);
						this.generateFlashExplosion(playerAirBombBullsEye);
					}

					if (playerAirBombBullsEye.autoBlast()) {
						playerAirBombBullsEye.setBlast();
						this.generateRingFireExplosion(playerAirBombBullsEye);
					}
				}

				if (playerAirBombBullsEye.hasFaded() /*|| playerAirBombBullsEye.x > Constants.DEFAULT_GAME_VIEW_WIDTH || playerAirBombBullsEye.getRight() < 0 || playerAirBombBullsEye.getBottom() < 0 || playerAirBombBullsEye.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					playerAirBombBullsEye.disableRendering();
					this.setAmmunitionBarValue(this.playerAirBombHurlingBallGameObjects);
				}
			});
		}
	}

	//#endregion

	//#region PlayerArmorSpheres

	private armorSphereGameObjects: Array<GameObjectContainer> = [];

	private spawnPlayerArmorSpheres() {

		for (let j = 0; j < 1; j++) {

			const armorSphere: GameObjectContainer = new GameObjectContainer();
			armorSphere.disableRendering();

			const circle = new Graphics().lineStyle(7, 0xffffff).beginFill(0xf9b233).drawCircle(0, 0, 110).endFill();
			armorSphere.addChild(circle);
			armorSphere.alpha = 0.4;

			this.armorSphereGameObjects.push(armorSphere);
			this.sceneContainer.addChild(armorSphere);
		}
	}

	private generatePlayerArmorSpheres() {

		if (this.powerUpBar.tag == PowerUpType.ARMOR && this.powerUpBar.hasHealth()) {

			var armorSphere = this.armorSphereGameObjects.find(x => x.isAnimating == false);

			if (armorSphere) {
				armorSphere.setPosition(this.player.x, this.player.y);
				armorSphere.enableRendering();
			}
		}
	}

	private animatePlayerArmorSpheres() {

		if (this.powerUpBar.tag == PowerUpType.ARMOR) {

			var animatingArmorSpheres = this.armorSphereGameObjects.filter(x => x.isAnimating == true);

			if (animatingArmorSpheres) {

				animatingArmorSpheres.forEach(armorSphere => {
					armorSphere.pop();

					if (this.powerUpBar.hasHealth()) {
						armorSphere.setPosition(this.player.x, this.player.y);
					}
					else {
						armorSphere.disableRendering();
					}
				});
			}
		}
		else {
			if (this.armorSphereGameObjects.some(x => x.isAnimating == true)) {
				var animatingArmorSphere = this.armorSphereGameObjects.find(x => x.isAnimating == true);
				if (animatingArmorSphere)
					animatingArmorSphere.disableRendering();
			}
		}
	}

	//#endregion

	//#endregion

	//#region UfoEnemys

	private ufoEnemiesAppeared: boolean = false;
	private ufoEnemyDefeatCount: number = 0;
	private readonly ufoEnemyDefeatPoint: number = 20;

	//#region UfoEnemys

	private ufoEnemySize = { width: 160, height: 160 };
	private ufoEnemyGameObjects: Array<UfoEnemy> = [];

	private readonly ufoEnemyPopDelayDefault: number = 35 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoEnemyPopDelay: number = 0;

	private spawnUfoEnemys() {

		for (let j = 0; j < 7; j++) {

			const gameObject: UfoEnemy = new UfoEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.UFO_ENEMY));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoEnemySize.width;
			sprite.height = this.ufoEnemySize.height;
			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoEnemyGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	private generateUfoEnemys() {

		if (!this.anyBossExists() && this.ufoEnemyCheckpoint.shouldRelease(this.gameScoreBar.getScore())) {

			this.ufoEnemyPopDelay -= 0.1;

			if (this.ufoEnemyPopDelay < 0) {

				var ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating == false);

				if (ufoEnemy) {
					ufoEnemy.reset();
					ufoEnemy.reposition();
					ufoEnemy.enableRendering();

					this.ufoEnemyPopDelay = this.ufoEnemyPopDelayDefault;

					if (!this.ufoEnemiesAppeared) {
						this.ufoEnemiesAppeared = true;
						this.generateOnScreenMessage("Alien ufos approaching!");

						SoundManager.play(SoundType.UFO_ENEMY_ENTRY);
						SoundManager.play(SoundType.UFO_HOVERING, 0.8, true);
					}
				}
			}
		}
	}

	private animateUfoEnemys() {

		var animatingUfoEnemys = this.ufoEnemyGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoEnemys) {
			animatingUfoEnemys.forEach(ufoEnemy => {

				ufoEnemy.pop();

				if (ufoEnemy.isDead()) {
					ufoEnemy.fade();

					if (!ufoEnemy.isDeflectionComplete)
						ufoEnemy.deflect();
				}
				else {
					ufoEnemy.hover();
					ufoEnemy.moveDownRight();

					// generate honk
					if (!this.anyBossExists() && ufoEnemy.honk()) {
						this.generateHonk(ufoEnemy);
					}

					// fire orbs
					if (!this.anyBossExists() && ufoEnemy.attack()) {
						this.generateUfoEnemyAirBombs(ufoEnemy);
					}

					this.generateTaunts(ufoEnemy);
				}

				if (ufoEnemy.hasFaded() || ufoEnemy.x - ufoEnemy.width > Constants.DEFAULT_GAME_VIEW_WIDTH || ufoEnemy.y - ufoEnemy.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					ufoEnemy.disableRendering();
				}
			});
		}
	}

	private looseUfoEnemyhealth(ufoEnemy: UfoEnemy) {

		if (!ufoEnemy.isDead()) {
			ufoEnemy.setPopping();
			ufoEnemy.looseHealth();

			if (ufoEnemy.isDead()) {

				ufoEnemy.setDestruction();
				this.addScore();
				this.ufoEnemyDefeatCount++;

				SoundManager.play(SoundType.SCORE_ACQUIRED, 1);

				if (this.ufoEnemyDefeatCount > this.ufoEnemyDefeatPoint) // after killing limited enemies increase the threadhold limit
				{
					this.ufoEnemyCheckpoint.increaseLimit(this.ufoEnemyRelease.limit, this.gameScoreBar.getScore());
					this.ufoEnemyDefeatCount = 0;
					this.ufoEnemiesAppeared = false;
					this.levelUp();

					SoundManager.stop(SoundType.UFO_HOVERING);
				}
			}
		}
	}

	private ufoEnemyExists(): boolean {
		return this.ufoEnemyGameObjects.some(x => x.isAnimating == true && !x.isDead());
	}

	//#endregion

	//#region UfoEnemyAirBombs

	private ufoEnemyRocketSize = { width: 65, height: 65 };
	private ufoEnemyRocketGameObjects: Array<UfoEnemyAirBomb> = [];

	spawnUfoEnemyAirBombs() {

		for (let j = 0; j < 7; j++) {

			const gameObject: UfoEnemyAirBomb = new UfoEnemyAirBomb(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.UFO_ENEMY_AIR_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoEnemyRocketSize.width;
			sprite.height = this.ufoEnemyRocketSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoEnemyRocketGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateUfoEnemyAirBombs(ufoEnemy: UfoEnemy) {

		if (ufoEnemy.getLeft() - 50 > 0 && ufoEnemy.getTop() - 50 > 0) {

			let ufoEnemyRocket = this.ufoEnemyRocketGameObjects.find(x => x.isAnimating == false);

			if (ufoEnemyRocket) {
				ufoEnemyRocket.reset();
				ufoEnemyRocket.reposition(ufoEnemy);
				ufoEnemyRocket.setPopping();
				ufoEnemyRocket.enableRendering();
				this.generateFlashExplosion(ufoEnemyRocket);
			}
		}
	}

	animateUfoEnemyAirBombs() {

		let animatingUfoEnemyAirBombs = this.ufoEnemyRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoEnemyAirBombs) {

			animatingUfoEnemyAirBombs.forEach(ufoEnemyRocket => {

				ufoEnemyRocket.moveDownRight();

				if (ufoEnemyRocket.isBlasting) {
					ufoEnemyRocket.shrink();
					ufoEnemyRocket.fade();
				}
				else {

					ufoEnemyRocket.pop();
					ufoEnemyRocket.hover();

					if (Constants.checkCloseCollision(ufoEnemyRocket, this.player)) {
						ufoEnemyRocket.setBlast();
						this.loosePlayerHealth();
						this.generateRingFireExplosion(ufoEnemyRocket);
					}

					if (ufoEnemyRocket.autoBlast()) {
						ufoEnemyRocket.setBlast();
						this.generateRingFireExplosion(ufoEnemyRocket);
					}
				}

				if (ufoEnemyRocket.hasFaded() || ufoEnemyRocket.x > Constants.DEFAULT_GAME_VIEW_WIDTH || ufoEnemyRocket.getRight() < 0 || ufoEnemyRocket.getBottom() < 0 || ufoEnemyRocket.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					ufoEnemyRocket.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region VehicleEnemys

	//#region VehicleEnemys

	private vehicleEnemySize = { width: 250, height: 250 };
	private vehicleEnemyGameObjects: Array<VehicleEnemy> = [];

	private readonly vehicleEnemyPopDelayDefault: number = 30 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleEnemyPopDelay: number = 15;

	private soundPollutionDamageDelay: number = 15;
	private readonly soundPollutionDamageDelayDefault: number = 15;
	private readonly soundPollutionDamageDialogues: string[] = ["My ears hurt!", "Let's stop 'em.", "Let's shut 'em up!", "Too much honking!", "Are we giving up?", "Aah!", "Ouch!", "Oh no!", "Too noisy!"];

	private spawnVehicleEnemys() {

		for (let j = 0; j < 10; j++) {

			const gameObject: VehicleEnemy = new VehicleEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.vehicleType = Constants.getRandomNumber(TextureType.VEHICLE_ENEMY_SMALL, TextureType.VEHICLE_ENEMY_LARGE);

			gameObject.disableRendering();

			var uri: string = "";
			switch (gameObject.vehicleType) {
				case TextureType.VEHICLE_ENEMY_SMALL: {
					uri = Constants.getRandomUri(TextureType.VEHICLE_ENEMY_SMALL);
				} break;
				case TextureType.VEHICLE_ENEMY_LARGE: {
					uri = Constants.getRandomUri(TextureType.VEHICLE_ENEMY_LARGE);
				} break;
				default: break;
			}

			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;

			switch (gameObject.vehicleType) {
				case TextureType.VEHICLE_ENEMY_SMALL: {
					sprite.width = this.vehicleEnemySize.width / 1.2;
					sprite.height = this.vehicleEnemySize.height / 1.2;
				} break;
				case TextureType.VEHICLE_ENEMY_LARGE: {
					sprite.width = this.vehicleEnemySize.width;
					sprite.height = this.vehicleEnemySize.height;
				} break;
				default: break;
			}

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.vehicleEnemyGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateVehicleEnemys() {

		if (!this.vehicleBossExists() && !this.ufoEnemyExists()) {
			this.vehicleEnemyPopDelay -= 0.1;

			if (this.vehicleEnemyPopDelay < 0) {

				var gameObject = this.vehicleEnemyGameObjects.find(x => x.isAnimating == false);

				if (gameObject) {

					gameObject.reset();

					let sprite = gameObject.getFirstSprite();

					switch (gameObject.vehicleType) {
						case TextureType.VEHICLE_ENEMY_SMALL: {
							sprite.width = this.vehicleEnemySize.width / 1.2;
							sprite.height = this.vehicleEnemySize.height / 1.2;
						} break;
						case TextureType.VEHICLE_ENEMY_LARGE: {
							sprite.width = this.vehicleEnemySize.width;
							sprite.height = this.vehicleEnemySize.height;
						} break;
						default: break;
					}

					if (this.anyInAirBossExists())
						gameObject.repositionReverse();
					else
						gameObject.reposition();

					gameObject.enableRendering();

					this.vehicleEnemyPopDelay = this.vehicleEnemyPopDelayDefault;
				}
			}
		}
	}

	private animateVehicleEnemys() {

		var animatingVehicleEnemys = this.vehicleEnemyGameObjects.filter(x => x.isAnimating == true);

		if (animatingVehicleEnemys) {

			animatingVehicleEnemys.forEach(vehicleEnemy => {

				vehicleEnemy.pop();

				if (this.anyInAirBossExists()) { // when in air bosses appear, stop the stage transition, and make the vehicles move forward

					vehicleEnemy.moveUpLeft();
					vehicleEnemy.moveUpLeft(); // move with double speed
					vehicleEnemy.dillyDally();
				}
				else {

					if (!this.vehicleBossExists())
						vehicleEnemy.dillyDally();

					vehicleEnemy.moveDownRight();
				}

				if (vehicleEnemy.isBlasting) {
					vehicleEnemy.hop();
				}

				// prevent overlapping
				var vehicles = this.vehicleEnemyGameObjects.filter(x => x.isAnimating == true);

				if (vehicles) {

					vehicles.forEach(collidingVehicle => {

						if (Constants.checkCollision(collidingVehicle, vehicleEnemy)) {

							if (collidingVehicle.speed > vehicleEnemy.speed) // colliding vehicle is faster
							{
								vehicleEnemy.speed = collidingVehicle.speed;
							}
							else if (vehicleEnemy.speed > collidingVehicle.speed) // current vehicle is faster
							{
								collidingVehicle.speed = vehicleEnemy.speed;
							}
						}
					});
				}

				// generate honk
				if (vehicleEnemy.honk() && !this.ufoEnemyExists() && !this.anyInAirBossExists()) {
					this.generateHonk(vehicleEnemy);
				}

				this.generateVehicleSmoke(vehicleEnemy);

				// recycle vehicle
				if (this.anyInAirBossExists()) {
					if (vehicleEnemy.getRight() < 0 || vehicleEnemy.getBottom() < 0) { // reverse recycling
						vehicleEnemy.disableRendering();
					}
				}
				else {
					if (vehicleEnemy.x - vehicleEnemy.width > Constants.DEFAULT_GAME_VIEW_WIDTH || vehicleEnemy.y - vehicleEnemy.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
						vehicleEnemy.disableRendering();
					}
				}
			});
		}

		// sound pollution damage
		if (!this.anyBossExists()) {
			var honkingVehicles = this.vehicleEnemyGameObjects.filter(x => x.isAnimating == true && x.willHonk && x.isHonking);

			if (honkingVehicles) {
				var count = honkingVehicles.length * 2;

				if (this.soundPollutionBar.getValue() != count)
					this.soundPollutionBar.setValue(count); // if at least 3 or more vehicles are honking player looses health

				if (this.soundPollutionBar.getProgress() >= 100) {
					this.soundPollutionDamageDelay -= 0.1;

					if (this.soundPollutionDamageDelay <= 0) {
						this.loosePlayerHealth();
						this.generateMessageBubble(this.player, this.soundPollutionDamageDialogues[Constants.getRandomNumber(0, this.soundPollutionDamageDialogues.length - 1)]);
						this.soundPollutionDamageDelay = this.soundPollutionDamageDelayDefault;
					}
				}
			}
		}
		else {
			if (this.soundPollutionBar.getProgress() > 0) // when bosses arrive no sound pollution damage will be incurred
				this.soundPollutionBar.setValue(0);
		}
	}

	private looseVehicleEnemyhealth(vehicleEnemy: VehicleEnemy) {
		vehicleEnemy.setPopping();
		vehicleEnemy.looseHealth();

		if (vehicleEnemy.willHonk) {

			if (vehicleEnemy.isDead()) {
				vehicleEnemy.setHopping();
				vehicleEnemy.setBlast();
				this.addScore(false);
				SoundManager.play(SoundType.SCORE_ACQUIRED, 1);

				this.generateMessageBubble(vehicleEnemy, this.honkBustReactions[Constants.getRandomNumber(0, this.honkBustReactions.length - 1)]);
			}
		}
	}

	//#endregion

	//#region VehicleSmokes

	private vehicleSmokeSize = { width: 35, height: 35 };
	private vehicleSmokeGameObjects: Array<VehicleSmoke> = [];

	private readonly vehicleSmokePopDelayDefault: number = 20 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleSmokePopDelay: number = 20;

	private spawnVehicleSmokes() {

		for (let j = 0; j < 10; j++) {

			const vehicleSmoke: VehicleSmoke = new VehicleSmoke(Constants.DEFAULT_CONSTRUCT_SPEED);
			vehicleSmoke.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.VEHICLE_SMOKE));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.vehicleSmokeSize.width;
			sprite.height = this.vehicleSmokeSize.height;
			sprite.anchor.set(0.5, 0.5);
			vehicleSmoke.addChild(sprite);

			this.vehicleSmokeGameObjects.push(vehicleSmoke);
			this.sceneContainer.addChild(vehicleSmoke);
		}
	}

	private generateVehicleSmoke(source: GameObjectContainer) {

		this.vehicleSmokePopDelay -= 0.1;

		if (this.vehicleSmokePopDelay < 0) {

			var vehicleSmoke = this.vehicleSmokeGameObjects.find(x => x.isAnimating == false);

			if (vehicleSmoke) {
				vehicleSmoke.reset();
				vehicleSmoke.reposition(source);
				vehicleSmoke.setPopping();
				vehicleSmoke.enableRendering();
			}

			this.vehicleSmokePopDelay = Constants.getRandomNumber(this.vehicleSmokePopDelayDefault, this.vehicleSmokePopDelayDefault + 3);
		}
	}

	private animateVehicleSmokes() {

		var animatingVehicleSmokes = this.vehicleSmokeGameObjects.filter(x => x.isAnimating == true);

		if (animatingVehicleSmokes) {

			animatingVehicleSmokes.forEach(vehicleSmoke => {
				vehicleSmoke.dillyDally();
				vehicleSmoke.pop();
				vehicleSmoke.moveUpRight();
				vehicleSmoke.fade();

				if (vehicleSmoke.hasFaded()) {
					vehicleSmoke.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region Bosss

	private anyBossExists(): boolean {
		return (this.ufoBossExists() || this.vehicleBossExists() || this.zombieBossExists() || this.mafiaBossExists());
	}

	private anyInAirBossExists(): boolean {
		return (this.ufoBossExists() || this.zombieBossExists() || this.mafiaBossExists());
	}

	private anyInAirEnemyExists(): boolean {
		return (this.anyInAirBossExists() || this.ufoEnemyExists());
	}

	//#endregion

	//#region VehicleBosss

	//#region VehicleBosss

	private vehicleBossGameObjects: Array<VehicleBoss> = [];

	private spawnVehicleBosss() {
		const gameObject: VehicleBoss = new VehicleBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.VEHICLE_BOSS));
		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.vehicleEnemySize.width / 1.2;
		sprite.height = this.vehicleEnemySize.height / 1.2;
		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.vehicleBossGameObjects.push(gameObject);
		this.sceneContainer.addChild(gameObject);
	}

	private generateVehicleBoss() {

		if (this.vehicleBossCheckpoint.shouldRelease(this.gameScoreBar.getScore()) && !this.vehicleBossExists()) {

			var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.reset();

				let sprite = gameObject.getFirstSprite();

				sprite.width = this.vehicleEnemySize.width / 1.2;
				sprite.height = this.vehicleEnemySize.height / 1.2;

				gameObject.reposition();
				gameObject.health = this.vehicleBossCheckpoint.getReleasePointDifference() * 1.5;
				gameObject.enableRendering();

				this.vehicleBossCheckpoint.increaseLimit(this.vehicleBossRelease.limit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(gameObject.health);
				this.bossHealthBar.setValue(gameObject.health);
				this.bossHealthBar.setIcon(gameObject.getFirstSprite().getTexture());

				this.generateOnScreenMessage("A hotrod has arrived!", this.interactIcon);

				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.3, true);

				this.vehicleEnemyGameObjects.forEach(vehicle => {
					vehicle.speed = Constants.DEFAULT_CONSTRUCT_SPEED; // when vehicle boss arrive all vehicles stop
				});
			}
		}
	}

	private animateVehicleBoss() {

		var vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true);

		if (vehicleBoss) {
			vehicleBoss.hop();
			vehicleBoss.pop();
			vehicleBoss.recoverFromHealthLoss();

			if (vehicleBoss.isDead()) {

				if (!this.isBossDeathExploding()) {
					vehicleBoss.moveDownRight(); // move down right after exploding
				}
			}
			else {
				vehicleBoss.dillyDally();
				this.generateVehicleSmoke(vehicleBoss);

				if (vehicleBoss.isAttacking) {
					vehicleBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT);

					if (vehicleBoss.honk()) {
						this.generateHonk(vehicleBoss);
					}

					this.generateTaunts(vehicleBoss);
				}
				else {
					// when all vehicles are out of view or have passed to the bottom right corner
					if (this.vehicleEnemyGameObjects.every(x => x.isAnimating == false ||
						this.vehicleEnemyGameObjects.filter(x => x.isAnimating).every(x => x.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH / 3) * 2))) {
						vehicleBoss.isAttacking = true;
					}
				}
			}

			if (vehicleBoss.isDead() && vehicleBoss.x - vehicleBoss.width > Constants.DEFAULT_GAME_VIEW_WIDTH || vehicleBoss.y - vehicleBoss.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				vehicleBoss.disableRendering();
				console.log("vehicle boss died.");
			}
		}
	}

	private looseVehicleBosshealth(vehicleBoss: VehicleBoss) {
		vehicleBoss.setHopping();
		vehicleBoss.setPopping();
		vehicleBoss.looseHealth();

		this.bossHealthBar.setValue(vehicleBoss.health);

		if (vehicleBoss.isDead()) {

			this.player.setWinStance();
			this.generateMessageBubble(this.player, "Ha ha! Yeah!");

			this.addScore(false);
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);

			this.generateMessageBubble(vehicleBoss, "I'll be back!");
			this.setBossDeathExplosion();
		}
	}

	private vehicleBossExists(): boolean {
		return this.vehicleBossGameObjects.some(x => x.isAnimating == true);
	}

	//#endregion

	//#region VehicleBossAirBombs

	private vehicleBossRocketSize = { width: 90, height: 90 };
	private vehicleBossRocketGameObjects: Array<VehicleBossAirBomb> = [];

	private readonly vehicleBossRocketPopDelayDefault: number = 12 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleBossRocketPopDelay: number = 0;

	spawnVehicleBossAirBombs() {

		for (let j = 0; j < 3; j++) {

			const gameObject: VehicleBossAirBomb = new VehicleBossAirBomb(Constants.DEFAULT_CONSTRUCT_SPEED * 1.1);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.VEHICLE_BOSS_AIR_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.vehicleBossRocketSize.width;
			sprite.height = this.vehicleBossRocketSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.vehicleBossRocketGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateVehicleBossAirBombs() {

		let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (vehicleBoss) {

			this.vehicleBossRocketPopDelay -= 0.1;

			if (this.vehicleBossRocketPopDelay < 0) {

				let vehicleBossRocket = this.vehicleBossRocketGameObjects.find(x => x.isAnimating == false);

				if (vehicleBossRocket) {
					vehicleBossRocket.reset();
					vehicleBossRocket.reposition(vehicleBoss);
					vehicleBossRocket.setPopping();
					vehicleBossRocket.enableRendering();
					this.generateFlashExplosion(vehicleBossRocket);
				}

				this.vehicleBossRocketPopDelay = this.vehicleBossRocketPopDelayDefault;
			}
		}
	}

	animateVehicleBossAirBombs() {

		let animatingVehicleBossAirBombs = this.vehicleBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingVehicleBossAirBombs) {

			animatingVehicleBossAirBombs.forEach(gameObject => {
				gameObject.moveUpRight();

				gameObject.decelerate();

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.dillyDally();

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();

						this.generateRingFireExplosion(gameObject);
						this.generateRingSmokeExplosion(gameObject);
						this.generateFlashExplosion(gameObject);
					}

					if (gameObject.autoBlast()) {
						gameObject.setBlast();

						this.generateRingFireExplosion(gameObject);
						this.generateRingSmokeExplosion(gameObject);
					}
				}

				if (gameObject.hasFaded()) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region UfoBosss

	//#region UfoBosss

	private ufoBossSize = { width: 200, height: 200 };
	private ufoBossGameObjects: Array<UfoBoss> = [];

	private spawnUfoBosss() {
		const gameObject: UfoBoss = new UfoBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.UFO_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.ufoBossSize.width;
		sprite.height = this.ufoBossSize.height;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.ufoBossGameObjects.push(gameObject);
		this.sceneContainer.addChild(gameObject);

		this.spawnCastShadow(gameObject);
	}

	private generateUfoBoss() {

		if (this.ufoBossCheckpoint.shouldRelease(this.gameScoreBar.getScore()) && !this.ufoBossExists()) {

			var gameObject = this.ufoBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var ufoBoss = gameObject as UfoBoss;
				ufoBoss.setPosition(0, ufoBoss.height * -1);
				ufoBoss.reset();
				ufoBoss.health = this.ufoBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this.ufoBossCheckpoint.increaseLimit(this.ufoBossRelease.limit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(ufoBoss.health);
				this.bossHealthBar.setValue(ufoBoss.health);
				this.bossHealthBar.setIcon(ufoBoss.getFirstSprite().getTexture());

				this.generateOnScreenMessage("Cyborg inbound!", this.interactIcon);


				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.3, true);
				SoundManager.play(SoundType.UFO_BOSS_ENTRY);
				SoundManager.play(SoundType.UFO_HOVERING, 0.8, true);

				//this.switchToNightMode();
			}
		}
	}

	private animateUfoBoss() {

		var ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true);

		if (ufoBoss) {

			ufoBoss.pop();
			ufoBoss.recoverFromHealthLoss();

			if (ufoBoss.isDead()) {

				if (this.isBossDeathExploding()) {
					ufoBoss.hover();
				}
				else {
					ufoBoss.shrink();
				}
			}
			else {
				ufoBoss.hover();
				ufoBoss.depleteHitStance();
				ufoBoss.depleteWinStance();

				if (ufoBoss.isAttacking) {

					ufoBoss.move(this.sceneBoundaryWidth, this.sceneBoundaryHeight, this.player.getCloseBounds());

					if (Constants.checkCloseCollision(this.player, ufoBoss)) {
						this.loosePlayerHealth();
					}

					this.generateTaunts(ufoBoss);
				}
				else {

					ufoBoss.moveDownRight();

					if (ufoBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling / 3)) // bring UfoBoss to a suitable distance from player and then start attacking
					{
						ufoBoss.isAttacking = true;
					}
				}
			}

			if (ufoBoss.hasShrinked()) {
				ufoBoss.disableRendering();
			}
		}
	}

	private looseUfoBosshealth(ufoBoss: UfoBoss) {

		ufoBoss.setPopping();
		ufoBoss.looseHealth();
		ufoBoss.setHitStance();

		this.bossHealthBar.setValue(ufoBoss.health);

		if (ufoBoss.isDead()) {

			this.player.setWinStance();
			this.generateMessageBubble(this.player, "Not so tough are we?");
			this.addScore();
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.UFO_BOSS_DEAD);
			SoundManager.stop(SoundType.UFO_HOVERING);
			SoundManager.play(SoundType.SCORE_ACQUIRED, 1);

			this.generateMessageBubble(ufoBoss, "I'll reboot and revert!");
			this.setBossDeathExplosion();
		}
	}

	private ufoBossExists(): boolean {
		return this.ufoBossGameObjects.some(x => x.isAnimating == true);
	}

	//#endregion

	//#region UfoBossAirBombs

	private ufoBossRocketSize = { width: 90, height: 90 };
	private ufoBossRocketGameObjects: Array<UfoBossAirBomb> = [];

	private readonly ufoBossRocketPopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoBossRocketPopDelay: number = 0;

	spawnUfoBossAirBombs() {

		for (let j = 0; j < 3; j++) {

			const gameObject: UfoBossAirBomb = new UfoBossAirBomb(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.UFO_BOSS_AIR_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoBossRocketSize.width;
			sprite.height = this.ufoBossRocketSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoBossRocketGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateUfoBossAirBombs() {

		let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (ufoBoss) {

			this.ufoBossRocketPopDelay -= 0.1;

			if (this.ufoBossRocketPopDelay < 0) {

				let ufoBossRocket = this.ufoBossRocketGameObjects.find(x => x.isAnimating == false);

				if (ufoBossRocket) {
					ufoBossRocket.reset();
					ufoBossRocket.reposition(ufoBoss);
					ufoBossRocket.setPopping();
					ufoBossRocket.enableRendering();
					this.setBossRocketDirection(ufoBoss, ufoBossRocket, this.player);
					this.generateFlashExplosion(ufoBossRocket);
				}

				this.ufoBossRocketPopDelay = this.ufoBossRocketPopDelayDefault;
			}
		}
	}

	animateUfoBossAirBombs() {

		let animatingUfoBossAirBombs = this.ufoBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoBossAirBombs) {

			animatingUfoBossAirBombs.forEach(ufoBossRocket => {

				ufoBossRocket.accelerate();

				if (ufoBossRocket.awaitMoveDownLeft) {
					ufoBossRocket.moveDownLeft();
				}
				else if (ufoBossRocket.awaitMoveUpRight) {
					ufoBossRocket.moveUpRight();
				}
				else if (ufoBossRocket.awaitMoveUpLeft) {
					ufoBossRocket.moveUpLeft();
				}
				else if (ufoBossRocket.awaitMoveDownRight) {
					ufoBossRocket.moveDownRight();
				}

				if (ufoBossRocket.isBlasting) {
					ufoBossRocket.shrink();
					ufoBossRocket.fade();
				}
				else {

					ufoBossRocket.pop();
					ufoBossRocket.hover();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (Constants.checkCloseCollision(ufoBossRocket, this.player)) {
						ufoBossRocket.setBlast();
						this.loosePlayerHealth();
						ufoBoss?.setWinStance();
						this.generateRingFireExplosion(ufoBossRocket);
					}

					if (ufoBossRocket.autoBlast()) {
						ufoBossRocket.setBlast();
						this.generateRingFireExplosion(ufoBossRocket);
					}
				}

				if (ufoBossRocket.hasFaded() /*|| ufoBossRocket.x > Constants.DEFAULT_GAME_VIEW_WIDTH || ufoBossRocket.getRight() < 0 || ufoBossRocket.getBottom() < 0 || ufoBossRocket.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					ufoBossRocket.disableRendering();
				}
			});
		}
	}

	setBossRocketDirection(source: GameObjectContainer, rocket: GameObjectContainer, rocketTarget: GameObjectContainer) {

		// rocket target is on the bottom right side of the UfoBoss
		if (rocketTarget.getTop() > source.getTop() && rocketTarget.getLeft() > source.getLeft()) {
			rocket.awaitMoveDownRight = true;
			rocket.setRotation(33);
		}
		// rocket target is on the bottom left side of the UfoBoss
		else if (rocketTarget.getTop() > source.getTop() && rocketTarget.getLeft() < source.getLeft()) {
			rocket.awaitMoveDownLeft = true;
			rocket.setRotation(-213);
		}
		// if rocket target is on the top left side of the UfoBoss
		else if (rocketTarget.getTop() < source.getTop() && rocketTarget.getLeft() < source.getLeft()) {
			rocket.awaitMoveUpLeft = true;
			rocket.setRotation(213);
		}
		// if rocket target is on the top right side of the UfoBoss
		else if (rocketTarget.getTop() < source.getTop() && rocketTarget.getLeft() > source.getLeft()) {
			rocket.awaitMoveUpRight = true;
			rocket.setRotation(-33);
		}
		else {
			rocket.awaitMoveDownRight = true;
			rocket.setRotation(33);
		}
	}

	//#endregion

	//#region UfoBossAirBombSeekingBalls

	private ufoBossRocketSeekingSize = { width: 60, height: 60 };
	private ufoBossRocketSeekingGameObjects: Array<UfoBossAirBombSeekingBall> = [];

	private readonly ufoBossRocketSeekingPopDelayDefault: number = 12 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoBossRocketSeekingPopDelay: number = 0;

	spawnUfoBossAirBombSeekingBalls() {

		for (let j = 0; j < 2; j++) {

			const gameObject: UfoBossAirBombSeekingBall = new UfoBossAirBombSeekingBall(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.UFO_BOSS_AIR_BOMB_SEEKING));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoBossRocketSeekingSize.width;
			sprite.height = this.ufoBossRocketSeekingSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoBossRocketSeekingGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateUfoBossAirBombSeekingBalls() {

		let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (ufoBoss) {

			if (this.ufoBossRocketSeekingGameObjects.every(x => x.isAnimating == false)) {

				this.ufoBossRocketSeekingPopDelay -= 0.1;

				if (this.ufoBossRocketSeekingPopDelay < 0) {

					let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating == false);

					if (ufoBossRocketSeeking) {
						ufoBossRocketSeeking.reset();
						ufoBossRocketSeeking.reposition(ufoBoss);
						ufoBossRocketSeeking.setPopping();
						ufoBossRocketSeeking.enableRendering();
						this.generateFlashExplosion(ufoBossRocketSeeking);
					}

					this.ufoBossRocketSeekingPopDelay = this.ufoBossRocketSeekingPopDelayDefault;
				}
			}
		}
	}

	animateUfoBossAirBombSeekingBalls() {

		let animatingUfoBossAirBombSeekingBalls = this.ufoBossRocketSeekingGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoBossAirBombSeekingBalls) {

			animatingUfoBossAirBombSeekingBalls.forEach(ufoBossRocketSeeking => {

				if (ufoBossRocketSeeking.isBlasting) {
					ufoBossRocketSeeking.shrink();
					ufoBossRocketSeeking.fade();
					ufoBossRocketSeeking.moveDownRight();
				}
				else {

					ufoBossRocketSeeking.pop();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (ufoBoss) {

						ufoBossRocketSeeking.follow(this.player.getCloseBounds());

						if (Constants.checkCloseCollision(ufoBossRocketSeeking, this.player)) {
							ufoBossRocketSeeking.setBlast();
							ufoBoss.setWinStance();
							this.loosePlayerHealth();
							this.generateRingFireExplosion(ufoBossRocketSeeking);
							this.generateRingSmokeExplosion(ufoBossRocketSeeking);
						}
						else {
							if (ufoBossRocketSeeking.autoBlast()) {
								ufoBossRocketSeeking.setBlast();
								this.generateRingFireExplosion(ufoBossRocketSeeking);
							}
						}
					}
					else {
						ufoBossRocketSeeking.setBlast();
					}
				}

				if (ufoBossRocketSeeking.hasFaded()) {
					ufoBossRocketSeeking.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region ZombieBosss

	//#region ZombieBosss

	private zombieBossSize = { width: 200, height: 200 };
	private zombieBossGameObjects: Array<ZombieBoss> = [];

	private spawnZombieBosss() {
		const gameObject: ZombieBoss = new ZombieBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.ZOMBIE_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.zombieBossSize.width;
		sprite.height = this.zombieBossSize.height;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.zombieBossGameObjects.push(gameObject);
		this.sceneContainer.addChild(gameObject);

		this.spawnCastShadow(gameObject);
	}

	private generateZombieBoss() {

		if (this.zombieBossCheckpoint.shouldRelease(this.gameScoreBar.getScore()) && !this.zombieBossExists()) {

			var gameObject = this.zombieBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var zombieBoss = gameObject as ZombieBoss;
				zombieBoss.setPosition(0, zombieBoss.height * -1);
				zombieBoss.reset();
				zombieBoss.health = this.zombieBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this.zombieBossCheckpoint.increaseLimit(this.zombieBossRelease.limit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(zombieBoss.health);
				this.bossHealthBar.setValue(zombieBoss.health);
				this.bossHealthBar.setIcon(zombieBoss.getFirstSprite().getTexture());

				this.generateOnScreenMessage("Zombie inbound!", this.interactIcon);


				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.3, true);
				SoundManager.play(SoundType.UFO_BOSS_ENTRY);
				SoundManager.play(SoundType.UFO_HOVERING, 0.8, true);

				//this.switchToNightMode();
			}
		}
	}

	private animateZombieBoss() {

		var zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true);

		if (zombieBoss) {

			zombieBoss.pop();
			zombieBoss.recoverFromHealthLoss();

			if (zombieBoss.isDead()) {

				if (this.isBossDeathExploding()) {
					zombieBoss.hover();
				}
				else {
					zombieBoss.shrink();
				}
			}
			else {
				zombieBoss.hover();
				zombieBoss.depleteHitStance();
				zombieBoss.depleteWinStance();

				if (zombieBoss.isAttacking) {

					zombieBoss.moveUpRightDownLeft(Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling);

					if (Constants.checkCloseCollision(this.player, zombieBoss)) {
						this.loosePlayerHealth();
					}

					this.generateTaunts(zombieBoss);
				}
				else {

					zombieBoss.moveDownRight();

					// bring ZombieBoss to a suitable distance from player and then start attacking
					if (zombieBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling / 2)) {
						zombieBoss.isAttacking = true;
					}
				}
			}

			if (zombieBoss.hasShrinked()) {
				zombieBoss.disableRendering();
			}
		}
	}

	private looseZombieBosshealth(zombieBoss: ZombieBoss) {

		zombieBoss.setPopping();
		zombieBoss.looseHealth();
		zombieBoss.setHitStance();

		this.bossHealthBar.setValue(zombieBoss.health);

		if (zombieBoss.isDead()) {

			this.player.setWinStance();
			this.generateMessageBubble(this.player, "Rest in peace!");
			this.addScore();
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.UFO_BOSS_DEAD);
			SoundManager.stop(SoundType.UFO_HOVERING);
			SoundManager.play(SoundType.SCORE_ACQUIRED, 1);

			this.setBossDeathExplosion();
			this.generateMessageBubble(zombieBoss, "I'll return from the dead!");
		}
	}

	private zombieBossExists(): boolean {
		return this.zombieBossGameObjects.some(x => x.isAnimating == true);
	}

	//#endregion

	//#region ZombieBossAirBombCubes

	private zombieBossRocketBlockSize = { width: 256 / 1.5, height: 256 / 1.5 };
	private zombieBossRocketBlockGameObjects: Array<ZombieBossAirBombCube> = [];

	private readonly zombieBossRocketBlockPopDelayDefault: number = 8 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private zombieBossRocketBlockPopDelay: number = 0;

	spawnZombieBossAirBombCubes() {

		for (let j = 0; j < 5; j++) {

			const gameObject: ZombieBossAirBombCube = new ZombieBossAirBombCube(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.ZOMBIE_BOSS_ROCKET_BLOCK));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.zombieBossRocketBlockSize.width;
			sprite.height = this.zombieBossRocketBlockSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.zombieBossRocketBlockGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateZombieBossAirBombCubes() {

		let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (zombieBoss) {

			this.zombieBossRocketBlockPopDelay -= 0.1;

			if (this.zombieBossRocketBlockPopDelay < 0) {

				let zombieBossRocketBlock = this.zombieBossRocketBlockGameObjects.find(x => x.isAnimating == false);

				if (zombieBossRocketBlock) {
					zombieBossRocketBlock.reset();
					zombieBossRocketBlock.reposition();
					zombieBossRocketBlock.setPopping();
					zombieBossRocketBlock.enableRendering();
				}

				this.zombieBossRocketBlockPopDelay = this.zombieBossRocketBlockPopDelayDefault;
			}
		}
	}

	animateZombieBossAirBombCubes() {

		let animatingZombieBossAirBombCubes = this.zombieBossRocketBlockGameObjects.filter(x => x.isAnimating == true);

		if (animatingZombieBossAirBombCubes) {

			animatingZombieBossAirBombCubes.forEach(zombieBossRocketBlock => {
				zombieBossRocketBlock.moveDownRight();

				if (zombieBossRocketBlock.isBlasting) {
					zombieBossRocketBlock.shrink();
					zombieBossRocketBlock.fade();
				}
				else {

					zombieBossRocketBlock.pop();
					zombieBossRocketBlock.hover();

					if (Constants.checkCloseCollision(zombieBossRocketBlock, this.player)) {
						zombieBossRocketBlock.setBlast();
						this.loosePlayerHealth();
						this.generateRingFireExplosion(zombieBossRocketBlock);
					}

					if (zombieBossRocketBlock.autoBlast()) {
						this.generateRingFireExplosion(zombieBossRocketBlock);
						zombieBossRocketBlock.setBlast();
					}
				}

				if (zombieBossRocketBlock.hasFaded() || zombieBossRocketBlock.x > Constants.DEFAULT_GAME_VIEW_WIDTH || zombieBossRocketBlock.getRight() < 0 || zombieBossRocketBlock.getBottom() < 0 || zombieBossRocketBlock.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					zombieBossRocketBlock.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region MafiaBosss

	//#region MafiaBosss

	private mafiaBossSize = { width: 200, height: 200 };
	private mafiaBossGameObjects: Array<MafiaBoss> = [];

	private spawnMafiaBosss() {
		const gameObject: MafiaBoss = new MafiaBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.MAFIA_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.mafiaBossSize.width;
		sprite.height = this.mafiaBossSize.height;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.mafiaBossGameObjects.push(gameObject);
		this.sceneContainer.addChild(gameObject);

		this.spawnCastShadow(gameObject);
	}

	private generateMafiaBoss() {

		if (this.mafiaBossCheckpoint.shouldRelease(this.gameScoreBar.getScore()) && !this.mafiaBossExists()) {

			var gameObject = this.mafiaBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var mafiaBoss = gameObject as MafiaBoss;
				mafiaBoss.setPosition(0, mafiaBoss.height * -1);
				mafiaBoss.reset();
				mafiaBoss.health = this.mafiaBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this.mafiaBossCheckpoint.increaseLimit(this.mafiaBossRelease.limit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(mafiaBoss.health);
				this.bossHealthBar.setValue(mafiaBoss.health);
				this.bossHealthBar.setIcon(mafiaBoss.getFirstSprite().getTexture());

				this.generateOnScreenMessage("Godfather inbound.", this.interactIcon);


				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.3, true);
				SoundManager.play(SoundType.UFO_BOSS_ENTRY);
				SoundManager.play(SoundType.UFO_HOVERING, 0.8, true);

				//this.switchToNightMode();
			}
		}
	}

	private animateMafiaBoss() {

		var mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true);

		if (mafiaBoss) {

			mafiaBoss.pop();
			mafiaBoss.recoverFromHealthLoss();

			if (mafiaBoss.isDead()) {

				if (this.isBossDeathExploding()) {
					mafiaBoss.hover();
				}
				else {
					mafiaBoss.shrink();
				}
			}
			else {
				mafiaBoss.hover();
				mafiaBoss.depleteHitStance();
				mafiaBoss.depleteWinStance();

				if (mafiaBoss.isAttacking) {

					mafiaBoss.move(this.sceneBoundaryWidth, this.sceneBoundaryHeight, this.player.getCloseBounds());

					if (Constants.checkCloseCollision(this.player, mafiaBoss)) {
						this.loosePlayerHealth();
					}

					this.generateTaunts(mafiaBoss);
				}
				else {

					mafiaBoss.moveDownRight();

					if (mafiaBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling / 3)) // bring MafiaBoss to a suitable distance from player and then start attacking
					{
						mafiaBoss.isAttacking = true;
					}
				}
			}

			if (mafiaBoss.hasShrinked()) {
				mafiaBoss.disableRendering();
			}
		}
	}

	private looseMafiaBosshealth(mafiaBoss: MafiaBoss) {

		mafiaBoss.setPopping();
		mafiaBoss.looseHealth();
		mafiaBoss.setHitStance();

		this.bossHealthBar.setValue(mafiaBoss.health);

		if (mafiaBoss.isDead()) {

			this.player.setWinStance();
			this.generateMessageBubble(this.player, "Who's the boss now?");
			this.addScore();
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.UFO_BOSS_DEAD);
			SoundManager.stop(SoundType.UFO_HOVERING);
			SoundManager.play(SoundType.SCORE_ACQUIRED, 1);

			this.setBossDeathExplosion();
			this.generateMessageBubble(mafiaBoss, "See you next time, kid!");
		}
	}

	private mafiaBossExists(): boolean {
		var gameObject = this.mafiaBossGameObjects.find(x => x.isAnimating == true);

		if (gameObject)
			return true;
		else
			return false;
	}

	//#endregion

	//#region MafiaBossAirBombs

	private mafiaBossRocketSize = { width: 90, height: 90 };
	private mafiaBossRocketGameObjects: Array<MafiaBossAirBomb> = [];

	private readonly mafiaBossRocketPopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private mafiaBossRocketPopDelay: number = 0;

	spawnMafiaBossAirBombs() {

		for (let j = 0; j < 3; j++) {

			const gameObject: MafiaBossAirBomb = new MafiaBossAirBomb(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.MAFIA_BOSS_AIR_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.mafiaBossRocketSize.width;
			sprite.height = this.mafiaBossRocketSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.mafiaBossRocketGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateMafiaBossAirBombs() {

		let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (mafiaBoss) {

			this.mafiaBossRocketPopDelay -= 0.1;

			if (this.mafiaBossRocketPopDelay < 0) {

				let mafiaBossRocket = this.mafiaBossRocketGameObjects.find(x => x.isAnimating == false);

				if (mafiaBossRocket) {
					mafiaBossRocket.reset();
					mafiaBossRocket.reposition(mafiaBoss);
					mafiaBossRocket.setPopping();
					mafiaBossRocket.enableRendering();
					this.generateFlashExplosion(mafiaBossRocket);
					this.setBossRocketDirection(mafiaBoss, mafiaBossRocket, this.player);
				}

				this.mafiaBossRocketPopDelay = this.mafiaBossRocketPopDelayDefault;
			}
		}
	}

	animateMafiaBossAirBombs() {

		let animatingMafiaBossAirBombs = this.mafiaBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingMafiaBossAirBombs) {

			animatingMafiaBossAirBombs.forEach(mafiaBossRocket => {

				mafiaBossRocket.accelerate();

				if (mafiaBossRocket.awaitMoveDownLeft) {
					mafiaBossRocket.moveDownLeft();
				}
				else if (mafiaBossRocket.awaitMoveUpRight) {
					mafiaBossRocket.moveUpRight();
				}
				else if (mafiaBossRocket.awaitMoveUpLeft) {
					mafiaBossRocket.moveUpLeft();
				}
				else if (mafiaBossRocket.awaitMoveDownRight) {
					mafiaBossRocket.moveDownRight();
				}

				if (mafiaBossRocket.isBlasting) {
					mafiaBossRocket.shrink();
					mafiaBossRocket.fade();
				}
				else {

					mafiaBossRocket.pop();
					mafiaBossRocket.hover();

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (Constants.checkCloseCollision(mafiaBossRocket, this.player)) {
						mafiaBossRocket.setBlast();
						this.loosePlayerHealth();
						mafiaBoss?.setWinStance();
						this.generateRingFireExplosion(mafiaBossRocket);
					}

					if (mafiaBossRocket.autoBlast()) {
						mafiaBossRocket.setBlast();
						this.generateRingFireExplosion(mafiaBossRocket);
					}
				}

				if (mafiaBossRocket.hasFaded() /*|| mafiaBossRocket.x > Constants.DEFAULT_GAME_VIEW_WIDTH || mafiaBossRocket.getRight() < 0 || mafiaBossRocket.getBottom() < 0 || mafiaBossRocket.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					mafiaBossRocket.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region MafiaBossAirBombHurlingBalls

	private mafiaBossRocketBullsEyeSize = { width: 60, height: 60 };
	private mafiaBossRocketBullsEyeGameObjects: Array<MafiaBossAirBombHurlingBall> = [];

	private readonly mafiaBossRocketBullsEyePopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private mafiaBossRocketBullsEyePopDelay: number = 0;

	spawnMafiaBossAirBombHurlingBalls() {

		for (let j = 0; j < 3; j++) {

			const gameObject: MafiaBossAirBombHurlingBall = new MafiaBossAirBombHurlingBall(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.MAFIA_BOSS_AIR_BOMB_HURLING_BALLS));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.mafiaBossRocketBullsEyeSize.width;
			sprite.height = this.mafiaBossRocketBullsEyeSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.mafiaBossRocketBullsEyeGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateMafiaBossAirBombHurlingBalls() {

		let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (mafiaBoss) {

			this.mafiaBossRocketBullsEyePopDelay -= 0.1;

			if (this.mafiaBossRocketBullsEyePopDelay < 0) {

				let mafiaBossRocketBullsEye = this.mafiaBossRocketBullsEyeGameObjects.find(x => x.isAnimating == false);

				if (mafiaBossRocketBullsEye) {
					mafiaBossRocketBullsEye.reset();
					mafiaBossRocketBullsEye.reposition(mafiaBoss);
					mafiaBossRocketBullsEye.setPopping();
					mafiaBossRocketBullsEye.setHurlingTarget(this.player.getCloseBounds());
					mafiaBossRocketBullsEye.enableRendering();
					this.generateFlashExplosion(mafiaBossRocketBullsEye);
				}

				this.mafiaBossRocketBullsEyePopDelay = this.mafiaBossRocketBullsEyePopDelayDefault;
			}
		}
	}

	animateMafiaBossAirBombHurlingBalls() {

		let animatingMafiaBossAirBombHurlingBalls = this.mafiaBossRocketBullsEyeGameObjects.filter(x => x.isAnimating == true);

		if (animatingMafiaBossAirBombHurlingBalls) {

			animatingMafiaBossAirBombHurlingBalls.forEach(mafiaBossRocketBullsEye => {

				if (mafiaBossRocketBullsEye.isBlasting) {
					mafiaBossRocketBullsEye.shrink();
					mafiaBossRocketBullsEye.fade();
					mafiaBossRocketBullsEye.moveDownRight();
				}
				else {

					mafiaBossRocketBullsEye.pop();
					mafiaBossRocketBullsEye.rotate(RotationDirection.Forward, 0, 2.5);

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (mafiaBoss) {
						mafiaBossRocketBullsEye.hurl();

						if (Constants.checkCloseCollision(mafiaBossRocketBullsEye, this.player)) {
							mafiaBossRocketBullsEye.setBlast();
							this.loosePlayerHealth();
							mafiaBoss.setWinStance();
							this.generateRingFireExplosion(mafiaBossRocketBullsEye);
						}
						else {
							if (mafiaBossRocketBullsEye.autoBlast()) {
								mafiaBossRocketBullsEye.setBlast();
								this.generateRingFireExplosion(mafiaBossRocketBullsEye);
							}
						}
					}
					else {
						mafiaBossRocketBullsEye.setBlast();
					}
				}

				if (mafiaBossRocketBullsEye.hasFaded() /*|| mafiaBossRocketBullsEye.x > Constants.DEFAULT_GAME_VIEW_WIDTH || mafiaBossRocketBullsEye.getRight() < 0 || mafiaBossRocketBullsEye.getBottom() < 0 || mafiaBossRocketBullsEye.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					mafiaBossRocketBullsEye.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region Pickups

	//#region HealthPickups

	private healthPickupSize = { width: 327 / 3, height: 327 / 3 };
	private healthPickupGameObjects: Array<HealthPickup> = [];

	private readonly healthPickupPopDelayDefault: number = 130 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private healthPickupPopDelay: number = 0;

	private spawnHealthPickups() {

		for (let j = 0; j < 3; j++) {

			const gameObject: HealthPickup = new HealthPickup(Constants.getRandomNumber(2, Constants.DEFAULT_CONSTRUCT_SPEED));
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.HEALTH_PICKUP));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.healthPickupSize.width;
			sprite.height = this.healthPickupSize.height;
			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.healthPickupGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	private generateHealthPickups() {

		if (HealthPickup.shouldGenerate(this.playerHealthBar.getProgress())) { // generate health if health is below 40 %
			this.healthPickupPopDelay -= 0.1;

			if (this.healthPickupPopDelay < 0) {

				var gameObject = this.healthPickupGameObjects.find(x => x.isAnimating == false);

				if (gameObject) {
					gameObject.reset();

					if (gameObject) {
						var topOrLeft = Constants.getRandomNumber(0, 1);

						switch (topOrLeft) {
							case 0:
								{
									var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;
									gameObject.setPosition(Constants.getRandomNumber(0, xLaneWidth - gameObject.width), gameObject.height * -1);
								}
								break;
							case 1:
								{
									var yLaneWidth = (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2) / 2;
									gameObject.setPosition(gameObject.width * -1, Constants.getRandomNumber(0, yLaneWidth));
								}
								break;
							default:
								break;
						}
					}

					gameObject.enableRendering();

					this.healthPickupPopDelay = this.healthPickupPopDelayDefault;
				}
			}
		}
	}

	private animateHealthPickups() {

		var animatingHealthPickups = this.healthPickupGameObjects.filter(x => x.isAnimating == true);

		if (animatingHealthPickups) {

			animatingHealthPickups.forEach(gameObject => {

				if (gameObject.isPickedUp) {
					gameObject.shrink();
				}
				else {
					gameObject.moveDownRight();

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.pickedUp();

						this.player.gainhealth();
						this.playerHealthBar.setValue(this.player.health);

						this.generateOnScreenMessage("Health +10", gameObject.getFirstSprite().getTexture());
					}
				}

				if (gameObject.hasShrinked() || gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region PowerUpPickups

	private powerUpPickupSize = { width: 327 / 3, height: 327 / 3 };
	private powerUpPickupGameObjects: Array<PowerUpPickup> = [];

	private readonly powerUpPickupPopDelayDefault: number = 130 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private powerUpPickupPopDelay: number = 0;

	private spawnPowerUpPickups() {

		for (let j = 0; j < 3; j++) {

			const gameObject: PowerUpPickup = new PowerUpPickup(Constants.getRandomNumber(2, Constants.DEFAULT_CONSTRUCT_SPEED));
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(TextureType.POWERUP_PICKUP_ARMOR));
			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.powerUpPickupSize.width;
			sprite.height = this.powerUpPickupSize.height;
			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.powerUpPickupGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	private generatePowerUpPickups() {

		if ((this.anyInAirEnemyExists()) && !this.powerUpBar.hasHealth()) {
			this.powerUpPickupPopDelay -= 0.1;

			if (this.powerUpPickupPopDelay < 0) {

				var gameObject = this.powerUpPickupGameObjects.find(x => x.isAnimating == false);

				if (gameObject) {

					gameObject.reset();

					var powerUpPickup = gameObject as PowerUpPickup;

					if (powerUpPickup) {
						var topOrLeft = Constants.getRandomNumber(0, 1);

						switch (topOrLeft) {
							case 0:
								{
									var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;
									powerUpPickup.setPosition(Constants.getRandomNumber(0, xLaneWidth - powerUpPickup.width), powerUpPickup.height * -1);
								}
								break;
							case 1:
								{
									var yLaneWidth = (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2) / 2;
									powerUpPickup.setPosition(powerUpPickup.width * -1, Constants.getRandomNumber(0, yLaneWidth));
								}
								break;
							default:
								break;
						}
					}

					gameObject.enableRendering();

					this.powerUpPickupPopDelay = this.powerUpPickupPopDelayDefault;
				}
			}
		}
	}

	private animatePowerUpPickups() {

		var animatingPowerUpPickups = this.powerUpPickupGameObjects.filter(x => x.isAnimating == true);

		if (animatingPowerUpPickups) {

			animatingPowerUpPickups.forEach(gameObject => {

				if (gameObject.isPickedUp) {
					gameObject.shrink();
				}
				else {

					gameObject.moveDownRight();

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.pickedUp();

						this.powerUpBar.tag = gameObject.powerUpType;
						this.powerUpBar.setIcon(gameObject.getFirstSprite().getTexture());

						switch (gameObject.powerUpType) {
							case PowerUpType.HURLING_BALLS: // if bulls eye powerup, allow using a single shot of 20 bombs
								{
									this.powerUpBar.setMaximumValue(20).setValue(20);
									this.generateOnScreenMessage("Hurling Balls +20", this.powerUpBar.getIcon());
								}
								break;
							case PowerUpType.ARMOR:
								{
									this.powerUpBar.setMaximumValue(10).setValue(10);
									this.generateOnScreenMessage("Armor +10", this.powerUpBar.getIcon());
									this.generatePlayerArmorSpheres();
								}
								break;
							default:
								break;
						}
					}
				}

				if (gameObject.hasShrinked() || gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	private depletePowerUp() {
		if (this.powerUpBar.hasHealth())
			this.powerUpBar.setValue(this.powerUpBar.getValue() - 1); // use up the power up			
	}

	//#endregion

	//#endregion

	//#region GameController

	setGameController() {

	}

	//#endregion	

	//#region ScoreBars

	private repositionGameScoreBar() {
		this.gameScoreBar.reposition(10, 10);
	}

	private repositionGameLevelBar() {
		this.gameLevelBar.reposition(10, 45);
	}

	//#endregion

	//#region HealthBars

	private repositionPlayerHealthBar() {
		this.playerHealthBar.reposition((SceneManager.width) - 105, 10);
	}

	private repositionBossHealthBar() {
		this.bossHealthBar.reposition((SceneManager.width) - 205, 10);
	}

	private repositionPowerUpBar() {
		this.powerUpBar.reposition((SceneManager.width) - 305, 10);
	}

	private repositionSoundPollutionBar() {
		this.soundPollutionBar.reposition((SceneManager.width) - 405, 10);
	}

	private repositionAmmunitionBar() {
		this.ammunitionBar.reposition(this.ammunitionBar.width * 1.5, SceneManager.height - this.ammunitionBar.height * 1.5);
	}

	private setAmmunitionBarValue(source: GameObjectContainer[]) {
		this.ammunitionBar.setValue(source.filter(x => x.isAnimating == false).length);

		if (source.every(x => x.isBlasting == false)) { // only set to default textures and not blasting ones
			this.ammunitionBar.setIcon(source[0].getFirstSprite().getTexture());
		} 
	}

	//#endregion

	//#region OnScreenMessage

	private generateOnScreenMessage(title: string, icon: Texture = Texture.from("character_maleAdventurer_talk")) {
		if (this.onScreenMessage.isAnimating == false) {
			this.onScreenMessage.setContent(title, icon);
			this.onScreenMessage.reset();
			this.onScreenMessage.reposition(SceneManager.width / 2, (SceneManager.height / 3) * 2);
			this.onScreenMessage.enableRendering();
		}
		if (this.onScreenMessage.isAnimating && this.onScreenMessage.getText() != title) {
			this.onScreenMessage.setContent(title, icon);
			this.onScreenMessage.reset();
			this.onScreenMessage.reposition(SceneManager.width / 2, (SceneManager.height / 3) * 2);
		}
	}

	private animateOnScreenMessage() {

		if (this.onScreenMessage.isAnimating == true) {
			this.onScreenMessage.depleteOnScreenDelay();

			if (this.onScreenMessage.isDepleted()) {
				this.onScreenMessage.disableRendering();
			}
		}
	}

	//#endregion	

	//#endregion
}

