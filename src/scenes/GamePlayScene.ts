import { BlurFilter, Container, Graphics, Texture } from "pixi.js";
import { GameObjectContainer } from '../core/GameObjectContainer';
import { Constants, ConstructType, ExplosionType, PlayerGroundBombTemplate, PlayerRideTemplate, PlayerAirBombTemplate, PowerUpType, RotationDirection, SoundType } from '../Constants';
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
import { VehicleBossRocket } from "../objects/VehicleBossRocket";
import { UfoEnemy } from "../objects/UfoEnemy";
import { UfoEnemyRocket } from "../objects/UfoEnemyRocket";
import { UfoBoss } from "../objects/UfoBoss";
import { UfoBossRocket } from "../objects/UfoBossRocket";
import { UfoBossRocketSeeking } from "../objects/UfoBossRocketSeeking";
import { HealthPickup } from "../objects/HealthPickup";
import { Honk } from "../objects/Honk";
import { MafiaBoss } from "../objects/MafiaBoss";
import { MafiaBossRocket } from "../objects/MafiaBossRocket";
import { MafiaBossRocketBullsEye } from "../objects/MafiaBossRocketBullsEye";
import { PlayerRide } from "../objects/PlayerRide";
import { PlayerGroundBomb } from "../objects/PlayerGroundBomb";
import { Explosion } from "../objects/Explosion";
import { PlayerAirBomb } from "../objects/PlayerAirBomb";
import { PlayerAirBombBullsEye } from "../objects/PlayerAirBombBullsEye";
import { PowerUpPickup } from "../objects/PowerUpPickup";
import { ZombieBoss } from "../objects/ZombieBoss";
import { ZombieBossRocketBlock } from "../objects/ZombieBossRocketBlock";
import { MessageBubble } from "../controls/MessageBubble";
import { RoadMark } from "../objects/RoadMark";
import { GrandExplosionRing } from "../objects/GrandExplosionRing";


export class GamePlayScene extends Container implements IScene {

	//#region Properties

	private sceneContainer: GameObjectContainer;

	private gameController: GameController;
	private gameScoreBar: GameScoreBar;
	private gameLevelBar: GameScoreBar;

	private onScreenMessage: OnScreenMessage;

	//TODO: do yourself a favor, reset these to the default values after testing
	private readonly ufoEnemyRelease: { point: number, limit: number } = { point: 35, limit: 15 }; // 35
	private readonly vehicleBossRelease: { point: number, limit: number } = { point: 25, limit: 15 }; // 25
	private readonly ufoBossRelease: { point: number, limit: number } = { point: 50, limit: 15 }; // 50
	private readonly zombieBossRelease: { point: number, limit: number } = { point: 100, limit: 15 }; // 100
	private readonly mafiaBossRelease: { point: number, limit: number } = { point: 150, limit: 15 }; // 150

	private readonly ufoEnemyCheckpoint: GameCheckpoint;
	private readonly vehicleBossCheckpoint: GameCheckpoint;
	private readonly ufoBossCheckpoint: GameCheckpoint;
	private readonly zombieBossCheckpoint: GameCheckpoint;
	private readonly mafiaBossCheckpoint: GameCheckpoint;

	private playerHealthBar: HealthBar;
	private bossHealthBar: HealthBar;

	private powerUpBar: HealthBar;
	private soundPollutionBar: HealthBar;

	private stageColors: number[] = [0x1e2a36, 0x4187ab];
	private stageColor: Graphics;
	private stageMask: Graphics;

	private behindBackIcon: Texture;
	private talkIcon: Texture;
	private cheerIcon: Texture;
	private interactIcon: Texture;

	private honkBustReactions: string[] = [];

	private sceneBoundaryWidth: number = Constants.DEFAULT_GAME_VIEW_WIDTH;
	private sceneBoundaryHeight: number = Constants.DEFAULT_GAME_VIEW_HEIGHT;

	//#endregion

	//#region Methods

	//#region Constructor

