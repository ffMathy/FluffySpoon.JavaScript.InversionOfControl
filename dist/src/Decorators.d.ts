import "reflect-metadata";
export declare function addInjectableMetadata(sourceConstructor: any, destinationConstructor: any): void;
export declare function Injectable<T extends {
    new (...args: any[]): any;
}>(constructor: T): T;
export declare function Inject(target: any, _propertyKey: string, parameterIndex: number): void;
