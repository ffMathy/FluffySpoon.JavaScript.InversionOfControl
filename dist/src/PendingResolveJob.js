"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentInjectionDictionary_1 = require("./ArgumentInjectionDictionary");
var PendingResolveJob = /** @class */ (function () {
    function PendingResolveJob(_constructor, _parent, _argumentIndex) {
        this._constructor = _constructor;
        this._parent = _parent;
        this._argumentIndex = _argumentIndex;
        this._argumentInjectionDictionary = new ArgumentInjectionDictionary_1.ArgumentInjectionDictionary();
    }
    Object.defineProperty(PendingResolveJob.prototype, "constructor", {
        get: function () {
            return this._constructor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PendingResolveJob.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PendingResolveJob.prototype, "argumentIndex", {
        get: function () {
            return this._argumentIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PendingResolveJob.prototype, "argumentInjectionDictionary", {
        get: function () {
            return this._argumentInjectionDictionary;
        },
        enumerable: true,
        configurable: true
    });
    return PendingResolveJob;
}());
exports.PendingResolveJob = PendingResolveJob;
//# sourceMappingURL=PendingResolveJob.js.map