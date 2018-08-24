import test from 'ava';
import { Injectable, Inject, Container } from "../src";

@Injectable
class B1 {

}

@Injectable
class B2 {
    
}

@Injectable
class A2 {

}

interface MyInterface {

}

@Injectable
class A1Circular {
    constructor(
        @Inject public a: B1,
        @Inject public c: B2,
        @Inject public b: A1Circular) 
    {
    }
}

@Injectable
class A1 {
    constructor(
        @Inject public a: B1,
        @Inject public c: B2,
        @Inject public b: A2) 
    {
    }
}

@Injectable
class ExplodingB2 {
    constructor() {
        throw new Error('Too bad');
    }
}

@Injectable
class Bar {
    constructor(
        @Inject public a: A1, 
        @Inject public b: A2, 
        @Inject public c: A2) 
    {
    }
}

@Injectable
class BarWithInterface {
    constructor(
        @Inject public a: A1, 
        @Inject public b: MyInterface) 
    {
    }
}

@Injectable
class BarCircular {
    constructor(
        @Inject public a: A1Circular, 
        @Inject public b: A2, 
        @Inject public c: A2) 
    {
    }
}

let container: Container;

test.beforeEach(() => {
	container = new Container();
});

test('can resolve Bar', t => {
    const bar = container.resolve(Bar);

    t.not(bar, null);

    t.not(bar.a, null);
    t.not(bar.a.a, null);
    t.not(bar.a.b, null);
    t.not(bar.a.c, null);

    t.not(bar.b, null);

    t.not(bar.c, null);
});

test('can resolve Bar with instance per request', t => {
    const bar = container.resolve(Bar);
    
    t.not(bar.c, bar.b);
    t.not(bar.c, bar.a.b);
});

test('explodes when using exploding dependency for Bar', t => {
    container.whenRequestingType(B2).useType(ExplodingB2);

    t.throws(() => container.resolve(Bar), (ex) => 
        ex.message.indexOf(
`An error occured while resolving:
-> Bar
   -> A1
      -> B2

Error: Too bad`) === 0);
});

test('explodes when using circular dependencies', t => {
    t.throws(() => container.resolve(BarCircular), (ex) => 
        ex.message.indexOf(
`An error occured while resolving:
-> BarCircular
   -> A1Circular
      -> A1Circular

Error: A circular dependency was detected. This can't be resolved and is a code smell.`) === 0);
});

test('can resolve Bar with interfaces', t => {
    t.throws(() => container.resolve(BarWithInterface), (ex) => 
        ex.message.indexOf(
`An error occured while resolving:
-> BarWithInterface
   -> Object

Error: A dependency of type Object could not be resolved. Make sure the dependency is of a class (not an interface) type, and that it has the @Injectable decorator set.`) === 0);
});