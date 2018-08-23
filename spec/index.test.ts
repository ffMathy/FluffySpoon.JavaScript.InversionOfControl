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

test('can resolve Bar with singleton A2', t => {
    container.whenRequestingType(A2).useRequestedType().asSingleInstance();

    const bar = container.resolve(Bar);

    t.is(bar.c, bar.b);
    t.is(bar.c, bar.a.b);
});