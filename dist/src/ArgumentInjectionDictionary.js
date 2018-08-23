"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utilities_1 = require("./Utilities");
var ArgumentInjectionDictionary = /** @class */ (function () {
    function ArgumentInjectionDictionary(_target) {
        this._target = _target;
        this._dictionary = {};
        this._indexes = [];
    }
    ArgumentInjectionDictionary.prototype.getParameterIndexes = function () {
        return this._indexes.slice();
    };
    ArgumentInjectionDictionary.prototype.getParameter = function (index) {
        if (!this._dictionary[index.toString()])
            throw new Error('No parameter at index ' + index + ' was found on constructor of class ' + Utilities_1.extractClassName(this._target) + '.');
        return this._dictionary[index.toString()];
    };
    ArgumentInjectionDictionary.prototype.toParameterArray = function () {
        var parameters = new Array();
        for (var _i = 0, _a = this._indexes; _i < _a.length; _i++) {
            var index = _a[_i];
            parameters.push(this.getParameter(index));
        }
        return parameters;
    };
    ArgumentInjectionDictionary.prototype.updateParameterAtIndex = function (index, value) {
        if (value || !this._dictionary[index.toString()])
            this._dictionary[index.toString()] = value || null;
        if (this._indexes.indexOf(index) === -1)
            this._indexes.push(index);
    };
    return ArgumentInjectionDictionary;
}());
exports.ArgumentInjectionDictionary = ArgumentInjectionDictionary;
//# sourceMappingURL=ArgumentInjectionDictionary.js.map