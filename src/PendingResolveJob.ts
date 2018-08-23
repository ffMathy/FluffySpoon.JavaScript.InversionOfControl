import { Constructor } from "./Types";
import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";

export class PendingResolveJob {
    private readonly _argumentInjectionDictionary: ArgumentInjectionDictionary;

    public argumentCount: number;

    get constructor() {
        return this._constructor;
    }

    get parent() {
        return this._parent;
    }

    get argumentIndex() {
        return this._argumentIndex;
    }

    get argumentInjectionDictionary() { 
        return this._argumentInjectionDictionary;
    }

    constructor(
        private _constructor: Constructor, 
        private _parent: PendingResolveJob,
        private _argumentIndex: number) 
    {
        this._argumentInjectionDictionary = new ArgumentInjectionDictionary();
    }
}