import { Constants } from './Constants';
import { GameObjectContainer } from './GameObjectContainer';

export class VehicleBase extends GameObjectContainer {

	private honkDelay: number = 0;

	public willHonk: boolean = false;

	constructor(speed: number) {
		super(speed);
	}

	reposition() {
		var xOrYlane = Constants.getRandomNumber(0, 1); // generate top and left corner lane wise vehicles
		var lane = Constants.getRandomNumber(0, 1); // generate number of lanes based of screen height
		var randomY = Constants.getRandomNumber(-5, 5);

		switch (xOrYlane) {
			case 0:
				{
					var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;

					switch (lane) {
						case 0:
							{
								this.setPosition(0 - this.width, (this.height * -1) + randomY);

							}
							break;
						case 1:
							{
								this.setPosition((xLaneWidth - this.width), (this.height * -1) + randomY);

							}
							break;
						default:
							break;
					}
				}
				break;
			case 1:
				{
					var yLaneHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT / 6;

					switch (lane) {
						case 0:
							{
								this.setPosition(this.width * -1, (0 - this.height / 2) + randomY);

							}
							break;
						case 1:
							{
								this.setPosition(this.width * -1, (yLaneHeight - this.height / 3) + randomY);

							}
							break;
						default:
							break;
					}
				}
				break;
			default:
				break;
		}
	}

	repositionReverse() {
		var xOrYlane = Constants.getRandomNumber(0, 1); // generate top and left corner lane wise vehicles
		var lane = Constants.getRandomNumber(0, 1); // generate number of lanes based of screen height
		var randomY = Constants.getRandomNumber(-5, 5);

		switch (xOrYlane) {
			case 0:
				{
					var yLaneHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

					switch (lane) {
						case 0:
							{
								this.setPosition(Constants.DEFAULT_GAME_VIEW_WIDTH + this.width, yLaneHeight + (this.height) + randomY);
								console.log("x lane 0");
							}
							break;
						case 1:
							{
								this.setPosition(Constants.DEFAULT_GAME_VIEW_WIDTH + this.width, yLaneHeight + yLaneHeight + randomY);
								console.log("x lane 1");
							}
							break;
						default:
							break;
					}
				}
				break;
			case 1:
				{
					var yLaneHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT / 2;

					switch (lane) {
						case 0:
							{
								this.setPosition(Constants.DEFAULT_GAME_VIEW_WIDTH + this.width, Constants.DEFAULT_GAME_VIEW_HEIGHT + (this.height / 2) + randomY);
								console.log("y lane 0");
							}
							break;
						case 1:
							{
								this.setPosition(Constants.DEFAULT_GAME_VIEW_WIDTH + this.width, Constants.DEFAULT_GAME_VIEW_HEIGHT + (yLaneHeight - this.height / 2) + randomY);
								console.log("y lane 1");
							}
							break;
						default:
							break;
					}
				}
				break;
			default:
				break;
		}
	}

	honk(): boolean {
		if (this.willHonk) {
			this.honkDelay--;

			if (this.honkDelay < 0) {
				this.setHonkDelay();
				return true;
			}
		}

		return false;
	}

	setHonkDelay() {
		this.honkDelay = Constants.getRandomNumber(40, 80);
	}
}

