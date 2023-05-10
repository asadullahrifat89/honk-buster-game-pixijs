import { Rectangle } from 'pixi.js';
import { RocketBase } from './RocketBase';


export class SeekingRocketBase extends RocketBase {

	private readonly grace: number = 7;
	public directTarget: Rectangle = new Rectangle();

	private shootXSpeed: number = 0;
	private shootYSpeed: number = 0;

	setShootTarget(target: Rectangle) {

		let rocketX = this.getLeft() + this.width / 2;
		let rocketY = this.getTop() + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		var distanceY = Math.abs(targetY - rocketY);
		this.shootYSpeed = this.getShootingSpeed(distanceY);

		var distanceX = Math.abs(targetX - rocketX);
		this.shootXSpeed = this.getShootingSpeed(distanceX);

		//var scaling = SceneManager.scaling;

		// move up
		if (targetY < rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.directTarget.y = targetY - distance;

			//if (this.directTarget.y > 0)
			//	this.directTarget.y -= distance;
		}

		// move down
		if (targetY > rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.directTarget.y = targetY + distance;

			//if (this.directTarget.y < Constants.DEFAULT_GAME_VIEW_HEIGHT * scaling)
			//	this.directTarget.y += distance;
		}

		// move left
		if (targetX < rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.directTarget.x = targetX - distance;

			//if (this.directTarget.x > 0)
			//	this.directTarget.x -= distance;
		}

		// move right
		if (targetX > rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.directTarget.x = targetX + distance;

			//if (this.directTarget.x < Constants.DEFAULT_GAME_VIEW_WIDTH * scaling)
			//	this.directTarget.x += distance;
		}
	}

	setDirectTarget(target: Rectangle) {

		let rocketX = this.getLeft() + this.width / 2;
		let rocketY = this.getTop() + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		// move up
		if (targetY < rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.directTarget.y = targetY - distance;
		}

		// move down
		if (targetY > rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.directTarget.y = targetY + distance;
		}

		// move left
		if (targetX < rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.directTarget.x = targetX - distance;
		}

		// move right
		if (targetX > rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.directTarget.x = targetX + distance;
		}
	}

	shoot(target: Rectangle) {

		let left = this.getLeft();
		let top = this.getTop();

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		let rocketX = left + this.width / 2;
		let rocketY = top + this.height / 2;

		// move up
		if (targetY < rocketY - this.grace) {
			this.y = (top - this.shootYSpeed);
		}

		// move down
		if (targetY > rocketY + this.grace) {
			this.y = (top + this.shootYSpeed);
		}

		// move left
		if (targetX < rocketX - this.grace) {
			this.x = (left - this.shootXSpeed);
		}

		// move right
		if (targetX > rocketX + this.grace) {
			this.x = (left + this.shootXSpeed);
		}
	}

	direct(target: Rectangle) {

		let left = this.getLeft();
		let top = this.getTop();

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		let rocketX = left + this.width / 2;
		let rocketY = top + this.height / 2;

		// move up
		if (targetY < rocketY - this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getDirectingSpeed(distance);

			this.y = (top - speed);
		}

		// move down
		if (targetY > rocketY + this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getDirectingSpeed(distance);

			this.y = (top + speed);
		}

		// move left
		if (targetX < rocketX - this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getDirectingSpeed(distance);

			this.x = (left - speed);
		}

		// move right
		if (targetX > rocketX + this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getDirectingSpeed(distance);

			this.x = (left + speed);
		}
	}

	follow(target: Rectangle) {

		let left = this.getLeft();
		let top = this.getTop();

		let rocketX = left + this.width / 2;
		let rocketY = top + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		// move up
		if (targetY < rocketY - this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getFollowingSpeed(distance);

			this.y = (top - speed);
		}

		// move down
		if (targetY > rocketY + this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getFollowingSpeed(distance);

			this.y = (top + speed);
		}

		// move left
		if (targetX < rocketX - this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getFollowingSpeed(distance);

			this.x = (left - speed);
		}

		// move right
		if (targetX > rocketX + this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getFollowingSpeed(distance);

			this.x = (left + speed);
		}
	}	

	private getFollowingSpeed(distance: number): number {
		var speed = (1.5 / 100 * distance);
		return speed;
	}

	private getShootingSpeed(distance: number): number {
		var speed = (1.5 / 70 * distance);
		return speed;
	}

	private getDirectingSpeed(distance: number): number {
		var speed = (1.5 / 100 * distance);
		return speed;
	}
}

