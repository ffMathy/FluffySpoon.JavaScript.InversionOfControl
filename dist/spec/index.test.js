"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var src_1 = require("../src");
var B1 = /** @class */ (function () {
    function B1() {
    }
    B1 = __decorate([
        src_1.Injectable
    ], B1);
    return B1;
}());
var B2 = /** @class */ (function () {
    function B2() {
    }
    B2 = __decorate([
        src_1.Injectable
    ], B2);
    return B2;
}());
var A1 = /** @class */ (function () {
    function A1(a) {
        this.a = a;
    }
    A1 = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __metadata("design:paramtypes", [B1])
    ], A1);
    return A1;
}());
var A2 = /** @class */ (function () {
    function A2() {
    }
    A2 = __decorate([
        src_1.Injectable
    ], A2);
    return A2;
}());
var Bar = /** @class */ (function () {
    function Bar(a, b) {
        this.a = a;
        this.b = b;
    }
    Bar = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __param(1, src_1.Inject),
        __metadata("design:paramtypes", [A1,
            A2])
    ], Bar);
    return Bar;
}());
var container;
ava_1.default.beforeEach(function () {
    container = new src_1.Container();
});
ava_1.default('can resolve Bar', function (t) {
    t.notDeepEqual(container.resolve(Bar), null);
});
//# sourceMappingURL=index.test.js.map