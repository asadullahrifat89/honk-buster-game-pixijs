import { Constants } from './Constants';
import { SceneManager } from './managers/SceneManager';
import { GameLoaderScene } from './scenes/GameLoaderScene';

SceneManager.initialize(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT, /*0x8b482f*/0x1e2a36);
const loaderScene = new GameLoaderScene();
SceneManager.changeScene(loaderScene);