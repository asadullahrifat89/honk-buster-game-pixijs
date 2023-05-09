import { manifest } from "../assets";
import { Container, Graphics, Assets } from "pixi.js";
import { IScene } from "../managers/IScene";
import { SceneManager } from "../managers/SceneManager";
import { GameTitleScene } from "./GameTitleScene";
import { ScreenOrientationScene } from "./ScreenOrientationScene";


export class GameLoaderScene extends Container implements IScene {

	// for making our loader graphics...
	private loaderBar: Container;
	private loaderBarBoder: Graphics;
	private loaderBarFill: Graphics;

	constructor() {
		super();

		// lets make a loader graphic:
		const loaderBarWidth = SceneManager.width * 0.8; // just an auxiliar variable

		// the fill of the bar.
		this.loaderBarFill = new Graphics().beginFill(/*0x321d21*/0xf73e3e, 1).drawRoundedRect(0, 0, loaderBarWidth, 50, 5).endFill();
		this.loaderBarFill.scale.x = 0; // we draw the filled bar and with scale we set the %

		// The border of the bar.
		this.loaderBarBoder = new Graphics().lineStyle(5, 0xffffff, 1).drawRoundedRect(0, 0, loaderBarWidth, 50, 5);

		// Now we keep the border and the fill in a container so we can move them together.
		this.loaderBar = new Container();
		this.loaderBar.addChild(this.loaderBarFill);
		this.loaderBar.addChild(this.loaderBarBoder);

		//Looks complex but this just centers the bar on screen.
		this.loaderBar.position.x = (SceneManager.width - this.loaderBar.width) / 2;
		this.loaderBar.position.y = (SceneManager.height - this.loaderBar.height) / 2;
		this.addChild(this.loaderBar);

		// Start loading!
		this.initializeLoader().then(() => {
			this.gameLoaded();
		})
	}

	update(): void {
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
			this.removeChild(this.loaderBar);
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.removeChild(this.loaderBar);
			SceneManager.changeScene(new GameTitleScene());
		}
	}
}