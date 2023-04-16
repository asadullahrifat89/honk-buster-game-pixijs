import { Container, Texture } from "pixi.js";
import { IScene } from "./IScene";
import { GameObject } from './GameObject';
import { GameObjectContainer } from './GameObjectContainer';
import { Constants, ConstructType } from './Constants';


export class GameScene extends Container implements IScene {

	//#region Fields

	private defaultSpeed: number = 3;

	//#endregion

	//#region GameObjectContainers

	//#region Trees

	private roadTreeXyAdjustment: number = 30.5;

	private roadTreeSizeWidth: number = 450;
	private roadTreeSizeHeight: number = 450;

	private roadTreeBottomContainers: Array<GameObjectContainer> = [];
	private roadTreeTopContainers: Array<GameObjectContainer> = [];

	private roadTreePopDelayDefault: number = 70;
	private roadTreePopDelayTop: number = 0;
	private roadTreePopDelayBottom: number = 0;

	private SpawnTreesTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadTreeSizeWidth * 5;
			container.height = this.roadTreeSizeHeight / 2 * 5;

			// add trees to the tree top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const tree: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_TREE, this.defaultSpeed);

				tree.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				tree.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				tree.width = this.roadTreeSizeWidth;
				tree.height = this.roadTreeSizeHeight;

