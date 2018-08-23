import "reflect-metadata";

import { Constructor } from "./Types";
import { PendingResolveJob } from './PendingResolveJob';
import { getMetadata, extractClassName } from "./Utilities";
import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";

type TypeMapping = {
    requestingType: Constructor<any>,
    lifetime: 'singleton' | 'per-request',
    useType?: Constructor<any>,
    useFactory?: () => any
};

export class Container {
    private readonly _typeMappings: Array<TypeMapping>;
    private readonly _singletonCache: Array<{
        type: Constructor,
        instance: any
    }>;

    constructor() {
        this._typeMappings = [];
        this._singletonCache = [];
    }

    whenRequestingType<T>(requestingType: Constructor<T>) {
        const typeMapping: TypeMapping = this.createNewTypeMapping(requestingType);

        for(let existingTypeMapping of [...this._typeMappings]) {
            if(existingTypeMapping.requestingType === requestingType)
                this._typeMappings.splice(this._typeMappings.indexOf(existingTypeMapping), 1);
        }

        for(let existingSingletonCacheEntry of [...this._singletonCache]) {
            if(existingSingletonCacheEntry.type === requestingType)
                this._singletonCache.splice(this._singletonCache.indexOf(existingSingletonCacheEntry), 1);
        }

        this._typeMappings.push(typeMapping);

        const use = (mappingCallback: (mapping: TypeMapping) => void) => {
            mappingCallback(typeMapping);

            return {
                asSingleInstance: () => {
                    this._singletonCache.push({
                        instance: null,
                        type: requestingType
                    });
                    typeMapping.lifetime = 'singleton';
                },
                asInstancePerRequest: () => typeMapping.lifetime = 'per-request'
            }
        };

        return {
            useType: (t: Constructor<T>) => use(m => m.useType = t),
            useRequestedType: () => use(m => m.useType = requestingType),
            useFactory: (f: () => T) => use(m => m.useFactory = f)
        };
    }

    private createNewTypeMapping(requestingType: Constructor): TypeMapping {
        return {
            requestingType,
            lifetime: 'per-request'
        };
    }

    private findTypeMappingForConstructor(constructor: Constructor): TypeMapping {
        for(let mapping of this._typeMappings) {
            if(mapping.requestingType !== constructor)
                continue;

            return mapping;
        }

        const mapping = this.createNewTypeMapping(constructor);
        return mapping;
    }

    resolve<T>(typeToResolve: Constructor<T>): T {
        const resolveJobs = new Array<PendingResolveJob>();
        resolveJobs.push(new PendingResolveJob(typeToResolve, null, null));

        while(resolveJobs.length > 0) {
            let job = resolveJobs[resolveJobs.length - 1];

            try {
                const mapping = this.findTypeMappingForConstructor(job.constructor);

                let constructor = mapping.useType || mapping.requestingType;
                const className = extractClassName(constructor);

                if(constructor === String || constructor === Number || constructor === Boolean)
                    throw new Error('Simple types (in this case ' + className + ') can\'t be injected.');

                const argumentInjectionInstanceDictionary = job.argumentInjectionDictionary;
                if(argumentInjectionInstanceDictionary.getParameterIndexes().length === job.argumentCount) {
                    const instance = this.createInstance(job, mapping, resolveJobs);
                    if(instance)
                        return instance;

                    continue;
                }
                
                const argumentInjectionTypeDictionary = getMetadata<ArgumentInjectionDictionary>(constructor, 'arguments');
                const argumentCount = getMetadata<number>(constructor, 'argumentCount');

                if(!argumentInjectionTypeDictionary)
                    throw new Error('The class ' + className + ' must be decorated with the @Injectable decorator for it to be resolved.');

                job.argumentCount = argumentCount;

                if(argumentInjectionTypeDictionary.getParameterIndexes().length !== argumentCount)
                    throw new Error('All arguments in the class ' + className + ' must have the @Inject decorator set for it to be resolved.');
                
                const argumentIndexes = argumentInjectionTypeDictionary.getParameterIndexes();
                if(argumentCount > 0) {
                    for(let argumentIndex of argumentIndexes) {
                        const argumentType = argumentInjectionTypeDictionary.getParameter(argumentIndex);
                        resolveJobs.push(new PendingResolveJob(argumentType, job, argumentIndex));
                    }
                } else {
                    const instance = this.createInstance(job, mapping, resolveJobs);
                    if(instance)
                        return instance;
                }
            } catch(ex) {
                if(!(ex instanceof Error))
                    ex = new Error(ex);

                let path = extractClassName(job.constructor);
                let pathCount = 1;

                let jobIteration: PendingResolveJob;

                jobIteration = job;
                while(true) {
                    jobIteration = jobIteration.parent;
                    if(!jobIteration)
                        break;
                    
                    pathCount++;
                }

                let indentCount = pathCount - 1;

                jobIteration = job;
                while(true) {
                    jobIteration = jobIteration.parent;
                    if(!jobIteration)
                        break;

                    let indent = '';
                    for(var i=0;i<indentCount;i++) {
                        indent += '   ';
                    }
                    
                    path = extractClassName(jobIteration.constructor) + '\n' + indent + '-> ' + path;

                    indentCount--;
                }

                throw new Error('An error occured while resolving:\n-> ' + path + '\n\n' + ex + '\n' + ex.stacktrace);
            }
        }

        throw new Error('Could not find a type to use for ' + extractClassName(typeToResolve) + '.');
    }

    private getSingletonCacheEntry(type: Constructor) {
        for(let singletonInstance of this._singletonCache) {
            if(singletonInstance.type === type)
                return singletonInstance;
        }

        return null;
    }

    private createInstance(job: PendingResolveJob, mapping: TypeMapping, resolveJobs: PendingResolveJob[]): any {
        const parentJob = job.parent;
        const parentArgumentInjectionInstanceDictionary = parentJob && parentJob.argumentInjectionDictionary;
        
        const instanceFactory = () => {
            if(mapping.useFactory)
                return mapping.useFactory();

            return new (mapping.useType || (mapping.requestingType as any))(
                ...job.argumentInjectionDictionary.toParameterArray());
        };

        let instance: any;
        const singletonCacheEntry = this.getSingletonCacheEntry(mapping.requestingType);

        if(singletonCacheEntry) {
            instance = singletonCacheEntry.instance || (singletonCacheEntry.instance = instanceFactory());
        } else {
            instance = instanceFactory();
        }

        if(parentJob === null)
            return instance;

        parentArgumentInjectionInstanceDictionary.updateParameterAtIndex(job.argumentIndex, instance);

        resolveJobs.splice(resolveJobs.length - 1, 1);

        return null;
    }
}