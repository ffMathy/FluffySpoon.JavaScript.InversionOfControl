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
var A1Circular = /** @class */ (function () {
    function A1Circular(a, c, b) {
        this.a = a;
        this.c = c;
        this.b = b;
    }
    A1Circular = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __param(1, src_1.Inject),
        __param(2, src_1.Inject),
        __metadata("design:paramtypes", [B1,
            B2,
            A1Circular])
    ], A1Circular);
    return A1Circular;
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
var BarWithInterface = /** @class */ (function () {
    function BarWithInterface(a, b) {
        this.a = a;
        this.b = b;
    }
    BarWithInterface = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __param(1, src_1.Inject),
        __metadata("design:paramtypes", [A1, Object])
    ], BarWithInterface);
    return BarWithInterface;
}());
var BarCircular = /** @class */ (function () {
    function BarCircular(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    BarCircular = __decorate([
        src_1.Injectable,
        __param(0, src_1.Inject),
        __param(1, src_1.Inject),
        __param(2, src_1.Inject),
        __metadata("design:paramtypes", [A1Circular,
            A2,
            A2])
    ], BarCircular);
    return BarCircular;
}());
var container;
ava_1.default.beforeEach(function () {
    container = new src_1.Container();
});
ava_1.default('can resolve Bar', function (t) {
    var bar = container.resolveInstance(Bar);
    t.not(bar, null);
    t.not(bar.a, null);
    t.not(bar.a.a, null);
    t.not(bar.a.b, null);
    t.not(bar.a.c, null);
    t.not(bar.b, null);
    t.not(bar.c, null);
});
ava_1.default('can resolve Bar with instance per request', function (t) {
    var bar = container.resolveInstance(Bar);
    t.not(bar.c, bar.b);
    t.not(bar.c, bar.a.b);
});
ava_1.default('explodes when using exploding dependency for Bar', function (t) {
    container.whenResolvingType(B2).useType(ExplodingB2);
    t.throws(function () { return container.resolveInstance(Bar); }, function (ex) {
        return ex.message.indexOf("An error occured while resolving:\n-> Bar\n   -> A1\n      -> B2\n\nError: Too bad") === 0;
    });
});
ava_1.default('explodes when using circular dependencies', function (t) {
    t.throws(function () { return container.resolveInstance(BarCircular); }, function (ex) {
        return ex.message.indexOf("An error occured while resolving:\n-> BarCircular\n   -> A1Circular\n      -> A1Circular\n\nError: A circular dependency was detected. This can't be resolved and is a code smell.") === 0;
    });
});
ava_1.default('can resolve Bar with interfaces', function (t) {
    t.throws(function () { return container.resolveInstance(BarWithInterface); }, function (ex) {
        return ex.message.indexOf("An error occured while resolving:\n-> BarWithInterface\n   -> Object\n\nError: A dependency of type Object could not be resolved. Make sure the dependency is of a class (not an interface) type, and that it has the @Injectable decorator set.") === 0;
    });
});
//# sourceMappingURL=index.test.js.map