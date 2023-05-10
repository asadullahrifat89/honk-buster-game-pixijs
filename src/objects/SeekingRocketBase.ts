import { Point, Rectangle } from 'pixi.js';
import { Constants } from '../Constants';
import { RocketBase } from './RocketBase';


export class SeekingRocketBase extends RocketBase {

	public directTarget: Rectangle = new Rectangle();
	public shootTarget: Point = new Point();

	private readonly grace: number = 7;
	private velocity: { x: number, y: number } = { x: 0, y: 0 };

	setShootTarget(target: Rectangle) {
		const angle = Math.atan2(target.y - this.y, target.x - this.x);
		this.speed = Constants.DEFAULT_CONSTRUCT_SPEED * 3.3;		
		this.velocity = {
			x: Math.cos(angle) * this.speed,
			y: Math.sin(angle) * this.speed
		};
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

	shoot() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	direct() {

		let left = this.getLeft();
		let top = this.getTop();

		let targetX = this.directTarget.x + this.directTarget.width / 2;
		let targetY = this.directTarget.y + this.directTarget.height / 2;

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

	private getDirectingSpeed(distance: number): number {
		var speed = (1.5 / 100 * distance);
		return speed;
	}
}

