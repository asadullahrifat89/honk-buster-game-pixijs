import { Constants } from './Constants';
import { GameObject } from './GameObject';

export class VehicleBase extends GameObject {

	private honkDelay: number = 0;

	public willHonk: boolean = false;

	constructor(speed: number) {
		super(speed);
	}

	reposition() {
		var topOrLeft = Constants.getRandomNumber(0, 1); // generate top and left corner lane wise vehicles
		var lane = Constants.getRandomNumber(0, 1); // generate number of lanes based of screen height
		var randomY = Constants.getRandomNumber(-5, 5);

		switch (topOrLeft) {
			case 0:
				{
					var xLaneWidth = Constants.DEFAULT_GAME_VIEW_WIDTH / 4;

					switch (lane) {
						case 0:
							{
								this.setPosition(0 - this.width / 2, (this.height * -1) + randomY);
								break;
							}
						case 1:
							{
								this.setPosition((xLaneWidth - this.width / 1.5), (this.height * -1) + randomY);
								break;
							}
						default:
							break;
					}

					break;
				}
			case 1:
				{
					var yLaneHeight = Constants.DEFAULT_GAME_VIEW_HEIGHT / 6;

					switch (lane) {
						case 0:
							{
								this.setPosition(this.width * -1, (0 - this.height / 2) + randomY);
								break;
							}

						case 1:
							{
								this.setPosition(this.width * -1, (yLaneHeight - this.height / 3) + randomY);
								break;
							}
						default:
							break;
					}

					break;
				}
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

