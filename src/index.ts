import { Application, Texture } from 'pixi.js'
import { GameObject } from './GameObject';
import { GameObjectContainer } from './GameObjectContainer';
import { Constants, ConstructType } from './Constants';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x464646,
	width: Constants.DEFAULT_GAME_VIEW_WIDTH,
	height: Constants.DEFAULT_GAME_VIEW_HEIGHT,
	resizeTo: window
});

const defaultSpeed: number = 3;

//#region Trees

const roadTreeXyAdjustment: number = 30.5;

const roadTreeSizeWidth: number = 450;
const roadTreeSizeHeight: number = 450;

const roadTreeBottomContainers: Array<GameObjectContainer> = [];
const roadTreeTopContainers: Array<GameObjectContainer> = [];

const roadTreePopDelayDefault: number = 70;
let roadTreePopDelayTop: number = 0;
let roadTreePopDelayBottom: number = 0;

function SpawnTreesTop() {

	for (let j = 0; j < 5; j++) {

		const treeContainer: GameObjectContainer = new GameObjectContainer();
		treeContainer.x = -1500;
		treeContainer.y = -1500;
		treeContainer.width = roadTreeSizeWidth * 5;
		treeContainer.height = roadTreeSizeHeight / 2 * 5;

		// add trees to the tree top container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
			const texture = Texture.from(uri);
			const tree: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_TREE);

			tree.x = roadTreeSizeWidth * i - (roadTreeXyAdjustment * i);
			tree.y = (roadTreeSizeHeight / 2) * i - ((roadTreeXyAdjustment / 2) * i);
			tree.width = roadTreeSizeWidth;
			tree.height = roadTreeSizeHeight;

			treeContainer.addChild(tree);
		}

		roadTreeTopContainers.push(treeContainer);
		app.stage.addChild(treeContainer);
	}
}

function SpawnTreesBottom() {

	for (let j = 0; j < 5; j++) {

		const treeContainer: GameObjectContainer = new GameObjectContainer();
		treeContainer.x = -1500;
		treeContainer.y = -1500;
		treeContainer.width = roadTreeSizeWidth * 5;
		treeContainer.height = roadTreeSizeHeight / 2 * 5;

		// add trees to the tree bottom container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
			const texture = Texture.from(uri);
			const tree: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_TREE);

			tree.x = roadTreeSizeWidth * i - (roadTreeXyAdjustment * i);
			tree.y = (roadTreeSizeHeight / 2) * i - ((roadTreeXyAdjustment / 2) * i);
			tree.width = roadTreeSizeWidth;
			tree.height = roadTreeSizeHeight;

			treeContainer.addChild(tree);
		}

		roadTreeBottomContainers.push(treeContainer);
		app.stage.addChild(treeContainer);
	}
}

function GenerateTreesTop() {

	roadTreePopDelayTop -= 0.1;

	if (roadTreePopDelayTop < 0) {

		var container = roadTreeTopContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = -1150;
			container.y = container.height * -1;
			container.isAnimating = true;
			roadTreePopDelayTop = roadTreePopDelayDefault;

			// console.log("Tree bottom container popped.");
		}
	}
}

function GenerateTreesBottom() {

	roadTreePopDelayBottom -= 0.1;

	if (roadTreePopDelayBottom < 0) {

		var container = roadTreeBottomContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = container.width * -1;
			container.y = -650;
			container.isAnimating = true;
			roadTreePopDelayBottom = roadTreePopDelayDefault;

			// console.log("Tree bottom container popped.");
		}
	}
}

function AnimateTreesTop() {

	var animatingTrees = roadTreeTopContainers.filter(x => x.isAnimating == true);

	if (animatingTrees) {

		animatingTrees.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

			if (container.x > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				container.x = -1500;
				container.y = -1500;
				container.isAnimating = false;
			}
		});
	}
}

