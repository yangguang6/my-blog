# 【译】通过实现 Promise 来增加对它的理解

> 原文地址：https://exploringjs.com/deep-js/ch_implementing-promises.html

在本章节，我们将从一个不同的角度来探讨 Promise ：通过一个简单的实现，而不是 API 的使用。这个角度曾经对我理解 Promise 帮助很大。  

Promise 的实现是一个类 `ToyPromise`。为了更容易理解，它并没有完全对应 API 。但这已经足够让我们来理解 Promise 是怎样工作的。  

> `ToyPromise` 的 GitHub 仓库[地址](https://github.com/rauschma/toy-promise)

## 复习：Promise的状态

![Promise的状态](../images/states-of-promises.svg "Promise的状态")

我们先从一个简化版本的 Promise 工作原理开始：  

- 一开始，Promise 状态是 _pending_（待定）。
- 如果 Promise 以一个值 `v` 被 _resolved_ （已决议），那么它的状态会变成 _fulfilled_ （已兑现）（later, we’ll see that resolving can also reject）。 `v` 现在是 Promise 的 _fulfillment value_ （已兑现的值）。
- 如果 Promise 以一个错误 `e` 被 _rejected_ （已拒绝），那么它的状态会变成 _rejected_ （已拒绝）。 `e`现在是 Promise 的 _rejection value_ （已拒绝的值）。

## 版本1：独立的 Promise

我们的第一个实现是一个拥有最小功能的独立运行的Promise：

- 我们可以创建一个 Promise。
- 我们可以 resolve 或者 reject 一个 Promise，并且只能做一次。
- 我们可以通过 `.then()` 注册 `reactions` （callback，回调）。注册能够正常进行，且独立于 Promise 是否已敲定（settled）。
- `.then()` 现在还不支持链式操作 —— 他不会返回任何值。

`ToyPromise` 是一个拥有三个原型方法的类：

- `ToyPromise1.prototype.resolve(value)`
- `ToyPromise1.prototype.reject(reason)`
- `ToyPromise1.prototype.then(onFulfilled, onRejected)`

也就是说， `resolve` 和 `reject` 都是方法（而不是传给构造函数回调参数的函数）。

下面是第一版实现的使用：

```javascript
// .resolve() 在 .then() 之前
const tp1 = new ToyPromise1();
tp1.resolve('abc');
tp1.then((value) => {
    assert.equal(value, 'abc');
});
// .then() 在 .resolve() 之前
const tp2 = new ToyPromise1();
tp2.then((value) => {
    assert.equal(value, 'def');
});
tp2.resolve('def');
```

下图表示了第一版实现的原理。

![ToyPromise1](../images/toy-promise1.svg "ToyPromise1")  

`ToyPromise1`：如果一个 Promise 已决议，那么提供的值会被传递给 _fulfillment reactions_ （ `.then` 的第一个参数）。如果是已拒绝，那么会传给 _rejection reactions_ （ `.then` 的第二个参数）。

### 方法 `.then()`
