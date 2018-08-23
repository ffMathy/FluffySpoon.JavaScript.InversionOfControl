import { Constructor } from "./Types";
import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";
export declare class PendingResolveJob {
    private _constructor;
    private _parent;
    private _argumentIndex;
    private readonly _argumentInjectionDictionary;
    argumentCount: number;
    readonly constructor: Constructor<any>;
    readonly parent: PendingResolveJob;
    readonly argumentIndex: number;
    readonly argumentInjectionDictionary: ArgumentInjectionDictionary;
    constructor(_constructor: Constructor, _parent: PendingResolveJob, _argumentIndex: number);
}
