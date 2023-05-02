
export class GameCheckpoint {

    private limit: number = 0;
    private lastReleasePoint: number = 0;

    constructor(limit: number) {
        this.limit = limit;
    }

    getReleasePointDifference() {
        return this.limit;
    }

    shouldRelease(currentPoint: number): boolean {
        var release = currentPoint - this.lastReleasePoint > this.limit;
        return release;
    }

    increaseLimit(limit: number, currentPoint: number) {
        this.lastReleasePoint = currentPoint;
        this.limit += limit;
    }

    reset(value: number) {
        this.limit = value;
        this.lastReleasePoint = 0;
    }
}
