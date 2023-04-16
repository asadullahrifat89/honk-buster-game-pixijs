import { Application } from "pixi.js";
import { IScene } from "./IScene";

export class Manager {

	private constructor() {
		/*this class is purely static. No constructor to see here*/
	}

	// Safely store variables for our game
	private static app: Application;
	private static currentScene: IScene;

	// Width and Height are read-only after creation (for now)
	private static _width: number;
	private static _height: number;

	// With getters but not setters, these variables become read-only
	public static get width(): number {
		return Manager._width;
	}

	public static get height(): number {
		return Manager._height;
	}

	// Use this function ONCE to start the entire machinery
	public static initialize(width: number, height: number, background: number): void {

		// store our width and height
		Manager._width = width;
		Manager._height = height;

		// Create our pixi app
		Manager.app = new Application({
			view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
			resizeTo: window, // This line here handles the actual resize!
			resolution: window.devicePixelRatio || 1,
			autoDensity: true,
			backgroundColor: background,
			width: width,
			height: height
		});

		// Add the ticker
		Manager.app.ticker.add(Manager.update)

		// listen for the browser telling us that the screen size changed
		window.addEventListener("resize", Manager.resize);		
	}


	public static resize(): void {

		const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		console.log("ScreenWidth: " + screenWidth);

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

		// if we have a scene, we let it know that a resize happened!
		if (Manager.currentScene) {
			Manager.currentScene.resize(scaling);
		}
	}

	// Call this function when you want to go to a new scene
	public static changeScene(newScene: IScene): void {
		// Remove and destroy old scene... if we had one..
		if (Manager.currentScene) {
			Manager.app.stage.removeChild(Manager.currentScene);
			Manager.currentScene.destroy();
		}

		// Add the new one
		Manager.currentScene = newScene;
		Manager.app.stage.addChild(Manager.currentScene);
	}

	// This update will be called by a pixi ticker and tell the scene that a tick happened
	private static update(framesPassed: number): void {
		// Let the current scene know that we updated it...
		// Just for funzies, sanity check that it exists first.
		if (Manager.currentScene) {
			Manager.currentScene.update(framesPassed);
		}

		// as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
	}
}
