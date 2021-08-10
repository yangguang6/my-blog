# 手动实现 `call` `apply` `bind`

## call()

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

### 思路

1. `call()` 方法的参数分为两部分：  
    **`thisArg`**: 可选，在 `function` 函数运行时使用的 `this` 值。  
    **`arg1, arg2, ...`**：指定的参数列表。
2. `thisArg` 作为一个对象，可以把函数作为其中一个属性再执行，返回结果后删除属性。

### 实现

```javascript
Function.prototype.myCall = function call (thisArg = globalThis, ...args) {
    // 使用 symbol 类型， 保证属性名唯一
    const fn = Symbol('fn')
    thisArg[fn] = this
    const res = thisArg[fn](...args)
    delete thisArg[fn]
    return res
}
```

### 测试用例

```javascript
const Person = {
    name: 'Tom',
    age: 10,
}

function foo (sex) {
    console.log(this.name, this.age, sex)
}

foo.myCall(Person, 'male')

// Tom 10 male
```

## apply()

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

### 思路

与 `call` 方法类似，唯一区别是 `apply` 接受一个数组（或类数组对象）。

### 实现

```javascript
Function.prototype.myApply = function apply (thisArg = globalThis, argsArray = []) {
    const fn = Symbol('fn')
    thisArg[fn] = this
    argsArray = [...argsArray]
    const result = thisArg[fn](...argsArray)
    delete thisArg[fn]
    return result
}
```

### 测试用例

```javascript
const Person = {
    name: 'Tom',
    age: 10,
}

function foo (sex) {
    console.log(this.name, this.age, sex)
}

foo.myApply(Person, ['male'])

// Tom 10 male
```

## bind()

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

### 思路

1. 语法：`bind(thisArg, arg1, ... , argN)` ，返回一个指定 `this` 的函数；
2. ⚠️ 注意使用 `new` 操作符的情况；

### 实现

```javascript
Function.prototype.myBind = function bind (thisArg = globalThis, ...args) {
    const func = this
    return function bound (...newArgs) {
        if (this instanceof bound) {
            // 如果使用new操作符，则忽略this
            return new func(...args, ...newArgs)
        }
        const fn = Symbol('fn')
        thisArg[fn] = func
        const result = thisArg[fn](...args, ...newArgs) // bind的参数会在前面
        delete thisArg[fn]
        return result
    }
}
```

### 测试用例

```javascript
const bar = {
    x: 42,
    getX: function() {
        return this.x;
    }
};

const unboundGetX = bar.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

const boundGetX = unboundGetX.myBind(bar);
console.log(boundGetX());
// expected output: 42
```
