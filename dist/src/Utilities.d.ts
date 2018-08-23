import "reflect-metadata";
import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";
export declare function defineMetadata(target: any, key: any, value: any): void;
export declare function getMetadata<T>(target: any, key: any): T;
export declare function getOrCreateArgumentsMetadataForTarget(target: any): ArgumentInjectionDictionary;
