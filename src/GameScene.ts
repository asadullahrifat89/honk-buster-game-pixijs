import { Container, Texture } from "pixi.js";
import { IScene } from "./IScene";
import { GameObjectSprite } from './GameObjectSprite';
import { GameObject } from './GameObject';
import { Cloud } from "./Cloud";
import { Constants, ConstructType, RotationDirection } from './Constants';
import { VehicleEnemy } from "./VehicleEnemy";
import { Honk } from "./Honk";
import { PlayerBalloon } from "./PlayerBalloon";
import { GameController } from "./GameController";
import { Manager } from "./Manager";
import { PlayerHonkBomb } from "./PlayerHonkBomb";
import { GameScoreBar } from "./GameScoreBar";
import { GameCheckpoint } from "./GameCheckpoint";
import { VehicleBoss } from "./VehicleBoss";
import { InterimScreen } from "./InterimScreen";
import { VehicleBossRocket } from "./VehicleBossRocket";
import { HealthBar } from "./HealthBar";
import { UfoBoss } from "./UfoBoss";
import { PlayerRocket } from "./PlayerRocket";
import { UfoBossRocket } from "./UfoBossRocket";
import { UfoBossRocketSeeking } from "./UfoBossRocketSeeking";
import { ZombieBoss } from "./ZombieBoss";
import { ZombieBossRocketBlock } from "./ZombieBossRocketBlock";
import { MafiaBoss } from "./MafiaBoss";
import { MafiaBossRocket } from "./MafiaBossRocket";
import { MafiaBossRocketBullsEye } from "./MafiaBossRocketBullsEye";
import { HealthPickup } from "./HealthPickup";


export class GameScene extends Container implements IScene {

	//#region Properties

	private _gameController: GameController = new GameController();
	private _sceneContainer: Container = new Container();
	private _gameScoreBar: GameScoreBar;

	private _interimScreen: InterimScreen;

	//TODO: set defaults _vehicleBossReleasePoint = 25
	private readonly _vehicleBossReleasePoint: number = 25; // first appearance
	private readonly _vehicleBossReleasePoint_increase: number = 15;
	private readonly _vehicleBossCheckpoint: GameCheckpoint;

	//TODO: set defaults _ufoBossReleasePoint = 50
	private readonly _ufoBossReleasePoint: number = 50; // first appearance
	private readonly _ufoBossReleasePoint_increase: number = 15;
	private readonly _ufoBossCheckpoint: GameCheckpoint;

	//TODO: set defaults _zombieBossReleasePoint = 75
	private readonly _zombieBossReleasePoint: number = 75; // first appearance
	private readonly _zombieBossReleasePoint_increase: number = 15;
	private readonly _zombieBossCheckpoint: GameCheckpoint;

	//TODO: set defaults _mafiaBossReleasePoint = 100
	private readonly _mafiaBossReleasePoint: number = 100; // first appearance
	private readonly _mafiaBossReleasePoint_increase: number = 15;
	private readonly _mafiaBossCheckpoint: GameCheckpoint;

	private _playerHealthBar: HealthBar;
	private _bossHealthBar: HealthBar;

	private _gameLevel: number = 0;

	//#endregion

	//#region Methods

	//#region Constructor

