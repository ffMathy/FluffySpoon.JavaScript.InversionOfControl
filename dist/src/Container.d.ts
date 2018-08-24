import "reflect-metadata";
import { Constructor } from "./Types";
export declare class Container {
    private readonly _typeMappings;
    private readonly _singletonCache;
    private _hasResolvedBefore;
    constructor();
    whenResolvingType<T>(requestingType: Constructor<T>): {
        useType: (t: Constructor<T>) => {
            asSingleInstance: () => void;
            asInstancePerRequest: () => string;
        };
        useRequestedType: () => {
            asSingleInstance: () => void;
            asInstancePerRequest: () => string;
        };
        useFactory: (f: () => T) => {
            asSingleInstance: () => void;
            asInstancePerRequest: () => string;
        };
    };
    resolveInstance<T>(typeToResolve: Constructor<T>): T;
    private createNewTypeMapping;
    private findTypeMappingForConstructor;
    private getPathDescription;
    private getSingletonCacheEntry;
    private createInstance;
}
