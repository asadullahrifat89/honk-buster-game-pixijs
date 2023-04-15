import { Manager } from './Manager';
import { GameScene } from './GameScene';
import { Constants } from './Constants';

Manager.initialize(Constants.DEFAULT_GAME_VIEW_WIDTH, Constants.DEFAULT_GAME_VIEW_HEIGHT, 0x464646);

// Set the game scene
const gameScene: GameScene = new GameScene();
Manager.changeScene(gameScene);

// Resize the scene
Manager.resize();