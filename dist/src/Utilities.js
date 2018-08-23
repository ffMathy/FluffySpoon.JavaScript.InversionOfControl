"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ArgumentInjectionDictionary_1 = require("./ArgumentInjectionDictionary");
function defineMetadata(target, key, value) {
    Reflect.defineMetadata('@fluffy-spoon/inverse/' + key, value, target);
}
exports.defineMetadata = defineMetadata;
function getMetadata(target, key) {
    return Reflect.getMetadata('@fluffy-spoon/inverse/' + key, target);
}
exports.getMetadata = getMetadata;
function getOrCreateArgumentsMetadataForTarget(target) {
    var argumentInjectionDictionary = getMetadata(target, 'arguments');
    if (!argumentInjectionDictionary) {
        argumentInjectionDictionary = new ArgumentInjectionDictionary_1.ArgumentInjectionDictionary(target);
        defineMetadata(target, 'arguments', argumentInjectionDictionary);
    }
    return argumentInjectionDictionary;
}
exports.getOrCreateArgumentsMetadataForTarget = getOrCreateArgumentsMetadataForTarget;
function extractClassName(constructor) {
    return (constructor && constructor.name) || constructor;
}
exports.extractClassName = extractClassName;
//# sourceMappingURL=Utilities.js.map