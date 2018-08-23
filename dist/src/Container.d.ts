import "reflect-metadata";
import { Constructor } from "./Types";
export declare class Container {
    private readonly _typeMappings;
    constructor();
    whenRequestingType<T>(requestingType: Constructor<T>): {
        useType: (useType: Constructor<T>) => number;
    };
    resolve<T>(typeToResolve: Constructor<T>): T;
}
