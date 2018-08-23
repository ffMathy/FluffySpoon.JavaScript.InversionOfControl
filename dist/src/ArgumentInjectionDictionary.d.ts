export declare class ArgumentInjectionDictionary {
    private readonly _dictionary;
    private readonly _indexes;
    constructor();
    getParameterIndexes(): number[];
    getParameter(index: number): any;
    toParameterArray(): any[];
    updateParameterAtIndex(index: number, value?: any): void;
}
