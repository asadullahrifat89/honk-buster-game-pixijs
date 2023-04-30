import { Container, Graphics, Assets, Text } from "pixi.js";
import { manifest } from "./assets";
import { IScene } from "./IScene";
import { SceneManager } from "./SceneManager";
import { GameTitleScene } from "./GameTitleScene";
import { ScreenOrientationScene } from "./ScreenOrientationScene";

export class GameLoaderScene extends Container implements IScene {

	// for making our loader graphics...
	private loaderBar: Container;
	private loaderBarBoder: Graphics;
	private loaderBarFill: Graphics;
	private changeOrienationText: Text;

	constructor() {
		super();

		//this.filters = [new DropShadowFilter()];

		// lets make a loader graphic:
		const loaderBarWidth = SceneManager.width * 0.8; // just an auxiliar variable

		// the fill of the bar.
		this.loaderBarFill = new Graphics();
		this.loaderBarFill.beginFill(0x5fc4f8, 1);
		this.loaderBarFill.drawRoundedRect(0, 0, loaderBarWidth, 50, 5);
		this.loaderBarFill.endFill();
		this.loaderBarFill.scale.x = 0; // we draw the filled bar and with scale we set the %

		// The border of the bar.
		this.loaderBarBoder = new Graphics();
		this.loaderBarBoder.lineStyle(10, 0xffffff, 1);
		this.loaderBarBoder.drawRoundedRect(0, 0, loaderBarWidth, 50, 5);

		// Now we keep the border and the fill in a container so we can move them together.
		this.loaderBar = new Container();
		this.loaderBar.addChild(this.loaderBarFill);
		this.loaderBar.addChild(this.loaderBarBoder);

		//Looks complex but this just centers the bar on screen.
		this.loaderBar.position.x = (SceneManager.width - this.loaderBar.width) / 2;
		this.loaderBar.position.y = (SceneManager.height - this.loaderBar.height) / 2;
		this.addChild(this.loaderBar);

		this.changeOrienationText = new Text("Pls Change Screen Orientation", {
			fontFamily: "gameplay",
			fontSize: 18,
			align: "center",
			fill: "#ffffff",
		});
		this.changeOrienationText.x = SceneManager.width / 2 - this.changeOrienationText.width / 2;
		this.changeOrienationText.y = (SceneManager.height / 2 - this.changeOrienationText.height / 2) - 120;
		this.changeOrienationText.alpha = 0;

		this.addChild(this.changeOrienationText);

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

	}

	private async initializeLoader(): Promise<void> {
		await Assets.init({ manifest: manifest });

		const bundleIds = manifest.bundles.map(bundle => bundle.name);

		// The second parameter for `loadBundle` is a function that reports the download progress!
		await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
	}

	private downloadProgress(progressRatio: number): void {
		this.loaderBarFill.scale.x = progressRatio; // progressRatio goes from 0 to 1, so set it to scale
	}

	private gameLoaded(): void {
		// Our game finished loading!

		// check if screen orientation is in correct mode
		if (SceneManager.width < SceneManager.height) {

			// Let's remove our loading bar
			this.removeChild(this.loaderBar);

			// Change scene to the menu scene!
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			// Let's remove our loading bar
			this.removeChild(this.loaderBar);

			// Change scene to the menu scene!
			SceneManager.changeScene(new GameTitleScene());
		}
	}
}