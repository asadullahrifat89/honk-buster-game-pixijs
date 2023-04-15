import { Application, Sprite, Container, Texture } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	// backgroundColor: 0x6495ed,
	width: 1900,
	height: 940
});

class GameObjectContainer extends Container {

	public isAnimating: boolean = false;

	constructor() {
		super();
		this.isAnimating = false;

	}
}

class GameObject extends Sprite {

	public isAnimating: boolean = false;

	constructor(texture: Texture) {
		super();

		this.isAnimating = false;
		this.texture = texture;

	}

	setContent(texture: Texture) {
		this.texture = texture;
	}
}

const defaultSpeed: number = 2;
const roadSideTreeSize: number = 256;
const xyAdjustment: number = 31.5;

const treeBottomContainers: Array<GameObjectContainer> = [];

let treePopDelay: number = 36;

// add tree bottom containers
for (let j = 0; j < 5; j++) {

	const treeBottomContainer: GameObjectContainer = new GameObjectContainer();
	treeBottomContainer.x = -1500;
	treeBottomContainer.y = -1500;
	treeBottomContainer.width = roadSideTreeSize * 5;
	treeBottomContainer.height = roadSideTreeSize / 2 * 5;
	app.stage.addChild(treeBottomContainer);

	// add trees to the tree bottom container
	for (let i = 0; i < 5; i++) {

		const texture = Texture.from("tree_1.png");
		const tree: GameObject = new GameObject(texture);

		tree.x = roadSideTreeSize * i - (xyAdjustment * i);
		tree.y = (roadSideTreeSize / 2) * i - ((xyAdjustment / 2) * i);
		tree.width = roadSideTreeSize;
		tree.height = roadSideTreeSize;

		treeBottomContainer.addChild(tree);
	}

	treeBottomContainers.push(treeBottomContainer);
}

app.ticker.add(() => {

	treePopDelay -= 0.1;

	if (treePopDelay < 0) {

		var treeBottomContainer = treeBottomContainers.find(x => x.isAnimating == false);

		if (treeBottomContainer) {
			treeBottomContainer.x = treeBottomContainer.width * -1.1;
			treeBottomContainer.y = (app.screen.height * -1);
			treeBottomContainer.isAnimating = true;
			treePopDelay = 36;

			console.log("Tree bottom container popped.");
		}
	}

	var animatingTrees = treeBottomContainers.filter(x => x.isAnimating == true);

	if (animatingTrees) {

		animatingTrees.forEach(container => {
			container.x += defaultSpeed;
			container.y += defaultSpeed / 2;

			if (container.x > app.screen.width || container.y > app.screen.height) {
				container.x = -1500;
				container.y = -1500;
				container.isAnimating = false;
			}
		});
	}

});