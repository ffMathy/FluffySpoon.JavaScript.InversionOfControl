import "reflect-metadata";
import { Constructor } from "./Types";
export interface IContainerUseResult {
    asSingleInstance(): void;
    asInstancePerRequest(): void;
}
export interface IContainerWhenResult<T> {
    useType(t: Constructor<T>): IContainerUseResult;
    useRequestedType(): IContainerUseResult;
    useFactory(f: () => T): IContainerUseResult;
}
export interface IContainer {
    whenResolvingType<T>(requestingType: Constructor<T>): IContainerWhenResult<T>;
    resolveInstance<T>(typeToResolve: Constructor<T>): T;
}
export declare class Container implements IContainer {
    private readonly _typeMappings;
    private readonly _singletonCache;
    constructor();
    whenResolvingType<T>(requestingType: Constructor<T>): {
        useType: (t: Constructor<T>) => IContainerUseResult;
        useRequestedType: () => IContainerUseResult;
        useFactory: (f: () => T) => IContainerUseResult;
    };
    resolveType<T extends Constructor>(typeToResolve: T): T;
    resolveInstance<T>(typeToResolve: Constructor<T>): T;
    private createNewTypeMapping;
    private findTypeMappingForConstructor;
    private getPathDescription;
    private getSingletonCacheEntry;
    private createInstance;
}