function AnimateTreesBottom() {

	var animatingTrees = roadTreeBottomContainers.filter(x => x.isAnimating == true);

	if (animatingTrees) {

		animatingTrees.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

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

const roadHedgeXyAdjustment: number = 30.5;

const roadHedgeSizeWidth: number = 450;
const roadHedgeSizeHeight: number = 450;

const roadHedgeBottomContainers: Array<GameObjectContainer> = [];
const roadHedgeTopContainers: Array<GameObjectContainer> = [];

const roadHedgePopDelayDefault: number = 70;
let roadHedgePopDelayTop: number = 0;
let roadHedgePopDelayBottom: number = 0;

function SpawnHedgesTop() {

	for (let j = 0; j < 5; j++) {

		const hedgeContainer: GameObjectContainer = new GameObjectContainer();
		hedgeContainer.x = -1500;
		hedgeContainer.y = -1500;
		hedgeContainer.width = roadHedgeSizeWidth * 5;
		hedgeContainer.height = roadHedgeSizeHeight / 2 * 5;

		// add hedges to the hedge top container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_HEDGE);
			const texture = Texture.from(uri);
			const hedge: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_HEDGE);

			hedge.x = roadHedgeSizeWidth * i - (roadHedgeXyAdjustment * i);
			hedge.y = (roadHedgeSizeHeight / 2) * i - ((roadHedgeXyAdjustment / 2) * i);
			hedge.width = roadHedgeSizeWidth;
			hedge.height = roadHedgeSizeHeight;

			hedgeContainer.addChild(hedge);
		}

		roadHedgeTopContainers.push(hedgeContainer);
		app.stage.addChild(hedgeContainer);
	}
}

function SpawnHedgesBottom() {

	for (let j = 0; j < 5; j++) {

		const hedgeContainer: GameObjectContainer = new GameObjectContainer();
		hedgeContainer.x = -1500;
		hedgeContainer.y = -1500;
		hedgeContainer.width = roadHedgeSizeWidth * 5;
		hedgeContainer.height = roadHedgeSizeHeight / 2 * 5;

		// add hedges to the hedge bottom container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_HEDGE);
			const texture = Texture.from(uri);
			const hedge: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_HEDGE);

			hedge.x = roadHedgeSizeWidth * i - (roadHedgeXyAdjustment * i);
			hedge.y = (roadHedgeSizeHeight / 2) * i - ((roadHedgeXyAdjustment / 2) * i);
			hedge.width = roadHedgeSizeWidth;
			hedge.height = roadHedgeSizeHeight;

			hedgeContainer.addChild(hedge);
		}

		roadHedgeBottomContainers.push(hedgeContainer);
		app.stage.addChild(hedgeContainer);
	}
}

function GenerateHedgesTop() {

	roadHedgePopDelayTop -= 0.1;

	if (roadHedgePopDelayTop < 0) {

		var container = roadHedgeTopContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = -1430;
			container.y = container.height * -1;
			container.isAnimating = true;
			roadHedgePopDelayTop = roadHedgePopDelayDefault;

			// console.log("Hedge bottom container popped.");
		}
	}
}

function GenerateHedgesBottom() {

	roadHedgePopDelayBottom -= 0.1;

	if (roadHedgePopDelayBottom < 0) {

		var container = roadHedgeBottomContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = container.width * -1;
			container.y = -710;
			container.isAnimating = true;
			roadHedgePopDelayBottom = roadHedgePopDelayDefault;

			// console.log("Hedge bottom container popped.");
		}
	}
}

function AnimateHedgesTop() {

	var animatingHedges = roadHedgeTopContainers.filter(x => x.isAnimating == true);

	if (animatingHedges) {

		animatingHedges.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

			if (container.x - roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				container.x = -1500;
				container.y = -1500;
				container.isAnimating = false;
			}
		});
	}
}

function AnimateHedgesBottom() {

	var animatingHedges = roadHedgeBottomContainers.filter(x => x.isAnimating == true);

	if (animatingHedges) {

		animatingHedges.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

			if (container.x - roadHedgeSizeWidth > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				container.x = -1500;
				container.y = -1500;
				container.isAnimating = false;
			}
		});
	}
}

//#endregion

//#region SideWalks

const roadSideWalkXyAdjustment: number = 111.5;

const roadSideWalkWidth: number = 450;
const roadSideWalkHeight: number = 450;

const roadSideWalkTopContainers: Array<GameObjectContainer> = [];
const roadSideWalkBottomContainers: Array<GameObjectContainer> = [];

const roadSideWalkPopDelayDefault: number = 50;
let roadSideWalkPopDelayTop: number = 0;
let roadSideWalkPopDelayBottom: number = 0;

