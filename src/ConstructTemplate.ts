import { ConstructType } from "./Constants";

export class ConstructTemplate {

    public ConstructType: ConstructType = 0;
    public Uri: string = "";

    constructor(constructType: ConstructType, uri: string) {
        this.ConstructType = constructType;
        this.Uri = uri;
    }
}
