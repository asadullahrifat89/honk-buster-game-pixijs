import { Application, Texture } from 'pixi.js'
import { GameObject } from './GameObject';
import { GameObjectContainer } from './GameObjectContainer';
import { Constants, ConstructType } from './Constants';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: Constants.DEFAULT_GAME_VIEW_WIDTH,
	height: Constants.DEFAULT_GAME_VIEW_HEIGHT,
	resizeTo: window
});

const defaultSpeed: number = 2;
const roadTreeSize: number = 450;
const roadSideWalkSize: number = 450;
const xyAdjustment: number = 31.5;

const roadTreeBottomContainers: Array<GameObjectContainer> = [];
const roadTreeTopContainers: Array<GameObjectContainer> = [];

const roadSideWalkTopContainers: Array<GameObjectContainer> = [];
//const roadSideWalkBottomContainers: Array<GameObjectContainer> = [];

let roadTreePopDelayTop: number = 0;
let roadTreePopDelayBottom: number = 0;
let roadTreePopDelayDefault: number = 100;

let roadSideWalkPopDelayTop: number = 0;
//let roadSideWalkPopDelayBottom: number = 0;
let roadSideWalkPopDelayDefault: number = 100;

//#region Trees 

function SpawnTreesTop() {

	for (let j = 0; j < 5; j++) {

		const treeContainer: GameObjectContainer = new GameObjectContainer();
		treeContainer.x = -1500;
		treeContainer.y = -1500;
		treeContainer.width = roadTreeSize * 5;
		treeContainer.height = roadTreeSize / 2 * 5;		

		// add trees to the tree top container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
			const texture = Texture.from(uri);
			const tree: GameObject = new GameObject(texture);

			tree.x = roadTreeSize * i - (xyAdjustment * i);
			tree.y = (roadTreeSize / 2) * i - ((xyAdjustment / 2) * i);
			tree.width = roadTreeSize;
			tree.height = roadTreeSize;

			treeContainer.addChild(tree);
		}

		roadTreeTopContainers.push(treeContainer);
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

function SpawnTreesBottom() {

	for (let j = 0; j < 5; j++) {

		const treeContainer: GameObjectContainer = new GameObjectContainer();
		treeContainer.x = -1500;
		treeContainer.y = -1500;
		treeContainer.width = roadTreeSize * 5;
		treeContainer.height = roadTreeSize / 2 * 5;		

		// add trees to the tree bottom container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
			const texture = Texture.from(uri);
			const tree: GameObject = new GameObject(texture);

			tree.x = roadTreeSize * i - (xyAdjustment * i);
			tree.y = (roadTreeSize / 2) * i - ((xyAdjustment / 2) * i);
			tree.width = roadTreeSize;
			tree.height = roadTreeSize;

			treeContainer.addChild(tree);
		}

		roadTreeBottomContainers.push(treeContainer);
		app.stage.addChild(treeContainer);
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

//#region Side Walks

function SpawnSideWalksTop() {

	for (let j = 0; j < 5; j++) {

		const sideWalkContainer: GameObjectContainer = new GameObjectContainer();
		sideWalkContainer.x = -1500;
		sideWalkContainer.y = -1500;
		sideWalkContainer.width = roadSideWalkSize * 5;
		sideWalkContainer.height = roadSideWalkSize / 2 * 5;

		// add sideWalks to the sideWalk top container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_WALK);
			const texture = Texture.from(uri);
			const sideWalk: GameObject = new GameObject(texture);

			sideWalk.x = roadSideWalkSize * i - (xyAdjustment * i);
			sideWalk.y = (roadSideWalkSize / 2) * i - ((xyAdjustment / 2) * i);
			sideWalk.width = roadSideWalkSize;
			sideWalk.height = roadSideWalkSize;

			sideWalkContainer.addChild(sideWalk);
		}

		roadSideWalkTopContainers.push(sideWalkContainer);
		app.stage.addChild(sideWalkContainer);
	}
}

function GenerateSideWalksTop() {

	roadSideWalkPopDelayTop -= 0.1;

	if (roadSideWalkPopDelayTop < 0) {

		var container = roadSideWalkTopContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = -1150;
			container.y = container.height * -1;
			container.isAnimating = true;
			roadSideWalkPopDelayTop = roadSideWalkPopDelayDefault;

			// console.log("SideWalk bottom container popped.");
		}
	}
}

function AnimateSideWalksTop() {

	var animatingSideWalks = roadSideWalkTopContainers.filter(x => x.isAnimating == true);

	if (animatingSideWalks) {

		animatingSideWalks.forEach(container => {
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

// spawn game objects
SpawnSideWalksTop();
SpawnTreesTop();

SpawnTreesBottom();

// the ticker 
app.ticker.add(() => {
	GenerateSideWalksTop();
	GenerateTreesTop();

	GenerateTreesBottom();

	AnimateSideWalksTop();
	AnimateTreesTop();
	AnimateTreesBottom();
});