---
title: Promise与事件循环
---

# Promise与事件循环

## 1. 例子1

```javascript
setTimeout(console.log, 0, 1)

const p = new Promise((resolve, reject) => {
    console.log(2)
    resolve()
    reject()
    console.log(3)
})

p.then(() => {
    console.log(4)
    throw new Error('error')
}).catch(() => {
    console.log(5)
}).finally(() => {
    console.log(6)
})

console.log(7)
```

```javascript
// 2
// 3
// 7
// 4
// 5
// 6
// 1
```

分析打印结果可以得出：
- 执行器函数（executor）函数是同步执行的。
- Promise状态变更后需要被执行的回调是微任务，例如`then`、`catch`、`finally`。

## 2. 例子2

```javascript
Promise.resolve().then(() => {
    console.log(1)
    Promise.resolve().then(() => {
        console.log(2)
    })
}).then(() => {
    console.log(3)
})
```

```javascript
// 1
// 2
// 3
```

- 链式调用中，只有前一个 `then` 的回调执行完毕后，跟着的 `then` 中的回调才会被加入至微任务队列。（也就是说，只有上一个回调执行完了，才能决定接下来该执行哪个回调）

## 3. 例子3

```javascript
const p = Promise.resolve()

p.then(() => {
    console.log(1)
    Promise.resolve().then(() => {
        console.log(2)
    })
}).then(() => {
    console.log(3)
})

p.then(() => {
    console.log(4)
})
```

```javascript
// 1
// 4
// 2
// 3
```

- 同一个 Promise 的每个链式调用的开端会首先依次进入微任务队列。

## 4. 例子4

```javascript
const p = new Promise((resolve, reject) => {
    const promise = Promise.resolve()
    resolve(promise)
})

p.then(() => {
    console.log(1)
})

Promise.resolve().then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```

```javascript
// 2
// 3
// 1
// 4

// ？结果和想象中的不一样？为什么当 `resolve` 一个Promise时，执行顺序变得不一样了？
```

查看ECMA-262规范[25.4.1.3.2Promise Resolve Functions](https://262.ecma-international.org/6.0/#sec-promise-resolve-functions)

发现当`resolve`函数的参数是一个`thenable`时，会执行一个叫做`PromiseResolveThenableJob`的微任务

> thenable: 一个拥有`then`方法的对象。例如：
> ```javascript
> const thenable = {
>    then: function() {}
> }
> ```

说下我的理解，发现当`resolve`函数的参数是一个`thenable`时，会去尝试执行它的then方法，并将其返回值作为当前Promise的返回值，`PromiseResolveThenableJob`大概就在做这个事情。

另外，根据[这里](https://stackoverflow.com/a/53929252/15267859)的回答，可以知道：

```javascript
new Promise((resolve, reject) => {
    resolve(thenable)
})

// 可以转换为

new Promise((resolve, reject) => {
    Promise.resolve().then(() => {
        thenable.then(() => resolve)
    })
})
```

- 为什么外面要包一层Promise？  
  为了保证Promise行为的一致性。thenable的then方法可能同步执行。

那么，上面例子中的代码就可以转换为：

```javascript
const p = new Promise((resolve, reject) => {
    const promise = Promise.resolve()
    // resolve(promise)
    Promise.resolve().then(() => {
        promise.then(resolve, reject)
    })
})

p.then(() => {
    console.log(1)
})

Promise.resolve().then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
```

```javascript
// 2
// 3
// 1
// 4
```

当然，这样的例子只是帮助我们更好的理解规范，实践中并不推荐这样写，最好使用Promise链的写法。

## 5. 例子5

### 5.1 例子5-1

```javascript
button.addEventListener('click', () => {
    Promise.resolve().then(() => console.log('Microtask 1'))
    console.log('Listener 1')
})

button.addEventListener('click', () => {
    Promise.resolve().then(() => console.log('Microtask 2'))
    console.log('Listener 2')
})
```

```javascript
// Listener 1
// Microtask 1
// Listener 2
// Microtask 2
```

### 5.2 例子5-2

```javascript
button.addEventListener('click', () => {
    Promise.resolve().then(() => console.log('Microtask 1'))
    console.log('Listener 1')
})

button.addEventListener('click', () => {
    Promise.resolve().then(() => console.log('Microtask 2'))
    console.log('Listener 2')
})

button.click()
```

```javascript
// Listener 1
// Listener 2
// Microtask 1
// Microtask 2
```

在做一些自动化测试，使用JavaScript来点击页面上的元素时，可能会导致不同的结果。


# 总结

事件循环在浏览器渲染中起着很关键的作用，在平时开发中如果遇到一些与预期不符的情况，或许可以考虑是不是这里的问题。

# 参考
- [Promise 你真的用明白了么？](https://github.com/KieSun/Dream/issues/34)
- [IN THE LOOP - Jake Archibald@JSconf 2018](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
