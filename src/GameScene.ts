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


export class GameScene extends Container implements IScene {

	//#region Propperties

	private gameController: GameController = new GameController();
	private gameScoreBar: GameScoreBar;
	private sceneContainer: Container = new Container();


	//TODO: set defaults _vehicleReleasePoint = 25
	private readonly _vehicleBossReleasePoint: number = 25; // first appearance
	private readonly _vehicleBossReleasePoint_increase: number = 15;

	private readonly _vehicleBossCheckpoint: GameCheckpoint;
	//TODO: create a new gameObject and add every game object in that gameObject and leave the UI controls in the main scene

	//#endregion

	//#region Ctor

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
		this.spawnHonks();

		this.spawnSideWalksBottom();
		this.spawnHedgesBottom();
		this.spawnLightBillboardsBottom();
		this.spawnTreesBottom();

		this.spawnPlayerHonkBombs();
		this.spawnPlayerBalloon();
		this.generatePlayerBalloon();

		this.spawnClouds();

		this.sceneContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH;
		this.sceneContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT;

		this.addChild(this.sceneContainer);

		this.gameScoreBar = new GameScoreBar(this);
		this.repositionGameScoreBar();

		this.setGameController();
	}

	//#endregion

	//#region Methods

	//#region RoadMarks

	private roadRoadMarkXyAdjustment: number = 19;

	private roadRoadMarkSizeWidth: number = 256;
	private roadRoadMarkSizeHeight: number = 256;

	private roadRoadMarkGameObjects: Array<GameObject> = [];

	private roadRoadMarkPopDelayDefault: number = 39.5 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadRoadMarkPopDelay: number = 0;

	private spawnRoadMarks() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadRoadMarkSizeWidth * 5;
			gameObject.height = this.roadRoadMarkSizeHeight / 2 * 5;

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_MARK));

				sprite.x = this.roadRoadMarkSizeWidth * i - (this.roadRoadMarkXyAdjustment * i);
				sprite.y = (this.roadRoadMarkSizeHeight / 2) * i - ((this.roadRoadMarkXyAdjustment / 2) * i);
				sprite.width = this.roadRoadMarkSizeWidth;
				sprite.height = this.roadRoadMarkSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadRoadMarkGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateRoadMarks() {

		this.roadRoadMarkPopDelay -= 0.1;

		if (this.roadRoadMarkPopDelay < 0) {

			var gameObject = this.roadRoadMarkGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				gameObject.setPosition(gameObject.width * - 1.1, gameObject.height * -1);
				gameObject.enableRendering();

				this.roadRoadMarkPopDelay = this.roadRoadMarkPopDelayDefault;
			}
		}
	}

	private animateRoadMarks() {

		var animatingRoadMarks = this.roadRoadMarkGameObjects.filter(x => x.isAnimating == true);

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

	private roadTreeXyAdjustment: number = 85.5;

	private roadTreeSizeWidth: number = 450;
	private roadTreeSizeHeight: number = 450;

	private roadTreeBottomGameObjects: Array<GameObject> = [];
	private roadTreeTopGameObjects: Array<GameObject> = [];

	private roadTreePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadTreePopDelayTop: number = 0;
	private roadTreePopDelayBottom: number = 0;

	private spawnTreesTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadTreeSizeWidth * 5;
			gameObject.height = this.roadTreeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_TREE));

				sprite.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				sprite.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				sprite.width = this.roadTreeSizeWidth;
				sprite.height = this.roadTreeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadTreeTopGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private spawnTreesBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadTreeSizeWidth * 5;
			gameObject.height = this.roadTreeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				sprite.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				sprite.width = this.roadTreeSizeWidth;
				sprite.height = this.roadTreeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadTreeBottomGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateTreesTop() {

		this.roadTreePopDelayTop -= 0.1;

		if (this.roadTreePopDelayTop < 0) {

			var gameObject = this.roadTreeTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-850, gameObject.height * -1);
				gameObject.enableRendering();
				this.roadTreePopDelayTop = this.roadTreePopDelayDefault;
			}
		}
	}

	private generateTreesBottom() {

		this.roadTreePopDelayBottom -= 0.1;

		if (this.roadTreePopDelayBottom < 0) {

			var gameObject = this.roadTreeBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(gameObject.width * -1, -570);
				gameObject.enableRendering();
				this.roadTreePopDelayBottom = this.roadTreePopDelayDefault;
			}
		}
	}

	private animateTreesTop() {

		var animatingTrees = this.roadTreeTopGameObjects.filter(x => x.isAnimating == true);

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

		var animatingTrees = this.roadTreeBottomGameObjects.filter(x => x.isAnimating == true);

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

	private roadHedgeXyAdjustment: number = 30.5;

	private roadHedgeSizeWidth: number = 450;
	private roadHedgeSizeHeight: number = 450;

	private roadHedgeBottomGameObjects: Array<GameObject> = [];
	private roadHedgeTopGameObjects: Array<GameObject> = [];

	private roadHedgePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadHedgePopDelayTop: number = 0;
	private roadHedgePopDelayBottom: number = 0;

	private spawnHedgesTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadHedgeSizeWidth * 5;
			gameObject.height = this.roadHedgeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add hedges to the hedge top gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_HEDGE));

				sprite.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				sprite.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				sprite.width = this.roadHedgeSizeWidth;
				sprite.height = this.roadHedgeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadHedgeTopGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private spawnHedgesBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadHedgeSizeWidth * 5;
			gameObject.height = this.roadHedgeSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add hedges to the hedge bottom gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_HEDGE));

				sprite.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				sprite.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				sprite.width = this.roadHedgeSizeWidth;
				sprite.height = this.roadHedgeSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadHedgeBottomGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateHedgesTop() {

		this.roadHedgePopDelayTop -= 0.1;

		if (this.roadHedgePopDelayTop < 0) {

			var gameObject = this.roadHedgeTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-1430, gameObject.height * -1);
				gameObject.enableRendering();
				this.roadHedgePopDelayTop = this.roadHedgePopDelayDefault;
			}
		}
	}

	private generateHedgesBottom() {

		this.roadHedgePopDelayBottom -= 0.1;

		if (this.roadHedgePopDelayBottom < 0) {

			var gameObject = this.roadHedgeBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(gameObject.width * -1, -710);
				gameObject.enableRendering();
				this.roadHedgePopDelayBottom = this.roadHedgePopDelayDefault;

				// console.log("Hedge bottom gameObject popped.");
			}
		}
	}

	private animateHedgesTop() {

		var animatingHedges = this.roadHedgeTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateHedgesBottom() {

		var animatingHedges = this.roadHedgeBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region LightBillboards

	private roadLightBillboardXyAdjustment: number = 31.5;
	private roadLightBillboardXyDistance = 250;

	private roadLightBillboardSizeWidth: number = 128;
	private roadLightBillboardSizeHeight: number = 128;

	private roadLightBillboardBottomGameObjects: Array<GameObject> = [];
	private roadLightBillboardTopGameObjects: Array<GameObject> = [];

	private roadLightBillboardPopDelayDefault: number = 57 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadLightBillboardPopDelayTop: number = 0;
	private roadLightBillboardPopDelayBottom: number = 0;

	private spawnLightBillboardsTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadLightBillboardSizeWidth * 5;
			gameObject.height = this.roadLightBillboardSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD));

				sprite.x = (this.roadLightBillboardSizeWidth * i - (this.roadLightBillboardXyAdjustment * i)) + (this.roadLightBillboardXyDistance * i);
				sprite.y = ((this.roadLightBillboardSizeHeight / 2) * i - ((this.roadLightBillboardXyAdjustment / 2) * i)) + (this.roadLightBillboardXyDistance / 2 * i);
				sprite.width = this.roadLightBillboardSizeWidth;
				sprite.height = this.roadLightBillboardSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadLightBillboardTopGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private spawnLightBillboardsBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadLightBillboardSizeWidth * 5;
			gameObject.height = this.roadLightBillboardSizeHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add trees to the tree bottom gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD));

				sprite.x = (this.roadLightBillboardSizeWidth * i - (this.roadLightBillboardXyAdjustment * i)) + (this.roadLightBillboardXyDistance * i);
				sprite.y = ((this.roadLightBillboardSizeHeight / 2) * i - ((this.roadLightBillboardXyAdjustment / 2) * i)) + (this.roadLightBillboardXyDistance / 2 * i);
				sprite.width = this.roadLightBillboardSizeWidth;
				sprite.height = this.roadLightBillboardSizeHeight;

				gameObject.addChild(sprite);
			}

			this.roadLightBillboardBottomGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateLightBillboardsTop() {

		this.roadLightBillboardPopDelayTop -= 0.1;

		if (this.roadLightBillboardPopDelayTop < 0) {

			var gameObject = this.roadLightBillboardTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.setPosition(-480, gameObject.height * -1);
				gameObject.enableRendering();
				this.roadLightBillboardPopDelayTop = this.roadLightBillboardPopDelayDefault;
			}
		}
	}

	private generateLightBillboardsBottom() {

		this.roadLightBillboardPopDelayBottom -= 0.1;

		if (this.roadLightBillboardPopDelayBottom < 0) {

			var gameObject = this.roadLightBillboardBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = gameObject.width * -1;
				gameObject.y = -330;
				gameObject.enableRendering();
				this.roadLightBillboardPopDelayBottom = this.roadLightBillboardPopDelayDefault;
			}
		}
	}

	private animateLightBillboardsTop() {

		var animatingLightBillboards = this.roadLightBillboardTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingLightBillboards) {

			animatingLightBillboards.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.roadLightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateLightBillboardsBottom() {

		var animatingLightBillboards = this.roadLightBillboardBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingLightBillboards) {

			animatingLightBillboards.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - this.roadLightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
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

	private roadSideWalkXyAdjustment: number = 111.5;

	private roadSideWalkWidth: number = 450;
	private roadSideWalkHeight: number = 450;

	private roadSideWalkTopGameObjects: Array<GameObject> = [];
	private roadSideWalkBottomGameObjects: Array<GameObject> = [];

	private roadSideWalkPopDelayDefault: number = 50 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadSideWalkPopDelayTop: number = 0;
	private roadSideWalkPopDelayBottom: number = 0;

	private spawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadSideWalkWidth * 5;
			gameObject.height = this.roadSideWalkHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add sideWalks to the sideWalk top gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK));

				sprite.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sprite.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sprite.width = this.roadSideWalkWidth;
				sprite.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				gameObject.addChild(sprite);
			}

			this.roadSideWalkTopGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private spawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const gameObject: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadSideWalkWidth * 5;
			gameObject.height = this.roadSideWalkHeight / 2 * 5;

			// gameObject.filters = [new DropShadowFilter()];

			// add sideWalks to the sideWalk top gameObject
			for (let i = 0; i < 5; i++) {

				const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.ROAD_SIDE_WALK));

				sprite.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sprite.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sprite.width = this.roadSideWalkWidth;
				sprite.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				gameObject.addChild(sprite);
			}

			this.roadSideWalkBottomGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateSideWalksTop() {

		this.roadSideWalkPopDelayTop -= 0.1;

		if (this.roadSideWalkPopDelayTop < 0) {

			var gameObject = this.roadSideWalkTopGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = -945;
				gameObject.y = gameObject.height * -1;
				gameObject.enableRendering();
				this.roadSideWalkPopDelayTop = this.roadSideWalkPopDelayDefault;
			}
		}
	}

	private generateSideWalksBottom() {

		this.roadSideWalkPopDelayBottom -= 0.1;

		if (this.roadSideWalkPopDelayBottom < 0) {

			var gameObject = this.roadSideWalkBottomGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {
				gameObject.x = gameObject.width * -1;
				gameObject.y = -435;
				gameObject.enableRendering();
				this.roadSideWalkPopDelayBottom = this.roadSideWalkPopDelayDefault;
			}
		}
	}

	private animateSideWalksTop() {

		var animatingSideWalks = this.roadSideWalkTopGameObjects.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	private animateSideWalksBottom() {

		var animatingSideWalks = this.roadSideWalkBottomGameObjects.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(gameObject => {
				gameObject.moveDownRight();

				if (gameObject.x - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || gameObject.y - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					gameObject.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Clouds	

	private roadCloudSizeWidth: number = 512 / 2;
	private roadCloudSizeHeight: number = 350 / 2;

	private roadCloudGameObjects: Array<GameObject> = [];

	private roadCloudPopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadCloudPopDelay: number = 0;

	private spawnClouds() {

		for (let j = 0; j < 5; j++) {

			const gameObject: Cloud = new Cloud(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2));
			gameObject.disableRendering();
			gameObject.width = this.roadCloudSizeWidth;
			gameObject.height = this.roadCloudSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.CLOUD));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.roadCloudSizeWidth;
			sprite.height = this.roadCloudSizeHeight;
			//sprite.filters = [new BlurFilter(4, 10)];
			//cloudContainer.filters = [new BlurFilter(2, 10)];
			gameObject.addChild(sprite);

			this.roadCloudGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateClouds() {

		this.roadCloudPopDelay -= 0.1;

		if (this.roadCloudPopDelay < 0) {

			var gameObject = this.roadCloudGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				gameObject.setTexture(Constants.getRandomTexture(ConstructType.CLOUD));
				gameObject.speed = Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2);

				var cloud = gameObject as Cloud;
				cloud.reposition();

				gameObject.enableRendering();

				this.roadCloudPopDelay = this.roadCloudPopDelayDefault;
			}
		}
	}

	private animateClouds() {

		var animatingClouds = this.roadCloudGameObjects.filter(x => x.isAnimating == true);

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

	private roadVehicleEnemySizeWidth: number = 245;
	private roadVehicleEnemySizeHeight: number = 245;

	private roadVehicleEnemyGameObjects: Array<GameObject> = [];

	private roadVehicleEnemyPopDelayDefault: number = 35 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadVehicleEnemyPopDelay: number = 0;

	private spawnVehicleEnemys() {

		for (let j = 0; j < 10; j++) {

			const gameObject: VehicleEnemy = new VehicleEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			gameObject.disableRendering();
			gameObject.width = this.roadVehicleEnemySizeWidth;
			gameObject.height = this.roadVehicleEnemySizeHeight;

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
			sprite.width = this.roadVehicleEnemySizeWidth;
			sprite.height = this.roadVehicleEnemySizeHeight;

			sprite.anchor.set(0.5, 0.5);

			gameObject.addChild(sprite);

			this.roadVehicleEnemyGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	private generateVehicleEnemys() {

		this.roadVehicleEnemyPopDelay -= 0.1;

		if (this.roadVehicleEnemyPopDelay < 0) {

			var gameObject = this.roadVehicleEnemyGameObjects.find(x => x.isAnimating == false);

			if (gameObject) {

				var vehicleEnemey = gameObject as VehicleEnemy;
				vehicleEnemey.reposition();
				vehicleEnemey.reset();

				gameObject.enableRendering();

				this.roadVehicleEnemyPopDelay = this.roadVehicleEnemyPopDelayDefault;
			}
		}
	}

	private animateVehicleEnemys() {

		var animatingVehicleEnemys = this.roadVehicleEnemyGameObjects.filter(x => x.isAnimating == true);

		if (animatingVehicleEnemys) {

			animatingVehicleEnemys.forEach(gameObject => {

				gameObject.pop();
				gameObject.moveDownRight();

				// prevent overlapping

				var collidingVehicleEnemy = this.roadVehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCollision(x, gameObject));

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
				this.gameScoreBar.gainScore(2);
			}
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
			this.sceneContainer.addChild(gameObject);
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

	//#region PlayerHonkBomb

	private honkBombSizeWidth: number = 45;
	private honkBombSizeHeight: number = 45;

	private honkBombGameObjects: Array<GameObject> = [];

	spawnPlayerHonkBombs() {

		let playerHonkBombTemplate = Constants.getRandomNumber(0, 1);

		for (let j = 0; j < 3; j++) {

			const gameObject: PlayerHonkBomb = new PlayerHonkBomb(4);
			gameObject.disableRendering();
			gameObject.width = this.honkBombSizeWidth;
			gameObject.height = this.honkBombSizeHeight;

			const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_HONK_BOMB));

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.honkBombSizeWidth;
			sprite.height = this.honkBombSizeHeight;

			sprite.anchor.set(0.5, 0.5);
			gameObject.addChild(sprite);

			gameObject.setHonkBombTemplate(playerHonkBombTemplate);

			this.honkBombGameObjects.push(gameObject);
			this.sceneContainer.addChild(gameObject);
		}
	}

	generatePlayerHonkBomb() {

		var gameObject = this.honkBombGameObjects.find(x => x.isAnimating == false);

		if (gameObject) {

			var playerHonkBomb = gameObject as PlayerHonkBomb;
			playerHonkBomb.reset();
			playerHonkBomb.reposition(this.playerBalloonContainer);
			playerHonkBomb.setPopping();

			gameObject.enableRendering();

			this.playerBalloonContainer.setAttackStance();
		}
	}

	animatePlayerHonkBomb() {

		var animatingHonkBombs = this.honkBombGameObjects.filter(x => x.isAnimating == true);

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

							let vehicleEnemy = this.roadVehicleEnemyGameObjects.find(x => x.isAnimating == true && Constants.checkCloseCollision(x, playerHonkBomb));

							if (vehicleEnemy) {
								this.looseVehicleEnemyhealth(vehicleEnemy as VehicleEnemy);
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

	//#region PlayerBalloon

	private playerBalloonSizeWidth: number = 150;
	private playerBalloonSizeHeight: number = 150;

	private playerBalloonContainer: PlayerBalloon = new PlayerBalloon(Constants.DEFAULT_CONSTRUCT_SPEED);

	spawnPlayerBalloon() {

		let playerTemplate = Constants.getRandomNumber(0, 1);
		this.playerBalloonContainer.disableRendering();

		this.playerBalloonContainer.width = this.playerBalloonSizeWidth;
		this.playerBalloonContainer.height = this.playerBalloonSizeHeight;

		const sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.PLAYER_BALLOON_IDLE));

		sprite.x = 0;
		sprite.y = 0;
		sprite.width = this.playerBalloonSizeWidth;
		sprite.height = this.playerBalloonSizeWidth;

		this.playerBalloonContainer.addChild(sprite);
		this.playerBalloonContainer.setPlayerTemplate(playerTemplate);

		this.sceneContainer.addChild(this.playerBalloonContainer);
	}

	generatePlayerBalloon() {
		this.playerBalloonContainer.reset();
		this.playerBalloonContainer.reposition();
		this.playerBalloonContainer.enableRendering();
	}

	animatePlayerBalloon() {
		this.playerBalloonContainer.pop();
		this.playerBalloonContainer.hover();
		this.playerBalloonContainer.depleteAttackStance();
		this.playerBalloonContainer.depleteWinStance();
		this.playerBalloonContainer.depleteHitStance();
		this.playerBalloonContainer.recoverFromHealthLoss();

		this.playerBalloonContainer.move(
			Constants.DEFAULT_GAME_VIEW_WIDTH * Manager.scaling,
			Constants.DEFAULT_GAME_VIEW_HEIGHT * Manager.scaling,
			this.gameController);

		if (this.gameController.isAttacking) {
			this.generatePlayerHonkBomb();
			this.gameController.isAttacking = false;
		}
	}

	//#endregion

	//#region GameController

	setGameController() {

		this.gameController.height = Manager.height;
		this.gameController.width = Manager.width;

		this.addChild(this.gameController);
	}

	//#endregion

	//#region GameScoreBar

	private repositionGameScoreBar() {
		this.gameScoreBar.reposition((Manager.width) / 2, 10);
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
		this.animateHonks();

		this.animateSideWalksBottom();
		this.animateHedgesBottom();
		this.animateTreesBottom();
		this.animateLightBillboardsBottom();

		this.animateClouds();
		this.animatePlayerHonkBomb();

		this.gameController.update();
		this.animatePlayerBalloon();
	}

	public resize(scale: number): void {
		this.sceneContainer.scale.set(scale);
		this.repositionGameScoreBar();
	}

	//#endregion

	//#endregion
}