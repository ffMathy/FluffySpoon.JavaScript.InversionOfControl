import "reflect-metadata";
export declare function getParameterTypesMetadata(target: any): any;
export declare function addInjectableMetadata(constructor: any): void;
export declare function Injectable<T extends {
    new (...args: any[]): any;
}>(constructor: T): T;
export declare function Inject(target: any, _propertyKey: string, parameterIndex: number): void;
