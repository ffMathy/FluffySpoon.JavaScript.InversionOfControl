"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var PendingResolveJob_1 = require("./PendingResolveJob");
var Utilities_1 = require("./Utilities");
var Container = /** @class */ (function () {
    function Container() {
        this._typeMappings = [];
        this._singletonCache = [];
    }
    Container.prototype.whenRequestingType = function (requestingType) {
        var _this = this;
        var typeMapping = this.createNewTypeMapping(requestingType);
        for (var _i = 0, _a = this._typeMappings.slice(); _i < _a.length; _i++) {
            var existingTypeMapping = _a[_i];
            if (existingTypeMapping.requestingType === requestingType)
                this._typeMappings.splice(this._typeMappings.indexOf(existingTypeMapping), 1);
        }
        for (var _b = 0, _c = this._singletonCache.slice(); _b < _c.length; _b++) {
            var existingSingletonCacheEntry = _c[_b];
            if (existingSingletonCacheEntry.type === requestingType)
                this._singletonCache.splice(this._singletonCache.indexOf(existingSingletonCacheEntry), 1);
        }
        this._typeMappings.push(typeMapping);
        var use = function (mappingCallback) {
            mappingCallback(typeMapping);
            return {
                asSingleInstance: function () {
                    _this._singletonCache.push({
                        instance: null,
                        type: requestingType
                    });
                    typeMapping.lifetime = 'singleton';
                },
                asInstancePerRequest: function () { return typeMapping.lifetime = 'per-request'; }
            };
        };
        return {
            useType: function (t) { return use(function (m) { return m.useType = t; }); },
            useRequestedType: function () { return use(function (m) { return m.useType = requestingType; }); },
            useFactory: function (f) { return use(function (m) { return m.useFactory = f; }); }
        };
    };
    Container.prototype.createNewTypeMapping = function (requestingType) {
        return {
            requestingType: requestingType,
            lifetime: 'per-request'
        };
    };
    Container.prototype.findTypeMappingForConstructor = function (constructor) {
        for (var _i = 0, _a = this._typeMappings; _i < _a.length; _i++) {
            var mapping_1 = _a[_i];
            if (mapping_1.requestingType !== constructor)
                continue;
            return mapping_1;
        }
        var mapping = this.createNewTypeMapping(constructor);
        return mapping;
    };
    Container.prototype.resolve = function (typeToResolve) {
        var resolveJobs = new Array();
        resolveJobs.push(new PendingResolveJob_1.PendingResolveJob(typeToResolve, null, null));
        while (resolveJobs.length > 0) {
            var job = resolveJobs[resolveJobs.length - 1];
            var path = new Array();
            var jobIteration = job;
            while (true) {
                path.push(jobIteration);
                jobIteration = jobIteration.parent;
                if (!jobIteration)
                    break;
            }
            try {
                for (var i = 1; i < path.length; i++) {
                    if (path[i].constructor === job.constructor)
                        throw new Error('A circular dependency was detected. This can\'t be resolved and is a code smell.');
                }
                var mapping = this.findTypeMappingForConstructor(job.constructor);
                var constructor = mapping.useType || mapping.requestingType;
                var className = Utilities_1.extractClassName(constructor);
                if (constructor === Object)
                    throw new Error('A dependency of type ' + className + ' could not be resolved. Make sure the dependency is of a class (not an interface) type, and that it has the @Injectable decorator set.');
                if (constructor === String || constructor === Number || constructor === Boolean)
                    throw new Error('Simple types (in this case ' + className + ') can\'t be injected.');
                var argumentInjectionInstanceDictionary = job.argumentInjectionDictionary;
                if (argumentInjectionInstanceDictionary.getParameterIndexes().length === job.argumentCount) {
                    var instance = this.createInstance(job, mapping, resolveJobs);
                    if (instance)
                        return instance;
                    continue;
                }
                var argumentInjectionTypeDictionary = Utilities_1.getMetadata(constructor, 'arguments');
                var argumentCount = Utilities_1.getMetadata(constructor, 'argumentCount');
                if (!argumentInjectionTypeDictionary)
                    throw new Error('The class ' + className + ' must be decorated with the @Injectable decorator for it to be resolved.');
                job.argumentCount = argumentCount;
                if (argumentInjectionTypeDictionary.getParameterIndexes().length !== argumentCount)
                    throw new Error('All arguments in the class ' + className + ' must have the @Inject decorator set for it to be resolved.');
                var argumentIndexes = argumentInjectionTypeDictionary.getParameterIndexes();
                if (argumentCount > 0) {
                    for (var _i = 0, argumentIndexes_1 = argumentIndexes; _i < argumentIndexes_1.length; _i++) {
                        var argumentIndex = argumentIndexes_1[_i];
                        var argumentType = argumentInjectionTypeDictionary.getParameter(argumentIndex);
                        resolveJobs.push(new PendingResolveJob_1.PendingResolveJob(argumentType, job, argumentIndex));
                    }
                }
                else {
                    var instance = this.createInstance(job, mapping, resolveJobs);
                    if (instance)
                        return instance;
                }
            }
            catch (ex) {
                if (!(ex instanceof Error))
                    ex = new Error(ex);
                var pathDescription = this.getPathDescription(path);
                throw new Error('An error occured while resolving:\n-> ' + pathDescription + '\n\n' + ex + (ex.stacktrace ? '\n' + ex.stacktrace : ''));
            }
        }
        throw new Error('Could not find a type to use for ' + Utilities_1.extractClassName(typeToResolve) + '.');
    };
    Container.prototype.getPathDescription = function (path) {
        var pathDescription = Utilities_1.extractClassName(path[0].constructor);
        var pathCount = path.length;
        var indentCount = pathCount - 1;
        for (var i = 1; i < path.length; i++) {
            var job = path[i];
            var indent = '';
            for (var x = 0; x < indentCount; x++) {
                indent += '   ';
            }
            pathDescription = Utilities_1.extractClassName(job.constructor) + '\n' + indent + '-> ' + pathDescription;
            indentCount--;
        }
        return pathDescription;
    };
    Container.prototype.getSingletonCacheEntry = function (type) {
        for (var _i = 0, _a = this._singletonCache; _i < _a.length; _i++) {
            var singletonInstance = _a[_i];
            if (singletonInstance.type === type)
                return singletonInstance;
        }
        return null;
    };
    Container.prototype.createInstance = function (job, mapping, resolveJobs) {
        var parentJob = job.parent;
        var parentArgumentInjectionInstanceDictionary = parentJob && parentJob.argumentInjectionDictionary;
        var instanceFactory = function () {
            var _a;
            if (mapping.useFactory)
                return mapping.useFactory();
            return new ((_a = (mapping.useType || mapping.requestingType)).bind.apply(_a, [void 0].concat(job.argumentInjectionDictionary.toParameterArray())))();
        };
        var instance;
        var singletonCacheEntry = this.getSingletonCacheEntry(mapping.requestingType);
        if (singletonCacheEntry) {
            instance = singletonCacheEntry.instance || (singletonCacheEntry.instance = instanceFactory());
        }
        else {
            instance = instanceFactory();
        }
        if (parentJob === null)
            return instance;
        parentArgumentInjectionInstanceDictionary.updateParameterAtIndex(job.argumentIndex, instance);
        resolveJobs.splice(resolveJobs.length - 1, 1);
        return null;
    };
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=Container.js.map