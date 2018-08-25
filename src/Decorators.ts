import "reflect-metadata";

import { defineMetadata, getOrCreateArgumentsMetadataForTarget, extractClassName } from "./Utilities";

export function addInjectableMetadata(sourceConstructor: any, destinationConstructor: any) {
    const className = extractClassName(sourceConstructor);

    let type = Reflect.getMetadata("design:paramtypes", sourceConstructor) as any[];

    defineMetadata(destinationConstructor, 'name', className);
    defineMetadata(destinationConstructor, 'argumentCount', !type ? 0 : type.length);

    let argumentInjectionDictionary = getOrCreateArgumentsMetadataForTarget(destinationConstructor);

    let argumentIndexes = argumentInjectionDictionary.getParameterIndexes();
    for(var argumentIndex of argumentIndexes) {
        if(!type[argumentIndex])
            throw new Error('Could not extract type information for constructor parameter index ' + argumentIndex + ' of class ' + className + '. Make sure that class ' + className + ' is defined below the class it is using.');

        argumentInjectionDictionary.updateParameterAtIndex(argumentIndex, type[argumentIndex]);
    }
}

export function Injectable<T extends { new(...args: any[]): any }>(constructor: T) {
    addInjectableMetadata(constructor, constructor);
    return constructor;
}

export function Inject(target: any, _propertyKey: string, parameterIndex: number) {
    let argumentInjectionDictionary = getOrCreateArgumentsMetadataForTarget(target);
    argumentInjectionDictionary.updateParameterAtIndex(parameterIndex);
}