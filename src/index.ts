import { Manager } from './Manager';
import { Constants } from './Constants';
import { LoaderScene } from './LoaderScene';

Manager.initialize(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT, 0x464646);

// Set the game scene
const loaderScene: LoaderScene = new LoaderScene();
Manager.changeScene(loaderScene);

// Resize the scene
Manager.resize();