import { Container, Texture } from "pixi.js";
import { IScene } from "./Manager";
import { GameObject } from './GameObject';
import { GameObjectContainer } from './GameObjectContainer';
import { Constants, ConstructType } from './Constants';


export class GameScene extends Container implements IScene {

	private defaultSpeed: number = 3;

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

			const treeContainer: GameObjectContainer = new GameObjectContainer();
			treeContainer.x = -1500;
			treeContainer.y = -1500;
			treeContainer.width = this.roadTreeSizeWidth * 5;
			treeContainer.height = this.roadTreeSizeHeight / 2 * 5;

			// add trees to the tree top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const tree: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_TREE);

				tree.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				tree.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				tree.width = this.roadTreeSizeWidth;
				tree.height = this.roadTreeSizeHeight;

				treeContainer.addChild(tree);
			}

			this.roadTreeTopContainers.push(treeContainer);
			this.addChild(treeContainer);
		}
	}

	private SpawnTreesBottom() {

		for (let j = 0; j < 5; j++) {

			const treeContainer: GameObjectContainer = new GameObjectContainer();
			treeContainer.x = -1500;
			treeContainer.y = -1500;
			treeContainer.width = this.roadTreeSizeWidth * 5;
			treeContainer.height = this.roadTreeSizeHeight / 2 * 5;

			// add trees to the tree bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
				const texture = Texture.from(uri);
				const tree: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_TREE);

				tree.x = this.roadTreeSizeWidth * i - (this.roadTreeXyAdjustment * i);
				tree.y = (this.roadTreeSizeHeight / 2) * i - ((this.roadTreeXyAdjustment / 2) * i);
				tree.width = this.roadTreeSizeWidth;
				tree.height = this.roadTreeSizeHeight;

				treeContainer.addChild(tree);
			}

			this.roadTreeBottomContainers.push(treeContainer);
			this.addChild(treeContainer);
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

				// console.log("Tree bottom container popped.");
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

				// console.log("Tree bottom container popped.");
			}
		}
	}

	private AnimateTreesTop() {

		var animatingTrees = this.roadTreeTopContainers.filter(x => x.isAnimating == true);

		if (animatingTrees) {

			animatingTrees.forEach(container => {
				container.x += this.defaultSpeed;
				container.y += this.defaultSpeed / 2;

				if (container.x > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.x = -1500;
					container.y = -1500;
					container.isAnimating = false;
				}
			});
		}
	}

	private AnimateTreesBottom() {

		var animatingTrees = this.roadTreeBottomContainers.filter(x => x.isAnimating == true);

		if (animatingTrees) {

			animatingTrees.forEach(container => {
				container.x += this.defaultSpeed;
				container.y += this.defaultSpeed / 2;

				if (container.x > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.x = -1500;
					container.y = -1500;
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

			const hedgeContainer: GameObjectContainer = new GameObjectContainer();
			hedgeContainer.x = -1500;
			hedgeContainer.y = -1500;
			hedgeContainer.width = this.roadHedgeSizeWidth * 5;
			hedgeContainer.height = this.roadHedgeSizeHeight / 2 * 5;

			// add hedges to the hedge top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const hedge: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_HEDGE);

				hedge.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				hedge.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				hedge.width = this.roadHedgeSizeWidth;
				hedge.height = this.roadHedgeSizeHeight;

				hedgeContainer.addChild(hedge);
			}

			this.roadHedgeTopContainers.push(hedgeContainer);
			this.addChild(hedgeContainer);
		}
	}

	private SpawnHedgesBottom() {

		for (let j = 0; j < 5; j++) {

			const hedgeContainer: GameObjectContainer = new GameObjectContainer();
			hedgeContainer.x = -1500;
			hedgeContainer.y = -1500;
			hedgeContainer.width = this.roadHedgeSizeWidth * 5;
			hedgeContainer.height = this.roadHedgeSizeHeight / 2 * 5;

			// add hedges to the hedge bottom container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_HEDGE);
				const texture = Texture.from(uri);
				const hedge: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_HEDGE);

				hedge.x = this.roadHedgeSizeWidth * i - (this.roadHedgeXyAdjustment * i);
				hedge.y = (this.roadHedgeSizeHeight / 2) * i - ((this.roadHedgeXyAdjustment / 2) * i);
				hedge.width = this.roadHedgeSizeWidth;
				hedge.height = this.roadHedgeSizeHeight;

				hedgeContainer.addChild(hedge);
			}

			this.roadHedgeBottomContainers.push(hedgeContainer);
			this.addChild(hedgeContainer);
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
				container.x += this.defaultSpeed;
				container.y += this.defaultSpeed / 2;

				if (container.x - this.roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.x = -1500;
					container.y = -1500;
					container.isAnimating = false;
				}
			});
		}
	}

	private AnimateHedgesBottom() {

		var animatingHedges = this.roadHedgeBottomContainers.filter(x => x.isAnimating == true);

		if (animatingHedges) {

			animatingHedges.forEach(container => {
				container.x += this.defaultSpeed;
				container.y += this.defaultSpeed / 2;

				if (container.x - this.roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.x = -1500;
					container.y = -1500;
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

			const sideWalkContainer: GameObjectContainer = new GameObjectContainer();
			sideWalkContainer.x = -1500;
			sideWalkContainer.y = -1500;
			sideWalkContainer.width = this.roadSideWalkWidth * 5;
			sideWalkContainer.height = this.roadSideWalkHeight / 2 * 5;

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sideWalk: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_WALK);

				sideWalk.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sideWalk.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sideWalk.width = this.roadSideWalkWidth;
				sideWalk.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				sideWalkContainer.addChild(sideWalk);
			}

			this.roadSideWalkTopContainers.push(sideWalkContainer);
			this.addChild(sideWalkContainer);
		}
	}

	private SpawnSideWalksBottom() {

		for (let j = 0; j < 5; j++) {

			const sideWalkContainer: GameObjectContainer = new GameObjectContainer();
			sideWalkContainer.x = -1500;
			sideWalkContainer.y = -1500;
			sideWalkContainer.width = this.roadSideWalkWidth * 5;
			sideWalkContainer.height = this.roadSideWalkHeight / 2 * 5;

			// add sideWalks to the sideWalk top container
			for (let i = 0; i < 5; i++) {

				const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
				const texture = Texture.from(uri);
				const sideWalk: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_WALK);

				sideWalk.x = this.roadSideWalkWidth * i - (this.roadSideWalkXyAdjustment * i);
				sideWalk.y = (this.roadSideWalkHeight / 2) * i - ((this.roadSideWalkXyAdjustment / 2) * i);

				sideWalk.width = this.roadSideWalkWidth;
				sideWalk.height = this.roadSideWalkHeight;

				//sideWalk.anchor.set(0.5, 0.5);
				//sideWalk.rotation = Constants.degreesToRadians(-63.5);
				//sideWalk.skew.set(0, Constants.degreesToRadians(37));

				sideWalkContainer.addChild(sideWalk);
			}

			this.roadSideWalkBottomContainers.push(sideWalkContainer);
			this.addChild(sideWalkContainer);
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
				container.x += this.defaultSpeed;
				container.y += this.defaultSpeed / 2;

				if (container.x - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.x = -1500;
					container.y = -1500;
					container.isAnimating = false;
				}
			});
		}
	}

	private AnimateSideWalksBottom() {

		var animatingSideWalks = this.roadSideWalkBottomContainers.filter(x => x.isAnimating == true);

		if (animatingSideWalks) {

			animatingSideWalks.forEach(container => {
				container.x += this.defaultSpeed;
				container.y += this.defaultSpeed / 2;

				if (container.x - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - (this.roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
					container.x = -1500;
					container.y = -1500;
					container.isAnimating = false;
				}
			});
		}
	}

	//#endregion

	constructor() {
		super();

		// spawn game objects
		this.SpawnSideWalksTop();
		this.SpawnHedgesTop();
		this.SpawnTreesTop();

		this.SpawnSideWalksBottom();
		this.SpawnHedgesBottom();
		this.SpawnTreesBottom();
	}

	public update(_framesPassed: number): void {

		this.GenerateSideWalksTop();
		this.GenerateHedgesTop();
		this.GenerateTreesTop();

		this.GenerateSideWalksBottom();
		this.GenerateHedgesBottom();
		this.GenerateTreesBottom();

		this.AnimateSideWalksTop();
		this.AnimateHedgesTop();
		this.AnimateTreesTop();

		this.AnimateSideWalksBottom();
		this.AnimateHedgesBottom();
		this.AnimateTreesBottom();
	}

	public resize(scale: number): void {
		this.scale.set(scale);

		console.log("Scale: " + scale);
	}

}