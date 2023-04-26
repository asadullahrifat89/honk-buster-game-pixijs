import { ConstructType } from "./Constants";

export class ConstructTemplate {

    public constructType: ConstructType = 0;
    public uri: string = "";

    constructor(constructType: ConstructType, uri: string) {
        this.constructType = constructType;
        this.uri = uri;
    }
}

