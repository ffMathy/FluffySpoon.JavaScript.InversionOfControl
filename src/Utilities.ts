import "reflect-metadata";

import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";

export function defineMetadata(target, key, value) {
    Reflect.defineMetadata('@fluffy-spoon/inverse/' + key, value, target);
}

export function getMetadata<T>(target, key) {
    return Reflect.getMetadata('@fluffy-spoon/inverse/' + key, target) as T;
}

export function getOrCreateArgumentsMetadataForTarget(target: any) {
    let argumentInjectionDictionary = getMetadata<ArgumentInjectionDictionary>(target, 'arguments');
    if (!argumentInjectionDictionary) {
        argumentInjectionDictionary = new ArgumentInjectionDictionary();
        defineMetadata(target, 'arguments', argumentInjectionDictionary);
    }
    return argumentInjectionDictionary;
}