function SpawnSideWalksTop() {

	for (let j = 0; j < 5; j++) {

		const sideWalkContainer: GameObjectContainer = new GameObjectContainer();
		sideWalkContainer.x = -1500;
		sideWalkContainer.y = -1500;
		sideWalkContainer.width = roadSideWalkWidth * 5;
		sideWalkContainer.height = roadSideWalkHeight / 2 * 5;

		// add sideWalks to the sideWalk top container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
			const texture = Texture.from(uri);
			const sideWalk: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_WALK);

			sideWalk.x = roadSideWalkWidth * i - (roadSideWalkXyAdjustment * i);
			sideWalk.y = (roadSideWalkHeight / 2) * i - ((roadSideWalkXyAdjustment / 2) * i);

			sideWalk.width = roadSideWalkWidth;
			sideWalk.height = roadSideWalkHeight;

			//sideWalk.anchor.set(0.5, 0.5);
			//sideWalk.rotation = Constants.degreesToRadians(-63.5);
			//sideWalk.skew.set(0, Constants.degreesToRadians(37));

			sideWalkContainer.addChild(sideWalk);
		}

		roadSideWalkTopContainers.push(sideWalkContainer);
		app.stage.addChild(sideWalkContainer);
	}
}

function SpawnSideWalksBottom() {

	for (let j = 0; j < 5; j++) {

		const sideWalkContainer: GameObjectContainer = new GameObjectContainer();
		sideWalkContainer.x = -1500;
		sideWalkContainer.y = -1500;
		sideWalkContainer.width = roadSideWalkWidth * 5;
		sideWalkContainer.height = roadSideWalkHeight / 2 * 5;

		// add sideWalks to the sideWalk top container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
			const texture = Texture.from(uri);
			const sideWalk: GameObject = new GameObject(texture, ConstructType.ROAD_SIDE_WALK);

			sideWalk.x = roadSideWalkWidth * i - (roadSideWalkXyAdjustment * i);
			sideWalk.y = (roadSideWalkHeight / 2) * i - ((roadSideWalkXyAdjustment / 2) * i);

			sideWalk.width = roadSideWalkWidth;
			sideWalk.height = roadSideWalkHeight;

			//sideWalk.anchor.set(0.5, 0.5);
			//sideWalk.rotation = Constants.degreesToRadians(-63.5);
			//sideWalk.skew.set(0, Constants.degreesToRadians(37));

			sideWalkContainer.addChild(sideWalk);
		}

		roadSideWalkBottomContainers.push(sideWalkContainer);
		app.stage.addChild(sideWalkContainer);
	}
}

function GenerateSideWalksTop() {

	roadSideWalkPopDelayTop -= 0.1;

	if (roadSideWalkPopDelayTop < 0) {

		var container = roadSideWalkTopContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = -945;
			container.y = container.height * -1;
			container.isAnimating = true;
			roadSideWalkPopDelayTop = roadSideWalkPopDelayDefault;
		}
	}
}

function GenerateSideWalksBottom() {

	roadSideWalkPopDelayBottom -= 0.1;

	if (roadSideWalkPopDelayBottom < 0) {

		var container = roadSideWalkBottomContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = container.width * -1;
			container.y = -435;
			container.isAnimating = true;
			roadSideWalkPopDelayBottom = roadSideWalkPopDelayDefault;
		}
	}
}

function AnimateSideWalksTop() {

	var animatingSideWalks = roadSideWalkTopContainers.filter(x => x.isAnimating == true);

	if (animatingSideWalks) {

		animatingSideWalks.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

			if (container.x - (roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				container.x = -1500;
				container.y = -1500;
				container.isAnimating = false;
			}
		});
	}
}

function AnimateSideWalksBottom() {

	var animatingSideWalks = roadSideWalkBottomContainers.filter(x => x.isAnimating == true);

	if (animatingSideWalks) {

		animatingSideWalks.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

			if (container.x - (roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_WIDTH || container.y - (roadSideWalkWidth + 50) > Constants.DEFAULT_GAME_VIEW_HEIGHT) {
				container.x = -1500;
				container.y = -1500;
				container.isAnimating = false;
			}
		});
	}
}

//#endregion

// spawn game objects
SpawnSideWalksTop();
SpawnHedgesTop();
SpawnTreesTop();

SpawnSideWalksBottom();
SpawnHedgesBottom();
SpawnTreesBottom();

// add function to the ticker 
app.ticker.add(() => {
	GenerateSideWalksTop();
	GenerateHedgesTop();
	GenerateTreesTop();

	GenerateSideWalksBottom();
	GenerateHedgesBottom();
	GenerateTreesBottom();

	AnimateSideWalksTop();
	AnimateHedgesTop();
	AnimateTreesTop();

	AnimateSideWalksBottom();
	AnimateHedgesBottom();
	AnimateTreesBottom();
});