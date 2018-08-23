`npm i @fluffy-spoon/inverse --save-dev`

# Examples
These examples assume that there's a `Bar` class which as some dependencies (`A1` and `A2`), which then further have some dependencies (`B1` and `B2`) as shown below.

_Note how every class has an `Injectable` decorator, and how every dependency has an `Inject` decorator. That's all that is needed!_

```typescript
@Injectable
class Bar {
    constructor(
        @Inject private a: A1, 
        @Inject private b: A2, 
        @Inject private c: A2) 
    {
    }
}

@Injectable
class B1 {

}

@Injectable
class B2 implements B1 {

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
    constructor(
        @Inject private a: B2) 
    {
    }
}
```

## Basic use
In the following example, a `Bar` instance is requested from the IOC container. Per default, each dependency will be instantiated recursively with its own constructor.

The following code:

```typescript
import { Container } from '@fluffy-spoon/inverse';

const container = new Container();

const bar = container.resolve(Bar);
```

Is equal to:

```typescript
const bar = new Bar(
    new A1(new B1()),
    new A2(new B2()),
    new A2(new B2()));
```

## Changing dependencies
In the below example, we change all `B1` to be instances of `B2` instead. This is possible because `B2` implements `B1`.

The following code:

```typescript
import { Container } from '@fluffy-spoon/inverse';

const container = new Container();
container.whenRequestingType(B1).useType(B2);

const bar = container.resolve(Bar);
```

Is equal to:

```typescript
const bar = new Bar(
    new A1(new B2()),
    new A2(new B2()),
    new A2(new B2()));
```

You can also use:
- `useFactory` for determining how an instance should be created.
- `useRequestedType` to use the requested type (this is default).

## Changing lifetime
In the below example, we make `B2` instances be single-instance by using the `asSingleInstance` method.

_Note that `useRequestedType` is called here. This just means that when a `B2` instance is requested, a `B2` instance is also injected (which is default)._

```typescript
import { Container } from '@fluffy-spoon/inverse';

const container = new Container();
container.whenRequestingType(B2).useRequestedType().asSingleInstance();

const bar = container.resolve(Bar);
```

Is equal to:

```typescript
const b2 = new B2();
const bar = new Bar(
    new A1(new B1()),
    new A2(b2,
    new A2(b2)));
```

You can also use:
- `asInstancePerRequest` to create a new instance from the type or factory provided every time (this is default).