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
var A2 = /** @class */ (function () {
    function A2() {
    }
    A2 = __decorate([
        src_1.Injectable
    ], A2);
    return A2;
}());
var A1 = /** @class */ (function () {
    function A1(a, c, b) {
        this.a = a;
        this.c = c;
        this.b = b;
    }
    A1 = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __param(1, src_1.Inject),
        __param(2, src_1.Inject),
        __metadata("design:paramtypes", [B1,
            B2,
            A2])
    ], A1);
    return A1;
}());
var ExplodingB2 = /** @class */ (function () {
    function ExplodingB2() {
        throw new Error('Too bad');
    }
    ExplodingB2 = __decorate([
        src_1.Injectable,
        __metadata("design:paramtypes", [])
    ], ExplodingB2);
    return ExplodingB2;
}());
var Bar = /** @class */ (function () {
    function Bar(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    Bar = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __param(1, src_1.Inject),
        __param(2, src_1.Inject),
        __metadata("design:paramtypes", [A1,
            A2,
            A2])
    ], Bar);
    return Bar;
}());
var container;
ava_1.default.beforeEach(function () {
    container = new src_1.Container();
});
ava_1.default('can resolve Bar', function (t) {
    var bar = container.resolve(Bar);
    t.not(bar, null);
    t.not(bar.a, null);
    t.not(bar.a.a, null);
    t.not(bar.a.b, null);
    t.not(bar.a.c, null);
    t.not(bar.b, null);
    t.not(bar.c, null);
});
ava_1.default('can resolve Bar with instance per request', function (t) {
    var bar = container.resolve(Bar);
    t.not(bar.c, bar.b);
    t.not(bar.c, bar.a.b);
});
ava_1.default('explodes when using exploding dependency for Bar', function (t) {
    container.whenRequestingType(B2).useType(ExplodingB2);
    t.throws(function () { return container.resolve(Bar); }, function (ex) {
        return ex.message.indexOf("An error occured while resolving:\n-> Bar\n   -> A1\n      -> B2\n\nError: Too bad") === 0;
    });
});
ava_1.default('can resolve Bar with singleton A2', function (t) {
    container.whenRequestingType(A2).useRequestedType().asSingleInstance();
    var bar = container.resolve(Bar);
    t.is(bar.c, bar.b);
    t.is(bar.c, bar.a.b);
});
//# sourceMappingURL=index.test.js.map