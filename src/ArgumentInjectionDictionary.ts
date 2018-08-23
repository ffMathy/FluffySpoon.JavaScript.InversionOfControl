import { extractClassName } from "./Utilities";

export class ArgumentInjectionDictionary {
    private readonly _dictionary;
    private readonly _indexes: number[];

    constructor(private _target: any) {
        this._dictionary = {};
        this._indexes = [];
    }

    getParameterIndexes() {
        return [...this._indexes];
    }

    getParameter(index: number) {
        if(!this._dictionary[index.toString()])
            throw new Error('No parameter at index ' + index + ' was found on constructor of class ' + extractClassName(this._target) + '.');

        return this._dictionary[index.toString()];
    }

    toParameterArray() {
        const parameters = new Array<any>();
        for(let index of this._indexes) {
            parameters.push(this.getParameter(index));
        }

        return parameters;
    }

    updateParameterAtIndex(index: number, value?: any) {
        if(value || !this._dictionary[index.toString()])
            this._dictionary[index.toString()] = value || null;
        
        if(this._indexes.indexOf(index) === -1)
            this._indexes.push(index);
    }
}