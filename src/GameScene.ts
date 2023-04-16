import { Container, Texture } from "pixi.js";
import { IScene } from "./IScene";
import { GameObjectSprite } from './GameObjectSprite';
import { GameObject } from './GameObject';
import { Cloud } from "./Cloud";
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

	private roadTreeBottomContainers: Array<GameObject> = [];
	private roadTreeTopContainers: Array<GameObject> = [];

	private roadTreePopDelayDefault: number = 70;
	private roadTreePopDelayTop: number = 0;
	private roadTreePopDelayBottom: number = 0;

	private SpawnTreesTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadTreeSizeWidth * 5;
			container.height = this.roadTreeSizeHeight / 2 * 5;

			// add trees to the tree top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.ROAD_SIDE_TREE, this.defaultSpeed);

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

			const container: GameObject = new GameObject(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadTreeSizeWidth * 5;
			container.height = this.roadTreeSizeHeight / 2 * 5;

			// add trees to the tree bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.ROAD_SIDE_TREE, this.defaultSpeed);

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

	private roadHedgeBottomContainers: Array<GameObject> = [];
	private roadHedgeTopContainers: Array<GameObject> = [];

	private roadHedgePopDelayDefault: number = 70;
	private roadHedgePopDelayTop: number = 0;
	private roadHedgePopDelayBottom: number = 0;

	private SpawnHedgesTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadHedgeSizeWidth * 5;
			container.height = this.roadHedgeSizeHeight / 2 * 5;

			// add hedges to the hedge top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.ROAD_SIDE_HEDGE, this.defaultSpeed);

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

			const container: GameObject = new GameObject(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadHedgeSizeWidth * 5;
			container.height = this.roadHedgeSizeHeight / 2 * 5;

			// add hedges to the hedge bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.ROAD_SIDE_HEDGE, this.defaultSpeed);

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

	private roadSideWalkTopContainers: Array<GameObject> = [];
	private roadSideWalkBottomContainers: Array<GameObject> = [];

	private roadSideWalkPopDelayDefault: number = 50;
	private roadSideWalkPopDelayTop: number = 0;
	private roadSideWalkPopDelayBottom: number = 0;

	private SpawnSideWalksTop() {

		for (let j = 0; j < 5; j++) {

			const container: GameObject = new GameObject(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadSideWalkWidth * 5;
			container.height = this.roadSideWalkHeight / 2 * 5;

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.ROAD_SIDE_WALK, this.defaultSpeed);

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

			const container: GameObject = new GameObject(this.defaultSpeed);
			container.moveOutOfSight();
			container.width = this.roadSideWalkWidth * 5;
			container.height = this.roadSideWalkHeight / 2 * 5;

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.getRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.ROAD_SIDE_WALK, this.defaultSpeed);

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

	private roadCloudContainers: Array<GameObject> = [];

	private roadCloudPopDelayDefault: number = 70;
	private roadCloudPopDelay: number = 0;

	private SpawnClouds() {

		for (let j = 0; j < 5; j++) {

			const container: Cloud = new Cloud(Constants.randomNumberBetween(1, this.defaultSpeed + 2));
			container.moveOutOfSight();
			container.width = this.roadCloudSizeWidth;
			container.height = this.roadCloudSizeHeight;

			const uri = Constants.getRandomUri(ConstructType.CLOUD);
			const texture = Texture.from(uri);
			const sprite: GameObjectSprite = new GameObjectSprite(texture, ConstructType.CLOUD, this.defaultSpeed);

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

			var cloud = this.roadCloudContainers.find(x => x.isAnimating == false);

			if (cloud) {

				cloud.changeTexture(Constants.getRandomTexture(ConstructType.CLOUD));
				cloud.speed = Constants.randomNumberBetween(1, this.defaultSpeed + 2);

				var cloud1 = cloud as Cloud;
				cloud1.reposition();

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