				container.addChild(tree);
			}

			this.roadTreeTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnTreesBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadTreeSizeWidth * 5;
			container.height = this.roadTreeSizeHeight / 2 * 5;

			// add trees to the tree bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const tree: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_TREE, this.defaultSpeed);

				tree.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				tree.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				tree.width = this.roadTreeSizeWidth;
				tree.height = this.roadTreeSizeHeight;

				container.addChild(tree);
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
				container.x = -1150;
				container.y = container.height * -1;
				container.isAnimating = true;
				this.roadTreePopDelayTop = this.roadTreePopDelayDefault;
			}
		}
	}

	private GenerateTreesBottom() {

		this.roadTreePopDelayBottom -= 0.1;

		if (this.roadTreePopDelayBottom < 0) {

			var container = this.roadTreeBottomContainers.find(x => x.isAnimating == false);

			if (container) {
				container.x = container.width * -1;
				container.y = -650;
				container.isAnimating = true;
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
					container.moveOutOfSight();
					container.isAnimating = false;
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
					container.moveOutOfSight();
					container.isAnimating = false;
				}
			});
		}
	}

	//#endregion

	//#region Hedges

	private roadHedgeXyAdjustment: number = 30.5;

	private roadHedgeSizeWidth: number = 450;
	private roadHedgeSizeHeight: number = 450;

	private roadHedgeBottomContainers: Array<GameObjectContainer> = [];
	private roadHedgeTopContainers: Array<GameObjectContainer> = [];

	private roadHedgePopDelayDefault: number = 70;
	private roadHedgePopDelayTop: number = 0;
	private roadHedgePopDelayBottom: number = 0;

	private SpawnHedgesTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadHedgeSizeWidth * 5;
			container.height = this.roadHedgeSizeHeight / 2 * 5;

			// add hedges to the hedge top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const hedge: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_HEDGE, this.defaultSpeed);

				hedge.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				hedge.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				hedge.width = this.roadHedgeSizeWidth;
				hedge.height = this.roadHedgeSizeHeight;

				container.addChild(hedge);
			}

			this.roadHedgeTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnHedgesBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadHedgeSizeWidth * 5;
			container.height = this.roadHedgeSizeHeight / 2 * 5;

			// add hedges to the hedge bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const hedge: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_HEDGE, this.defaultSpeed);

				hedge.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				hedge.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				hedge.width = this.roadHedgeSizeWidth;
				hedge.height = this.roadHedgeSizeHeight;

				container.addChild(hedge);
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
				container.x = -1430;
				container.y = container.height * -1;
				container.isAnimating = true;
				this.roadHedgePopDelayTop = this.roadHedgePopDelayDefault;

				// console.log("Hedge bottom container popped.");
			}
		}
	}

	private GenerateHedgesBottom() {

		this.roadHedgePopDelayBottom -= 0.1;

		if (this.roadHedgePopDelayBottom < 0) {

			var container = this.roadHedgeBottomContainers.find(x => x.isAnimating == false);

			if (container) {
				container.x = container.width * -1;
				container.y = -710;
				container.isAnimating = true;
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
					container.moveOutOfSight();
					container.isAnimating = false;
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
					container.moveOutOfSight();
					container.isAnimating = false;
				}
			});
		}
	}

	//#endregion

	//#region SideWalks

	private roadSideWalkXyAdjustment: number = 111.5;

	private roadSideWalkWidth: number = 450;
	private roadSideWalkHeight: number = 450;

	private roadSideWalkTopContainers: Array<GameObjectContainer> = [];
	private roadSideWalkBottomContainers: Array<GameObjectContainer> = [];

	private roadSideWalkPopDelayDefault: number = 50;
	private roadSideWalkPopDelayTop: number = 0;
	private roadSideWalkPopDelayBottom: number = 0;

	private SpawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadSideWalkWidth * 5;
			container.height = this.roadSideWalkHeight / 2 * 5;

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sideWalk: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_WALK, this.defaultSpeed);

				sideWalk.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sideWalk.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sideWalk.width = this.roadSideWalkWidth;
				sideWalk.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				container.addChild(sideWalk);
			}

			this.roadSideWalkTopContainers.push(container);
			this.addChild(container);
		}
	}

	private SpawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadSideWalkWidth * 5;
			container.height = this.roadSideWalkHeight / 2 * 5;

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sideWalk: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_WALK, this.defaultSpeed);

				sideWalk.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sideWalk.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sideWalk.width = this.roadSideWalkWidth;
				sideWalk.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				container.addChild(sideWalk);
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
				container.isAnimating = true;
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
				container.isAnimating = true;
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
					container.moveOutOfSight();
					container.isAnimating = false;
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
					container.moveOutOfSight();
					container.isAnimating = false;
				}
			});
		}
	}

	//#endregion

	//#region Clouds	

	private roadCloudSizeWidth: number = 512 / 2;
	private roadCloudSizeHeight: number = 350 / 2;

	private roadCloudContainers: Array<GameObjectContainer> = [];

	private roadCloudPopDelayDefault: number = 70;
	private roadCloudPopDelay: number = 0;

	private SpawnClouds() {

		for (let j = 0; j < 5; j++) {

			const container: GameObjectContainer = new GameObjectContainer(Constants.randomNumberBetween(1, this.defaultSpeed + 2));
			container.moveOutOfSight();
			container.width = this.roadCloudSizeWidth;
			container.height = this.roadCloudSizeHeight;

			const uri = Constants.GetRandomUri(ConstructType.CLOUD);
			const texture = Texture.from(uri);
			const cloud: GameObject = new GameObject(texture, ConstructType.CLOUD, this.defaultSpeed);

			cloud.x = 0;
			cloud.y = 0;
			cloud.width = this.roadCloudSizeWidth;
			cloud.height = this.roadCloudSizeHeight;
			//cloud.filters = [new BlurFilter(4, 10)];
			container.addChild(cloud);

			//cloudContainer.filters = [new BlurFilter(2, 10)];

			this.roadCloudContainers.push(container);
			this.addChild(container);
		}
	}

	private GenerateClouds() {

		this.roadCloudPopDelay -= 0.1;

		if (this.roadCloudPopDelay < 0) {

			var cloud = this.roadCloudContainers.find(x => x.isAnimating == false);

			if (cloud) {

				cloud.speed = Constants.randomNumberBetween(1, this.defaultSpeed + 2);
				var topOrLeft = Constants.randomNumberBetween(0, 2);

				switch (topOrLeft) {
					case 0: {
						var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;

						cloud.x = Constants.randomNumberBetween(0, xLaneWidth - cloud.width);
						cloud.y = cloud.height * -1;

						break;
					}
					case 1: {
						var yLaneWidth = (Constants.DEFAULT_GAME_VIEW_HEIGHT / 2) / 2;

						cloud.x = cloud.width * -1;
						cloud.y = Constants.randomNumberBetween(0, yLaneWidth);

						break;
					}
					default:
						break;
				}

				cloud.isAnimating = true;
				this.roadCloudPopDelay = this.roadCloudPopDelayDefault;
			}
		}
	}

	private AnimateClouds() {

		var animatingClouds = this.roadCloudContainers.filter(x => x.isAnimating == true);

		if (animatingClouds) {

			animatingClouds.forEach(container => {
				container.moveDownRight();

				if (container.x - container.width > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - container.height > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.moveOutOfSight();
					container.isAnimating = false;
				}
			});
		}
	}

	//#endregion

	//#endregion

	//#region Ctor

	constructor() {
		super();

		// spawn game objects
		this.SpawnSideWalksTop();
		this.SpawnHedgesTop();
		this.SpawnTreesTop();

		this.SpawnSideWalksBottom();
		this.SpawnHedgesBottom();
		this.SpawnTreesBottom();

		this.SpawnClouds();
	}

	//#endregion

	//#region Methods

	public update(_framesPassed: number): void {

		this.GenerateSideWalksTop();
		this.GenerateHedgesTop();
		this.GenerateTreesTop();

		this.GenerateClouds();

		this.GenerateSideWalksBottom();
		this.GenerateHedgesBottom();
		this.GenerateTreesBottom();

		this.AnimateSideWalksTop();
		this.AnimateHedgesTop();
		this.AnimateTreesTop();

		this.AnimateSideWalksBottom();
		this.AnimateHedgesBottom();
		this.AnimateTreesBottom();

		this.AnimateClouds();
	}

	public resize(scale: number): void {
		this.scale.set(scale);
		console.log("Scale: " + scale);
	}

	//#endregion
}