	constructor() {
		super();

		this._sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH;
		this._sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT;
		//this._sceneContainer.filters = [new DropShadowFilter()];

		this.addChild(this._sceneContainer);

		this._vehicleBossCheckpoint = new GameCheckpoint(this._vehicleBossReleasePoint);
		this._ufoBossCheckpoint = new GameCheckpoint(this._ufoBossReleasePoint);
		this._zombieBossCheckpoint = new GameCheckpoint(this._zombieBossReleasePoint);
		this._mafiaBossCheckpoint = new GameCheckpoint(this._mafiaBossReleasePoint);

		this.spawnRoadMarks();

		this.spawnSideWalksTop();
		this.spawnHedgesTop();
		//this.spawnHeavyBillboardsTop();
		this.spawnLightBillboardsTop();
		this.spawnTreesTop();
		this.spawnLampsTop();

		this.spawnVehicleEnemys();
		this.spawnVehicleBosss();
		this.spawnHonks();
		this.spawnVehicleBossRockets();

		this.spawnSideWalksBottom();
		this.spawnHedgesBottom();
		this.spawnLampsBottom();
		this.spawnTreesBottom();
		this.spawnLightBillboardsBottom();

		this.spawnPlayerHonkBombs();
		this.spawnPlayerRockets();
		this.spawnPlayerBalloon();

		this.spawnUfoBossRockets();
		this.spawnUfoBossRocketSeekings();
		this.spawnUfoBosss();

		this.spawnZombieBosss();
		this.spawnZombieBossRocketBlocks();

		this.spawnMafiaBosss();
		this.spawnMafiaBossRockets();
		this.spawnMafiaBossRocketBullsEyes();

		this.spawnHealthPickups();

		this.spawnClouds();

		this.generatePlayerBalloon();

		this._gameScoreBar = new GameScoreBar(this);
		this.repositionGameScoreBar();

		this._playerHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP), this);
		this._playerHealthBar.setMaximumValue(100);
		this._playerHealthBar.setValue(100);
		this.repositionPlayerHealthBar();

		this._bossHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.VEHICLE_ENEMY_LARGE), this);
		this._bossHealthBar.setMaximumValue(100);
		this._bossHealthBar.setValue(0);
		this.repositionVehicleBossHealthBar();

		this._interimScreen = new InterimScreen(this);

		this.setGameController();
	}

	//#endregion

	//#region RoadMarks

	private roadMarkXyAdjustment: number = 19;

	private roadMarkSizeWidth: number = 256;
	private roadMarkSizeHeight: number = 256;

	private roadMarkGameObjects: Array<GameObject> = [];

	private roadMarkPopDelayDefault: number = 39.5 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadMarkPopDelay: number = 0;

	private spawnRoadMarks() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadMarkSizeWidth * 5;
			gameObject.height = this.roadMarkSizeHeight / 2 * 5;

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_MARK));

				sprite.x = this.roadMarkSizeWidth * i - (this.roadMarkXyAdjustment * i);
				sprite.y = (this.roadMarkSizeHeight / 2) * i - ((this.roadMarkXyAdjustment / 2) * i);
				sprite.width = this.roadMarkSizeWidth;
				sprite.height = this.roadMarkSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadMarkGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateRoadMarks() {

		this.roadMarkPopDelay -= 0.1;

		if (this.roadMarkPopDelay < 0) {

			var gameObject = this.roadMarkGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				gameObject.setPosition(gameObject.width * - 1.1, gameObject.height * -1);
				gameObject.enableRendering();

				this.roadMarkPopDelay = this.roadMarkPopDelayDefault;
			}
		}
	}

	private animateRoadMarks() {

		var animatingRoadMarks = this.roadMarkGameObjects.filter(x => x.isAnimating == true);

		if (animatingRoadMarks) {

			animatingRoadMarks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Trees

	private treeXyAdjustment: number = 85.5;

	private treeSizeWidth: number = 450;
	private treeSizeHeight: number = 450;

	private treeBottomGameObjects: Array<GameObject> = [];
	private treeTopGameObjects: Array<GameObject> = [];

	private treePopDelayDefault: number = 62 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private treePopDelayTop: number = 0;
	private treePopDelayBottom: number = 0;

	private spawnTreesTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.treeSizeWidth * 5;
			gameObject.height = this.treeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_TREE));

				sprite.x = this.treeSizeWidth * i - (this.treeXyAdjustment * i);
				sprite.y = (this.treeSizeHeight / 2) * i - ((this.treeXyAdjustment / 2) * i);
				sprite.width = this.treeSizeWidth;
				sprite.height = this.treeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.treeTopGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private spawnTreesBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.treeSizeWidth * 5;
			gameObject.height = this.treeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.treeSizeWidth * i - (this.treeXyAdjustment * i);
				sprite.y = (this.treeSizeHeight / 2) * i - ((this.treeXyAdjustment / 2) * i);
				sprite.width = this.treeSizeWidth;
				sprite.height = this.treeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.treeBottomGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateTreesTop() {

		this.treePopDelayTop -= 0.1;

		if (this.treePopDelayTop < 0) {

			var gameObject = this.treeTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-850, gameObject.height * -1);
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
				gameObject.setPosition(gameObject.width * -1, -570);
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

				if (gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
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

				if (gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Hedges

	private hedgeXyAdjustment: number = 30.5;

	private hedgeSizeWidth: number = 450;
	private hedgeSizeHeight: number = 450;

	private hedgeBottomGameObjects: Array<GameObject> = [];
	private hedgeTopGameObjects: Array<GameObject> = [];

	private hedgePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private hedgePopDelayTop: number = 0;
	private hedgePopDelayBottom: number = 0;

	private spawnHedgesTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.hedgeSizeWidth * 5;
			gameObject.height = this.hedgeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add hedges to the hedge top gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_HEDGE));

				sprite.x = this.hedgeSizeWidth * i - (this.hedgeXyAdjustment * i);
				sprite.y = (this.hedgeSizeHeight / 2) * i - ((this.hedgeXyAdjustment / 2) * i);
				sprite.width = this.hedgeSizeWidth;
				sprite.height = this.hedgeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.hedgeTopGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private spawnHedgesBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.hedgeSizeWidth * 5;
			gameObject.height = this.hedgeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add hedges to the hedge bottom gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_HEDGE));

				sprite.x = this.hedgeSizeWidth * i - (this.hedgeXyAdjustment * i);
				sprite.y = (this.hedgeSizeHeight / 2) * i - ((this.hedgeXyAdjustment / 2) * i);
				sprite.width = this.hedgeSizeWidth;
				sprite.height = this.hedgeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.hedgeBottomGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateHedgesTop() {

		this.hedgePopDelayTop -= 0.1;

		if (this.hedgePopDelayTop < 0) {

			var gameObject = this.hedgeTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-1430, gameObject.height * -1);
				gameObject.enableRendering();
				this.hedgePopDelayTop = this.hedgePopDelayDefault;
			}
		}
	}

	private generateHedgesBottom() {

		this.hedgePopDelayBottom -= 0.1;

		if (this.hedgePopDelayBottom < 0) {

			var gameObject = this.hedgeBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(gameObject.width * -1, -710);
				gameObject.enableRendering();
				this.hedgePopDelayBottom = this.hedgePopDelayDefault;

				// console.log("Hedge bottom gameObject popped.");
			}
		}
	}

	private animateHedgesTop() {

		var animatingHedges = this.hedgeTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.hedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateHedgesBottom() {

		var animatingHedges = this.hedgeBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.hedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region HeavyBillboards

	//private roadHeavyBillboardXyAdjustment: number = 31.5;
	//private roadHeavyBillboardXyDistance = 250;

	//private roadHeavyBillboardSizeWidth: number = 256;
	//private roadHeavyBillboardSizeHeight: number = 256;

	////private roadHeavyBillboardBottomGameObjects: Array<GameObject> = [];
	//private roadHeavyBillboardTopGameObjects: Array<GameObject> = [];

	//private roadHeavyBillboardPopDelayDefault: number = 78;
	//private roadHeavyBillboardPopDelayTop: number = 0;
	////private roadHeavyBillboardPopDelayBottom: number = 0;

	//private spawnHeavyBillboardsTop() {

	//	for (let j = 0; j < 5; j++) {

	//		const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		gameObject.moveOutOfSight();
	//		gameObject.width = this.roadHeavyBillboardSizeWidth * 5;
	//		gameObject.height = this.roadHeavyBillboardSizeHeight / 2 * 5;

	//		// gameObject.filters = [new DropShadowFilter()];


	//		for (let i = 0; i < 5; i++) {

	//			const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_BILLBOARD);
	//			const texture = Texture.from(uri);
	//			const sprite: GameObjectSprite = new GameObjectSprite(texture);

	//			sprite.x = (this.roadHeavyBillboardSizeWidth * i - (this.roadHeavyBillboardXyAdjustment * i)) + (this.roadHeavyBillboardXyDistance * i);
	//			sprite.y = ((this.roadHeavyBillboardSizeHeight / 2) * i - ((this.roadHeavyBillboardXyAdjustment / 2) * i)) + (this.roadHeavyBillboardXyDistance / 2 * i);
	//			sprite.width = this.roadHeavyBillboardSizeWidth;
	//			sprite.height = this.roadHeavyBillboardSizeHeight;

	//			gameObject.addChild(sprite);
	//		}

	//		this.roadHeavyBillboardTopGameObjects.push(gameObject);
	//		this.addChild(gameObject);
	//	}
	//}

	////private spawnHeavyBillboardsBottom() {

	////	for (let j = 0; j < 5; j++) {

	////		const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
	////		gameObject.moveOutOfSight();
	////		gameObject.width = this.roadHeavyBillboardSizeWidth * 5;
	////		gameObject.height = this.roadHeavyBillboardSizeHeight / 2 * 5;

	////		// gameObject.filters = [new DropShadowFilter()];

	////		
	////		for (let i = 0; i < 5; i++) {

	////			const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD);
	////			const texture = Texture.from(uri);
	////			const sprite: GameObjectSprite = new GameObjectSprite(texture);

	////			sprite.x = (this.roadHeavyBillboardSizeWidth * i - (this.roadHeavyBillboardXyAdjustment * i)) + (this.roadHeavyBillboardXyDistance * i);
	////			sprite.y = ((this.roadHeavyBillboardSizeHeight / 2) * i - ((this.roadHeavyBillboardXyAdjustment / 2) * i)) + (this.roadHeavyBillboardXyDistance / 2 * i);
	////			sprite.width = this.roadHeavyBillboardSizeWidth;
	////			sprite.height = this.roadHeavyBillboardSizeHeight;

	////			gameObject.addChild(sprite);
	////		}

	////		this.roadHeavyBillboardBottomGameObjects.push(gameObject);
	////		this.addChild(gameObject);
	////	}
	////}

	//private generateHeavyBillboardsTop() {

	//	this.roadHeavyBillboardPopDelayTop -= 0.1;

	//	if (this.roadHeavyBillboardPopDelayTop < 0) {

	//		var gameObject = this.roadHeavyBillboardTopGameObjects.find(x => x.isAnimating == false);

	//		if (gameObject) {
	//			gameObject.x = -980;
	//			gameObject.y = gameObject.height * -1;
	//			gameObject.isAnimating = true;
	//			this.roadHeavyBillboardPopDelayTop = this.roadHeavyBillboardPopDelayDefault;
	//		}
	//	}
	//}

	////private generateHeavyBillboardsBottom() {

	////	this.roadHeavyBillboardPopDelayBottom -= 0.1;

	////	if (this.roadHeavyBillboardPopDelayBottom < 0) {

	////		var gameObject = this.roadHeavyBillboardBottomGameObjects.find(x => x.isAnimating == false);

	////		if (gameObject) {
	////			gameObject.x = gameObject.width * -1;
	////			gameObject.y = -330;
	////			gameObject.isAnimating = true;
	////			this.roadHeavyBillboardPopDelayBottom = this.roadHeavyBillboardPopDelayDefault;
	////		}
	////	}
	////}

	//private animateHeavyBillboardsTop() {

	//	var animatingHeavyBillboards = this.roadHeavyBillboardTopGameObjects.filter(x => x.isAnimating == true);

	//	if (animatingHeavyBillboards) {

	//		animatingHeavyBillboards.forEach(gameObject => {
	//			gameObject.moveDownRight();

	//			if (gameObject.x - this.roadHeavyBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				gameObject.moveOutOfSight();
	//
	//			}
	//		});
	//	}
	//}

	////private animateHeavyBillboardsBottom() {

	////	var animatingHeavyBillboards = this.roadHeavyBillboardBottomGameObjects.filter(x => x.isAnimating == true);

	////	if (animatingHeavyBillboards) {

	////		animatingHeavyBillboards.forEach(gameObject => {
	////			gameObject.moveDownRight();

	////			if (gameObject.x - this.roadHeavyBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	////				gameObject.moveOutOfSight();
	////
	////			}
	////		});
	////	}
	////}

	//#endregion

	//#region Lamps

	private lampXyAdjustment: number = 31.5;
	private lampXyDistance = 250;

	private lampSizeWidth: number = 268 / 2;
	private lampSizeHeight: number = 234 / 2;

	private lampBottomGameObjects: Array<GameObject> = [];
	private lampTopGameObjects: Array<GameObject> = [];

	private lampPopDelayDefault: number = 57 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private lampPopDelayTop: number = 0;
	private lampPopDelayBottom: number = 0;

	private spawnLampsTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.lampSizeWidth * 5;
			gameObject.height = this.lampSizeHeight / 2 * 5;

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LAMP));

				sprite.x = (this.lampSizeWidth * i - (this.lampXyAdjustment * i)) + (this.lampXyDistance * i);
				sprite.y = ((this.lampSizeWidth / 2) * i - ((this.lampXyAdjustment / 2) * i)) + (this.lampXyDistance / 2 * i);
				sprite.width = this.lampSizeWidth;
				sprite.height = this.lampSizeHeight;

				gameObject.addChild(sprite);
			}

			this.lampTopGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private spawnLampsBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.lampSizeWidth * 5;
			gameObject.height = this.lampSizeHeight / 2 * 5;

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LAMP));

				sprite.x = (this.lampSizeWidth * i - (this.lampXyAdjustment * i)) + (this.lampXyDistance * i);
				sprite.y = ((this.lampSizeWidth / 2) * i - ((this.lampXyAdjustment / 2) * i)) + (this.lampXyDistance / 2 * i);
				sprite.width = this.lampSizeWidth;
				sprite.height = this.lampSizeHeight;

				gameObject.addChild(sprite);
			}

			this.lampBottomGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateLampsTop() {

		this.lampPopDelayTop -= 0.1;

		if (this.lampPopDelayTop < 0) {

			var gameObject = this.lampTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-510, gameObject.height * -1);
				gameObject.enableRendering();
				this.lampPopDelayTop = this.lampPopDelayDefault;
			}
		}
	}

	private generateLampsBottom() {

		this.lampPopDelayBottom -= 0.1;

		if (this.lampPopDelayBottom < 0) {

			var gameObject = this.lampBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = gameObject.width * -1;
				gameObject.y = -330;
				gameObject.enableRendering();
				this.lampPopDelayBottom = this.lampPopDelayDefault;
			}
		}
	}

	private animateLampsTop() {

		var animatingLamps = this.lampTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingLamps) {

			animatingLamps.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.lampSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateLampsBottom() {

		var animatingLamps = this.lampBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingLamps) {

			animatingLamps.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.lampSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region LightBillboards

	private lightBillboardXyAdjustment: number = 31.5;
	private lightBillboardXyDistance = 250;

	private lightBillboardSizeWidth: number = 128;
	private lightBillboardSizeHeight: number = 128;

	private lightBillboardBottomGameObjects: Array<GameObject> = [];
	private lightBillboardTopGameObjects: Array<GameObject> = [];

	private lightBillboardPopDelayDefault: number = 57 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private lightBillboardPopDelayTop: number = 0;
	private lightBillboardPopDelayBottom: number = 0;

	private spawnLightBillboardsTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.lightBillboardSizeWidth * 5;
			gameObject.height = this.lightBillboardSizeHeight / 2 * 5;

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD));

				sprite.x = (this.lightBillboardSizeWidth * i - (this.lightBillboardXyAdjustment * i)) + (this.lightBillboardXyDistance * i);
				sprite.y = ((this.lightBillboardSizeHeight / 2) * i - ((this.lightBillboardXyAdjustment / 2) * i)) + (this.lightBillboardXyDistance / 2 * i);
				sprite.width = this.lightBillboardSizeWidth;
				sprite.height = this.lightBillboardSizeHeight;

				gameObject.addChild(sprite);
			}

			this.lightBillboardTopGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private spawnLightBillboardsBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.lightBillboardSizeWidth * 5;
			gameObject.height = this.lightBillboardSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];


			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD));

				sprite.x = (this.lightBillboardSizeWidth * i - (this.lightBillboardXyAdjustment * i)) + (this.lightBillboardXyDistance * i);
				sprite.y = ((this.lightBillboardSizeHeight / 2) * i - ((this.lightBillboardXyAdjustment / 2) * i)) + (this.lightBillboardXyDistance / 2 * i);
				sprite.width = this.lightBillboardSizeWidth;
				sprite.height = this.lightBillboardSizeHeight;

				gameObject.addChild(sprite);
			}

			this.lightBillboardBottomGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateLightBillboardsTop() {

		this.lightBillboardPopDelayTop -= 0.1;

		if (this.lightBillboardPopDelayTop < 0) {

			var gameObject = this.lightBillboardTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-380, gameObject.height * -1.1);
				gameObject.enableRendering();
				this.lightBillboardPopDelayTop = this.lightBillboardPopDelayDefault;
			}
		}
	}

	private generateLightBillboardsBottom() {

		this.lightBillboardPopDelayBottom -= 0.1;

		if (this.lightBillboardPopDelayBottom < 0) {

			var gameObject = this.lightBillboardBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(gameObject.width * -1, -180);
				gameObject.enableRendering();
				this.lightBillboardPopDelayBottom = this.lightBillboardPopDelayDefault;
			}
		}
	}

	private animateLightBillboardsTop() {

		var animatingLightBillboards = this.lightBillboardTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingLightBillboards) {

			animatingLightBillboards.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.lightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateLightBillboardsBottom() {

		var animatingLightBillboards = this.lightBillboardBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingLightBillboards) {

			animatingLightBillboards.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.lightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region SideWalks

	private sideWalkXyAdjustment: number = 111.5;

	private sideWalkWidth: number = 450;
	private sideWalkHeight: number = 450;

	private sideWalkTopGameObjects: Array<GameObject> = [];
	private sideWalkBottomGameObjects: Array<GameObject> = [];

	private sideWalkPopDelayDefault: number = 50 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private sideWalkPopDelayTop: number = 0;
	private sideWalkPopDelayBottom: number = 0;

	private spawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.sideWalkWidth * 5;
			gameObject.height = this.sideWalkHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add sideWalks to the sideWalk top gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK));

				sprite.x = this.sideWalkWidth * i - (this.sideWalkXyAdjustment * i);
				sprite.y = (this.sideWalkHeight / 2) * i - ((this.sideWalkXyAdjustment / 2) * i);

				sprite.width = this.sideWalkWidth;
				sprite.height = this.sideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				gameObject.addChild(sprite);
			}

			this.sideWalkTopGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private spawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.sideWalkWidth * 5;
			gameObject.height = this.sideWalkHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add sideWalks to the sideWalk top gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK));

				sprite.x = this.sideWalkWidth * i - (this.sideWalkXyAdjustment * i);
				sprite.y = (this.sideWalkHeight / 2) * i - ((this.sideWalkXyAdjustment / 2) * i);

				sprite.width = this.sideWalkWidth;
				sprite.height = this.sideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				gameObject.addChild(sprite);
			}

			this.sideWalkBottomGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateSideWalksTop() {

		this.sideWalkPopDelayTop -= 0.1;

		if (this.sideWalkPopDelayTop < 0) {

			var gameObject = this.sideWalkTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = -945;
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
				gameObject.y = -435;
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

	private cloudSizeWidth: number = 512 / 2;
	private cloudSizeHeight: number = 350 / 2;

	private cloudGameObjects: Array<GameObject> = [];

	private cloudPopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private cloudPopDelay: number = 0;

	private spawnClouds() {

		for (let j = 0; j < 5; j++) {

			const gameObject: Cloud = new Cloud(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2));
			gameObject.disableRendering();
			gameObject.width = this.cloudSizeWidth;
			gameObject.height = this.cloudSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.CLOUD));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.cloudSizeWidth;
			sprite.height = this.cloudSizeHeight;
			//sprite.filters = [new BlurFilter(4, 10)];
			//cloudContainer.filters = [new BlurFilter(2, 10)];
			gameObject.addChild(sprite);

			this.cloudGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateClouds() {

		this.cloudPopDelay -= 0.1;

		if (this.cloudPopDelay < 0) {

			var gameObject = this.cloudGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				gameObject.setTexture(Constants.getRandomTexture(ConstructType.CLOUD));
				gameObject.speed = Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2);

				var cloud = gameObject as Cloud;
				cloud.reposition();

				gameObject.enableRendering();

				this.cloudPopDelay = this.cloudPopDelayDefault;
			}
		}
	}

	private animateClouds() {

		var animatingClouds = this.cloudGameObjects.filter(x => x.isAnimating == true);

		if (animatingClouds) {

			animatingClouds.forEach(gameObject => {

				gameObject.hover();
				gameObject.moveDownRight();

				if (gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region VehicleEnemys	

	private vehicleEnemySizeWidth: number = 242;
	private vehicleEnemySizeHeight: number = 242;

	private vehicleEnemyGameObjects: Array<GameObject> = [];

	private vehicleEnemyPopDelayDefault: number = 35 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleEnemyPopDelay: number = 0;

	private spawnVehicleEnemys() {

		for (let j = 0; j < 10; j++) {

			const gameObject: VehicleEnemy = new VehicleEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.vehicleEnemySizeWidth;
			gameObject.height = this.vehicleEnemySizeHeight;

			var vehicleType = Constants.getRandomNumber(0, 1);

			var uri: string = "";
			switch (vehicleType) {
				case 0: {

					uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);

					break;
				}
				case 1: {

					uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);

					break;
				}
				default: break;
			}

			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.vehicleEnemySizeWidth;
			sprite.height = this.vehicleEnemySizeHeight;

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.vehicleEnemyGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateVehicleEnemys() {

		if (!this.anyBossExists()) {
			this.vehicleEnemyPopDelay -= 0.1;

			if (this.vehicleEnemyPopDelay < 0) {

				var gameObject = this.vehicleEnemyGameObjects.find(x => x.isAnimating == false);

				if (gameObject) {

					var vehicleEnemy = gameObject as VehicleEnemy;
					vehicleEnemy.reposition();
					vehicleEnemy.reset();

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
				gameObject.moveDownRight();

				// prevent overlapping

				var collidingVehicleEnemy = this.vehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCollision(x, gameObject));

				if (collidingVehicleEnemy) {

					if (collidingVehicleEnemy.speed > gameObject.speed) // colliding vehicleEnemy is faster
					{
						gameObject.speed = collidingVehicleEnemy.speed;
					}
					else if (gameObject.speed > collidingVehicleEnemy.speed) // vehicleEnemy is faster
					{
						collidingVehicleEnemy.speed = gameObject.speed;
					}
				}

				// generate honk

				let vehicleEnemy = gameObject as VehicleEnemy;

				if (vehicleEnemy) {

					if (vehicleEnemy.honk()) {
						this.generateHonk(gameObject);
					}
				}

				if (gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
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
				this._gameScoreBar.gainScore(2);
			}
		}
	}

	//#endregion

	//#region VehicleBosss	

	private vehicleBossSizeWidth: number = 242;
	private vehicleBossSizeHeight: number = 242;

	private vehicleBossGameObjects: Array<VehicleBoss> = [];

	private spawnVehicleBosss() {
		const gameObject: VehicleBoss = new VehicleBoss(Constants.DEFAULT_CONSTRUCT_SPEED);
		gameObject.disableRendering();
		gameObject.width = this.vehicleBossSizeWidth;
		gameObject.height = this.vehicleBossSizeHeight;

		var vehicleType = Constants.getRandomNumber(0, 1);

		var uri: string = "";
		switch (vehicleType) {
			case 0: {

				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_SMALL);

				break;
			}
			case 1: {

				uri = Constants.getRandomUri(ConstructType.VEHICLE_ENEMY_LARGE);

				break;
			}
			default: break;
		}

		const texture = Texture.from(uri);
		const sprite: GameObjectSprite = new GameObjectSprite(texture);

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.vehicleBossSizeWidth;
		sprite.height = this.vehicleBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.vehicleBossGameObjects.push(gameObject);
		this._sceneContainer.addChild(gameObject);
	}

	private generateVehicleBoss() {

		if (this._vehicleBossCheckpoint.shouldRelease(this._gameScoreBar.getScore()) && !this.vehicleBossExists()) {

			var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var vehicleBoss = gameObject as VehicleBoss;
				vehicleBoss.reposition();
				vehicleBoss.reset();
				vehicleBoss.health = this._vehicleBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this._vehicleBossCheckpoint.increaseThreasholdLimit(this._vehicleBossReleasePoint_increase, this._gameScoreBar.getScore());

				this._bossHealthBar.setMaximumValue(vehicleBoss.health);
				this._bossHealthBar.setValue(vehicleBoss.health);
				this._bossHealthBar.setIcon(vehicleBoss.getGameObjectSprite().getTexture());

				this.generateInterimScreen("Crazy Honker Arrived");
			}
		}
	}

	private animateVehicleBoss() {

		var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == true);
		let vehicleBoss: VehicleBoss = gameObject as VehicleBoss;

		if (gameObject) {

			if (vehicleBoss.isDead()) {
				vehicleBoss.moveDownRight();
			}
			else {
				gameObject.pop();

				if (vehicleBoss.isAttacking) {

					vehicleBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * Manager.scaling);

					if (vehicleBoss.honk()) {
						this.generateHonk(gameObject);
					}

				}
				else {

					if (this.vehicleEnemyGameObjects.every(x => x.isAnimating == false || this.vehicleEnemyGameObjects.filter(x => x.isAnimating).every(x => x.getLeft() > Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling / 2))) {
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

		this._bossHealthBar.setValue(vehicleBoss.health);

		if (vehicleBoss.isDead()) {

			this._player.setWinStance();
			this._gameScoreBar.gainScore(3);
			this.levelUp();
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

	private vehicleBossRocketPopDelayDefault: number = 15 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleBossRocketPopDelay: number = 0;

	spawnVehicleBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: VehicleBossRocket = new VehicleBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 1.7);
			gameObject.disableRendering();
			gameObject.width = this.vehicleBossRocketSizeWidth;
			gameObject.height = this.vehicleBossRocketSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.VEHICLE_BOSS_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.vehicleBossRocketSizeWidth;
			sprite.height = this.vehicleBossRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.vehicleBossRocketGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
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
					gameObject.expand();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					//gameObject.dillyDally();

					if (Constants.checkCloseCollision(gameObject, this._player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
					}

					if (gameObject.autoBlast())
						gameObject.setBlast();
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
		gameObject.width = this.ufoBossSizeWidth;
		gameObject.height = this.ufoBossSizeHeight;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.ufoBossSizeWidth;
		sprite.height = this.ufoBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.ufoBossGameObjects.push(gameObject);
		this._sceneContainer.addChild(gameObject);
	}

	private generateUfoBoss() {

		if (this._ufoBossCheckpoint.shouldRelease(this._gameScoreBar.getScore()) && !this.ufoBossExists()) {

			var gameObject = this.ufoBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var ufoBoss = gameObject as UfoBoss;
				ufoBoss.setPosition(0, ufoBoss.height * -1);
				ufoBoss.reset();
				ufoBoss.health = this._ufoBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this._ufoBossCheckpoint.increaseThreasholdLimit(this._ufoBossReleasePoint_increase, this._gameScoreBar.getScore());

				this._bossHealthBar.setMaximumValue(ufoBoss.health);
				this._bossHealthBar.setValue(ufoBoss.health);
				this._bossHealthBar.setIcon(ufoBoss.getGameObjectSprite().getTexture());

				this.generateInterimScreen("Scarlet Saucer Arrived");
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

				if (ufoBoss.isAttacking) {

					ufoBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * Manager.scaling, this._player.getCloseBounds());

					if (Constants.checkCloseCollision(this._player, ufoBoss)) {
						this.loosePlayerHealth();
					}
				}
				else {

					ufoBoss.moveDownRight();

					if (ufoBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling / 3)) // bring UfoBoss to a suitable distance from player and then start attacking
					{
						ufoBoss.isAttacking = true;
					}
				}
			}

			if (ufoBoss.isShrinkingComplete()) {
				gameObject.disableRendering();
			}
		}
	}

	private looseUfoBosshealth(ufoBoss: UfoBoss) {

		ufoBoss.setPopping();
		ufoBoss.looseHealth();
		ufoBoss.setHitStance();

		this._bossHealthBar.setValue(ufoBoss.health);

		if (ufoBoss.isDead()) {

			this._player.setWinStance();
			this._gameScoreBar.gainScore(3);
			this.levelUp();
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
			gameObject.width = this.ufoBossRocketSizeWidth;
			gameObject.height = this.ufoBossRocketSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoBossRocketSizeWidth;
			sprite.height = this.ufoBossRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoBossRocketGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
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

					this.setBossRocketDirection(ufoBoss, ufoBossRocket, this._player);
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
					gameObject.expand();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (Constants.checkCloseCollision(gameObject, this._player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
						ufoBoss?.setWinStance();
					}

					if (gameObject.autoBlast())
						gameObject.setBlast();
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	setBossRocketDirection(source: GameObject, rocket: GameObject, rocketTarget: GameObject) {

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
			gameObject.width = this.ufoBossRocketSeekingSizeWidth;
			gameObject.height = this.ufoBossRocketSeekingSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.UFO_BOSS_ROCKET_SEEKING));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.ufoBossRocketSeekingSizeWidth;
			sprite.height = this.ufoBossRocketSeekingSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.ufoBossRocketSeekingGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
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
					gameObject.expand();
					gameObject.fade();
					gameObject.moveDownRight();
				}
				else {

					gameObject.pop();

					let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (ufoBoss) {
						ufoBossRocketSeeking.seek(this._player.getCloseBounds());

						if (Constants.checkCloseCollision(gameObject, this._player)) {
							gameObject.setBlast();
							this.loosePlayerHealth();
							ufoBoss.setWinStance();
						}
						else {
							if (gameObject.autoBlast())
								gameObject.setBlast();
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
		gameObject.width = this.zombieBossSizeWidth;
		gameObject.height = this.zombieBossSizeHeight;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.zombieBossSizeWidth;
		sprite.height = this.zombieBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.zombieBossGameObjects.push(gameObject);
		this._sceneContainer.addChild(gameObject);
	}

	private generateZombieBoss() {

		if (this._zombieBossCheckpoint.shouldRelease(this._gameScoreBar.getScore()) && !this.zombieBossExists()) {

			var gameObject = this.zombieBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var zombieBoss = gameObject as ZombieBoss;
				zombieBoss.setPosition(0, zombieBoss.height * -1);
				zombieBoss.reset();
				zombieBoss.health = this._zombieBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this._zombieBossCheckpoint.increaseThreasholdLimit(this._zombieBossReleasePoint_increase, this._gameScoreBar.getScore());

				this._bossHealthBar.setMaximumValue(zombieBoss.health);
				this._bossHealthBar.setValue(zombieBoss.health);
				this._bossHealthBar.setIcon(zombieBoss.getGameObjectSprite().getTexture());

				this.generateInterimScreen("Zombie Blocks Arrived");
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

				if (zombieBoss.isAttacking) {

					zombieBoss.moveUpRightDownLeft(Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * Manager.scaling);

					if (Constants.checkCloseCollision(this._player, zombieBoss)) {
						this.loosePlayerHealth();
					}
				}
				else {

					zombieBoss.moveDownRight();

					if (zombieBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling / 3)) // bring ZombieBoss to a suitable distance from player and then start attacking
					{
						zombieBoss.isAttacking = true;
					}
				}
			}

			if (zombieBoss.isShrinkingComplete()) {
				gameObject.disableRendering();
			}
		}
	}

	private looseZombieBosshealth(zombieBoss: ZombieBoss) {

		zombieBoss.setPopping();
		zombieBoss.looseHealth();
		zombieBoss.setHitStance();

		this._bossHealthBar.setValue(zombieBoss.health);

		if (zombieBoss.isDead()) {

			this._player.setWinStance();
			this._gameScoreBar.gainScore(3);
			this.levelUp();
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
			gameObject.width = this.zombieBossRocketBlockSizeWidth;
			gameObject.height = this.zombieBossRocketBlockSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ZOMBIE_BOSS_ROCKET_BLOCK));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.zombieBossRocketBlockSizeWidth;
			sprite.height = this.zombieBossRocketBlockSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.zombieBossRocketBlockGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
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
					gameObject.expand();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					if (Constants.checkCloseCollision(gameObject, this._player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
					}

					if (gameObject.autoBlast())
						gameObject.setBlast();
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
		gameObject.width = this.mafiaBossSizeWidth;
		gameObject.height = this.mafiaBossSizeHeight;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.mafiaBossSizeWidth;
		sprite.height = this.mafiaBossSizeHeight;

		sprite.anchor.set(0.5, 0.5);

		gameObject.addChild(sprite);

		this.mafiaBossGameObjects.push(gameObject);
		this._sceneContainer.addChild(gameObject);
	}

	private generateMafiaBoss() {

		if (this._mafiaBossCheckpoint.shouldRelease(this._gameScoreBar.getScore()) && !this.mafiaBossExists()) {

			var gameObject = this.mafiaBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var mafiaBoss = gameObject as MafiaBoss;
				mafiaBoss.setPosition(0, mafiaBoss.height * -1);
				mafiaBoss.reset();
				mafiaBoss.health = this._mafiaBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this._mafiaBossCheckpoint.increaseThreasholdLimit(this._mafiaBossReleasePoint_increase, this._gameScoreBar.getScore());

				this._bossHealthBar.setMaximumValue(mafiaBoss.health);
				this._bossHealthBar.setValue(mafiaBoss.health);
				this._bossHealthBar.setIcon(mafiaBoss.getGameObjectSprite().getTexture());

				this.generateInterimScreen("Beware of Crimson Mafia");
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

				if (mafiaBoss.isAttacking) {

					mafiaBoss.move(Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling, Constants.DEFAULT_GAME_VIEW_HEIGHT * Manager.scaling, this._player.getCloseBounds());

					if (Constants.checkCloseCollision(this._player, mafiaBoss)) {
						this.loosePlayerHealth();
					}
				}
				else {

					mafiaBoss.moveDownRight();

					if (mafiaBoss.getLeft() > (Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling / 3)) // bring MafiaBoss to a suitable distance from player and then start attacking
					{
						mafiaBoss.isAttacking = true;
					}
				}
			}

			if (mafiaBoss.isShrinkingComplete()) {
				gameObject.disableRendering();
			}
		}
	}

	private looseMafiaBosshealth(mafiaBoss: MafiaBoss) {

		mafiaBoss.setPopping();
		mafiaBoss.looseHealth();
		mafiaBoss.setHitStance();

		this._bossHealthBar.setValue(mafiaBoss.health);

		if (mafiaBoss.isDead()) {

			this._player.setWinStance();
			this._gameScoreBar.gainScore(3);
			this.levelUp();
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
			gameObject.width = this.mafiaBossRocketSizeWidth;
			gameObject.height = this.mafiaBossRocketSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.mafiaBossRocketSizeWidth;
			sprite.height = this.mafiaBossRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.mafiaBossRocketGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
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

					this.setBossRocketDirection(mafiaBoss, mafiaBossRocket, this._player);
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
					gameObject.expand();
					gameObject.fade();
				}
				else {

					gameObject.pop();
					gameObject.hover();

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (Constants.checkCloseCollision(gameObject, this._player)) {
						gameObject.setBlast();
						this.loosePlayerHealth();
						mafiaBoss?.setWinStance();
					}

					if (gameObject.autoBlast())
						gameObject.setBlast();
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
			gameObject.width = this.mafiaBossRocketBullsEyeSizeWidth;
			gameObject.height = this.mafiaBossRocketBullsEyeSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.MAFIA_BOSS_ROCKET_BULLS_EYE));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.mafiaBossRocketBullsEyeSizeWidth;
			sprite.height = this.mafiaBossRocketBullsEyeSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.mafiaBossRocketBullsEyeGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
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
					mafiaBossRocketBullsEye.setTarget(this._player.getCloseBounds());
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
					gameObject.expand();
					gameObject.fade();
					gameObject.moveDownRight();
				}
				else {

					gameObject.pop();
					gameObject.rotate(RotationDirection.Forward, 0, 2.5);

					let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

					if (mafiaBoss) {
						mafiaBossRocketBullsEye.move();

						if (Constants.checkCloseCollision(gameObject, this._player)) {
							gameObject.setBlast();
							this.loosePlayerHealth();
							mafiaBoss.setWinStance();
						}
						else {
							if (gameObject.autoBlast())
								gameObject.setBlast();
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

	//#region Honks	

	private roadHonkSizeWidth: number = 125;
	private roadHonkSizeHeight: number = 125;

	private roadHonkGameObjects: Array<GameObject> = [];

	private spawnHonks() {

		for (let j = 0; j < 5; j++) {

			const gameObject: Honk = new Honk(0);
			gameObject.disableRendering();
			gameObject.width = this.roadHonkSizeWidth;
			gameObject.height = this.roadHonkSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HONK));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.roadHonkSizeWidth;
			sprite.height = this.roadHonkSizeHeight;

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.roadHonkGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateHonk(source: GameObject) {

		var gameObject = this.roadHonkGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {

			var honk = gameObject as Honk;
			honk.reset();
			honk.reposition(source);
			honk.setPopping();
			//source.setPopping();

			gameObject.enableRendering();
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

	//#region PlayerBalloon

	private playerBalloonSizeWidth: number = 150;
	private playerBalloonSizeHeight: number = 150;

	private _player: PlayerBalloon = new PlayerBalloon(Constants.DEFAULT_CONSTRUCT_SPEED);

	spawnPlayerBalloon() {

		let playerTemplate = Constants.getRandomNumber(0, 1);
		this._player.disableRendering();

		this._player.width = this.playerBalloonSizeWidth;
		this._player.height = this.playerBalloonSizeHeight;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.playerBalloonSizeWidth;
		sprite.height = this.playerBalloonSizeWidth;
		sprite.anchor.set(0.5, 0.5);

		this._player.addChild(sprite);
		this._player.setPlayerTemplate(playerTemplate);

		this._sceneContainer.addChild(this._player);
	}

	generatePlayerBalloon() {
		this._player.reset();
		this._player.reposition();
		this._player.enableRendering();
	}

	animatePlayerBalloon() {
		this._player.pop();
		this._player.hover();
		this._player.depleteAttackStance();
		this._player.depleteWinStance();
		this._player.depleteHitStance();
		this._player.recoverFromHealthLoss();

		this._player.move(
			Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling,
			Constants.DEFAULT_GAME_VIEW_HEIGHT * Manager.scaling,
			this._gameController);

		if (this._gameController.isAttacking) {

			if (this.anyInAirBossExists()) {
				this.generatePlayerRocket();
			}
			else {
				this.generatePlayerHonkBomb();
			}

			this._gameController.isAttacking = false;
		}
	}

	loosePlayerHealth() {
		this._player.setPopping();

		this._player.looseHealth();
		this._player.setHitStance();

		this._playerHealthBar.setValue(this._player.health);

		if (this.anyBossExists()) {
			//let vehicleBoss = this.vehicleBossGameObjects.find(x => x.isAnimating && x.isAttacking);

			//if (vehicleBoss)
		}
	}

	//#endregion

	//#region PlayerHonkBombs

	private playerHonkBombSizeWidth: number = 45;
	private playerHonkBombSizeHeight: number = 45;

	private playerHonkBombGameObjects: Array<GameObject> = [];

	spawnPlayerHonkBombs() {

		let playerHonkBombTemplate = Constants.getRandomNumber(0, 1);

		for (let j = 0; j < 3; j++) {

			const gameObject: PlayerHonkBomb = new PlayerHonkBomb(4);
			gameObject.disableRendering();
			gameObject.width = this.playerHonkBombSizeWidth;
			gameObject.height = this.playerHonkBombSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_HONK_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerHonkBombSizeWidth;
			sprite.height = this.playerHonkBombSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			gameObject.setHonkBombTemplate(playerHonkBombTemplate);

			this.playerHonkBombGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	generatePlayerHonkBomb() {

		var gameObject = this.playerHonkBombGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {

			var playerHonkBomb = gameObject as PlayerHonkBomb;
			playerHonkBomb.reset();
			playerHonkBomb.reposition(this._player);
			playerHonkBomb.setPopping();

			gameObject.enableRendering();

			this._player.setAttackStance();
		}
	}

	animatePlayerHonkBomb() {

		var animatingHonkBombs = this.playerHonkBombGameObjects.filter(x => x.isAnimating == true);

		if (animatingHonkBombs) {

			animatingHonkBombs.forEach(gameObject => {

				gameObject.pop();

				var playerHonkBomb = gameObject as PlayerHonkBomb;

				if (playerHonkBomb) {

					if (playerHonkBomb.isBlasting) {

						playerHonkBomb.expand();
						playerHonkBomb.fade();
						playerHonkBomb.moveDownRight();

					}
					else {

						playerHonkBomb.setPosition(
							playerHonkBomb.x + playerHonkBomb.speed,
							playerHonkBomb.y + playerHonkBomb.speed * 1.2
						);

						if (playerHonkBomb.depleteBlastDelay()) {

							let vehicleEnemy = this.vehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerHonkBomb));

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

				if (gameObject.hasFaded()) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region PlayerRockets

	private playerRocketSizeWidth: number = 90;
	private playerRocketSizeHeight: number = 90;

	private playerRocketGameObjects: Array<GameObject> = [];

	spawnPlayerRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: PlayerRocket = new PlayerRocket(4);
			gameObject.disableRendering();
			gameObject.width = this.playerRocketSizeWidth;
			gameObject.height = this.playerRocketSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_ROCKET));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.playerRocketSizeWidth;
			sprite.height = this.playerRocketSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			this.playerRocketGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	generatePlayerRocket() {

		var gameObject = this.playerRocketGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {

			var playerRocket = gameObject as PlayerRocket;
			playerRocket.reset();
			playerRocket.reposition(this._player);
			playerRocket.setPopping();

			gameObject.enableRendering();

			this._player.setAttackStance();

			//TODO: check more enemy types to set direction
			let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating && x.isAttacking);
			let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating && x.isAttacking);

			let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating);

			if (ufoBossRocketSeeking) {
				this.setPlayerRocketDirection(this._player, playerRocket, ufoBossRocketSeeking);
			}
			else if (ufoBoss) {
				this.setPlayerRocketDirection(this._player, playerRocket, ufoBoss);
			}
			else if (zombieBoss) {
				this.setPlayerRocketDirection(this._player, playerRocket, zombieBoss);
			}
			else if (mafiaBoss) {
				this.setPlayerRocketDirection(this._player, playerRocket, mafiaBoss);
			}
		}
	}

	animatePlayerRocket() {

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
						playerRocket.expand();
						playerRocket.fade();
					}
					else {

						playerRocket.hover();

						//TODO: check collision for more enemy types

						let ufoBoss = this.ufoBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));
						let ufoBossRocketSeeking = this.ufoBossRocketSeekingGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerRocket));

						let zombieBoss = this.zombieBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));
						let zombieBossRocketBlock = this.zombieBossRocketBlockGameObjects.find(x => x.isAnimating == true && !x.isBlasting == true && Constants.checkCloseCollision(x, playerRocket));

						let mafiaBoss = this.mafiaBossGameObjects.find(x => x.isAnimating == true && x.isAttacking == true && Constants.checkCloseCollision(x, playerRocket));

						if (ufoBossRocketSeeking) {
							playerRocket.setBlast();
							ufoBossRocketSeeking.setBlast();
						}
						else if (ufoBoss) {
							playerRocket.setBlast();
							this.looseUfoBosshealth(ufoBoss as UfoBoss);
						}
						else if (zombieBossRocketBlock) {
							playerRocket.setBlast();
							zombieBossRocketBlock.looseHealth();
						}
						else if (zombieBoss) {
							playerRocket.setBlast();
							this.looseZombieBosshealth(zombieBoss as ZombieBoss);
						}
						else if (mafiaBoss) {
							playerRocket.setBlast();
							this.looseMafiaBosshealth(mafiaBoss as MafiaBoss);
						}

						if (playerRocket.autoBlast())
							playerRocket.setBlast();
					}
				}

				if (gameObject.hasFaded() || gameObject.x > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.getRight() < 0 || gameObject.getBottom() < 0 || gameObject.getTop() > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	setPlayerRocketDirection(source: GameObject, rocket: GameObject, rocketTarget: GameObject) {

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

	//#region HealthPickups	

	private healthPickupSizeWidth: number = 327 / 3;
	private healthPickupSizeHeight: number = 327 / 3;

	private healthPickupGameObjects: Array<HealthPickup> = [];

	private healthPickupPopDelayDefault: number = 100 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private healthPickupPopDelay: number = 0;

	private spawnHealthPickups() {

		for (let j = 0; j < 3; j++) {

			const gameObject: HealthPickup = new HealthPickup(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 1));
			gameObject.disableRendering();
			gameObject.width = this.healthPickupSizeWidth;
			gameObject.height = this.healthPickupSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.healthPickupSizeWidth;
			sprite.height = this.healthPickupSizeHeight;
			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.healthPickupGameObjects.push(gameObject);
			this._sceneContainer.addChild(gameObject);
		}
	}

	private generateHealthPickups() {

		if (HealthPickup.shouldGenerate(this._player.health)) {
			this.healthPickupPopDelay -= 0.1;

			if (this.healthPickupPopDelay < 0) {

				var gameObject = this.healthPickupGameObjects.find(x => x.isAnimating == false);

				if (gameObject) {

					gameObject.reset();

					var healthPickup = gameObject as HealthPickup;

					if (healthPickup) {
						var topOrLeft = Constants.getRandomNumber(0, 1);

						switch (topOrLeft) {
							case 0:
								{
									var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;
									healthPickup.setPosition(Constants.getRandomNumber(0, xLaneWidth - healthPickup.width), healthPickup.height * -1);
								}
								break;
							case 1:
								{
									var yLaneWidth = (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2) / 2;
									healthPickup.setPosition(healthPickup.width * -1, Constants.getRandomNumber(0, yLaneWidth));
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

					if (Constants.checkCloseCollision(gameObject, this._player)) {
						gameObject.pickedUp();

						this._player.gainhealth();
						this._playerHealthBar.setValue(this._player.health);
					}
				}

				if (gameObject.isShrinkingComplete() || gameObject.x - gameObject.width > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - gameObject.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#region GameController

	setGameController() {

		this._gameController.height = Manager.height;
		this._gameController.width = Manager.width;

		this.addChild(this._gameController);
	}

	//#endregion

	//#region GameScoreBar

	private repositionGameScoreBar() {
		this._gameScoreBar.reposition((Manager.width) / 2, 10);
	}

	//#endregion

	//#region HealthBars

	private repositionPlayerHealthBar() {
		this._playerHealthBar.reposition((Manager.width) - 105, 10);
	}

	private repositionVehicleBossHealthBar() {
		this._bossHealthBar.reposition((Manager.width) - 205, 10);
	}

	//#endregion

	//#region InterimScreen

	private generateInterimScreen(title: string) {
		if (this._interimScreen.isAnimating == false) {
			this._interimScreen.setTitle(title);
			this._interimScreen.reset();
			this._interimScreen.reposition(Manager.width / 2, Manager.height / 2);
			this._interimScreen.enableRendering();
		}
	}

	private animateInterimScreen() {
		if (this._interimScreen.isAnimating == true) {
			this._interimScreen.depleteOnScreenDelay();

			if (this._interimScreen.isDepleted()) {
				this._interimScreen.disableRendering();
			}
		}
	}

	//#endregion

	//#region Scene

	public update(_framesPassed: number) {

		this.generateGameObjects();
		this.animateGameObjects();

		this._gameController.update();
		this.animatePlayerBalloon();
	}

	public resize(scale: number): void {
		this._sceneContainer.scale.set(scale);
		this.repositionGameScoreBar();
		this.repositionPlayerHealthBar();
	}

	private levelUp() {
		this._gameLevel++;
		this.generateInterimScreen("LEVEL " + this._gameLevel.toString() + " COMPLETE");
	}

	private generateGameObjects() {

		this.generateRoadMarks();
		this.generateSideWalksTop();
		//this.generateHeavyBillboardsTop();
		this.generateLightBillboardsTop();
		this.generateHedgesTop();
		this.generateTreesTop();
		this.generateLampsTop();

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

		this.generateHealthPickups();

		this.generateClouds();

		this.generateSideWalksBottom();
		this.generateHedgesBottom();
		this.generateLightBillboardsBottom();
		this.generateTreesBottom();
		this.generateLampsBottom();
	}

	private animateGameObjects() {

		this.animateRoadMarks();

		this.animateSideWalksTop();
		this.animateHedgesTop();
		this.animateTreesTop();
		//this.animateHeavyBillboardsTop();
		this.animateLightBillboardsTop();
		this.animateLampsTop();

		this.animateVehicleEnemys();
		this.animateVehicleBoss();
		this.animateVehicleBossRockets();

		this.animateHonks();

		this.animateSideWalksBottom();
		this.animateHedgesBottom();
		this.animateTreesBottom();
		this.animateLightBillboardsBottom();
		this.animateLampsBottom();

		this.animatePlayerHonkBomb();
		this.animatePlayerRocket();

		this.animateUfoBoss();
		this.animateUfoBossRockets();
		this.animateUfoBossRocketSeekings();

		this.animateZombieBoss();
		this.animateZombieBossRocketBlocks();

		this.animateMafiaBoss();
		this.animateMafiaBossRockets();
		this.animateMafiaBossRocketBullsEyes();

		this.animateHealthPickups();

		this.animateClouds();
		this.animateInterimScreen();
	}

	private anyBossExists(): boolean {
		return (this.ufoBossExists() || this.vehicleBossExists() || this.zombieBossExists() || this.mafiaBossExists());
	}

	private anyInAirBossExists(): boolean {
		return (this.ufoBossExists() || this.zombieBossExists() || this.mafiaBossExists());
	}

	//#endregion

	//#endregion
}