"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentInjectionDictionary = /** @class */ (function () {
    function ArgumentInjectionDictionary() {
        this._dictionary = {};
        this._indexes = [];
    }
    ArgumentInjectionDictionary.prototype.getParameterIndexes = function () {
        return this._indexes.slice();
    };
    ArgumentInjectionDictionary.prototype.getParameter = function (index) {
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
        this._dictionary[index.toString()] = value || null;
        if (this._indexes.indexOf(index) === -1)
            this._indexes.push(index);
    };
    return ArgumentInjectionDictionary;
}());
exports.ArgumentInjectionDictionary = ArgumentInjectionDictionary;
//# sourceMappingURL=ArgumentInjectionDictionary.js.map