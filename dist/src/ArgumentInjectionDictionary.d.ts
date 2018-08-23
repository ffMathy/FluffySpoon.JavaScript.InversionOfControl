export declare class ArgumentInjectionDictionary {
    private _target;
    private readonly _dictionary;
    private readonly _indexes;
    constructor(_target: any);
    getParameterIndexes(): number[];
    getParameter(index: number): any;
    toParameterArray(): any[];
    updateParameterAtIndex(index: number, value?: any): void;
}
