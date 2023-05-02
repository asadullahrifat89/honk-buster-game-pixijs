import { BlurFilter, Container, Graphics, Texture } from "pixi.js";
import { GameObjectContainer } from '../core/GameObjectContainer';
import { Constants, ConstructType, ExplosionType, PlayerHonkBombTemplate, PlayerRideTemplate, PowerUpType, RotationDirection, SoundType } from '../Constants';
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
import { PlayerHonkBomb } from "../objects/PlayerHonkBomb";
import { Explosion } from "../objects/Explosion";
import { PlayerRocket } from "../objects/PlayerRocket";
import { PlayerRocketBullsEye } from "../objects/PlayerRocketBullsEye";
import { PowerUpPickup } from "../objects/PowerUpPickup";
import { ZombieBoss } from "../objects/ZombieBoss";
import { ZombieBossRocketBlock } from "../objects/ZombieBossRocketBlock";
import { SoundTemplate } from "../core/SoundTemplate";
import { MessageBubble } from "../controls/MessageBubble";



export class GameScene extends Container implements IScene {

	//#region Properties

	private gameController: GameController;
	private gameContainer: GameObjectContainer;
	private gameScoreBar: GameScoreBar;
	private gameLevelBar: GameScoreBar;

	private onScreenMessage: OnScreenMessage;

	//TODO: do yourself a favor, reset these to the default values after testing
	private readonly vehicleBossReleasePoint: number = 25; // 25
	private readonly vehicleBossReleaseLimit: number = 15;
	private readonly vehicleBossCheckpoint: GameCheckpoint;
		
	private readonly ufoEnemyReleasePoint: number = 35; // 35
	private readonly ufoEnemyReleaseLimit: number = 5;
	private readonly ufoEnemyCheckpoint: GameCheckpoint;
		
	private readonly ufoBossReleasePoint: number = 50; // 50
	private readonly ufoBossReleaseLimit: number = 15;
	private readonly ufoBossCheckpoint: GameCheckpoint;
		
	private readonly zombieBossReleasePoint: number = 85; // 85
	private readonly zombieBossReleaseLimit: number = 15;
	private readonly zombieBossCheckpoint: GameCheckpoint;
	
	private readonly mafiaBossReleasePoint: number = 100; // 100
	private readonly mafiaBossReleaseLimit: number = 15;
	private readonly mafiaBossCheckpoint: GameCheckpoint;

	private ufoEnemiesAppeared: boolean = false;
	private ufoEnemyDefeatCount: number = 0;
	private readonly ufoEnemyDefeatPoint: number = 20;

	private playerHealthBar: HealthBar;
	private bossHealthBar: HealthBar;
	private powerUpMeter: HealthBar;

	private gameLevel: number = 0;
	private roadBackgroundDay: Graphics;
	private behindBackIcon: Texture;
	private talkIcon: Texture;
	private cheerIcon: Texture;
	private interactIcon: Texture;

	private honkBustReactions: SoundTemplate[] = [];

	//#endregion

	//#region Methods

	//#region Constructor

