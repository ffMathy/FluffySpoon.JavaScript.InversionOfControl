import test from 'ava';
import { Injectable, Inject, Container } from "../src";

@Injectable
abstract class B1 {

}

@Injectable
class B2 {

}

@Injectable
class A1 {
    constructor(
        @Inject private a: B1) 
    {
    }
}

@Injectable
class A2 {

}

@Injectable
class Bar {
    constructor(
        @Inject private a: A1, 
        @Inject private b: A2) 
    {
    }
}

let container: Container;

test.beforeEach(() => {
	container = new Container();
});

test('can resolve Bar', t => {
	t.notDeepEqual(container.resolve(Bar), null);
});