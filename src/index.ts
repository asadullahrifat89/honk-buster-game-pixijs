import { Constants } from './Constants';
import { GameLoaderScene } from './GameLoaderScene';
import { SceneManager } from './managers/SceneManager';

SceneManager.initialize(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT, 0x4187ab);
const loaderScene: GameLoaderScene = new GameLoaderScene();
SceneManager.changeScene(loaderScene);