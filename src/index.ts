import { Constants } from './Constants';
import { LoaderScene } from './LoaderScene';
import { SceneManager } from './SceneManager';

SceneManager.initialize(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT, 0x464646);

// Set the game scene
const loaderScene: LoaderScene = new LoaderScene();
SceneManager.changeScene(loaderScene);