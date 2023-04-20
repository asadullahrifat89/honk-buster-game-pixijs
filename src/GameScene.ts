import { Container, Texture } from "pixi.js";
import { IScene } from "./IScene";
import { GameObjectSprite } from './GameObjectSprite';
import { GameObject } from './GameObject';
import { Cloud } from "./Cloud";
import { Constants, ConstructType } from './Constants';
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


export class GameScene extends Container implements IScene {

	//#region Properties

	private _gameController: GameController = new GameController();
	private _gameScoreBar: GameScoreBar;
	private _interimScreen: InterimScreen;
	private _sceneContainer: Container = new Container();


	//TODO: set defaults _vehicleReleasePoint = 25
	private readonly _vehicleBossReleasePoint: number = 25; // first appearance
	private readonly _vehicleBossReleasePoint_increase: number = 15;

	private readonly _vehicleBossCheckpoint: GameCheckpoint;

	private _playerHealthBar: HealthBar;
	private _vehicleBossHealthBar: HealthBar;

	private _gameLevel: number = 0;

	//#endregion

	//#region Methods

	//#region Constructor

	constructor() {
		super();

		this._vehicleBossCheckpoint = new GameCheckpoint(this._vehicleBossReleasePoint);

		this.spawnRoadMarks();

		this.spawnSideWalksTop();
		this.spawnHedgesTop();
		this.spawnTreesTop();
		//this.spawnHeavyBillboardsTop();
		this.spawnLightBillboardsTop();

		this.spawnVehicleEnemys();
		this.spawnVehicleBosss();
		this.spawnHonks();
		this.spawnVehicleBossRockets();

		this.spawnSideWalksBottom();
		this.spawnHedgesBottom();
		this.spawnLightBillboardsBottom();
		this.spawnTreesBottom();

		this.spawnPlayerHonkBombs();
		this.spawnPlayerBalloon();
		this.generatePlayerBalloon();

		this.spawnClouds();

		this._sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH;
		this._sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT;

		this.addChild(this._sceneContainer);

		this._gameScoreBar = new GameScoreBar(this);
		this.repositionGameScoreBar();

		this._playerHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.HEALTH_PICKUP), this);
		this._playerHealthBar.setMaximumValue(100);
		this._playerHealthBar.setValue(100);
		this.repositionPlayerHealthBar();

		this._vehicleBossHealthBar = new HealthBar(Constants.getRandomTexture(ConstructType.VEHICLE_ENEMY_LARGE), this);
		this._vehicleBossHealthBar.setMaximumValue(100);
		this._vehicleBossHealthBar.setValue(0);
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

	private treePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
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

			// gameObject.filters = [new DropShadowFilter()];

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

			// add trees to the tree bottom gameObject
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
				gameObject.setPosition(-480, gameObject.height * -1);
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
				gameObject.x = gameObject.width * -1;
				gameObject.y = -330;
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

	////		// add trees to the tree bottom gameObject
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

	private vehicleEnemySizeWidth: number = 245;
	private vehicleEnemySizeHeight: number = 245;

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

	private vehicleBossSizeWidth: number = 245;
	private vehicleBossSizeHeight: number = 245;

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

	private generateVehicleBosss() {

		if (this._vehicleBossCheckpoint.shouldRelease(this._gameScoreBar.getScore()) && !this.vehicleBossExists()) {

			var gameObject = this.vehicleBossGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var vehicleBoss = gameObject as VehicleBoss;
				vehicleBoss.reposition();
				vehicleBoss.reset();
				vehicleBoss.health = this._vehicleBossCheckpoint.getReleasePointDifference() * 1.5;

				gameObject.enableRendering();

				this._vehicleBossCheckpoint.increaseThreasholdLimit(this._vehicleBossReleasePoint_increase, this._gameScoreBar.getScore());

				//TODO: set vehicle boss health bar

				this._vehicleBossHealthBar.setMaximumValue(vehicleBoss.health);
				this._vehicleBossHealthBar.setValue(vehicleBoss.health);
				this._vehicleBossHealthBar.setIcon(vehicleBoss.getGameObjectSprite().getTexture());

				this.generateInterimScreen("Crazy Honker Arrived");
			}
		}
	}

	private animateVehicleBosss() {

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

		this._vehicleBossHealthBar.setValue(vehicleBoss.health);

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

	private vehicleBossRocketPopDelayDefault: number = 20 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private vehicleBossRocketPopDelay: number = 0;

	spawnVehicleBossRockets() {

		for (let j = 0; j < 3; j++) {

			const gameObject: VehicleBossRocket = new VehicleBossRocket(Constants.DEFAULT_CONSTRUCT_SPEED / 2);
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
					gameObject.dillyDally();

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

	//#region Honks	

	private roadHonkSizeWidth: number = 128;
	private roadHonkSizeHeight: number = 128;

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

			source.setPopping();

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
			this.generatePlayerHonkBomb();
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
		this._vehicleBossHealthBar.reposition((Manager.width) - 205, 10);
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

	public update(_framesPassed: number): void {

		this.generateRoadMarks();
		this.generateSideWalksTop();
		//this.generateHeavyBillboardsTop();
		this.generateLightBillboardsTop();
		this.generateHedgesTop();
		this.generateTreesTop();

		this.generateVehicleEnemys();
		this.generateVehicleBosss();
		this.generateVehicleBossRockets();

		this.generateClouds();

		this.generateSideWalksBottom();
		this.generateHedgesBottom();
		this.generateLightBillboardsBottom();
		this.generateTreesBottom();

		this.animateRoadMarks();

		this.animateSideWalksTop();
		this.animateHedgesTop();
		this.animateTreesTop();
		//this.animateHeavyBillboardsTop();
		this.animateLightBillboardsTop();

		this.animateVehicleEnemys();
		this.animateVehicleBosss();
		this.animateVehicleBossRockets();
		this.animateHonks();

		this.animateSideWalksBottom();
		this.animateHedgesBottom();
		this.animateTreesBottom();
		this.animateLightBillboardsBottom();

		this.animateClouds();
		this.animatePlayerHonkBomb();

		this.animateInterimScreen();

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

	private anyBossExists(): boolean {
		return (/*UfoBossExists() ||*/ this.vehicleBossExists() /*|| ZombieBossExists() || MafiaBossExists()*/);
	}

	//#endregion

	//#endregion
}