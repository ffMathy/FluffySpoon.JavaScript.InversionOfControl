import "reflect-metadata";

import { defineMetadata, getOrCreateArgumentsMetadataForTarget, extractClassName } from "./Utilities";

export function addInjectableMetadata<T extends { new(...args: any[]): any }>(constructor: T) {
    const className = extractClassName(constructor);

    let type = Reflect.getMetadata("design:paramtypes", constructor) as any[];

    defineMetadata(constructor, 'argumentCount', !type ? 0 : type.length);

    let argumentInjectionDictionary = getOrCreateArgumentsMetadataForTarget(constructor);

    let argumentIndexes = argumentInjectionDictionary.getParameterIndexes();
    for(var argumentIndex of argumentIndexes) {
        if(!type[argumentIndex])
            throw new Error('Could not extract type information for constructor parameter index ' + argumentIndex + ' of class ' + className + '. Make sure that class ' + className + ' is defined below the class it is using.');

        argumentInjectionDictionary.updateParameterAtIndex(argumentIndex, type[argumentIndex]);
    }
}

export function Injectable<T extends { new(...args: any[]): any }>(constructor: T) {
    addInjectableMetadata(constructor);
    return constructor;
}

export function Inject(target: any, _propertyKey: string, parameterIndex: number) {
    let argumentInjectionDictionary = getOrCreateArgumentsMetadataForTarget(target);
    argumentInjectionDictionary.updateParameterAtIndex(parameterIndex);
}