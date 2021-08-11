# 实现 `new` 操作

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)

## 实现

```javascript
function myNew (constructor, ...args) {
  // 1. Creates a blank, plain JavaScript object.
  const obj = {}
  // const obj = new Object()
  // const obj = Object.create(null)

  // 2. Adds a property to the new object (__proto__) that links to the constructor function's prototype object.
  Object.setPrototypeOf(obj, constructor.prototype)
  // obj.__proto__ = constructor.prototype

  // combine step 1 and 2
  // const obj = Object.create(constructor.prototype)

  // 3. Binds the newly created object instance as the this context (i.e. all references to this in the constructor function now refer to the object created in the first step).
  const result = constructor.apply(obj, args)

  // 4. Returns this if the function doesn't return an object.
  return result && typeof result === 'object' ? result : obj
}
```

## 测试用例

```javascript
function Foo(bar1, bar2) {
  this.bar1 = bar1;
  this.bar2 = bar2;
  // return { a: 'a', b: 'b' }
}

const myFoo1 = myNew(Foo, 'Bar 1', 2021)
console.log(myFoo1)

const myFoo2 = new Foo('Bar 2', 2022)
console.log(myFoo2)
```
