import "reflect-metadata";

import { Constructor } from "./Types";
import { PendingResolveJob } from './PendingResolveJob';
import { getMetadata } from "./Utilities";
import { ArgumentInjectionDictionary } from "./ArgumentInjectionDictionary";

export class Container {
    private readonly _typeMappings: Array<{
        requestingType: Constructor<any>,
        useType: Constructor<any>
    }>;

    constructor() {
        this._typeMappings = [];
    }

    whenRequestingType<T>(requestingType: Constructor<T>) {
        return {
            useType: (useType: Constructor<T>) => this._typeMappings.push({
                requestingType,
                useType
            })
        };
    }

    resolve<T>(typeToResolve: Constructor<T>) {
        const resolveJobs = new Array<PendingResolveJob>();
        resolveJobs.push(new PendingResolveJob(typeToResolve, null, null));

        while(resolveJobs.length > 0) {
            let job = resolveJobs[resolveJobs.length - 1];

            try {
                const parentJob = job.parent;

                let constructor = job.constructor;
                for(let mapping of this._typeMappings) {
                    if(mapping.requestingType !== constructor)
                        continue;

                    constructor = mapping.useType;
                    break;
                }

                const className = this.extractClassName(constructor);

                if(constructor === String || constructor === Number)
                    throw new Error('Simple types (in this case ' + className + ') can\'t be injected.');

                const argumentInjectionInstanceDictionary = job.argumentInjectionDictionary;
                const parentArgumentInjectionInstanceDictionary = parentJob && parentJob.argumentInjectionDictionary;

                if(argumentInjectionInstanceDictionary.getParameterIndexes().length === job.argumentCount) {
                    const instance = new (constructor as any)(...argumentInjectionInstanceDictionary.toParameterArray());
                    if(parentJob === null)
                        return instance;

                    parentArgumentInjectionInstanceDictionary.updateParameterAtIndex(job.argumentIndex, instance);

                    resolveJobs.splice(resolveJobs.length - 1, 1);

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
                    const instance = new (constructor as any)();
                    if(parentJob === null)
                        return instance;

                    parentArgumentInjectionInstanceDictionary.updateParameterAtIndex(job.argumentIndex, instance);

                    resolveJobs.splice(resolveJobs.length - 1, 1);

                    continue;
                }
            } catch(ex) {
                if(!(ex instanceof Error))
                    throw ex;

                const err = ex as Error;

                let path = this.extractClassName(job.constructor);
                let indentCount = 0;

                while(true) {
                    job = job.parent;
                    if(!job)
                        break;

                    let indent = '';
                    for(var i=0;i<indentCount;i++) {
                        indent += ' ';
                    }
                    
                    path = this.extractClassName(job.constructor) + '\n' + indent + '-> ' + path;

                    indentCount++;
                }

                throw new Error(err.message + '\nWhile resolving:\n-> ' + path);
            }
        }
    }

    private extractClassName(constructor: Constructor<any>) {
        return (constructor as any).name || constructor;
    }
}