import { Container, Text, BlurFilter } from "pixi.js";
import { ScreenOrientationScene } from "./ScreenOrientationScene";
import { IScene } from "../managers/IScene";
import { GameObjectContainer } from "../core/GameObjectContainer";
import { Constants, ConstructType, SoundType } from "../Constants";
import { SceneManager } from "../managers/SceneManager";
import { GameObjectSprite } from "../core/GameObjectSprite";
import { Button } from "../controls/Button";
import { SoundManager } from "../managers/SoundManager";
import { PlayerGearSelectionScene } from "./PlayerGearSelectionScene";
import { SelectionButton } from "../controls/SelectionButton";


export class PlayerCharacterSelectionScene extends Container implements IScene {

	private uiContainer: GameObjectContainer;
	private bg_container: GameObjectContainer;

	constructor() {
		super();

		this.uiContainer = new GameObjectContainer();
		this.uiContainer.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		this.uiContainer.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		this.addChild(this.uiContainer);

		const bg_sprite: GameObjectSprite = new GameObjectSprite(Constants.getRandomTexture(ConstructType.GAME_COVER_IMAGE));
		bg_sprite.x = 0;
		bg_sprite.y = 0;
		bg_sprite.width = Constants.DEFAULT_GAME_VIEW_WIDTH / 2;
		bg_sprite.height = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;
		bg_sprite.filters = [new BlurFilter()];

		this.bg_container = new GameObjectContainer();
		this.bg_container.setHoverSpeed(0.2);
		this.bg_container.addChild(bg_sprite);

		this.uiContainer.addChild(this.bg_container);

		const title = new Text("Select a Character", {
			fontFamily: Constants.GAME_DEFAULT_FONT,
			fontSize: 35,
			align: "center",
			fill: "#ffffff",
		});
		title.x = this.uiContainer.width / 2 - title.width / 2;
		title.y = (this.uiContainer.height / 2 - title.height / 2) - 120;
		this.uiContainer.addChild(title);

		//#region player 1

		const player_1_button = new SelectionButton("player_1_character", 208 / 2, 256 / 2, "Lvl " + 1, () => {

			button.setText("Rad").setIsEnabled(true);
			player_1_button.select();
			player_2_button.unselect();
			Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE = 0;
			SoundManager.play(SoundType.ITEM_SELECT);
		});

		player_1_button.setPosition((this.uiContainer.width / 2 - player_1_button.width * 2) + 100, this.uiContainer.height / 2 - player_1_button.height / 2 + 10);
		this.uiContainer.addChild(player_1_button);

		//#endregion

		//#region player 2

		const player_2_button = new SelectionButton("player_2_character", 208 / 2, 256 / 2, "Coming Soon", () => {

			button.setText("Rodney").setIsEnabled(true);
			player_2_button.select();
			player_1_button.unselect();
			Constants.SELECTED_PLAYER_CHARACTER_TEMPLATE = 1;
			SoundManager.play(SoundType.ITEM_SELECT);
		}, false);

		player_2_button.setPosition((this.uiContainer.width / 2 - player_2_button.width / 2) + 180, this.uiContainer.height / 2 - player_2_button.height / 2 + 10);
		this.uiContainer.addChild(player_2_button);

		//#endregion

		const button = new Button(() => {
			if (button.getIsEnabled()) {
				SoundManager.play(SoundType.OPTION_SELECT);
				this.removeChild(this.uiContainer);
				this.uiContainer.destroy();
				SceneManager.changeScene(new PlayerGearSelectionScene());
			}
			else {
				SoundManager.play(SoundType.DAMAGE_TAKEN);
			}

		}).setText("Select").setIsEnabled(false);
		button.setPosition(this.uiContainer.width / 2 - button.width / 2, this.uiContainer.height - button.height * 2);
		this.uiContainer.addChild(button);
	}

	public update() {
	}

	public resize(scale: number): void {

		if (SceneManager.width < SceneManager.height) {
			this.removeChild(this.uiContainer);
			this.uiContainer.destroy();
			SceneManager.changeScene(new ScreenOrientationScene());
		}
		else {
			this.uiContainer.scale.set(scale);
			this.uiContainer.setPosition(SceneManager.width / 2 - this.uiContainer.width / 2, SceneManager.height / 2 - this.uiContainer.height / 2);
		}
	}
}

