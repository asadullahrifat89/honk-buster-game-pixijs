
export class GameCheckpoint {

    private threasholdLimit: number = 0;
    private lastReleasePoint: number = 0;

    constructor(threasholdLimit: number) {
        this.threasholdLimit = threasholdLimit;
    }

    getReleasePointDifference() {
        return this.threasholdLimit;
    }

    shouldRelease(currentPoint: number): boolean {
        var release = currentPoint - this.lastReleasePoint > this.threasholdLimit;
        return release;
    }

    increaseThreasholdLimit(increment: number, currentPoint: number) {
        this.lastReleasePoint = currentPoint;
        this.threasholdLimit += increment;
    }

    reset(value: number) {
        this.threasholdLimit = value;
        this.lastReleasePoint = 0;
    }
}
