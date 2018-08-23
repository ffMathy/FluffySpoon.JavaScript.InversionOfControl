import "reflect-metadata";
import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";
import { Constructor } from "./Types";
export declare function defineMetadata(target: any, key: any, value: any): void;
export declare function getMetadata<T>(target: any, key: any): T;
export declare function getOrCreateArgumentsMetadataForTarget(target: any): ArgumentInjectionDictionary;
export declare function extractClassName(constructor: Constructor<any>): any;
