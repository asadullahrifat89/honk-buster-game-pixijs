import { Constants } from './Constants';
import { SceneManager } from './managers/SceneManager';
import { GameLoaderScene } from './scenes/GameLoaderScene';

SceneManager.initialize(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT, 0x8b482f);
const loaderScene: GameLoaderScene = new GameLoaderScene();
SceneManager.changeScene(loaderScene);