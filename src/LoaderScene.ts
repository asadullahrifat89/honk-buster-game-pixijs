import { Container, Graphics, Assets } from "pixi.js";
import { manifest } from "./assets";
import { IScene } from "./IScene";
import { SceneManager } from "./SceneManager";
import { GameTitleScene } from "./GameTitleScene";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export class LoaderScene extends Container implements IScene {

	// for making our loader graphics...
	private loaderBar: Container;
	private loaderBarBoder: Graphics;
	private loaderBarFill: Graphics;

	constructor() {
		super();

		this.filters = [new DropShadowFilter()];

		// lets make a loader graphic:
		const loaderBarWidth = SceneManager.width * 0.8; // just an auxiliar variable

		// the fill of the bar.
		this.loaderBarFill = new Graphics();
		this.loaderBarFill.beginFill(0x008881, 1);
		this.loaderBarFill.drawRoundedRect(0, 0, loaderBarWidth, 50, 10);
		this.loaderBarFill.endFill();
		this.loaderBarFill.scale.x = 0; // we draw the filled bar and with scale we set the %

		// The border of the bar.
		this.loaderBarBoder = new Graphics();
		this.loaderBarBoder.lineStyle(10, 0xffffff, 1);
		this.loaderBarBoder.drawRoundedRect(0, 0, loaderBarWidth, 50, 10);

		// Now we keep the border and the fill in a container so we can move them together.
		this.loaderBar = new Container();
		this.loaderBar.addChild(this.loaderBarFill);
		this.loaderBar.addChild(this.loaderBarBoder);

		//Looks complex but this just centers the bar on screen.
		this.loaderBar.position.x = (SceneManager.width - this.loaderBar.width) / 2;
		this.loaderBar.position.y = (SceneManager.height - this.loaderBar.height) / 2;
		this.addChild(this.loaderBar);

		//const title = new Text("LOADING", {
		//	fontFamily: "gameplay",
		//	fontSize: 35,
		//	align: "center",
		//	fill: "#ffffff",
		//});
		//title.x = SceneManager.width / 2 - title.width / 2;
		//title.y = (SceneManager.height / 2 - title.height / 2) - 120;
		//this.addChild(title);

		// Start loading!
		this.initializeLoader().then(() => {
			// Remember that constructors can't be async, so we are forced to use .then(...) here!
			this.gameLoaded();
		})
	}

	update(_framesPassed: number): void {
		// To be a scene we must have the update method even if we don't use it.
	}

	resize(_scale: number): void {
		//this.scale.set(scale);
	}

	private async initializeLoader(): Promise<void> {
		await Assets.init({ manifest: manifest });

		const bundleIds = manifest.bundles.map(bundle => bundle.name);

		// The second parameter for `loadBundle` is a function that reports the download progress!
		await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
	}

	private downloadProgress(progressRatio: number): void {
		// progressRatio goes from 0 to 1, so set it to scale
		this.loaderBarFill.scale.x = progressRatio;
	}

	private gameLoaded(): void {
		// Our game finished loading!

		// Let's remove our loading bar
		this.removeChild(this.loaderBar);

		// Change scene to the menu scene!
		SceneManager.changeScene(new GameTitleScene());
	}
}