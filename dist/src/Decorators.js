"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Utilities_1 = require("./Utilities");
function Injectable(constructor) {
    var className = Utilities_1.extractClassName(constructor);
    var type = Reflect.getMetadata("design:paramtypes", constructor);
    Utilities_1.defineMetadata(constructor, 'argumentCount', !type ? 0 : type.length);
    var argumentInjectionDictionary = Utilities_1.getOrCreateArgumentsMetadataForTarget(constructor);
    var argumentIndexes = argumentInjectionDictionary.getParameterIndexes();
    for (var _i = 0, argumentIndexes_1 = argumentIndexes; _i < argumentIndexes_1.length; _i++) {
        var argumentIndex = argumentIndexes_1[_i];
        if (!type[argumentIndex])
            throw new Error('Could not extract type information for constructor parameter index ' + argumentIndex + ' of class ' + className + '. Make sure that class ' + className + ' is defined below the class it is using.');
        argumentInjectionDictionary.updateParameterAtIndex(argumentIndex, type[argumentIndex]);
    }
    return constructor;
}
exports.Injectable = Injectable;
function Inject(target, _propertyKey, parameterIndex) {
    var argumentInjectionDictionary = Utilities_1.getOrCreateArgumentsMetadataForTarget(target);
    argumentInjectionDictionary.updateParameterAtIndex(parameterIndex);
}
exports.Inject = Inject;
//# sourceMappingURL=Decorators.js.map