	constructor() {
		super();

		this.honkBustReactions = Constants.SOUND_TEMPLATES.filter(x => x.soundType == SoundType.HONK_BUST_REACTION);

		this.behindBackIcon = Texture.from("./images/character_maleAdventurer_behindBack.png");
		this.cheerIcon = Texture.from("./images/character_maleAdventurer_cheer0.png");
		this.talkIcon = Texture.from("./images/character_maleAdventurer_talk.png");
		this.interactIcon = Texture.from("./images/character_maleAdventurer_interact.png");

		this.playerRideTemplate = Constants.SELECTED_PLAYER_RIDE_TEMPLATE;
		this.playerHonkBusterTemplate = Constants.SELECTED_HONK_BUSTER_TEMPLATE;

		let colors: number[] = [0x1e2a36, 0x4187ab]
		let color = colors[Constants.getRandomNumber(0, colors.length - 1)];
		this.roadBackgroundDay = new Graphics().beginFill(color, 1).drawRect(0, 0, SceneManager.width, SceneManager.height).endFill();

		this.addChildAt(this.roadBackgroundDay, 0);

		this.gameContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
		this.addChild(this.gameContainer);
		this.gameContainer.alpha = 0;

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

		this.vehicleBossCheckpoint = new GameCheckpoint(this.vehicleBossReleasePoint);
		this.ufoBossCheckpoint = new GameCheckpoint(this.ufoBossReleasePoint);
		this.zombieBossCheckpoint = new GameCheckpoint(this.zombieBossReleasePoint);
		this.mafiaBossCheckpoint = new GameCheckpoint(this.mafiaBossReleasePoint);
		this.ufoEnemyCheckpoint = new GameCheckpoint(this.ufoEnemyReleasePoint);

		this.spawnGameObjects();

		this.generatePlayerBalloon();

		this.gameScoreBar = new GameScoreBar(this, "Score ");
		this.repositionGameScoreBar();

		this.gameLevelBar = new GameScoreBar(this, "Lvl ", 1);
		this.repositionGameLevelBar();

		this.playerHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP), this);
		this.playerHealthBar.setMaximumValue(this.player.health);
		this.playerHealthBar.setValue(this.player.health);
		this.repositionPlayerHealthBar();

		this.bossHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.VEHICLE_ENEMY_LARGE), this);
		this.bossHealthBar.setMaximumValue(100);
		this.bossHealthBar.setValue(0);
		this.repositionBossHealthBar();

		this.powerUpMeter = new HealthBar(Constants.getRandomTexture(ConstructType.POWERUP_PICKUP_ARMOR), this);
		this.powerUpMeter.setMaximumValue(100);
		this.powerUpMeter.setValue(0);
		this.repositionPowerUpMeter();

		this.onScreenMessage = new OnScreenMessage(this);

		this.setGameController();

		// progress the frames a little bit to avoid blank scene
		for (var i = 0; i < 350; i++) {
			this.updateFrame();
		}

		switch (Constants.SELECTED_HONK_BUSTER_TEMPLATE) {
			case 0: { this.generateOnScreenMessage("Drop crackers on 'em honkers!", this.talkIcon); } break;
			case 1: { this.generateOnScreenMessage("Drop trash cans on 'em honkers!", this.talkIcon); } break;
			default:
		}

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case 0: { } break;
			case 1: { SoundManager.play(SoundType.CHOPPER_HOVERING, 0.1, true); } break;
			default:
		}

		SoundManager.play(SoundType.AMBIENCE, 0.4, true);
		SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC, 0.4, true);
		SoundManager.play(SoundType.GAME_START);
	}

	//#endregion	

	//#region CastShadow

	private castShadowGameObjects: Array<CastShadow> = [];

	spawnCastShadow(source: GameObjectContainer) {

		const gameObject: CastShadow = new CastShadow(source, 40, 15);
		gameObject.disableRendering();

		this.castShadowGameObjects.push(gameObject);
		this.gameContainer.addChild(gameObject);
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

		var nonAnimatingCastShadows = this.castShadowGameObjects.filter(x => x.source.isAnimating == false || x.source.isBlasting || x.source.isDead());

		if (nonAnimatingCastShadows) {

			nonAnimatingCastShadows.forEach(dropShadow => {
				if (dropShadow.isAnimating)
					dropShadow.disableRendering();
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
			this.gameContainer.addChild(gameObject);
		}
	}

	private generateMessageBubble(source: GameObjectContainer, message: string) {

		if (source.getLeft() > 0 && source.getTop() > 0) {
			var gameObject = this.messageBubbleGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var messageBubble = gameObject as MessageBubble;
				messageBubble.reset();
				messageBubble.reposition(source, message);
				messageBubble.setPopping();

				gameObject.enableRendering();
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

	//#region OnScreenMessage

	private generateOnScreenMessage(title: string, icon: Texture = Texture.from("./images/character_maleAdventurer_talk.png")) {
		if (this.onScreenMessage.isAnimating == false) {
			this.onScreenMessage.setContent(title, icon);
			this.onScreenMessage.reset();
			this.onScreenMessage.reposition(SceneManager.width / 2, SceneManager.height - SceneManager.height / 11);
			this.onScreenMessage.enableRendering();
		}
		if (this.onScreenMessage.isAnimating && this.onScreenMessage.getText() != title) {
			this.onScreenMessage.setContent(title, icon);
			this.onScreenMessage.reset();
			this.onScreenMessage.reposition(SceneManager.width / 2, SceneManager.height - SceneManager.height / 11);
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

	//#region Taunts

	private tauntDelay: number = 15
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
				//this.generateOnScreenMessage(message, this.bossHealthBar.getIcon());


			}
		}
	}

	//#endregion

	//#region RoadMarks

	private roadMarkXyAdjustment: number = 890;

	private roadMarkSizeWidth: number = 1400;
	private roadMarkSizeHeight: number = 1400;

	private roadMarksGameObjects: Array<GameObjectContainer> = [];

	private roadMarkPopDelayDefault: number = 84.5 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadMarkPopDelay: number = 0;

	private spawnRoadMarks() {

		for (let j = 0; j < 3; j++) {

			const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_MARK));

				sprite.x = this.roadMarkSizeWidth * i - (this.roadMarkXyAdjustment * i);
				sprite.y = (this.roadMarkSizeHeight / 2) * i - ((this.roadMarkXyAdjustment / 2) * i);
				sprite.width = this.roadMarkSizeWidth;
				sprite.height = this.roadMarkSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadMarksGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
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

	//#region Trees

	private treeXyAdjustment: number = 100;

	private treeSizeWidth: number = 260;
	private treeSizeHeight: number = 260;

	private treeBottomGameObjects: Array<GameObjectContainer> = [];
	private treeTopGameObjects: Array<GameObjectContainer> = [];

	private treePopDelayDefault: number = 60 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private treePopDelayTop: number = 17.5;
	private treePopDelayBottom: number = 16;

	private spawnTreesTop() {

		for (let j = 0; j < 3; j++) {

			const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_TREE));

				sprite.x = this.treeSizeWidth * i + (this.treeXyAdjustment * i);
				sprite.y = (this.treeSizeHeight / 2) * i + ((this.treeXyAdjustment / 2) * i);
				sprite.width = this.treeSizeWidth;
				sprite.height = this.treeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.treeTopGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	private spawnTreesBottom() {

		for (let j = 0; j < 3; j++) {

			const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_TREE));

				sprite.x = this.treeSizeWidth * i + (this.treeXyAdjustment * i);
				sprite.y = (this.treeSizeHeight / 2) * i + ((this.treeXyAdjustment / 2) * i);
				sprite.width = this.treeSizeWidth;
				sprite.height = this.treeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.treeBottomGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	private generateTreesTop() {

		this.treePopDelayTop -= 0.1;

		if (this.treePopDelayTop < 0) {

			var gameObject = this.treeTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-710, gameObject.height * -1);
				gameObject.enableRendering();
				this.treePopDelayTop = this.treePopDelayDefault;
			}
		}
	}

	private generateTreesBottom() {

		this.treePopDelayBottom -= 0.1;

		if (this.treePopDelayBottom < 0) {

			var gameObject = this.treeBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(gameObject.width * -1, -580);
				gameObject.enableRendering();
				this.treePopDelayBottom = this.treePopDelayDefault;
			}
		}
	}

	private animateTreesTop() {

		var animatingTrees = this.treeTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingTrees) {

			animatingTrees.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - gameObject.width / 2 > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	private animateTreesBottom() {

		var animatingTrees = this.treeBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingTrees) {

			animatingTrees.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - gameObject.width / 2 > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height / 2 > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region Hedges

	//private hedgeXyAdjustment: number = 30.5;

	//private hedgeSizeWidth: number = 450;
	//private hedgeSizeHeight: number = 450;

	//private hedgeBottomGameObjects: Array<GameObjectContainer> = [];
	//private hedgeTopGameObjects: Array<GameObjectContainer> = [];

	//private hedgePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	//private hedgePopDelayTop: number = 0;
	//private hedgePopDelayBottom: number = 0;

	//private spawnHedgesTop() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		gameObject.disableRendering();

	//		for (let i = 0; i < 5; i++) {

	//			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_HEDGE));

	//			sprite.x = this.hedgeSizeWidth * i - (this.hedgeXyAdjustment * i);
	//			sprite.y = (this.hedgeSizeHeight / 2) * i - ((this.hedgeXyAdjustment / 2) * i);
	//			sprite.width = this.hedgeSizeWidth;
	//			sprite.height = this.hedgeSizeHeight;

	//			gameObject.addChild(sprite);
	//		}

	//		this.hedgeTopGameObjects.push(gameObject);
	//		this.sceneContainer.addChild(gameObject);
	//	}
	//}

	//private spawnHedgesBottom() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		gameObject.disableRendering();

	//		for (let i = 0; i < 5; i++) {

	//			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_HEDGE));

	//			sprite.x = this.hedgeSizeWidth * i - (this.hedgeXyAdjustment * i);
	//			sprite.y = (this.hedgeSizeHeight / 2) * i - ((this.hedgeXyAdjustment / 2) * i);
	//			sprite.width = this.hedgeSizeWidth;
	//			sprite.height = this.hedgeSizeHeight;

	//			gameObject.addChild(sprite);
	//		}

	//		this.hedgeBottomGameObjects.push(gameObject);
	//		this.sceneContainer.addChild(gameObject);
	//	}
	//}

	//private generateHedgesTop() {

	//	this.hedgePopDelayTop -= 0.1;

	//	if (this.hedgePopDelayTop < 0) {

	//		var gameObject = this.hedgeTopGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {
	//			gameObject.setPosition(-1430, gameObject.height * -1);
	//			gameObject.enableRendering();
	//			this.hedgePopDelayTop = this.hedgePopDelayDefault;
	//		}
	//	}
	//}

	//private generateHedgesBottom() {

	//	this.hedgePopDelayBottom -= 0.1;

	//	if (this.hedgePopDelayBottom < 0) {

	//		var gameObject = this.hedgeBottomGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {
	//			gameObject.setPosition(gameObject.width * -1, -710);
	//			gameObject.enableRendering();
	//			this.hedgePopDelayBottom = this.hedgePopDelayDefault;

	//			// console.log("Hedge bottom gameObject popped.");
	//		}
	//	}
	//}

	//private animateHedgesTop() {

	//	var animatingHedges = this.hedgeTopGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingHedges) {

	//		animatingHedges.forEach(gameObject => {
	//			gameObject.moveDownRight();

	//			if (gameObject.x - this.hedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.disableRendering();

	//			}
	//		});
	//	}
	//}

	//private animateHedgesBottom() {

	//	var animatingHedges = this.hedgeBottomGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingHedges) {

	//		animatingHedges.forEach(gameObject => {
	//			gameObject.moveDownRight();

	//			if (gameObject.x - this.hedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.disableRendering();

	//			}
	//		});
	//	}
	//}

	//#endregion

	//#region Lamps

	private lampXyAdjustment: number = 197;

	private lampSizeWidth: number = 750;
	private lampSizeHeight: number = 750;

	private lampTopGameObjects: Array<GameObjectContainer> = [];

	private lampPopDelayDefault: number = 93 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private lampPopDelayTop: number = 7;

	private spawnLampsTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LAMP));

				sprite.x = (this.lampSizeWidth * i - (this.lampXyAdjustment * i));
				sprite.y = ((this.lampSizeWidth / 2) * i - ((this.lampXyAdjustment / 2) * i));
				sprite.width = this.lampSizeWidth;
				sprite.height = this.lampSizeHeight;

				gameObject.addChild(sprite);
			}

			this.lampTopGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	private generateLampsTop() {

		this.lampPopDelayTop -= 0.1;

		if (this.lampPopDelayTop < 0) {

			var gameObject = this.lampTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition((gameObject.width * -1), (gameObject.height * -1) - 276);
				gameObject.enableRendering();
				this.lampPopDelayTop = this.lampPopDelayDefault;
			}
		}
	}

	private animateLampsTop() {

		var animatingLamps = this.lampTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingLamps) {

			animatingLamps.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region LightBillboards

	//private lightBillboardXyAdjustment: number = 31.5;
	//private lightBillboardXyDistance = 250;

	//private lightBillboardSizeWidth: number = 128;
	//private lightBillboardSizeHeight: number = 128;

	//private lightBillboardBottomGameObjects: Array<GameObjectContainer> = [];
	//private lightBillboardTopGameObjects: Array<GameObjectContainer> = [];

	//private lightBillboardPopDelayDefault: number = 57 / Constants.DEFAULT_CONSTRUCT_DELTA;
	//private lightBillboardPopDelayTop: number = 0;
	//private lightBillboardPopDelayBottom: number = 0;

	//private spawnLightBillboardsTop() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		gameObject.disableRendering();

	//		for (let i = 0; i < 5; i++) {

	//			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD));

	//			sprite.x = (this.lightBillboardSizeWidth * i - (this.lightBillboardXyAdjustment * i)) + (this.lightBillboardXyDistance * i);
	//			sprite.y = ((this.lightBillboardSizeHeight / 2) * i - ((this.lightBillboardXyAdjustment / 2) * i)) + (this.lightBillboardXyDistance / 2 * i);
	//			sprite.width = this.lightBillboardSizeWidth;
	//			sprite.height = this.lightBillboardSizeHeight;

	//			gameObject.addChild(sprite);
	//		}

	//		this.lightBillboardTopGameObjects.push(gameObject);
	//		this.sceneContainer.addChild(gameObject);
	//	}
	//}

	//private spawnLightBillboardsBottom() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: GameObjectContainer = new GameObjectContainer(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		gameObject.disableRendering();

	//		for (let i = 0; i < 5; i++) {

	//			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD));

	//			sprite.x = (this.lightBillboardSizeWidth * i - (this.lightBillboardXyAdjustment * i)) + (this.lightBillboardXyDistance * i);
	//			sprite.y = ((this.lightBillboardSizeHeight / 2) * i - ((this.lightBillboardXyAdjustment / 2) * i)) + (this.lightBillboardXyDistance / 2 * i);
	//			sprite.width = this.lightBillboardSizeWidth;
	//			sprite.height = this.lightBillboardSizeHeight;

	//			gameObject.addChild(sprite);
	//		}

	//		this.lightBillboardBottomGameObjects.push(gameObject);
	//		this.sceneContainer.addChild(gameObject);
	//	}
	//}

	//private generateLightBillboardsTop() {

	//	this.lightBillboardPopDelayTop -= 0.1;

	//	if (this.lightBillboardPopDelayTop < 0) {

	//		var gameObject = this.lightBillboardTopGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {
	//			gameObject.setPosition(-380, gameObject.height * -1.1);
	//			gameObject.enableRendering();
	//			this.lightBillboardPopDelayTop = this.lightBillboardPopDelayDefault;
	//		}
	//	}
	//}

	//private generateLightBillboardsBottom() {

	//	this.lightBillboardPopDelayBottom -= 0.1;

	//	if (this.lightBillboardPopDelayBottom < 0) {

	//		var gameObject = this.lightBillboardBottomGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {
	//			gameObject.setPosition(gameObject.width * -1, -180);
	//			gameObject.enableRendering();
	//			this.lightBillboardPopDelayBottom = this.lightBillboardPopDelayDefault;
	//		}
	//	}
	//}

	//private animateLightBillboardsTop() {

	//	var animatingLightBillboards = this.lightBillboardTopGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingLightBillboards) {

	//		animatingLightBillboards.forEach(gameObject => {
	//			gameObject.moveDownRight();

	//			if (gameObject.x - this.lightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.disableRendering();

	//			}
	//		});
	//	}
	//}

	//private animateLightBillboardsBottom() {

	//	var animatingLightBillboards = this.lightBillboardBottomGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingLightBillboards) {

	//		animatingLightBillboards.forEach(gameObject => {
	//			gameObject.moveDownRight();

	//			if (gameObject.x - this.lightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.disableRendering();

	//			}
	//		});
	//	}
	//}

	//#endregion

	//#region SideWalks

	private sideWalkXyAdjustment: number = 190;

	private sideWalkWidth: number = 750;
	private sideWalkHeight: number = 750;

	private sideWalkTopGameObjects: Array<RoadSideWalk> = [];
	private sideWalkBottomGameObjects: Array<RoadSideWalk> = [];

	private sideWalkPopDelayDefault: number = 93 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private sideWalkPopDelayTop: number = 12;
	private sideWalkPopDelayBottom: number = 16;

	private spawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: RoadSideWalk = new RoadSideWalk(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_TOP));

				sprite.x = this.sideWalkWidth * i - (this.sideWalkXyAdjustment * i);
				sprite.y = (this.sideWalkHeight / 2) * i - ((this.sideWalkXyAdjustment / 2) * i);

				sprite.width = this.sideWalkWidth;
				sprite.height = this.sideWalkHeight;

				gameObject.addChild(sprite);
			}

			this.sideWalkTopGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	private spawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: RoadSideWalk = new RoadSideWalk(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK_BOTTOM));

				sprite.x = this.sideWalkWidth * i - (this.sideWalkXyAdjustment * i);
				sprite.y = (this.sideWalkHeight / 2) * i - ((this.sideWalkXyAdjustment / 2) * i);

				sprite.width = this.sideWalkWidth;
				sprite.height = this.sideWalkHeight;

				gameObject.addChild(sprite);
			}

			this.sideWalkBottomGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	private generateSideWalksTop() {

		this.sideWalkPopDelayTop -= 0.1;

		if (this.sideWalkPopDelayTop < 0) {

			var gameObject = this.sideWalkTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				//gameObject.reset();
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
				//gameObject.reset();
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

				if (gameObject.x - (this.sideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
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

				if (gameObject.x - (this.sideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - (this.sideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

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

	//#region RingExplosions	

	private ringExplosionGameObjects: Array<Explosion> = [];

	spawnRingExplosions() {

		for (let j = 0; j < 10; j++) {

			const gameObject: Explosion = new Explosion(Constants.DEFAULT_CONSTRUCT_SPEED - 2, ExplosionType.RING_EXPLOSION);
			gameObject.disableRendering();

			this.ringExplosionGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	generateRingExplosion(source: GameObjectContainer) {
		var gameObject = this.ringExplosionGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.setPopping();
			gameObject.enableRendering();
		}
	}

	animateRingExplosions() {
		var animatingHonkBombs = this.ringExplosionGameObjects.filter(x => x.isAnimating == true);
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
			this.gameContainer.addChild(gameObject);
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

	//#region SmokeExplosions	

	private smokeExplosionGameObjects: Array<Explosion> = [];

	spawnSmokeExplosions() {

		for (let j = 0; j < 4; j++) {

			const gameObject: Explosion = new Explosion(Constants.DEFAULT_CONSTRUCT_SPEED - 2, ExplosionType.SMOKE_EXPLOSION);
			gameObject.disableRendering();

			this.smokeExplosionGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	generateSmokeExplosion(source: GameObjectContainer) {
		var gameObject = this.smokeExplosionGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {
			gameObject.reset();
			gameObject.reposition(source);
			gameObject.setPopping();
			gameObject.enableRendering();
		}
	}

	animateSmokeExplosions() {
		var animatingHonkBombs = this.smokeExplosionGameObjects.filter(x => x.isAnimating == true);
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

	//#region PlayerRide

	private playerRideSizeWidth: number = 150;
	private playerRideSizeHeight: number = 150;
	private playerRideTemplate: number = 0;

	private player: PlayerRide = new PlayerRide();

	spawnPlayerBalloon() {
		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_RIDE_IDLE));
		sprite.x = 0;
		sprite.y = 0;

		switch (this.playerRideTemplate) {
			case PlayerRideTemplate.BALLOON: {
				sprite.width = this.playerRideSizeWidth * 1.3;
				sprite.height = this.playerRideSizeHeight * 1.3;
			} break;
			case PlayerRideTemplate.CHOPPER: {
				sprite.width = this.playerRideSizeWidth * 1.2;
				sprite.height = this.playerRideSizeHeight * 1.2;
			} break;
			default: break;
		}

		sprite.anchor.set(0.5, 0.5);

		this.player.addChild(sprite);
		this.player.setPlayerRideTemplate(this.playerRideTemplate);
		this.player.disableRendering();

		this.gameContainer.addChild(this.player);
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

		if (this.playerRideTemplate == PlayerRideTemplate.BALLOON) {
			this.player.dillyDally();
		}

		this.player.depleteAttackStance();
		this.player.depleteWinStance();
		this.player.depleteHitStance();
		this.player.recoverFromHealthLoss();

		this.player.move(
			Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling,
			Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling,
			this.gameController);

		if (this.gameController.isAttacking) {

			if (this.anyInAirBossExists() || this.ufoEnemyExists()) {

				if (this.powerUpMeter.hasHealth()) {

					switch (this.powerUpMeter.tag) {
						case PowerUpType.BULLS_EYE:
							{
								this.generatePlayerRocketBullsEye();
							}
							break;
						case PowerUpType.ARMOR:
							{
								this.generatePlayerRocket();
							}
							break;
						default:
							break;
					}
				}
				else {
					this.generatePlayerRocket();
				}
			}
			else {
				this.generatePlayerHonkBomb();
			}

			this.gameController.isAttacking = false;
		}
	}

	loosePlayerHealth() {
		this.player.setPopping();

		if (this.powerUpMeter.hasHealth() && this.powerUpMeter.tag == PowerUpType.ARMOR) {
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

	//#region PlayerHonkBombs

	private playerHonkBombSizeWidth: number = 50;
	private playerHonkBombSizeHeight: number = 50;

	private playerHonkBombGameObjects: Array<GameObjectContainer> = [];
	private playerHonkBusterTemplate: number = 0;

	spawnPlayerHonkBombs() {

		for (let j = 0; j < 3; j++) {

			const gameObject: PlayerHonkBomb = new PlayerHonkBomb(4);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_HONK_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerHonkBombSizeWidth;
			sprite.height = this.playerHonkBombSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			gameObject.setHonkBombTemplate(this.playerHonkBusterTemplate);

			this.playerHonkBombGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerHonkBomb() {

		var gameObject = this.playerHonkBombGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {

			var playerHonkBomb = gameObject as PlayerHonkBomb;
			playerHonkBomb.reset();
			playerHonkBomb.reposition(this.player);
			playerHonkBomb.setPopping();

			gameObject.enableRendering();

			this.player.setAttackStance();
		}
	}

	animatePlayerHonkBombs() {

		var animatingHonkBombs = this.playerHonkBombGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonkBombs) {

			animatingHonkBombs.forEach(gameObject => {

				gameObject.pop();

				var playerHonkBomb = gameObject as PlayerHonkBomb;

				if (playerHonkBomb) {

					if (playerHonkBomb.isBlasting) {

						playerHonkBomb.fade();

						switch (playerHonkBomb.playerHonkBombTemplate) {
							case PlayerHonkBombTemplate.Cracker: {
								playerHonkBomb.shrink();
							} break;
							case PlayerHonkBombTemplate.TrashCan: {
								playerHonkBomb.moveUpRight();
								playerHonkBomb.rotate(RotationDirection.Forward, 0, 0.5);
							} break;
							default:
						}
					}
					else {

						playerHonkBomb.move();
						playerHonkBomb.rotate(RotationDirection.Forward, 0, 5);

						if (playerHonkBomb.awaitBlast()) {

							this.generateSmokeExplosion(playerHonkBomb);

							let vehicleEnemy = this.vehicleEnemyGameObjects.find(x => x.isAnimating == true && x.willHonk && Constants.checkCloseCollision(x, playerHonkBomb));

							if (vehicleEnemy) {
								this.looseVehicleEnemyhealth(vehicleEnemy as VehicleEnemy);
							}

							let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerHonkBomb));

							if (vehicleBoss) {
								this.looseVehicleBosshealth(vehicleBoss as VehicleBoss);
							}
						}
					}
				}

				if (gameObject.hasFaded() || gameObject.hasShrinked() || gameObject.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region PlayerRockets

	private playerRocketSizeWidth: number = 90;
	private playerRocketSizeHeight: number = 90;

	private playerRocketGameObjects: Array<GameObjectContainer> = [];

	spawnPlayerRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: PlayerRocket = new PlayerRocket(4);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerRocketSizeWidth;
			sprite.height = this.playerRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.playerRocketGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerRocket() {

		var gameObject = this.playerRocketGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {

			var playerRocket = gameObject as PlayerRocket;
			playerRocket.reset();
			playerRocket.reposition(this.player);
			playerRocket.setPopping();

			gameObject.enableRendering();

			this.player.setAttackStance();

			let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

			let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating);
			let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating);

			if (ufoBossRocketSeeking) {
				this.setPlayerRocketDirection(this.player, playerRocket, ufoBossRocketSeeking);
			}
			else if (ufoEnemy) {
				this.setPlayerRocketDirection(this.player, playerRocket, ufoEnemy);
			}
			else if (ufoBoss) {
				this.setPlayerRocketDirection(this.player, playerRocket, ufoBoss);
			}
			else if (zombieBoss) {
				this.setPlayerRocketDirection(this.player, playerRocket, zombieBoss);
			}
			else if (mafiaBoss) {
				this.setPlayerRocketDirection(this.player, playerRocket, mafiaBoss);
			}
		}
	}

	animatePlayerRockets() {

		var animatingHonkBombs = this.playerRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonkBombs) {

			animatingHonkBombs.forEach(gameObject => {

				gameObject.pop();

				var playerRocket = gameObject as PlayerRocket;

				if (playerRocket) {

					if (playerRocket.awaitMoveDownLeft) {
						playerRocket.moveDownLeft();
					}
					else if (playerRocket.awaitMoveUpRight) {
						playerRocket.moveUpRight();
					}
					else if (playerRocket.awaitMoveUpLeft) {
						playerRocket.moveUpLeft();
					}
					else if (playerRocket.awaitMoveDownRight) {
						playerRocket.moveDownRight();
					}

					if (playerRocket.isBlasting) {
						playerRocket.shrink();
						playerRocket.fade();
					}
					else {

						playerRocket.hover();

						let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));
						let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerRocket));

						let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));
						let zombieBossRocketBlock = this.zombieBossRocketBlockGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerRocket));

						let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));

						let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerRocket));

						if (ufoBossRocketSeeking) {
							playerRocket.setBlast();
							ufoBossRocketSeeking.setBlast();
							this.generateRingExplosion(playerRocket);
							this.generateFlashExplosion(playerRocket);
						}
						else if (ufoEnemy) {
							playerRocket.setBlast();
							this.looseUfoEnemyhealth(ufoEnemy as UfoEnemy);
							this.generateRingExplosion(playerRocket);
							this.generateFlashExplosion(playerRocket);
						}
						else if (ufoBoss) {
							playerRocket.setBlast();
							this.looseUfoBosshealth(ufoBoss as UfoBoss);
							this.generateRingExplosion(playerRocket);
							this.generateFlashExplosion(playerRocket);
						}
						else if (zombieBossRocketBlock) {
							playerRocket.setBlast();
							zombieBossRocketBlock.looseHealth();
							this.generateRingExplosion(playerRocket);
							this.generateFlashExplosion(playerRocket);
						}
						else if (zombieBoss) {
							playerRocket.setBlast();
							this.looseZombieBosshealth(zombieBoss as ZombieBoss);
							this.generateRingExplosion(playerRocket);
							this.generateFlashExplosion(playerRocket);
						}
						else if (mafiaBoss) {
							playerRocket.setBlast();
							this.looseMafiaBosshealth(mafiaBoss as MafiaBoss);
							this.generateRingExplosion(playerRocket);
							this.generateFlashExplosion(playerRocket);
						}

						if (playerRocket.autoBlast()) {
							playerRocket.setBlast();
							this.generateRingExplosion(playerRocket);
						}
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	setPlayerRocketDirection(source: GameObjectContainer, rocket: GameObjectContainer, rocketTarget: GameObjectContainer) {

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
			rocket.awaitMoveUpLeft = true;
			rocket.setRotation(213);
		}
	}

	//#endregion

	//#region PlayerRocketBullsEyes

	private playerRocketBullsEyeSizeWidth: number = 90;
	private playerRocketBullsEyeSizeHeight: number = 90;

	private playerRocketBullsEyeGameObjects: Array<PlayerRocketBullsEye> = [];

	spawnPlayerRocketBullsEyes() {

		for (let j = 0; j < 3; j++) {

			const gameObject: PlayerRocketBullsEye = new PlayerRocketBullsEye(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_ROCKET_BULLS_EYE));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerRocketBullsEyeSizeWidth;
			sprite.height = this.playerRocketBullsEyeSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.playerRocketBullsEyeGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generatePlayerRocketBullsEye() {

		let playerRocketBullsEye = this.playerRocketBullsEyeGameObjects.find(x => x.isAnimating == false);

		if (playerRocketBullsEye) {
			playerRocketBullsEye.reset();
			playerRocketBullsEye.reposition(this.player);
			playerRocketBullsEye.setPopping();

			this.player.setAttackStance();

			let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

			let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating);
			let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating);

			if (ufoBossRocketSeeking) {
				playerRocketBullsEye.setTarget(ufoBossRocketSeeking.getCloseBounds());
			}
			else if (ufoEnemy) {
				playerRocketBullsEye.setTarget(ufoEnemy.getCloseBounds());
			}
			else if (ufoBoss) {
				playerRocketBullsEye.setTarget(ufoBoss.getCloseBounds());
			}
			else if (zombieBoss) {
				playerRocketBullsEye.setTarget(zombieBoss.getCloseBounds());
			}
			else if (mafiaBoss) {
				playerRocketBullsEye.setTarget(mafiaBoss.getCloseBounds());
			}

			playerRocketBullsEye.enableRendering();

			if (this.powerUpMeter.hasHealth() && this.powerUpMeter.tag == PowerUpType.BULLS_EYE)
				this.depletePowerUp();
		}
	}

	animatePlayerRocketBullsEyes() {

		let animatingPlayerRocketBullsEyes = this.playerRocketBullsEyeGameObjects.filter(x => x.isAnimating == true);

		if (animatingPlayerRocketBullsEyes) {

			animatingPlayerRocketBullsEyes.forEach(gameObject => {

				let playerRocket = gameObject as PlayerRocketBullsEye;

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
					gameObject.moveDownRight();
				}
				else {

					gameObject.pop();
					gameObject.rotate(RotationDirection.Forward, 0, 2.5);
					gameObject.move();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));
					let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerRocket));

					let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));
					let zombieBossRocketBlock = this.zombieBossRocketBlockGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerRocket));

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));

					let ufoEnemy = this.ufoEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerRocket));

					if (ufoBossRocketSeeking) {
						playerRocket.setBlast();
						ufoBossRocketSeeking.setBlast();
						this.generateRingExplosion(playerRocket);
						this.generateFlashExplosion(playerRocket);
					}
					else if (ufoBoss) {
						playerRocket.setBlast();
						this.looseUfoBosshealth(ufoBoss as UfoBoss);
						this.generateRingExplosion(playerRocket);
						this.generateFlashExplosion(playerRocket);
					}
					else if (ufoEnemy) {
						playerRocket.setBlast();
						this.looseUfoEnemyhealth(ufoEnemy as UfoEnemy);
						this.generateRingExplosion(playerRocket);
						this.generateFlashExplosion(playerRocket);
					}
					else if (zombieBossRocketBlock) {
						playerRocket.setBlast();
						zombieBossRocketBlock.looseHealth();
						this.generateRingExplosion(playerRocket);
						this.generateFlashExplosion(playerRocket);
					}
					else if (zombieBoss) {
						playerRocket.setBlast();
						this.looseZombieBosshealth(zombieBoss as ZombieBoss);
						this.generateRingExplosion(playerRocket);
						this.generateFlashExplosion(playerRocket);
					}
					else if (mafiaBoss) {
						playerRocket.setBlast();
						this.looseMafiaBosshealth(mafiaBoss as MafiaBoss);
						this.generateRingExplosion(playerRocket);
						this.generateFlashExplosion(playerRocket);
					}

					if (playerRocket.autoBlast()) {
						playerRocket.setBlast();
						this.generateRingExplosion(playerRocket);
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region VehicleEnemys	

	private vehicleEnemySizeWidth: number = 260;
	private vehicleEnemySizeHeight: number = 260;

	private vehicleEnemyGameObjects: Array<VehicleEnemy> = [];

	private vehicleEnemyPopDelayDefault: number = 30 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleEnemyPopDelay: number = 15;

	private spawnVehicleEnemys() {

		for (let j = 0; j < 10; j++) {

			const gameObject: VehicleEnemy = new VehicleEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.vehicleType = Constants.getRandomNumber(0, 1);

			gameObject.disableRendering();

			var uri: string = "";
			switch (gameObject.vehicleType) {
				case 0: {
					uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);
				} break;
				case 1: {
					uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);
				} break;
				default: break;
			}

			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;

			switch (gameObject.vehicleType) {
				case 0: {
					sprite.width = this.vehicleEnemySizeWidth / 1.2;
					sprite.height = this.vehicleEnemySizeHeight / 1.2;
				} break;
				case 1: {
					sprite.width = this.vehicleEnemySizeWidth;
					sprite.height = this.vehicleEnemySizeHeight;
				} break;
				default: break;
			}

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.vehicleEnemyGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
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
						case 0: {
							sprite.width = this.vehicleEnemySizeWidth / 1.2;
							sprite.height = this.vehicleEnemySizeHeight / 1.2;
						} break;
						case 1: {
							sprite.width = this.vehicleEnemySizeWidth;
							sprite.height = this.vehicleEnemySizeHeight;
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

			animatingVehicleEnemys.forEach(gameObject => {

				gameObject.pop();
				gameObject.dillyDally();

				if (this.anyInAirBossExists()) { // when in air bosses appear, stop the stage transition, and make the vehicles move forward
					gameObject.moveUpLeft();
					gameObject.moveUpLeft(); // move with double speed
				}
				else {
					gameObject.moveDownRight();
				}

				// prevent overlapping				

				var vehicles = this.vehicleEnemyGameObjects.filter(x => x.isAnimating == true);

				if (vehicles) {

					vehicles.forEach(collidingVehicle => {

						if (Constants.checkCollision(collidingVehicle, gameObject)) {

							if (collidingVehicle.speed > gameObject.speed) // colliding vehicle is faster
							{
								gameObject.speed = collidingVehicle.speed;
							}
							else if (gameObject.speed > collidingVehicle.speed) // current vehicle is faster
							{
								collidingVehicle.speed = gameObject.speed;
							}
						}
					});
				}

				// generate honk

				let vehicleEnemy = gameObject as VehicleEnemy;

				if (vehicleEnemy) {

					if (vehicleEnemy.honk() && !this.ufoEnemyExists() && !this.anyInAirBossExists()) {
						this.generateHonk(gameObject);
					}
				}

				// recycle vehicle

				if (this.anyInAirBossExists()) {
					if (gameObject.getRight() < 0 || gameObject.getBottom() < 0) {
						gameObject.disableRendering();
					}
				}
				else {
					if (gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
						gameObject.disableRendering();
					}
				}
			});
		}
	}

	private looseVehicleEnemyhealth(vehicleEnemy: VehicleEnemy) {

		vehicleEnemy.setPopping();
		vehicleEnemy.looseHealth();

		if (vehicleEnemy.willHonk) {

			if (vehicleEnemy.isDead()) {
				vehicleEnemy.setBlast();
				this.gameScoreBar.gainScore(2);
				let soundIndex = SoundManager.play(SoundType.HONK_BUST_REACTION, 0.8);
				let soundTemplate: SoundTemplate = this.honkBustReactions[soundIndex];

				this.generateMessageBubble(vehicleEnemy, soundTemplate.subTitle);
			}
		}
	}

	//#endregion

	//#region Honks	

	private roadHonkSizeWidth: number = 125;
	private roadHonkSizeHeight: number = 125;

	private roadHonkGameObjects: Array<Honk> = [];

	private spawnHonks() {

		for (let j = 0; j < 5; j++) {

			const gameObject: Honk = new Honk(0);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HONK));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.roadHonkSizeWidth;
			sprite.height = this.roadHonkSizeHeight;

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.roadHonkGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);
		}
	}

	private generateHonk(source: GameObjectContainer) {

		if (source.getLeft() > 0 && source.getTop() > 0) {
			var gameObject = this.roadHonkGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.reset();
				gameObject.reposition(source);
				gameObject.setPopping();
				gameObject.enableRendering();
			}
		}
	}

	private animateHonks() {

		var animatingHonks = this.roadHonkGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonks) {

			animatingHonks.forEach(gameObject => {
				gameObject.pop();
				gameObject.fade();

				if (gameObject.hasFaded()) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion		

	//#region UfoEnemys	

	private ufoEnemySizeWidth: number = 165;
	private ufoEnemySizeHeight: number = 165;

	private ufoEnemyGameObjects: Array<UfoEnemy> = [];

	private ufoEnemyPopDelayDefault: number = 35 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoEnemyPopDelay: number = 0;

	private spawnUfoEnemys() {

		for (let j = 0; j < 7; j++) {

			const gameObject: UfoEnemy = new UfoEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const texture = Constants.getRandomTexture(ConstructType.UFO_ENEMY);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoEnemySizeWidth;
			sprite.height = this.ufoEnemySizeHeight;

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.ufoEnemyGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	private generateUfoEnemys() {

		if (!this.anyBossExists() && this.ufoEnemyCheckpoint.shouldRelease(this.gameScoreBar.getScore())) {

			this.ufoEnemyPopDelay -= 0.1;

			if (this.ufoEnemyPopDelay < 0) {

				var gameObject = this.ufoEnemyGameObjects.find(x => x.isAnimating == false);

				if (gameObject) {

					var ufoEnemy = gameObject as UfoEnemy;
					ufoEnemy.reset();
					ufoEnemy.reposition();

					gameObject.enableRendering();

					this.ufoEnemyPopDelay = this.ufoEnemyPopDelayDefault;

					if (!this.ufoEnemiesAppeared) {
						this.generateOnScreenMessage("Shoot the aliens!");
						this.ufoEnemiesAppeared = true;
						SoundManager.play(SoundType.UFO_ENEMY_ENTRY);
						SoundManager.play(SoundType.UFO_BOSS_HOVERING, 0.6, true);
					}
				}
			}
		}
	}

	private animateUfoEnemys() {

		var animatingUfoEnemys = this.ufoEnemyGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoEnemys) {

			animatingUfoEnemys.forEach(gameObject => {
				if (gameObject.isDead()) {
					gameObject.shrink();
				}
				else {
					gameObject.pop();
					gameObject.hover();
					gameObject.moveDownRight();
				}

				let ufoEnemy = gameObject as UfoEnemy;

				if (ufoEnemy) {

					// generate honk

					if (!this.anyBossExists() && ufoEnemy.honk()) {
						this.generateHonk(gameObject);
					}

					// fire orbs

					if (!this.anyBossExists() && ufoEnemy.attack()) {
						this.generateUfoEnemyRockets(ufoEnemy);
					}

					this.generateTaunts(gameObject);
				}

				if (gameObject.hasShrinked() || gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	private looseUfoEnemyhealth(ufoEnemy: UfoEnemy) {

		ufoEnemy.setPopping();
		ufoEnemy.looseHealth();

		if (ufoEnemy.isDead()) {
			this.gameScoreBar.gainScore(2);

			this.ufoEnemyDefeatCount++;

			if (this.ufoEnemyDefeatCount > this.ufoEnemyDefeatPoint) // after killing limited enemies increase the threadhold limit
			{
				this.ufoEnemyCheckpoint.increaseLimit(this.ufoEnemyReleaseLimit, this.gameScoreBar.getScore());
				this.ufoEnemyDefeatCount = 0;
				this.ufoEnemiesAppeared = false;

				this.levelUp();

				SoundManager.stop(SoundType.UFO_BOSS_HOVERING);
			}
		}
	}

	private ufoEnemyExists(): boolean {
		var gameObject = this.ufoEnemyGameObjects.find(x => x.isAnimating == true);

		if (gameObject)
			return true;
		else
			return false;
	}

	//#endregion

	//#region UfoEnemyRockets

	private ufoEnemyRocketSizeWidth: number = 85;
	private ufoEnemyRocketSizeHeight: number = 85;

	private ufoEnemyRocketGameObjects: Array<UfoEnemyRocket> = [];

	spawnUfoEnemyRockets() {

		for (let j = 0; j < 7; j++) {

			const gameObject: UfoEnemyRocket = new UfoEnemyRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_ENEMY_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoEnemyRocketSizeWidth;
			sprite.height = this.ufoEnemyRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoEnemyRocketGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	generateUfoEnemyRockets(ufoEnemy: UfoEnemy) {

		let ufoEnemyRocket = this.ufoEnemyRocketGameObjects.find(x => x.isAnimating == false);

		if (ufoEnemyRocket) {
			ufoEnemyRocket.reset();
			ufoEnemyRocket.reposition(ufoEnemy);
			ufoEnemyRocket.setPopping();
			ufoEnemyRocket.enableRendering();
		}
	}

	animateUfoEnemyRockets() {

		let animatingUfoEnemyRockets = this.ufoEnemyRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoEnemyRockets) {

			animatingUfoEnemyRockets.forEach(gameObject => {

				let ufoEnemyRocket = gameObject as UfoEnemyRocket;
				ufoEnemyRocket.moveDownRight();

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
						this.generateRingExplosion(gameObject);
					}

					if (gameObject.autoBlast()) {
						gameObject.setBlast();
						this.generateRingExplosion(gameObject);
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region VehicleBosss	

	private vehicleBossSizeWidth: number = this.vehicleEnemySizeWidth;
	private vehicleBossSizeHeight: number = this.vehicleEnemySizeHeight;

	private vehicleBossGameObjects: Array<VehicleBoss> = [];

	private spawnVehicleBosss() {
		const gameObject: VehicleBoss = new VehicleBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.vehicleType = Constants.getRandomNumber(0, 1);
		gameObject.disableRendering();

		var uri: string = "";
		switch (gameObject.vehicleType) {
			case 0: {
				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);
			} break;
			case 1: {
				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);
			} break;
			default: break;
		}

		const texture = Texture.from(uri);
		const sprite: GameObjectSprite = new GameObjectSprite(texture);

		sprite.x = 0;
		sprite.y = 0;

		switch (gameObject.vehicleType) {
			case 0: {
				sprite.width = this.vehicleBossSizeWidth / 1.2;
				sprite.height = this.vehicleBossSizeHeight / 1.2;
			} break;
			case 1: {
				sprite.width = this.vehicleBossSizeWidth;
				sprite.height = this.vehicleBossSizeHeight;
			} break;
			default: break;
		}

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.vehicleBossGameObjects.push(gameObject);
		this.gameContainer.addChild(gameObject);
	}

	private generateVehicleBoss() {

		if (this.vehicleBossCheckpoint.shouldRelease(this.gameScoreBar.getScore()) && !this.vehicleBossExists()) {

			var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.reset();
				gameObject.health = this.vehicleBossCheckpoint.getReleasePointDifference() * 1.5;

				let sprite = gameObject.getSprite();

				switch (gameObject.vehicleType) {
					case 0: {
						sprite.width = this.vehicleBossSizeWidth / 1.2;
						sprite.height = this.vehicleBossSizeHeight / 1.2;
					} break;
					case 1: {
						sprite.width = this.vehicleBossSizeWidth;
						sprite.height = this.vehicleBossSizeHeight;
					} break;
					default: break;
				}

				gameObject.reposition();
				gameObject.enableRendering();

				this.vehicleBossCheckpoint.increaseLimit(this.vehicleBossReleaseLimit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(gameObject.health);
				this.bossHealthBar.setValue(gameObject.health);
				this.bossHealthBar.setIcon(gameObject.getSprite().getTexture());

				this.generateOnScreenMessage("Stop the crazy honker!", this.interactIcon);

				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.6, true);
			}
		}
	}

	private animateVehicleBoss() {

		var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == true);
		let vehicleBoss: VehicleBoss = gameObject as VehicleBoss;

		if (gameObject) {

			gameObject.pop();

			if (vehicleBoss.isDead()) {
				vehicleBoss.moveDownRight();
			}
			else {
				gameObject.dillyDally();
				gameObject.recoverFromHealthLoss();

				if (vehicleBoss.isAttacking) {

					vehicleBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling);

					if (vehicleBoss.honk()) {
						this.generateHonk(gameObject);
					}

					this.generateTaunts(gameObject);
				}
				else {
					if (this.vehicleEnemyGameObjects.every(x => x.isAnimating == false || this.vehicleEnemyGameObjects.filter(x => x.isAnimating).every(x => x.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling / 1.8))) {
						vehicleBoss.isAttacking = true;
					}
				}
			}

			if (vehicleBoss.isDead() && gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				gameObject.disableRendering();
			}
		}
	}

	private looseVehicleBosshealth(vehicleBoss: VehicleBoss) {

		vehicleBoss.setPopping();
		vehicleBoss.looseHealth();

		this.bossHealthBar.setValue(vehicleBoss.health);

		if (vehicleBoss.isDead()) {

			this.player.setWinStance();
			this.gameScoreBar.gainScore(3);
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);

			this.generateMessageBubble(vehicleBoss, "I'll be back!");
		}
	}

	private vehicleBossExists(): boolean {
		var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == true);

		if (gameObject)
			return true;
		else
			return false;
	}

	//#endregion

	//#region VehicleBossRockets

	private vehicleBossRocketSizeWidth: number = 90;
	private vehicleBossRocketSizeHeight: number = 90;

	private vehicleBossRocketGameObjects: Array<VehicleBossRocket> = [];

	private vehicleBossRocketPopDelayDefault: number = 12 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleBossRocketPopDelay: number = 0;

	spawnVehicleBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: VehicleBossRocket = new VehicleBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 1.4);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.vehicleBossRocketSizeWidth;
			sprite.height = this.vehicleBossRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.vehicleBossRocketGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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
						this.generateRingExplosion(gameObject);
					}

					if (gameObject.autoBlast()) {
						gameObject.setBlast();
						this.generateRingExplosion(gameObject);
					}
				}

				if (gameObject.hasFaded()) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region UfoBosss	

	private ufoBossSizeWidth: number = 200;
	private ufoBossSizeHeight: number = 200;

	private ufoBossGameObjects: Array<UfoBoss> = [];

	private spawnUfoBosss() {
		const gameObject: UfoBoss = new UfoBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.ufoBossSizeWidth;
		sprite.height = this.ufoBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.ufoBossGameObjects.push(gameObject);
		this.gameContainer.addChild(gameObject);

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

				this.ufoBossCheckpoint.increaseLimit(this.ufoBossReleaseLimit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(ufoBoss.health);
				this.bossHealthBar.setValue(ufoBoss.health);
				this.bossHealthBar.setIcon(ufoBoss.getSprite().getTexture());

				this.generateOnScreenMessage("Shoot the cyborg. Avoid the eye balls!", this.interactIcon);

				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.6, true);
				SoundManager.play(SoundType.UFO_BOSS_ENTRY);
				SoundManager.play(SoundType.UFO_BOSS_HOVERING, 0.8, true);

				//this.switchToNightMode();
			}
		}
	}

	private animateUfoBoss() {

		var gameObject = this.ufoBossGameObjects.find(x => x.isAnimating == true);
		let ufoBoss: UfoBoss = gameObject as UfoBoss;

		if (gameObject) {

			if (ufoBoss.isDead()) {
				ufoBoss.shrink();
			}
			else {
				gameObject.pop();
				gameObject.hover();
				ufoBoss.depleteHitStance();
				ufoBoss.depleteWinStance();
				ufoBoss.recoverFromHealthLoss();

				if (ufoBoss.isAttacking) {

					ufoBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling, this.player.getCloseBounds());

					if (Constants.checkCloseCollision(this.player, ufoBoss)) {
						this.loosePlayerHealth();
					}

					this.generateTaunts(gameObject);
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
				gameObject.disableRendering();
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
			this.gameScoreBar.gainScore(3);
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.UFO_BOSS_DEAD);
			SoundManager.stop(SoundType.UFO_BOSS_HOVERING);

			this.generateMessageBubble(ufoBoss, "My systems can not fail!");
		}
	}

	private ufoBossExists(): boolean {
		var gameObject = this.ufoBossGameObjects.find(x => x.isAnimating == true);

		if (gameObject)
			return true;
		else
			return false;
	}

	//#endregion

	//#region UfoBossRockets

	private ufoBossRocketSizeWidth: number = 90;
	private ufoBossRocketSizeHeight: number = 90;

	private ufoBossRocketGameObjects: Array<UfoBossRocket> = [];

	private ufoBossRocketPopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoBossRocketPopDelay: number = 0;

	spawnUfoBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: UfoBossRocket = new UfoBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoBossRocketSizeWidth;
			sprite.height = this.ufoBossRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoBossRocketGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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
				}

				this.ufoBossRocketPopDelay = this.ufoBossRocketPopDelayDefault;
			}
		}
	}

	animateUfoBossRockets() {

		let animatingUfoBossRockets = this.ufoBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoBossRockets) {

			animatingUfoBossRockets.forEach(gameObject => {

				let ufoBossRocket = gameObject as UfoBossRocket;

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

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
						ufoBoss?.setWinStance();
						this.generateRingExplosion(gameObject);
					}

					if (gameObject.autoBlast()) {
						gameObject.setBlast();
						this.generateRingExplosion(gameObject);
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
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

	private ufoBossRocketSeekingSizeWidth: number = 90;
	private ufoBossRocketSeekingSizeHeight: number = 90;

	private ufoBossRocketSeekingGameObjects: Array<UfoBossRocketSeeking> = [];

	private ufoBossRocketSeekingPopDelayDefault: number = 12 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private ufoBossRocketSeekingPopDelay: number = 0;

	spawnUfoBossRocketSeekings() {

		for (let j = 0; j < 2; j++) {

			const gameObject: UfoBossRocketSeeking = new UfoBossRocketSeeking(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET_SEEKING));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoBossRocketSeekingSizeWidth;
			sprite.height = this.ufoBossRocketSeekingSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoBossRocketSeekingGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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
					}

					this.ufoBossRocketSeekingPopDelay = this.ufoBossRocketSeekingPopDelayDefault;
				}
			}
		}
	}

	animateUfoBossRocketSeekings() {

		let animatingUfoBossRocketSeekings = this.ufoBossRocketSeekingGameObjects.filter(x => x.isAnimating == true);

		if (animatingUfoBossRocketSeekings) {

			animatingUfoBossRocketSeekings.forEach(gameObject => {

				let ufoBossRocketSeeking = gameObject as UfoBossRocketSeeking;

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
					gameObject.moveDownRight();
				}
				else {

					gameObject.pop();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (ufoBoss) {
						ufoBossRocketSeeking.seek(this.player.getCloseBounds());

						if (Constants.checkCloseCollision(gameObject, this.player)) {
							gameObject.setBlast();
							this.loosePlayerHealth();
							ufoBoss.setWinStance();
							this.generateRingExplosion(gameObject);
						}
						else {
							if (gameObject.autoBlast()) {
								gameObject.setBlast();
								this.generateRingExplosion(gameObject);
							}
						}
					}
					else {
						gameObject.setBlast();
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region ZombieBosss	

	private zombieBossSizeWidth: number = 200;
	private zombieBossSizeHeight: number = 200;

	private zombieBossGameObjects: Array<ZombieBoss> = [];

	private spawnZombieBosss() {
		const gameObject: ZombieBoss = new ZombieBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.zombieBossSizeWidth;
		sprite.height = this.zombieBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.zombieBossGameObjects.push(gameObject);
		this.gameContainer.addChild(gameObject);

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

				this.zombieBossCheckpoint.increaseLimit(this.zombieBossReleaseLimit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(zombieBoss.health);
				this.bossHealthBar.setValue(zombieBoss.health);
				this.bossHealthBar.setIcon(zombieBoss.getSprite().getTexture());

				this.generateOnScreenMessage("Shoot the zombie. Avoid the cubes!", this.interactIcon);

				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.6, true);
				SoundManager.play(SoundType.UFO_BOSS_ENTRY);
				SoundManager.play(SoundType.UFO_BOSS_HOVERING, 0.8, true);

				//this.switchToNightMode();
			}
		}
	}

	private animateZombieBoss() {

		var gameObject = this.zombieBossGameObjects.find(x => x.isAnimating == true);
		let zombieBoss: ZombieBoss = gameObject as ZombieBoss;

		if (gameObject) {

			if (zombieBoss.isDead()) {
				zombieBoss.shrink();
			}
			else {
				gameObject.pop();
				gameObject.hover();
				zombieBoss.depleteHitStance();
				zombieBoss.depleteWinStance();
				zombieBoss.recoverFromHealthLoss();

				if (zombieBoss.isAttacking) {

					zombieBoss.moveUpRightDownLeft(Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling);

					if (Constants.checkCloseCollision(this.player, zombieBoss)) {
						this.loosePlayerHealth();
					}

					this.generateTaunts(gameObject);
				}
				else {

					zombieBoss.moveDownRight();

					if (zombieBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling / 3)) // bring ZombieBoss to a suitable distance from player and then start attacking
					{
						zombieBoss.isAttacking = true;
					}
				}
			}

			if (zombieBoss.hasShrinked()) {
				gameObject.disableRendering();
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
			this.gameScoreBar.gainScore(3);
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.UFO_BOSS_DEAD);
			SoundManager.stop(SoundType.UFO_BOSS_HOVERING);

			this.generateMessageBubble(zombieBoss, "You can't kill the undead!");
		}
	}

	private zombieBossExists(): boolean {
		var gameObject = this.zombieBossGameObjects.find(x => x.isAnimating == true);

		if (gameObject)
			return true;
		else
			return false;
	}

	//#endregion

	//#region ZombieBossRocketBlocks

	private zombieBossRocketBlockSizeWidth: number = 130 * 1.1;
	private zombieBossRocketBlockSizeHeight: number = 150 * 1.1;

	private zombieBossRocketBlockGameObjects: Array<ZombieBossRocketBlock> = [];

	private zombieBossRocketBlockPopDelayDefault: number = 8 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private zombieBossRocketBlockPopDelay: number = 0;

	spawnZombieBossRocketBlocks() {

		for (let j = 0; j < 5; j++) {

			const gameObject: ZombieBossRocketBlock = new ZombieBossRocketBlock(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.zombieBossRocketBlockSizeWidth;
			sprite.height = this.zombieBossRocketBlockSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.zombieBossRocketBlockGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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

			animatingZombieBossRocketBlocks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
						this.generateRingExplosion(gameObject);
					}

					if (gameObject.autoBlast()) {
						this.generateRingExplosion(gameObject);
						gameObject.setBlast();
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region MafiaBosss	

	private mafiaBossSizeWidth: number = 200;
	private mafiaBossSizeHeight: number = 200;

	private mafiaBossGameObjects: Array<MafiaBoss> = [];

	private spawnMafiaBosss() {
		const gameObject: MafiaBoss = new MafiaBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.mafiaBossSizeWidth;
		sprite.height = this.mafiaBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.mafiaBossGameObjects.push(gameObject);
		this.gameContainer.addChild(gameObject);

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

				this.mafiaBossCheckpoint.increaseLimit(this.mafiaBossReleaseLimit, this.gameScoreBar.getScore());

				this.bossHealthBar.setMaximumValue(mafiaBoss.health);
				this.bossHealthBar.setValue(mafiaBoss.health);
				this.bossHealthBar.setIcon(mafiaBoss.getSprite().getTexture());

				this.generateOnScreenMessage("Shoot the mafia. Avoid the bowling balls.", this.interactIcon);

				SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
				SoundManager.play(SoundType.BOSS_BACKGROUND_MUSIC, 0.6, true);
				SoundManager.play(SoundType.UFO_BOSS_ENTRY);
				SoundManager.play(SoundType.UFO_BOSS_HOVERING, 0.8, true);

				//this.switchToNightMode();
			}
		}
	}

	private animateMafiaBoss() {

		var gameObject = this.mafiaBossGameObjects.find(x => x.isAnimating == true);
		let mafiaBoss: MafiaBoss = gameObject as MafiaBoss;

		if (gameObject) {

			if (mafiaBoss.isDead()) {
				mafiaBoss.shrink();
			}
			else {
				gameObject.pop();
				gameObject.hover();
				mafiaBoss.depleteHitStance();
				mafiaBoss.depleteWinStance();
				mafiaBoss.recoverFromHealthLoss();

				if (mafiaBoss.isAttacking) {

					mafiaBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH * SceneManager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * SceneManager.scaling, this.player.getCloseBounds());

					if (Constants.checkCloseCollision(this.player, mafiaBoss)) {
						this.loosePlayerHealth();
					}

					this.generateTaunts(gameObject);
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
				gameObject.disableRendering();
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
			this.gameScoreBar.gainScore(3);
			this.levelUp();

			SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.GAME_BACKGROUND_MUSIC);
			SoundManager.play(SoundType.UFO_BOSS_DEAD);
			SoundManager.stop(SoundType.UFO_BOSS_HOVERING);

			this.generateMessageBubble(mafiaBoss, "Next time, hotshot!");
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

	private mafiaBossRocketSizeWidth: number = 90;
	private mafiaBossRocketSizeHeight: number = 90;

	private mafiaBossRocketGameObjects: Array<MafiaBossRocket> = [];

	private mafiaBossRocketPopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private mafiaBossRocketPopDelay: number = 0;

	spawnMafiaBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: MafiaBossRocket = new MafiaBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.mafiaBossRocketSizeWidth;
			sprite.height = this.mafiaBossRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.mafiaBossRocketGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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

					this.setBossRocketDirection(mafiaBoss, mafiaBossRocket, this.player);
				}

				this.mafiaBossRocketPopDelay = this.mafiaBossRocketPopDelayDefault;
			}
		}
	}

	animateMafiaBossRockets() {

		let animatingMafiaBossRockets = this.mafiaBossRocketGameObjects.filter(x => x.isAnimating == true);

		if (animatingMafiaBossRockets) {

			animatingMafiaBossRockets.forEach(gameObject => {

				let mafiaBossRocket = gameObject as MafiaBossRocket;

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

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (Constants.checkCloseCollision(gameObject, this.player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
						mafiaBoss?.setWinStance();
						this.generateRingExplosion(gameObject);
					}

					if (gameObject.autoBlast()) {
						gameObject.setBlast();
						this.generateRingExplosion(gameObject);
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region MafiaBossRocketBullsEyes

	private mafiaBossRocketBullsEyeSizeWidth: number = 90;
	private mafiaBossRocketBullsEyeSizeHeight: number = 90;

	private mafiaBossRocketBullsEyeGameObjects: Array<MafiaBossRocketBullsEye> = [];

	private mafiaBossRocketBullsEyePopDelayDefault: number = 10 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private mafiaBossRocketBullsEyePopDelay: number = 0;

	spawnMafiaBossRocketBullsEyes() {

		for (let j = 0; j < 3; j++) {

			const gameObject: MafiaBossRocketBullsEye = new MafiaBossRocketBullsEye(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET_BULLS_EYE));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.mafiaBossRocketBullsEyeSizeWidth;
			sprite.height = this.mafiaBossRocketBullsEyeSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.mafiaBossRocketBullsEyeGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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
					mafiaBossRocketBullsEye.setTarget(this.player.getCloseBounds());
					mafiaBossRocketBullsEye.enableRendering();
				}

				this.mafiaBossRocketBullsEyePopDelay = this.mafiaBossRocketBullsEyePopDelayDefault;
			}
		}
	}

	animateMafiaBossRocketBullsEyes() {

		let animatingMafiaBossRocketBullsEyes = this.mafiaBossRocketBullsEyeGameObjects.filter(x => x.isAnimating == true);

		if (animatingMafiaBossRocketBullsEyes) {

			animatingMafiaBossRocketBullsEyes.forEach(gameObject => {

				let mafiaBossRocketBullsEye = gameObject as MafiaBossRocketBullsEye;

				if (gameObject.isBlasting) {
					gameObject.shrink();
					gameObject.fade();
					gameObject.moveDownRight();
				}
				else {

					gameObject.pop();
					gameObject.rotate(RotationDirection.Forward, 0, 2.5);

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (mafiaBoss) {
						mafiaBossRocketBullsEye.move();

						if (Constants.checkCloseCollision(gameObject, this.player)) {
							gameObject.setBlast();
							this.loosePlayerHealth();
							mafiaBoss.setWinStance();
							this.generateRingExplosion(gameObject);
						}
						else {
							if (gameObject.autoBlast()) {
								gameObject.setBlast();
								this.generateRingExplosion(gameObject);
							}
						}
					}
					else {
						gameObject.setBlast();
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region HealthPickups	

	private healthPickupSizeWidth: number = 327 / 3;
	private healthPickupSizeHeight: number = 327 / 3;

	private healthPickupGameObjects: Array<HealthPickup> = [];

	private healthPickupPopDelayDefault: number = 130 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private healthPickupPopDelay: number = 0;

	private spawnHealthPickups() {

		for (let j = 0; j < 3; j++) {

			const gameObject: HealthPickup = new HealthPickup(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED));
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.healthPickupSizeWidth;
			sprite.height = this.healthPickupSizeHeight;
			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.healthPickupGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

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

	private powerUpPickupSizeWidth: number = 327 / 3;
	private powerUpPickupSizeHeight: number = 327 / 3;

	private powerUpPickupGameObjects: Array<PowerUpPickup> = [];

	private powerUpPickupPopDelayDefault: number = 130 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private powerUpPickupPopDelay: number = 0;

	private spawnPowerUpPickups() {

		for (let j = 0; j < 3; j++) {

			const gameObject: PowerUpPickup = new PowerUpPickup(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED));
			gameObject.disableRendering();

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.POWERUP_PICKUP_ARMOR));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.powerUpPickupSizeWidth;
			sprite.height = this.powerUpPickupSizeHeight;
			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.powerUpPickupGameObjects.push(gameObject);
			this.gameContainer.addChild(gameObject);

			this.spawnCastShadow(gameObject);
		}
	}

	private generatePowerUpPickups() {

		if ((this.anyInAirBossExists() || this.ufoEnemyExists()) && !this.powerUpMeter.hasHealth()) {
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

						this.powerUpMeter.tag = gameObject.powerUpType;
						this.powerUpMeter.setIcon(gameObject.getSprite().getTexture());

						switch (gameObject.powerUpType) {
							case PowerUpType.BULLS_EYE: // if bulls eye powerup, allow using a single shot of 20 bombs
								{
									this.powerUpMeter.setMaximumValue(20);
									this.powerUpMeter.setValue(20);

									this.generateOnScreenMessage("Bull's' Eye +20", this.powerUpMeter.getIcon());
								}
								break;
							case PowerUpType.ARMOR:
								{
									this.powerUpMeter.setMaximumValue(10);
									this.powerUpMeter.setValue(10);

									this.generateOnScreenMessage("Armor +10", this.powerUpMeter.getIcon());
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
		// use up the power up
		if (this.powerUpMeter.hasHealth())
			this.powerUpMeter.setValue(this.powerUpMeter.getValue() - 1);
	}

	//#endregion

	//#region GameController

	setGameController() {
		this.addChild(this.gameController);
	}

	//#endregion

	//#region ScoreBars

	private repositionGameScoreBar() {
		this.gameScoreBar.reposition(/*SceneManager.width / 2*/10, 10);
	}

	private repositionGameLevelBar() {
		this.gameLevelBar.reposition(/*(SceneManager.width / 2) - 120*/10, 55);
	}

	//#endregion

	//#region HealthBars

	private repositionPlayerHealthBar() {
		this.playerHealthBar.reposition((SceneManager.width) - 105, 10);
	}

	private repositionBossHealthBar() {
		this.bossHealthBar.reposition((SceneManager.width) - 205, 10);
	}

	private repositionPowerUpMeter() {
		this.powerUpMeter.reposition((SceneManager.width) - 305, 10);
	}

	//#endregion

	//#region Scene

	public update(_framesPassed: number) {

		if (this.gameContainer.alpha < 1) {
			this.gameContainer.alpha += 0.02;
		}

		this.updateFrame();
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.gameController.pauseGame();
		}
		else {
			this.gameContainer.scale.set(scale);
			this.repositionGameScoreBar();
			this.repositionPlayerHealthBar();
			this.repositionBossHealthBar();
			this.repositionPowerUpMeter();
			this.gameController.resize();

			this.roadBackgroundDay.width = SceneManager.width;
			this.roadBackgroundDay.height = SceneManager.height;
		}
	}

	private updateFrame() {
		if (!this.gameController.isPaused) {
			this.generateGameObjects();
			this.animateGameObjects();

			this.gameController.update();
			this.animatePlayerBalloon();
		}
	}

	private spawnGameObjects() {

		this.spawnRoadMarks();

		this.spawnSideWalksTop();
		//this.spawnHedgesTop();
		//this.spawnLightBillboardsTop();
		this.spawnTreesTop();
		this.spawnLampsTop();

		this.spawnVehicleEnemys();
		this.spawnVehicleBosss();
		this.spawnHonks();
		this.spawnVehicleBossRockets();

		this.spawnSideWalksBottom();
		//this.spawnHedgesBottom();
		//this.spawnLampsBottom();
		this.spawnPlayerHonkBombs();
		this.spawnSmokeExplosions();

		this.spawnTreesBottom();
		//this.spawnLightBillboardsBottom();
		this.spawnPlayerRockets();
		this.spawnPlayerRocketBullsEyes();
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
		this.spawnRingExplosions();

		this.spawnHealthPickups();
		this.spawnPowerUpPickups();

		this.spawnMessageBubbles();

		//this.spawnUnderCityTop();

		//this.spawnClouds();
	}

	private generateGameObjects() {

		if (!this.anyInAirBossExists()) {
			this.generateRoadMarks();
			this.generateSideWalksTop();
			//this.generateLightBillboardsTop();
			//this.generateHedgesTop();
			this.generateTreesTop();
			this.generateLampsTop();
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

		if (!this.anyInAirBossExists()) {
			this.generateSideWalksBottom();
			//this.generateHedgesBottom();
			//this.generateLightBillboardsBottom();
			this.generateTreesBottom();
			//this.generateLampsBottom();
		}
	}

	private animateGameObjects() {

		if (!this.anyInAirBossExists()) {
			this.animateRoadMarks();

			this.animateSideWalksTop();
			//this.animateHedgesTop();
			this.animateTreesTop();
			//this.animateLightBillboardsTop();
			this.animateLampsTop();
		}

		this.animateVehicleEnemys();
		this.animateVehicleBoss();
		this.animateVehicleBossRockets();

		this.animateHonks();

		if (!this.anyInAirBossExists()) {
			this.animateSideWalksBottom();
			//this.animateHedgesBottom();
			this.animateTreesBottom();
			//this.animateLightBillboardsBottom();
			//this.animateLampsBottom();
		}

		this.animatePlayerHonkBombs();
		this.animateFlashExplosions();
		this.animateSmokeExplosions();
		this.animateRingExplosions();
		this.animatePlayerRockets();
		this.animatePlayerRocketBullsEyes();

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

		//this.animateClouds();
		this.animateOnScreenMessage();
		this.animateMessageBubbles();
	}

	private levelUp() {
		this.gameLevel++;
		this.gameLevelBar.gainScore(1);
		this.generateOnScreenMessage("Level " + this.gameLevel.toString() + " Complete", this.cheerIcon);
		SoundManager.play(SoundType.LEVEL_UP);
	}

	private anyBossExists(): boolean {
		return (this.ufoBossExists() || this.vehicleBossExists() || this.zombieBossExists() || this.mafiaBossExists());
	}

	private anyInAirBossExists(): boolean {
		return (this.ufoBossExists() || this.zombieBossExists() || this.mafiaBossExists());
	}

	private resumeGame() {
		if (this.anyBossExists()) {
			SoundManager.resume(SoundType.BOSS_BACKGROUND_MUSIC);

			if (this.anyInAirBossExists()) {
				SoundManager.resume(SoundType.UFO_BOSS_HOVERING);
			}
		}
		else {
			SoundManager.resume(SoundType.GAME_BACKGROUND_MUSIC);
		}

		if (this.ufoEnemyExists()) {
			SoundManager.resume(SoundType.UFO_BOSS_HOVERING);
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

		this.gameContainer.filters = null;
	}

	private pauseGame() {
		if (this.anyBossExists()) {
			SoundManager.pause(SoundType.BOSS_BACKGROUND_MUSIC);

			if (this.anyInAirBossExists()) {
				SoundManager.pause(SoundType.UFO_BOSS_HOVERING);
			}
		}
		else {
			SoundManager.pause(SoundType.GAME_BACKGROUND_MUSIC);
		}

		if (this.ufoEnemyExists()) {
			SoundManager.pause(SoundType.UFO_BOSS_HOVERING);
		}

		switch (Constants.SELECTED_PLAYER_RIDE_TEMPLATE) {
			case 0: { } break;
			case 1: { SoundManager.pause(SoundType.CHOPPER_HOVERING); } break;
			default:
		}

		SoundManager.pause(SoundType.AMBIENCE);

		this.generateOnScreenMessage("Game paused", this.behindBackIcon);

		this.gameContainer.filters = [new BlurFilter()];
	}

	private gameOver() {
		SoundManager.stop(SoundType.GAME_BACKGROUND_MUSIC);
		SoundManager.stop(SoundType.BOSS_BACKGROUND_MUSIC);
		SoundManager.stop(SoundType.UFO_BOSS_HOVERING);
		SoundManager.stop(SoundType.AMBIENCE);
		SoundManager.stop(SoundType.CHOPPER_HOVERING);

		Constants.GAME_SCORE = this.gameScoreBar.getScore();
		this.removeChild(this.gameContainer);
		SceneManager.changeScene(new GameOverScene());
	}

	//#endregion

	//#endregion
}

