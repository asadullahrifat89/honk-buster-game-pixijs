import { Container, Texture } from "pixi.js";
import { IScene } from "./IScene";
import { GameObjectSprite } from './GameObjectSprite';
import { GameObject } from './GameObject';
import { Cloud } from "./Cloud";
import { Constants, ConstructType } from './Constants';
import { VehicleEnemy } from "./VehicleEnemy";
import { Honk } from "./Honk";


export class GameScene extends Container implements IScene {

	//#region Fields

	/*private defaultSpeed: number = 3;*/

	//#endregion

	//#region GameObjectContainers

	//#region RoadMarks

	private roadRoadMarkXyAdjustment: number = 19;

	private roadRoadMarkSizeWidth: number = 256;
	private roadRoadMarkSizeHeight: number = 256;

	private roadRoadMarkContainers: Array<GameObject> = [];

	private roadRoadMarkPopDelayDefault: number = 39.5 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadRoadMarkPopDelay: number = 0;

	private SpawnRoadMarks() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadRoadMarkSizeWidth * 5;
			container.height = this.roadRoadMarkSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];


			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_MARK);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadRoadMarkSizeWidth * i - (this.roadRoadMarkXyAdjustment * i);
				sprite.y = (this.roadRoadMarkSizeHeight / 2) * i - ((this.roadRoadMarkXyAdjustment / 2) * i);
				sprite.width = this.roadRoadMarkSizeWidth;
				sprite.height = this.roadRoadMarkSizeHeight;

				container.addChild(sprite);
			}

			this.roadRoadMarkContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateRoadMarks() {

		this.roadRoadMarkPopDelay -= 0.1;

		if (this.roadRoadMarkPopDelay < 0) {

			var container = this.roadRoadMarkContainers.find(x => x.isAnimating == false);

			if (container) {

				container.setPosition(container.width * - 1.1, container.height * -1);
				container.enableRendering();

				this.roadRoadMarkPopDelay = this.roadRoadMarkPopDelayDefault;
			}
		}
	}

	private AnimateRoadMarks() {

		var animatingRoadMarks = this.roadRoadMarkContainers.filter(x => x.isAnimating == true);

		if (animatingRoadMarks) {

			animatingRoadMarks.forEach(container => {
				container.moveDownRight();

				if (container.x - container.width > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - container.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Trees

	private roadTreeXyAdjustment: number = 85.5;

	private roadTreeSizeWidth: number = 450;
	private roadTreeSizeHeight: number = 450;

	private roadTreeBottomContainers: Array<GameObject> = [];
	private roadTreeTopContainers: Array<GameObject> = [];

	private roadTreePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadTreePopDelayTop: number = 0;
	private roadTreePopDelayBottom: number = 0;

	private SpawnTreesTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadTreeSizeWidth * 5;
			container.height = this.roadTreeSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];


			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				sprite.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				sprite.width = this.roadTreeSizeWidth;
				sprite.height = this.roadTreeSizeHeight;

				container.addChild(sprite);
			}

			this.roadTreeTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnTreesBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadTreeSizeWidth * 5;
			container.height = this.roadTreeSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			// add trees to the tree bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				sprite.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				sprite.width = this.roadTreeSizeWidth;
				sprite.height = this.roadTreeSizeHeight;

				container.addChild(sprite);
			}

			this.roadTreeBottomContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateTreesTop() {

		this.roadTreePopDelayTop -= 0.1;

		if (this.roadTreePopDelayTop < 0) {

			var container = this.roadTreeTopContainers.find(x => x.isAnimating == false);

			if (container) {
				container.setPosition(-850, container.height * -1);
				container.enableRendering();
				this.roadTreePopDelayTop = this.roadTreePopDelayDefault;
			}
		}
	}

	private GenerateTreesBottom() {

		this.roadTreePopDelayBottom -= 0.1;

		if (this.roadTreePopDelayBottom < 0) {

			var container = this.roadTreeBottomContainers.find(x => x.isAnimating == false);

			if (container) {
				container.setPosition(container.width * -1, -570);
				container.enableRendering();
				this.roadTreePopDelayBottom = this.roadTreePopDelayDefault;
			}
		}
	}

	private AnimateTreesTop() {

		var animatingTrees = this.roadTreeTopContainers.filter(x => x.isAnimating == true);

		if (animatingTrees) {

			animatingTrees.forEach(container => {
				container.moveDownRight();

				if (container.x > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	private AnimateTreesBottom() {

		var animatingTrees = this.roadTreeBottomContainers.filter(x => x.isAnimating == true);

		if (animatingTrees) {

			animatingTrees.forEach(container => {
				container.moveDownRight();

				if (container.x > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Hedges

	private roadHedgeXyAdjustment: number = 30.5;

	private roadHedgeSizeWidth: number = 450;
	private roadHedgeSizeHeight: number = 450;

	private roadHedgeBottomContainers: Array<GameObject> = [];
	private roadHedgeTopContainers: Array<GameObject> = [];

	private roadHedgePopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadHedgePopDelayTop: number = 0;
	private roadHedgePopDelayBottom: number = 0;

	private SpawnHedgesTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadHedgeSizeWidth * 5;
			container.height = this.roadHedgeSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			// add hedges to the hedge top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				sprite.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				sprite.width = this.roadHedgeSizeWidth;
				sprite.height = this.roadHedgeSizeHeight;

				container.addChild(sprite);
			}

			this.roadHedgeTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnHedgesBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadHedgeSizeWidth * 5;
			container.height = this.roadHedgeSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			// add hedges to the hedge bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				sprite.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				sprite.width = this.roadHedgeSizeWidth;
				sprite.height = this.roadHedgeSizeHeight;

				container.addChild(sprite);
			}

			this.roadHedgeBottomContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateHedgesTop() {

		this.roadHedgePopDelayTop -= 0.1;

		if (this.roadHedgePopDelayTop < 0) {

			var container = this.roadHedgeTopContainers.find(x => x.isAnimating == false);

			if (container) {
				container.setPosition(-1430, container.height * -1);
				container.enableRendering();
				this.roadHedgePopDelayTop = this.roadHedgePopDelayDefault;
			}
		}
	}

	private GenerateHedgesBottom() {

		this.roadHedgePopDelayBottom -= 0.1;

		if (this.roadHedgePopDelayBottom < 0) {

			var container = this.roadHedgeBottomContainers.find(x => x.isAnimating == false);

			if (container) {
				container.setPosition(container.width * -1, -710);
				container.enableRendering();
				this.roadHedgePopDelayBottom = this.roadHedgePopDelayDefault;

				// console.log("Hedge bottom container popped.");
			}
		}
	}

	private AnimateHedgesTop() {

		var animatingHedges = this.roadHedgeTopContainers.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(container => {
				container.moveDownRight();

				if (container.x - this.roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	private AnimateHedgesBottom() {

		var animatingHedges = this.roadHedgeBottomContainers.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(container => {
				container.moveDownRight();

				if (container.x - this.roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

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

	private roadLightBillboardBottomContainers: Array<GameObject> = [];
	private roadLightBillboardTopContainers: Array<GameObject> = [];

	private roadLightBillboardPopDelayDefault: number = 57 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadLightBillboardPopDelayTop: number = 0;
	private roadLightBillboardPopDelayBottom: number = 0;

	private SpawnLightBillboardsTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadLightBillboardSizeWidth * 5;
			container.height = this.roadLightBillboardSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = (this.roadLightBillboardSizeWidth * i - (this.roadLightBillboardXyAdjustment * i)) + (this.roadLightBillboardXyDistance * i);
				sprite.y = ((this.roadLightBillboardSizeHeight / 2) * i - ((this.roadLightBillboardXyAdjustment / 2) * i)) + (this.roadLightBillboardXyDistance / 2 * i);
				sprite.width = this.roadLightBillboardSizeWidth;
				sprite.height = this.roadLightBillboardSizeHeight;

				container.addChild(sprite);
			}

			this.roadLightBillboardTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnLightBillboardsBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadLightBillboardSizeWidth * 5;
			container.height = this.roadLightBillboardSizeHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			// add trees to the tree bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = (this.roadLightBillboardSizeWidth * i - (this.roadLightBillboardXyAdjustment * i)) + (this.roadLightBillboardXyDistance * i);
				sprite.y = ((this.roadLightBillboardSizeHeight / 2) * i - ((this.roadLightBillboardXyAdjustment / 2) * i)) + (this.roadLightBillboardXyDistance / 2 * i);
				sprite.width = this.roadLightBillboardSizeWidth;
				sprite.height = this.roadLightBillboardSizeHeight;

				container.addChild(sprite);
			}

			this.roadLightBillboardBottomContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateLightBillboardsTop() {

		this.roadLightBillboardPopDelayTop -= 0.1;

		if (this.roadLightBillboardPopDelayTop < 0) {

			var container = this.roadLightBillboardTopContainers.find(x => x.isAnimating == false);

			if (container) {
				container.setPosition(-480, container.height * -1);
				container.enableRendering();
				this.roadLightBillboardPopDelayTop = this.roadLightBillboardPopDelayDefault;
			}
		}
	}

	private GenerateLightBillboardsBottom() {

		this.roadLightBillboardPopDelayBottom -= 0.1;

		if (this.roadLightBillboardPopDelayBottom < 0) {

			var container = this.roadLightBillboardBottomContainers.find(x => x.isAnimating == false);

			if (container) {
				container.x = container.width * -1;
				container.y = -330;
				container.enableRendering();
				this.roadLightBillboardPopDelayBottom = this.roadLightBillboardPopDelayDefault;
			}
		}
	}

	private AnimateLightBillboardsTop() {

		var animatingLightBillboards = this.roadLightBillboardTopContainers.filter(x => x.isAnimating == true);

		if (animatingLightBillboards) {

			animatingLightBillboards.forEach(container => {
				container.moveDownRight();

				if (container.x - this.roadLightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	private AnimateLightBillboardsBottom() {

		var animatingLightBillboards = this.roadLightBillboardBottomContainers.filter(x => x.isAnimating == true);

		if (animatingLightBillboards) {

			animatingLightBillboards.forEach(container => {
				container.moveDownRight();

				if (container.x - this.roadLightBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

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

	////private roadHeavyBillboardBottomContainers: Array<GameObject> = [];
	//private roadHeavyBillboardTopContainers: Array<GameObject> = [];

	//private roadHeavyBillboardPopDelayDefault: number = 78;
	//private roadHeavyBillboardPopDelayTop: number = 0;
	////private roadHeavyBillboardPopDelayBottom: number = 0;

	//private SpawnHeavyBillboardsTop() {

	//	for (let j = 0; j < 5; j++) {

	//		const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
	//		container.moveOutOfSight();
	//		container.width = this.roadHeavyBillboardSizeWidth * 5;
	//		container.height = this.roadHeavyBillboardSizeHeight / 2 * 5;

	//		// container.filters = [new DropShadowFilter()];


	//		for (let i = 0; i < 5; i++) {

	//			const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_BILLBOARD);
	//			const texture = Texture.from(uri);
	//			const sprite: GameObjectSprite = new GameObjectSprite(texture);

	//			sprite.x = (this.roadHeavyBillboardSizeWidth * i - (this.roadHeavyBillboardXyAdjustment * i)) + (this.roadHeavyBillboardXyDistance * i);
	//			sprite.y = ((this.roadHeavyBillboardSizeHeight / 2) * i - ((this.roadHeavyBillboardXyAdjustment / 2) * i)) + (this.roadHeavyBillboardXyDistance / 2 * i);
	//			sprite.width = this.roadHeavyBillboardSizeWidth;
	//			sprite.height = this.roadHeavyBillboardSizeHeight;

	//			container.addChild(sprite);
	//		}

	//		this.roadHeavyBillboardTopContainers.push(container);
	//		this.addChild(container);
	//	}
	//}

	////private SpawnHeavyBillboardsBottom() {

	////	for (let j = 0; j < 5; j++) {

	////		const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
	////		container.moveOutOfSight();
	////		container.width = this.roadHeavyBillboardSizeWidth * 5;
	////		container.height = this.roadHeavyBillboardSizeHeight / 2 * 5;

	////		// container.filters = [new DropShadowFilter()];

	////		// add trees to the tree bottom container
	////		for (let i = 0; i < 5; i++) {

	////			const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_LIGHT_BILLBOARD);
	////			const texture = Texture.from(uri);
	////			const sprite: GameObjectSprite = new GameObjectSprite(texture);

	////			sprite.x = (this.roadHeavyBillboardSizeWidth * i - (this.roadHeavyBillboardXyAdjustment * i)) + (this.roadHeavyBillboardXyDistance * i);
	////			sprite.y = ((this.roadHeavyBillboardSizeHeight / 2) * i - ((this.roadHeavyBillboardXyAdjustment / 2) * i)) + (this.roadHeavyBillboardXyDistance / 2 * i);
	////			sprite.width = this.roadHeavyBillboardSizeWidth;
	////			sprite.height = this.roadHeavyBillboardSizeHeight;

	////			container.addChild(sprite);
	////		}

	////		this.roadHeavyBillboardBottomContainers.push(container);
	////		this.addChild(container);
	////	}
	////}

	//private GenerateHeavyBillboardsTop() {

	//	this.roadHeavyBillboardPopDelayTop -= 0.1;

	//	if (this.roadHeavyBillboardPopDelayTop < 0) {

	//		var container = this.roadHeavyBillboardTopContainers.find(x => x.isAnimating == false);

	//		if (container) {
	//			container.x = -980;
	//			container.y = container.height * -1;
	//			container.isAnimating = true;
	//			this.roadHeavyBillboardPopDelayTop = this.roadHeavyBillboardPopDelayDefault;
	//		}
	//	}
	//}

	////private GenerateHeavyBillboardsBottom() {

	////	this.roadHeavyBillboardPopDelayBottom -= 0.1;

	////	if (this.roadHeavyBillboardPopDelayBottom < 0) {

	////		var container = this.roadHeavyBillboardBottomContainers.find(x => x.isAnimating == false);

	////		if (container) {
	////			container.x = container.width * -1;
	////			container.y = -330;
	////			container.isAnimating = true;
	////			this.roadHeavyBillboardPopDelayBottom = this.roadHeavyBillboardPopDelayDefault;
	////		}
	////	}
	////}

	//private AnimateHeavyBillboardsTop() {

	//	var animatingHeavyBillboards = this.roadHeavyBillboardTopContainers.filter(x => x.isAnimating == true);

	//	if (animatingHeavyBillboards) {

	//		animatingHeavyBillboards.forEach(container => {
	//			container.moveDownRight();

	//			if (container.x - this.roadHeavyBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	//				container.moveOutOfSight();
	//				
	//			}
	//		});
	//	}
	//}

	////private AnimateHeavyBillboardsBottom() {

	////	var animatingHeavyBillboards = this.roadHeavyBillboardBottomContainers.filter(x => x.isAnimating == true);

	////	if (animatingHeavyBillboards) {

	////		animatingHeavyBillboards.forEach(container => {
	////			container.moveDownRight();

	////			if (container.x - this.roadHeavyBillboardSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
	////				container.moveOutOfSight();
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

	private roadSideWalkTopContainers: Array<GameObject> = [];
	private roadSideWalkBottomContainers: Array<GameObject> = [];

	private roadSideWalkPopDelayDefault: number = 50 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadSideWalkPopDelayTop: number = 0;
	private roadSideWalkPopDelayBottom: number = 0;

	private SpawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadSideWalkWidth * 5;
			container.height = this.roadSideWalkHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sprite.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sprite.width = this.roadSideWalkWidth;
				sprite.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				container.addChild(sprite);
			}

			this.roadSideWalkTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadSideWalkWidth * 5;
			container.height = this.roadSideWalkHeight / 2 * 5;

			// container.filters = [new DropShadowFilter()];

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture);

				sprite.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sprite.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sprite.width = this.roadSideWalkWidth;
				sprite.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				container.addChild(sprite);
			}

			this.roadSideWalkBottomContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateSideWalksTop() {

		this.roadSideWalkPopDelayTop -= 0.1;

		if (this.roadSideWalkPopDelayTop < 0) {

			var container = this.roadSideWalkTopContainers.find(x => x.isAnimating == false);

			if (container) {
				container.x = -945;
				container.y = container.height * -1;
				container.enableRendering();
				this.roadSideWalkPopDelayTop = this.roadSideWalkPopDelayDefault;
			}
		}
	}

	private GenerateSideWalksBottom() {

		this.roadSideWalkPopDelayBottom -= 0.1;

		if (this.roadSideWalkPopDelayBottom < 0) {

			var container = this.roadSideWalkBottomContainers.find(x => x.isAnimating == false);

			if (container) {
				container.x = container.width * -1;
				container.y = -435;
				container.enableRendering();
				this.roadSideWalkPopDelayBottom = this.roadSideWalkPopDelayDefault;
			}
		}
	}

	private AnimateSideWalksTop() {

		var animatingSideWalks = this.roadSideWalkTopContainers.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(container => {
				container.moveDownRight();

				if (container.x - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	private AnimateSideWalksBottom() {

		var animatingSideWalks = this.roadSideWalkBottomContainers.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(container => {
				container.moveDownRight();

				if (container.x - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Clouds	

	private roadCloudSizeWidth: number = 512 / 2;
	private roadCloudSizeHeight: number = 350 / 2;

	private roadCloudContainers: Array<GameObject> = [];

	private roadCloudPopDelayDefault: number = 70 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadCloudPopDelay: number = 0;

	private SpawnClouds() {

		for (let j = 0; j < 5; j++) {

			const container: Cloud = new Cloud(Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2));
			container.disableRendering();
			container.width = this.roadCloudSizeWidth;
			container.height = this.roadCloudSizeHeight;

			const uri = Constants.getRandomUri(ConstructType.CLOUD);
			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.roadCloudSizeWidth;
			sprite.height = this.roadCloudSizeHeight;
			//cloud.filters = [new BlurFilter(4, 10)];
			container.addChild(sprite);

			//cloudContainer.filters = [new BlurFilter(2, 10)];

			this.roadCloudContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateClouds() {

		this.roadCloudPopDelay -= 0.1;

		if (this.roadCloudPopDelay < 0) {

			var container = this.roadCloudContainers.find(x => x.isAnimating == false);

			if (container) {

				container.changeTexture(Constants.getRandomTexture(ConstructType.CLOUD));
				container.speed = Constants.getRandomNumber(1, Constants.DEFAULT_CONSTRUCT_SPEED + 2);

				var cloud = container as Cloud;
				cloud.reposition();

				container.enableRendering();

				this.roadCloudPopDelay = this.roadCloudPopDelayDefault;
			}
		}
	}

	private AnimateClouds() {

		var animatingClouds = this.roadCloudContainers.filter(x => x.isAnimating == true);

		if (animatingClouds) {

			animatingClouds.forEach(container => {

				container.hover();
				container.moveDownRight();

				if (container.x - container.width > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - container.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region VehicleEnemys	

	private roadVehicleEnemySizeWidth: number = 245;
	private roadVehicleEnemySizeHeight: number = 245;

	private roadVehicleEnemyContainers: Array<GameObject> = [];

	private roadVehicleEnemyPopDelayDefault: number = 25 / Constants.DEFAULT_CONSTRUCT_DELTA;
	private roadVehicleEnemyPopDelay: number = 0;

	private SpawnVehicleEnemys() {

		for (let j = 0; j < 10; j++) {

			const container: VehicleEnemy = new VehicleEnemy(Constants.DEFAULT_CONSTRUCT_SPEED);
			container.disableRendering();
			container.width = this.roadVehicleEnemySizeWidth;
			container.height = this.roadVehicleEnemySizeHeight;

			var vehicleType = Constants.getRandomNumber(0, 1);

			let uri: string = "";
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

			container.addChild(sprite);

			this.roadVehicleEnemyContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateVehicleEnemys() {

		this.roadVehicleEnemyPopDelay -= 0.1;

		if (this.roadVehicleEnemyPopDelay < 0) {

			var container = this.roadVehicleEnemyContainers.find(x => x.isAnimating == false);

			if (container) {

				var vehicleEnemey = container as VehicleEnemy;
				vehicleEnemey.reposition();
				vehicleEnemey.reset();

				container.enableRendering();

				this.roadVehicleEnemyPopDelay = this.roadVehicleEnemyPopDelayDefault;
			}
		}
	}

	private AnimateVehicleEnemys() {

		var animatingVehicleEnemys = this.roadVehicleEnemyContainers.filter(x => x.isAnimating == true);

		if (animatingVehicleEnemys) {

			animatingVehicleEnemys.forEach(container => {

				container.pop();
				container.moveDownRight();

				// prevent overlapping

				var collidingVehicleEnemy = this.roadVehicleEnemyContainers.find(x => x.isAnimating == true && x.getBounds().intersects(container.getBounds()));

				if (collidingVehicleEnemy) {

					if (collidingVehicleEnemy.speed > container.speed) // colliding vehicleEnemy is faster
					{
						container.speed = collidingVehicleEnemy.speed;
					}
					else if (container.speed > collidingVehicleEnemy.speed) // vehicleEnemy is faster
					{
						collidingVehicleEnemy.speed = container.speed;
					}
				}

				// generate honk

				let vehicleEnemy = container as VehicleEnemy;

				if (vehicleEnemy) {

					if (vehicleEnemy.honk()) {
						this.GenerateHonk(container);
					}
				}

				if (container.x - container.width > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - container.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.disableRendering();

				}
			});
		}
	}

	//#endregion

	//#region Honks	

	private roadHonkSizeWidth: number = 128;
	private roadHonkSizeHeight: number = 128;

	private roadHonkContainers: Array<GameObject> = [];

	private SpawnHonks() {

		for (let j = 0; j < 5; j++) {

			const container: Honk = new Honk(0);
			container.disableRendering();
			container.width = this.roadHonkSizeWidth;
			container.height = this.roadHonkSizeHeight;

			const uri = Constants.getRandomUri(ConstructType.HONK);
			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture);

			sprite.x = 0;
			sprite.y = 0;
			sprite.width = this.roadHonkSizeWidth;
			sprite.height = this.roadHonkSizeHeight;

			sprite.anchor.set(0.5, 0.5);

			container.addChild(sprite);

			this.roadHonkContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateHonk(source: GameObject) {

		var container = this.roadHonkContainers.find(x => x.isAnimating == false);

		if (container) {

			var honk = container as Honk;
			honk.reset();
			honk.reposition(source);
			honk.setPopping();

			source.setPopping();

			container.enableRendering();
		}
	}

	private AnimateHonks() {

		var animatingHonks = this.roadHonkContainers.filter(x => x.isAnimating == true);

		if (animatingHonks) {

			animatingHonks.forEach(container => {
				container.pop();
				container.fade();

				if (container.hasFaded()) {
					container.disableRendering();
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region Ctor

	constructor() {
		super();

		this.SpawnRoadMarks();

		this.SpawnSideWalksTop();
		this.SpawnHedgesTop();
		this.SpawnTreesTop();
		//this.SpawnHeavyBillboardsTop();
		this.SpawnLightBillboardsTop();

		this.SpawnVehicleEnemys();
		this.SpawnHonks();

		this.SpawnSideWalksBottom();
		this.SpawnHedgesBottom();
		this.SpawnLightBillboardsBottom();
		this.SpawnTreesBottom();

		this.SpawnClouds();
	}

	//#endregion

	//#region Methods

	public update(_framesPassed: number): void {

		this.GenerateRoadMarks();
		this.GenerateSideWalksTop();
		//this.GenerateHeavyBillboardsTop();
		this.GenerateLightBillboardsTop();
		this.GenerateHedgesTop();
		this.GenerateTreesTop();

		this.GenerateVehicleEnemys();

		this.GenerateClouds();

		this.GenerateSideWalksBottom();
		this.GenerateHedgesBottom();
		this.GenerateLightBillboardsBottom();
		this.GenerateTreesBottom();

		this.AnimateRoadMarks();

		this.AnimateSideWalksTop();
		this.AnimateHedgesTop();
		this.AnimateTreesTop();
		//this.AnimateHeavyBillboardsTop();
		this.AnimateLightBillboardsTop();

		this.AnimateVehicleEnemys();
		this.AnimateHonks();

		this.AnimateSideWalksBottom();
		this.AnimateHedgesBottom();
		this.AnimateTreesBottom();
		this.AnimateLightBillboardsBottom();

		this.AnimateClouds();
	}

	public resize(scale: number): void {
		this.scale.set(scale);
		console.log("Scale: " + scale);
	}

	//#endregion
}