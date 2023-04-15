import { Application, Texture } from 'pixi.js'
import { GameObject } from './GameObject';
import { GameObjectContainer } from './GameObjectContainer';
// import { ConstructTemplate } from './ConstructTemplate';
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
const roadSideTreeSize: number = 450;
const xyAdjustment: number = 31.5;

const treeBottomContainers: Array<GameObjectContainer> = [];
const treeTopContainers: Array<GameObjectContainer> = [];

let treePopDelayTop: number = 0;
let treePopDelayBottom: number = 0;
let treePopDelayDefault: number = 100;


//#region Trees 

//#region Top

function SpawnTreesTop() {

	for (let j = 0; j < 5; j++) {

		const treeContainer: GameObjectContainer = new GameObjectContainer();
		treeContainer.x = -1500;
		treeContainer.y = -1500;
		treeContainer.width = roadSideTreeSize * 5;
		treeContainer.height = roadSideTreeSize / 2 * 5;

		app.stage.addChild(treeContainer);

		// add trees to the tree bottom container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
			const texture = Texture.from(uri);
			const tree: GameObject = new GameObject(texture);

			tree.x = roadSideTreeSize * i - (xyAdjustment * i);
			tree.y = (roadSideTreeSize / 2) * i - ((xyAdjustment / 2) * i);
			tree.width = roadSideTreeSize;
			tree.height = roadSideTreeSize;

			treeContainer.addChild(tree);
		}

		treeTopContainers.push(treeContainer);
	}
}

function GenerateTreesTop() {

	treePopDelayTop -= 0.1;

	if (treePopDelayTop < 0) {

		var container = treeTopContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = -1150;
			container.y = container.height * -1;
			container.isAnimating = true;
			treePopDelayTop = treePopDelayDefault;

			// console.log("Tree bottom container popped.");
		}
	}
}

function AnimateTreesTop() {
	var animatingTrees = treeTopContainers.filter(x => x.isAnimating == true);

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

//#region Bottom

function SpawnTreesBottom() {

	for (let j = 0; j < 5; j++) {

		const treeContainer: GameObjectContainer = new GameObjectContainer();
		treeContainer.x = -1500;
		treeContainer.y = -1500;
		treeContainer.width = roadSideTreeSize * 5;
		treeContainer.height = roadSideTreeSize / 2 * 5;

		app.stage.addChild(treeContainer);

		// add trees to the tree bottom container
		for (let i = 0; i < 5; i++) {

			const uri = Constants.GetRandomUri(ConstructType.ROAD_SIDE_TREE);
			const texture = Texture.from(uri);
			const tree: GameObject = new GameObject(texture);

			tree.x = roadSideTreeSize * i - (xyAdjustment * i);
			tree.y = (roadSideTreeSize / 2) * i - ((xyAdjustment / 2) * i);
			tree.width = roadSideTreeSize;
			tree.height = roadSideTreeSize;

			treeContainer.addChild(tree);
		}

		treeBottomContainers.push(treeContainer);
	}
}

function GenerateTreesBottom() {

	treePopDelayBottom -= 0.1;

	if (treePopDelayBottom < 0) {

		var container = treeBottomContainers.find(x => x.isAnimating == false);

		if (container) {
			container.x = container.width * -1;
			container.y = -650;
			container.isAnimating = true;
			treePopDelayBottom = treePopDelayDefault;

			// console.log("Tree bottom container popped.");
		}
	}
}

function AnimateTreesBottom() {
	var animatingTrees = treeBottomContainers.filter(x => x.isAnimating == true);

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

//#endregion

// spawn game objects
SpawnTreesTop();
SpawnTreesBottom();

// the ticker 
app.ticker.add(() => {

	GenerateTreesTop();
	GenerateTreesBottom();

	AnimateTreesTop();
	AnimateTreesBottom();
});