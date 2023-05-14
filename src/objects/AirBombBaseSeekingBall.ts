import { Point, Rectangle } from 'pixi.js';
import { AirBombBase } from './AirBombBase';


export class AirBombBaseSeekingBall extends AirBombBase {

	public hurlingTarget: Rectangle = new Rectangle();
	public followingTarget: Rectangle = new Rectangle();
	public shootingTarget: Point = new Point();

	private readonly grace: number = 10;
	private readonly lag: number = 50;
	private velocity: { x: number, y: number } = { x: 0, y: 0 };

	setShootingTarget(target: Rectangle) {
		const angle = Math.atan2((target.y + target.height / 2) - (this.y + this.height / 2), (target.x + target.width / 2) - (this.x + this.width / 2)); // calculate source and target from the center
		this.velocity = {
			x: Math.cos(angle) * this.speed,
			y: Math.sin(angle) * this.speed
		};
	}

	setHurlingTarget(target: Rectangle) {

		let rocketX = this.getLeft() + this.width / 2;
		let rocketY = this.getTop() + this.height / 2;

		let targetX = target.x + target.width / 2;
		let targetY = target.y + target.height / 2;

		// move up
		if (targetY < rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.hurlingTarget.y = targetY - distance;
		}

		// move down
		if (targetY > rocketY) {
			var distance = Math.abs(targetY - rocketY);
			this.hurlingTarget.y = targetY + distance;
		}

		// move left
		if (targetX < rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.hurlingTarget.x = targetX - distance;
		}

		// move right
		if (targetX > rocketX) {
			var distance = Math.abs(targetX - rocketX);
			this.hurlingTarget.x = targetX + distance;
		}
	}

	shoot() {
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	hurl() {

		let left = this.getLeft();
		let top = this.getTop();

		let targetX = this.hurlingTarget.x + this.hurlingTarget.width / 2;
		let targetY = this.hurlingTarget.y + this.hurlingTarget.height / 2;

		let rocketX = left + this.width / 2;
		let rocketY = top + this.height / 2;

		// move up
		if (targetY < rocketY - this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getHurlingSpeed(distance);

			this.y = (top - speed);
		}

		// move down
		if (targetY > rocketY + this.grace) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getHurlingSpeed(distance);

			this.y = (top + speed);
		}

		// move left
		if (targetX < rocketX - this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getHurlingSpeed(distance);

			this.x = (left - speed);
		}

		// move right
		if (targetX > rocketX + this.grace) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getHurlingSpeed(distance);

			this.x = (left + speed);
		}
	}

	follow(target: Rectangle) {

		this.followingTarget = target;

		let left = this.getLeft();
		let top = this.getTop();

		let targetX = this.followingTarget.x + this.followingTarget.width / 2;
		let targetY = this.followingTarget.y + this.followingTarget.height / 2;

		let rocketX = left + this.width / 2;
		let rocketY = top + this.height / 2;

		// move up
		if (targetY - this.grace < rocketY) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getFollowingSpeed(distance);

			this.y = (top - speed);
		}

		// move down
		if (targetY + this.grace > rocketY) {
			var distance = Math.abs(targetY - rocketY);
			let speed = this.getFollowingSpeed(distance);

			this.y = (top + speed);
		}

		// move left
		if (targetX - this.grace < rocketX) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getFollowingSpeed(distance);

			this.x = (left - speed);
		}

		// move right
		if (targetX + this.grace > rocketX) {
			var distance = Math.abs(targetX - rocketX);
			let speed = this.getFollowingSpeed(distance);

			this.x = (left + speed);
		}
	}

	private getFollowingSpeed(distance: number): number {
		var speed = distance / this.lag;
		return speed;
	}

	private getHurlingSpeed(distance: number): number {
		var speed = (1.5 / 100 * distance);
		return speed;
	}
}