	constructor() {
		super();

		this.honkBustReactions = ["Hey!", "No!", "What?", "Oh no!", "What the hell?", "Why?", "What are you doing?", "OMG!", "Holy shit!", "Holy moly!"];

		// get textures for on screen message icons
		this.behindBackIcon = Texture.from("character_maleAdventurer_behindBack");
		this.cheerIcon = Texture.from("character_maleAdventurer_cheer0");
		this.talkIcon = Texture.from("character_maleAdventurer_talk");
		this.interactIcon = Texture.from("character_maleAdventurer_interact");

		// set the background color of the scene		
		let color = this.stageColors[Constants.getRandomNumber(0, this.stageColors.length - 1)];

		this.stageColor = new Graphics().beginFill(color, 1).drawRect(0, 0, SceneManager.width, SceneManager.height).endFill();
		this.addChildAt(this.stageColor, 0);

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
		this.generatePlayerBalloon(); // player health is calculated here

		// set the game score bar		
		this.gameScoreBar = new GameScoreBar(this, "Score ");
		this.repositionGameScoreBar();

		// set the game level bar		
		this.gameLevelBar = new GameScoreBar(this, "Lvl ", 1);
		this.repositionGameLevelBar();

		// set health bars		
		this.playerHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP), this).setMaximumValue(this.player.health).setValue(this.player.health);
		this.repositionPlayerHealthBar();

		this.bossHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS), this, 0x7200ff).setMaximumValue(100).setValue(0);
		this.repositionBossHealthBar();

		// set power up bar
		this.powerUpBar = new HealthBar(Constants.getRandomTexture(ConstructType.POWERUP_PICKUP_ARMOR), this, 0xffaa00).setMaximumValue(100).setValue(0);
		this.repositionPowerUpBar();

		// set sound pollution bar
		this.soundPollutionBar = new HealthBar(Constants.getRandomTexture(ConstructType.HONK), this, 0x7200ff).setMaximumValue(6).setValue(0);
		this.repositionSoundPollutionBar();

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
		this.stageMask = new Graphics().beginFill().drawRoundedRect(5, 5, SceneManager.width - 10, SceneManager.height - 10, 5).endFill();
		this.mask = this.stageMask;

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
			case PlayerRideTemplate.AIR_BALLOON: { } break;
			case PlayerRideTemplate.CHOPPER: { SoundManager.play(SoundType.CHOPPER_HOVERING, 0.1, true); } break;
			default:
		}

		// start background sounds
		SoundManager.play(SoundType.AMBIENCE, 0.3, true);
		SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC, 0.3, true);
		SoundManager.play(SoundType.GAME_START);
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

	private honkSize = { width: 125, height: 125 };
	private honkGameObjects: Array<Honk> = [];

	private spawnHonks() {

		for (let j = 0; j < 5; j++) {

			const honk: Honk = new Honk(Constants.DEFAULT_CONSTRUCT_SPEED);
			honk.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HONK));
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

		if (source.getLeft() - 25 > 0 && source.getTop() - 25 > 0) {

			var honk = this.honkGameObjects.find(x => x.isAnimating == false);

			if (honk) {
				honk.reset();
				honk.reposition(source);
				//honk.setPopping();
				honk.enableRendering();
			}
		}
	}

	private animateHonks() {

		var animatingHonks = this.honkGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonks) {

			animatingHonks.forEach(honk => {
				//honk.pop();
				honk.fade();
				honk.expand();
				honk.moveDownRight();

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

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_MARK));
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

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_TOP));

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

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_BOTTOM));

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

	//#region Clouds

	//private cloudSizeWidth: number = 512 / 2;
	//private cloudSizeHeight: number = 350 / 2;

	//private cloudGameObjects: Array<GameObjectContainer> = [];

	//private cloudPopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	//private cloudPopDelay: number = 0;

	//private spawnClouds() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: Cloud = new Cloud(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2));
	//		gameObject.disableRendering();
	//		//gameObject.width = this.cloudSizeWidth;
	//		//gameObject.height = this.cloudSizeHeight;

	//		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.CLOUD));

	//		sprite.x = 0;
	//		sprite.y = 0;
	//		sprite.width = this.cloudSizeWidth;
	//		sprite.height = this.cloudSizeHeight;
	//		//sprite.filters = [new BlurFilter(4, 10)];
	//		//cloudContainer.filters = [new BlurFilter(2, 10)];
	//		gameObject.addChild(sprite);

	//		this.cloudGameObjects.push(gameObject);
	//		this._sceneContainer.addChild(gameObject);
	//	}
	//}

	//private generateClouds() {

	//	this.cloudPopDelay -= 0.1;

	//	if (this.cloudPopDelay < 0) {

	//		var gameObject = this.cloudGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {

	//			gameObject.setTexture(Constants.getRandomTexture(ConstructType.CLOUD));
	//			gameObject.speed = Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2);

	//			var cloud = gameObject as Cloud;
	//			cloud.reposition();

	//			gameObject.enableRendering();

	//			this.cloudPopDelay = this.cloudPopDelayDefault;
	//		}
	//	}
	//}

	//private animateClouds() {

	//	var animatingClouds = this.cloudGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingClouds) {

	//		animatingClouds.forEach(gameObject => {

	//			gameObject.hover();
	//			gameObject.moveDownRight();

	//			if (gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.disableRendering();

	//			}
	//		});
	//	}
	//}

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

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GRAND_EXPLOSION_RING));
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

		if (this.isBossDeathExploding() && this.anyBossExists()) {

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
					//this.generateRingSmokeExplosion(anyBoss);
					SoundManager.play(SoundType.AIR_BOMB_BLAST);

					if (this.bossDeathExplosionDuration > 0 && this.bossDeathExplosionDuration <= 0.3) { // when duration depletes generate an explosion ring
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

	spawnPlayerBalloon() {
		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_RIDE_IDLE));
		sprite.x = 0;
		sprite.y = 0;

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case PlayerRideTemplate.AIR_BALLOON: {
				sprite.width = this.playerRideSize.width / 3;
				sprite.height = this.playerRideSize.height / 3;
			} break;
			case PlayerRideTemplate.CHOPPER: {
				sprite.width = this.playerRideSize.width / 3.5;
				sprite.height = this.playerRideSize.height / 3.5;
			} break;
			default: break;
		}

		sprite.anchor.set(0.5, 0.5);
		this.player.addChild(sprite);

		this.player.setPlayerRideTemplate(Constants.SELECTED_PLAYER_RIDE_TEMPLATE);
		this.player.disableRendering();

		this.sceneContainer.addChild(this.player);
		this.spawnCastShadow(this.player);
	}

	generatePlayerBalloon() {
		this.player.reset();
		this.player.reposition();
		this.player.enableRendering();
	}

	animatePlayerBalloon() {
		this.player.pop();
		this.player.hover();

		if (Constants.SELECTED_PLAYER_RIDE_TEMPLATE == PlayerRideTemplate.AIR_BALLOON) {
			this.player.dillyDally();
		}

		this.player.depleteAttackStance();
		this.player.depleteWinStance();
		this.player.depleteHitStance();
		this.player.recoverFromHealthLoss();

		//console.log("scale: " + SceneManager.scaling + " w: " + screenWidth + " h: " + screenHeight + " pl.x:" + this.player.x + " pl.y:" + this.player.y);

		this.player.move(this.sceneBoundaryWidth, this.sceneBoundaryHeight, this.gameController);

		if (this.gameController.isAttacking) {

			if (this.anyInAirEnemyExists()) {

				if (this.powerUpBar.hasHealth()) {

					switch (this.powerUpBar.tag) {
						case PowerUpType.HURLING_BALLS:
							{
								this.generatePlayerAirBombBullsEye();
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
		this.player.setPopping();

		if (this.powerUpBar.hasHealth() && this.powerUpBar.tag == PowerUpType.ARMOR) {
			this.depletePowerUp();
		}
		else {

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

	private playerGroundBombSize = { width: 65, height: 65 };
	private playerGroundBombGameObjects: Array<PlayerGroundBomb> = [];

	private readonly playerAmmoBeltSize: number = 3 + Constants.ATTACK_LEVEL_MAX;

	spawnPlayerGroundBombs() {

		for (let j = 0; j < this.playerAmmoBeltSize; j++) {

			const gameObject: PlayerGroundBomb = new PlayerGroundBomb(4);
			gameObject.disableRendering();
			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_GROUND_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerGroundBombSize.width;
			sprite.height = this.playerGroundBombSize.height;

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
	}

	animatePlayerGroundBombs() {

		var animatingHonkBombs = this.playerGroundBombGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonkBombs) {

			animatingHonkBombs.forEach(playerGroundBomb => {

				playerGroundBomb.pop();

				if (playerGroundBomb.isBlasting) {

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
				else {
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
								playerGroundBomb.awaitToDropOnGround();
							}
						} break;
						default: break;
					}
				}

				if (playerGroundBomb.hasFaded() || playerGroundBomb.hasShrinked() /*|| playerGroundBomb.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || playerGroundBomb.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT*/) {
					playerGroundBomb.disableRendering();
				}
			});
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

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_AIR_BOMB));
			sprite.x = 0;
			sprite.y = 0;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			switch (Constants.SELECTED_PLAYER_AIR_BOMB_TEMPLATE) {
				case PlayerAirBombTemplate.GRAVITY_BALL: {
					sprite.width = this.playerAirBombSize.width / 1.5;
					sprite.height = this.playerAirBombSize.height / 1.5;

					gameObject.setTemplate(PlayerAirBombTemplate.GRAVITY_BALL);
				} break;
				case PlayerAirBombTemplate.MISSILE: {
					sprite.width = this.playerAirBombSize.width;
					sprite.height = this.playerAirBombSize.height;

					gameObject.setTemplate(PlayerAirBombTemplate.MISSILE);
				} break;
				case PlayerAirBombTemplate.BULLET_BALL: {
					sprite.width = this.playerAirBombSize.width / 1.5;
					sprite.height = this.playerAirBombSize.height / 1.5;

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
				}
			});
		}
	}

	setPlayerAirBombDirection(source: GameObjectContainer, playerAirBomb: PlayerAirBomb, target: GameObjectContainer) {

		if (playerAirBomb.playerAirBombTemplate == PlayerAirBombTemplate.BULLET_BALL) { // if bullet ball set the target
			playerAirBomb.setShootTarget(target.getCloseBounds());
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

	//#region PlayerAirBombBullsEyes

	private playerAirBombBullsEyeSize = { width: 75, height: 75 };
	private playerAirBombBullsEyeGameObjects: Array<PlayerAirBombBullsEye> = [];

	spawnPlayerAirBombBullsEyes() {

		for (let j = 0; j < this.playerAmmoBeltSize; j++) {

			const gameObject: PlayerAirBombBullsEye = new PlayerAirBombBullsEye(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_AIR_BOMB_HURLING_BALLS));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerAirBombBullsEyeSize.width;
			sprite.height = this.playerAirBombBullsEyeSize.height;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.playerAirBombBullsEyeGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerAirBombBullsEye() {

		let playerAirBombBullsEye = this.playerAirBombBullsEyeGameObjects.find(x => x.isAnimating == false);

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
				playerAirBombBullsEye.setDirectTarget(anyTarget.getCloseBounds());
				playerAirBombBullsEye.enableRendering();
				this.generateFlashExplosion(playerAirBombBullsEye);

				if (this.powerUpBar.hasHealth() && this.powerUpBar.tag == PowerUpType.HURLING_BALLS)
					this.depletePowerUp();
			}
		}
	}

	animatePlayerAirBombBullsEyes() {

		let animatingPlayerAirBombBullsEyes = this.playerAirBombBullsEyeGameObjects.filter(x => x.isAnimating == true);

		if (animatingPlayerAirBombBullsEyes) {

			animatingPlayerAirBombBullsEyes.forEach(playerAirBombBullsEye => {

				if (playerAirBombBullsEye.isBlasting) {
					playerAirBombBullsEye.shrink();
					playerAirBombBullsEye.fade();
					playerAirBombBullsEye.moveDownRight();
				}
				else {

					playerAirBombBullsEye.pop();
					playerAirBombBullsEye.rotate(RotationDirection.Forward, 0, 2.5);
					playerAirBombBullsEye.direct();

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
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region UfoEnemys

	private ufoEnemiesAppeared: boolean = false;
	private ufoEnemyDefeatCount: number = 0;
	private readonly ufoEnemyDefeatPoint: number = 20;

	//#region UfoEnemys

	private ufoEnemySize = { width: 165, height: 165 };
	private ufoEnemyGameObjects: Array<UfoEnemy> = [];

	private readonly ufoEnemyPopDelayDefault: number = 35 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoEnemyPopDelay: number = 0;

	private spawnUfoEnemys() {

		for (let j = 0; j < 7; j++) {

			const gameObject: UfoEnemy = new UfoEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_ENEMY));

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
						SoundManager.play(SoundType.UFO_HOVERING, 0.6, true);
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

					if (!ufoEnemy.isDestructionComplete)
						ufoEnemy.awaitDestruction();
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
						this.generateUfoEnemyRockets(ufoEnemy);
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
				this.gainScore();
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

	//#region UfoEnemyRockets

	private ufoEnemyRocketSize = { width: 85, height: 85 };
	private ufoEnemyRocketGameObjects: Array<UfoEnemyRocket> = [];

	spawnUfoEnemyRockets() {

		for (let j = 0; j < 7; j++) {

			const gameObject: UfoEnemyRocket = new UfoEnemyRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_ENEMY_ROCKET));

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

	generateUfoEnemyRockets(ufoEnemy: UfoEnemy) {

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

	animateUfoEnemyRockets() {

		let animatingUfoEnemyRockets = this.ufoEnemyRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoEnemyRockets) {

			animatingUfoEnemyRockets.forEach(ufoEnemyRocket => {

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

	private vehicleEnemySize = { width: 250, height: 250 };
	private vehicleEnemyGameObjects: Array<VehicleEnemy> = [];

	private readonly vehicleEnemyPopDelayDefault: number = 30 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleEnemyPopDelay: number = 15;

	private soundPollutionDamageDelay: number = 15;
	private readonly soundPollutionDamageDelayDefault: number = 15;

	private spawnVehicleEnemys() {

		for (let j = 0; j < 10; j++) {

			const gameObject: VehicleEnemy = new VehicleEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.vehicleType = Constants.getRandomNumber(ConstructType.VEHICLE_ENEMY_SMALL, ConstructType.VEHICLE_ENEMY_LARGE);

			gameObject.disableRendering();

			var uri: string = "";
			switch (gameObject.vehicleType) {
				case ConstructType.VEHICLE_ENEMY_SMALL: {
					uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);
				} break;
				case ConstructType.VEHICLE_ENEMY_LARGE: {
					uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);
				} break;
				default: break;
			}

			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;

			switch (gameObject.vehicleType) {
				case ConstructType.VEHICLE_ENEMY_SMALL: {
					sprite.width = this.vehicleEnemySize.width / 1.2;
					sprite.height = this.vehicleEnemySize.height / 1.2;
				} break;
				case ConstructType.VEHICLE_ENEMY_LARGE: {
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

					let sprite = gameObject.getSprite();

					switch (gameObject.vehicleType) {
						case ConstructType.VEHICLE_ENEMY_SMALL: {
							sprite.width = this.vehicleEnemySize.width / 1.2;
							sprite.height = this.vehicleEnemySize.height / 1.2;
						} break;
						case ConstructType.VEHICLE_ENEMY_LARGE: {
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
				if (vehicleEnemy) {

					if (vehicleEnemy.honk() && !this.ufoEnemyExists() && !this.anyInAirBossExists()) {
						this.generateHonk(vehicleEnemy);
					}
				}

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
				this.gainScore(false);
				SoundManager.play(SoundType.SCORE_ACQUIRED, 1);

				this.generateMessageBubble(vehicleEnemy, this.honkBustReactions[Constants.getRandomNumber(0, this.honkBustReactions.length - 1)]);
			}
		}
	}

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

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS));
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

				let sprite = gameObject.getSprite();

				sprite.width = this.vehicleEnemySize.width / 1.2;
				sprite.height = this.vehicleEnemySize.height / 1.2;

				gameObject.reposition();
				gameObject.health = this.vehicleBossCheckpoint.getReleasePointDifference() * 1.5;
				gameObject.enableRendering();

				this.vehicleBossCheckpoint.increaseLimit(this.vehicleBossRelease.limit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(gameObject.health);
				this.bossHealthBar.setValue(gameObject.health);
				this.bossHealthBar.setIcon(gameObject.getSprite().getTexture());

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
			this.gainScore(false);
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

	//#region VehicleBossRockets

	private vehicleBossRocketSize = { width: 90, height: 90 };
	private vehicleBossRocketGameObjects: Array<VehicleBossRocket> = [];

	private readonly vehicleBossRocketPopDelayDefault: number = 12 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleBossRocketPopDelay: number = 0;

	spawnVehicleBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: VehicleBossRocket = new VehicleBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED * 1.1);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS_ROCKET));

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

	generateVehicleBossRockets() {

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

	animateVehicleBossRockets() {

		let animatingVehicleBossRockets = this.vehicleBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingVehicleBossRockets) {

			animatingVehicleBossRockets.forEach(gameObject => {
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

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_IDLE));

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
				this.bossHealthBar.setIcon(ufoBoss.getSprite().getTexture());

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
			this.gainScore();
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

	//#region UfoBossRockets

	private ufoBossRocketSize = { width: 90, height: 90 };
	private ufoBossRocketGameObjects: Array<UfoBossRocket> = [];

	private readonly ufoBossRocketPopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoBossRocketPopDelay: number = 0;

	spawnUfoBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: UfoBossRocket = new UfoBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET));

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

	generateUfoBossRockets() {

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

	animateUfoBossRockets() {

		let animatingUfoBossRockets = this.ufoBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoBossRockets) {

			animatingUfoBossRockets.forEach(ufoBossRocket => {

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

	//#region UfoBossRocketSeekings

	private ufoBossRocketSeekingSize = { width: 75, height: 75 };
	private ufoBossRocketSeekingGameObjects: Array<UfoBossRocketSeeking> = [];

	private readonly ufoBossRocketSeekingPopDelayDefault: number = 12 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoBossRocketSeekingPopDelay: number = 0;

	spawnUfoBossRocketSeekings() {

		for (let j = 0; j < 2; j++) {

			const gameObject: UfoBossRocketSeeking = new UfoBossRocketSeeking(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET_SEEKING));

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

	generateUfoBossRocketSeekings() {

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

	animateUfoBossRocketSeekings() {

		let animatingUfoBossRocketSeekings = this.ufoBossRocketSeekingGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoBossRocketSeekings) {

			animatingUfoBossRocketSeekings.forEach(ufoBossRocketSeeking => {

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

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_IDLE));

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
				this.bossHealthBar.setIcon(zombieBoss.getSprite().getTexture());

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
			this.gainScore();
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

	//#region ZombieBossRocketBlocks

	private zombieBossRocketBlockSize = { width: 256 / 1.5, height: 256 / 1.5 };
	private zombieBossRocketBlockGameObjects: Array<ZombieBossRocketBlock> = [];

	private readonly zombieBossRocketBlockPopDelayDefault: number = 8 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private zombieBossRocketBlockPopDelay: number = 0;

	spawnZombieBossRocketBlocks() {

		for (let j = 0; j < 5; j++) {

			const gameObject: ZombieBossRocketBlock = new ZombieBossRocketBlock(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK));

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

	generateZombieBossRocketBlocks() {

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

	animateZombieBossRocketBlocks() {

		let animatingZombieBossRocketBlocks = this.zombieBossRocketBlockGameObjects.filter(x => x.isAnimating == true);

		if (animatingZombieBossRocketBlocks) {

			animatingZombieBossRocketBlocks.forEach(zombieBossRocketBlock => {
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

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_IDLE));

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
				this.bossHealthBar.setIcon(mafiaBoss.getSprite().getTexture());

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
			this.gainScore();
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

	//#region MafiaBossRockets

	private mafiaBossRocketSize = { width: 90, height: 90 };
	private mafiaBossRocketGameObjects: Array<MafiaBossRocket> = [];

	private readonly mafiaBossRocketPopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private mafiaBossRocketPopDelay: number = 0;

	spawnMafiaBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: MafiaBossRocket = new MafiaBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET));

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

	generateMafiaBossRockets() {

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

	animateMafiaBossRockets() {

		let animatingMafiaBossRockets = this.mafiaBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingMafiaBossRockets) {

			animatingMafiaBossRockets.forEach(mafiaBossRocket => {

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

	//#region MafiaBossRocketBullsEyes

	private mafiaBossRocketBullsEyeSize = { width: 75, height: 75 };
	private mafiaBossRocketBullsEyeGameObjects: Array<MafiaBossRocketBullsEye> = [];

	private readonly mafiaBossRocketBullsEyePopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private mafiaBossRocketBullsEyePopDelay: number = 0;

	spawnMafiaBossRocketBullsEyes() {

		for (let j = 0; j < 3; j++) {

			const gameObject: MafiaBossRocketBullsEye = new MafiaBossRocketBullsEye(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET_HURLING_BALLS));

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

	generateMafiaBossRocketBullsEyes() {

		let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

		if (mafiaBoss) {

			this.mafiaBossRocketBullsEyePopDelay -= 0.1;

			if (this.mafiaBossRocketBullsEyePopDelay < 0) {

				let mafiaBossRocketBullsEye = this.mafiaBossRocketBullsEyeGameObjects.find(x => x.isAnimating == false);

				if (mafiaBossRocketBullsEye) {
					mafiaBossRocketBullsEye.reset();
					mafiaBossRocketBullsEye.reposition(mafiaBoss);
					mafiaBossRocketBullsEye.setPopping();
					mafiaBossRocketBullsEye.setDirectTarget(this.player.getCloseBounds());
					mafiaBossRocketBullsEye.enableRendering();
					this.generateFlashExplosion(mafiaBossRocketBullsEye);
				}

				this.mafiaBossRocketBullsEyePopDelay = this.mafiaBossRocketBullsEyePopDelayDefault;
			}
		}
	}

	animateMafiaBossRocketBullsEyes() {

		let animatingMafiaBossRocketBullsEyes = this.mafiaBossRocketBullsEyeGameObjects.filter(x => x.isAnimating == true);

		if (animatingMafiaBossRocketBullsEyes) {

			animatingMafiaBossRocketBullsEyes.forEach(mafiaBossRocketBullsEye => {

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
						mafiaBossRocketBullsEye.direct();

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

			const gameObject: HealthPickup = new HealthPickup(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED));
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP));

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

						this.generateOnScreenMessage("Health +10", gameObject.getSprite().getTexture());
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

			const gameObject: PowerUpPickup = new PowerUpPickup(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED));
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.POWERUP_PICKUP_ARMOR));

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
						this.powerUpBar.setIcon(gameObject.getSprite().getTexture());

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

	//#region HUD

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

	//#region Scene

	public update() {
		this.processFrame();
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

			let color = this.stageColors[Constants.getRandomNumber(0, this.stageColors.length - 1)];
			this.stageColor.clear().beginFill(color, 1).drawRect(0, 0, SceneManager.width, SceneManager.height).endFill();
			this.stageMask.clear().beginFill().drawRoundedRect(5, 5, SceneManager.width - 10, SceneManager.height - 10, 5).endFill();

			this.sceneBoundaryWidth = Constants.DEFAULT_GAME_VIEW_WIDTH * (SceneManager.scaling * 1.20);
			this.sceneBoundaryHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT * (SceneManager.scaling * 1.35);
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

		this.spawnVehicleEnemys();
		this.spawnVehicleBosss();

		this.spawnHonks();
		this.spawnVehicleBossRockets();

		this.spawnSideWalksBottom();
		this.spawnBlowSmokeExplosions();
		this.spawnRingSmokeExplosions();

		this.spawnPlayerGroundBombs();
		this.spawnPlayerAirBombs();
		this.spawnPlayerAirBombBullsEyes();
		this.spawnPlayerBalloon();

		this.spawnUfoBossRockets();
		this.spawnUfoBossRocketSeekings();
		this.spawnUfoBosss();

		this.spawnZombieBosss();
		this.spawnZombieBossRocketBlocks();

		this.spawnMafiaBosss();
		this.spawnMafiaBossRockets();
		this.spawnMafiaBossRocketBullsEyes();

		this.spawnUfoEnemyRockets();
		this.spawnUfoEnemys();

		this.spawnFlashExplosions();
		this.spawnRingFireExplosions();
		this.spawnGrandExplosionRings();

		this.spawnHealthPickups();
		this.spawnPowerUpPickups();

		this.spawnMessageBubbles();

		//this.spawnSideWalkPillarsBottom();
	}

	private generateGameObjects() {

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.generateRoadMarks();
			this.generateSideWalksTop();
		}

		this.generateVehicleEnemys();
		this.generateVehicleBoss();
		this.generateVehicleBossRockets();

		this.generateUfoBoss();
		this.generateUfoBossRockets();
		this.generateUfoBossRocketSeekings();

		this.generateZombieBoss();
		this.generateZombieBossRocketBlocks();

		this.generateMafiaBoss();
		this.generateMafiaBossRockets();
		this.generateMafiaBossRocketBullsEyes();

		this.generateUfoEnemys();

		this.generateHealthPickups();
		this.generatePowerUpPickups();

		//this.generateClouds();

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.generateSideWalksBottom();
			//this.generateSideWalkPillarsBottom();
		}

		this.generateBossDeathExplosions();
		this.generateBossLowHealthExplosions();
		this.generatePlayerLowHealthExplosions();
	}

	private animateGameObjects() {

		this.animatePlayerBalloon();

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.animateRoadMarks();
			this.animateSideWalksTop();
		}

		this.animateVehicleEnemys();
		this.animateVehicleBoss();
		this.animateVehicleBossRockets();

		this.animateHonks();

		this.animatePlayerGroundBombs();
		this.animateFlashExplosions();
		this.animateBlowSmokeExplosions();
		this.animateRingSmokeExplosions();
		this.animateRingFireExplosions();
		this.animateGrandExplosionRings();
		this.animatePlayerAirBombs();
		this.animatePlayerAirBombBullsEyes();

		this.animateUfoBoss();
		this.animateUfoBossRockets();
		this.animateUfoBossRocketSeekings();

		this.animateZombieBoss();
		this.animateZombieBossRocketBlocks();

		this.animateMafiaBoss();
		this.animateMafiaBossRockets();
		this.animateMafiaBossRocketBullsEyes();

		this.animateUfoEnemys();
		this.animateUfoEnemyRockets();

		this.animateHealthPickups();
		this.animatePowerUpPickups();

		this.animateCastShadows();

		if (!this.anyInAirBossExists() && !this.isBossDeathExploding()) {
			this.animateSideWalksBottom();
			//this.animateSideWalkPillarsBottom();
		}

		//this.animateClouds();
		this.animateOnScreenMessage();
		this.animateMessageBubbles();
	}

	//#endregion

	//#region Game

	private gainScore(airEnemyBusted: boolean = true) {

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
				case PlayerGroundBombTemplate.GRENADE: { score += 1; } break;
				case PlayerGroundBombTemplate.TRASH_BIN: { score += 2; } break;
				case PlayerGroundBombTemplate.DYNAMITE: { score += 3; } break;
				default: { score += 1; } break;
			}
		}

		this.gameScoreBar.gainScore(score);
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
			case 0: { } break;
			case 1: { SoundManager.resume(SoundType.CHOPPER_HOVERING); } break;
			default:
		}

		if (this.onScreenMessage.isAnimating == true && this.onScreenMessage.getText() == "Game paused") {
			this.onScreenMessage.disableRendering();
		}

		this.sceneContainer.filters = null;
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
			case 0: { } break;
			case 1: { SoundManager.pause(SoundType.CHOPPER_HOVERING); } break;
			default:
		}

		SoundManager.pause(SoundType.AMBIENCE);

		this.generateOnScreenMessage("Game paused", this.behindBackIcon);

		this.sceneContainer.filters = [new BlurFilter()];
	}

	private gameOver() {
		SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
		SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
		SoundManager.stop(SoundType.UFO_HOVERING);
		SoundManager.stop(SoundType.UFO_BOSS_ENTRY);
		SoundManager.stop(SoundType.UFO_ENEMY_ENTRY);
		SoundManager.stop(SoundType.AMBIENCE);
		SoundManager.stop(SoundType.CHOPPER_HOVERING);

		Constants.GAME_SCORE = this.gameScoreBar.getScore();
		Constants.GAME_LEVEL = this.gameLevelBar.getScore();

		this.stageMask.destroy();
		this.stageColor.destroy();

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

	//#endregion
}

