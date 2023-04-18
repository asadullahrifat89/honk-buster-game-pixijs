import { ConstructType } from "./Constants";

//#endregion
export class ConstructTemplate {

    public ConstructType: ConstructType = 0;
    public Uri: string = "";

    constructor(constructType: ConstructType, uri: string) {
        this.ConstructType = constructType;
        this.Uri = uri;
    }
}
