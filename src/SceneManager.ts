import { Application } from "pixi.js";
import { IScene } from "./IScene";

export class SceneManager {

	//#region Properties

	private static app: Application;
	private static currentScene: IScene;

	public static scaling: number = 1;
	public static isNavigating: boolean = false;

	//#endregion

	//#region Methods

	private constructor() {
		/*this class is purely static. No constructor to see here*/
	}

	// Use this function ONCE to start the entire machinery
	public static initialize(width: number, height: number, background: number): void {

		// Create our pixi app
		SceneManager.app = new Application({
			view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
			resizeTo: window, // This line here handles the actual resize!
			resolution: window.devicePixelRatio || 1,
			autoDensity: true,
			backgroundColor: background,
			width: width,
			height: height,
			sharedTicker: true,
		});

		// Add the ticker
		SceneManager.app.ticker.minFPS = 50;
		SceneManager.app.ticker.maxFPS = 60;

		SceneManager.app.ticker.add(SceneManager.update)

		// listen for the browser telling us that the screen size changed
		window.addEventListener("resize", SceneManager.resize);
	}	

	public static get width(): number {
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}

	public static get height(): number {
		return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	}

	// With this fucntion scaling factor is decided and passed on the the scene
	public static resize(): void {

		// set the scaling on resize
		this.scaling = SceneManager.getScaling();

		// if we have a scene, we let it know that a resize happened!
		if (SceneManager.currentScene) {
			SceneManager.currentScene.resize(this.scaling);
		}
	}

	// Call this function when you want to go to a new scene
	public static changeScene(newScene: IScene): void {

		this.isNavigating = false;

		// if the screen supports fullscreen, toggle it
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}

		// Remove and destroy old scene... if we had one..
		if (SceneManager.currentScene) {
			SceneManager.app.stage.removeChild(SceneManager.currentScene);
			SceneManager.currentScene.destroy();
		}

		// Add the new one
		SceneManager.currentScene = newScene;
		SceneManager.app.stage.addChild(SceneManager.currentScene);
		SceneManager.resize();
	}

	private static getScaling() {
		const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		var scaling: number = 1;

		if (screenWidth <= 300)
			scaling = 0.40;
		else if (screenWidth <= 400)
			scaling = 0.45;
		else if (screenWidth <= 500)
			scaling = 0.50;
		else if (screenWidth <= 700)
			scaling = 0.55;
		else if (screenWidth <= 900)
			scaling = 0.60;
		else if (screenWidth <= 950)
			scaling = 0.65;
		else if (screenWidth <= 1000)
			scaling = 0.85;
		else if (screenWidth <= 1400)
			scaling = 0.90;
		else if (screenWidth <= 1900)
			scaling = 0.95;
		else scaling = 1;

		console.log("ScreenWidth: " + screenWidth);
		console.log("Scaling: " + scaling);

		return scaling;
	}

	// This update will be called by a pixi ticker and tell the scene that a tick happened
	private static update(framesPassed: number): void {

		// console.log("FPS: " + Manager.app.ticker.FPS);

		// Let the current scene know that we updated it...
		// Just for funzies, sanity check that it exists first.
		if (SceneManager.currentScene) {
			SceneManager.currentScene.update(framesPassed);
		}

		// as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
	}

	//#endregion
}

