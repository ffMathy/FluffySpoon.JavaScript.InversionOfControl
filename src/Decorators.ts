import "reflect-metadata";

import { defineMetadata, getOrCreateArgumentsMetadataForTarget } from "./Utilities";

export function Injectable(constructor: any) {
    let type = Reflect.getMetadata("design:paramtypes", constructor);

    defineMetadata(constructor, 'argumentCount', !type ? 0 : type.length);

    let argumentInjectionDictionary = getOrCreateArgumentsMetadataForTarget(constructor);

    let argumentIndexes = argumentInjectionDictionary.getParameterIndexes();
    for(var argumentIndex of argumentIndexes) {
        argumentInjectionDictionary.updateParameterAtIndex(argumentIndex, type[argumentIndex]);
    }

    return constructor;
}

export function Inject(target: any, _propertyKey: string, parameterIndex: number) {
    let argumentInjectionDictionary = getOrCreateArgumentsMetadataForTarget(target);
    argumentInjectionDictionary.updateParameterAtIndex(parameterIndex);
}