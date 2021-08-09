---
title: Promise基础概念及使用总结
---

# Promise基础概念及使用总结

## 概念
Promise是一种异步编程的解决方案。从本质上说，Promise是一个函数返回的对象，从它可以获取异步操作的消息。

## 特点
### 1. 对象的状态不受外界影响。
- 三种状态： `pending`（进行中）、`fulfilled`（已成功）、`rejected`（已失败）。
- 只有异步操作的结果才能决定当前是哪一种状态，其他任何操作都无法改变这个状态。

### 2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。
- Promise对象的状态改变只有两种可能：pending -> fulfilled 和 peding -> rejected 。
- 只要这两种情况发生，状态就不会再变了，这时称为 resolved（已定型）。

## 优点
- 可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。
- Promise对象提供统一的接口，使得控制异步操作更加容易。

## 缺点
- 无法取消Promise，一旦新建就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise内部抛出的错误不会反映到外部。
- 当处于pending状态时，无法得知目前的进展（刚刚开始还是即将完成）。

如果某些事件不断地反复发生，一般来说，使用 [Stream](https://nodejs.org/api/stream.html) 模式是比部署Promise更好的选择。

## 基本用法
### 创建一个Promise实例
```javascript   
const promise = new Promise((resolve, reject) => {
    // ... some code

    if(/* 异步操作成功 */) {
        resolve()
    } else {
        reject()
    }
})
```
- Promise构造函数接受一个函数作为参数，该函数的两个参数分别为`resolve`和`reject`。
- `resolve`函数将Promise状态由“未完成”(pending)变为“成功”(resolved)。
- `reject`函数将Promise状态由“未完成”(pending)变为“失败”(rejected)。

### Promise.prototype.then()
```javascript
promise.then((value) => {
    // success
}, (error) => {
    // failure
})

// 链式调用
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```
- `then`方法接受两个回调函数作为参数，均为可选参数。
- 第一个回调函数是当Promise对象的状态变为resolved时调用。
- 第二个回调函数是当Promise对象的状态变为rejected时调用。
- 它们都接受Promise对象传出的值作为参数。
- **`then`方法返回的是一个新的Promise实例。**

#### 例子1
```javascript
// 通过Promise构造器封装旧的API，例如 setTimeout

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100).then((value) => {
  console.log(value);
});
```

#### 例子2
```javascript
const promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```
- Promise建立后会立即执行，所以先输出的是`Promise`。

#### 例子3
```javascript
// 异步加载图片

function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}
```

#### 例子4
```javascript
// 用Promise对象实现的 Ajax 操作

const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

#### 例子5
```javascript
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
  
p1
  .then(result => console.log(1))
  .catch(error => console.log(2))
  .then(() => console.log(3))

// 2
// 3
// Error: fail
```

#### 例子6
```javascript
new Promise((resolve, reject) => {
  resolve(1); // 最好在前面加上 return ，避免意外
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
- 调用`resolve`和`reject`并不会终结Promise的参数函数的执行。

#### 例子7
```javascript
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait().then(() => console.log(4));
Promise.resolve().then(() => console.log(2)).then(() => console.log(3));
console.log(1);
// 1, 2, 3, 4
```

### Promise.prototype.catch()
等同于 `.then(null, rejection)` 或 `.then(undefined, rejection)`。

#### 例子1
```javascript
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
  
// ok
```
- Promise在`resolve`语句后面抛出错误，不会被捕获。（Promise状态一旦改变，就会永久保持，不会再变）。

#### 例子2
```javascript
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```
- Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。
- 建议总是使用`catch()`方法，而不使用`then()`方法的第二个参数（可以捕获前面`then`方法执行中的错误，也更接近同步的写法（`try/catch`））。

#### 例子3
```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);

// Uncaught (in promise) ReferenceError: x is not defined
// 123
```
- Promise 内部的错误不会影响到 Promise 外部的代码。

```javascript
process.on('unhandledRejection', function (err, p) {
  throw err;
});
```
- 注意，Node 有计划在未来废除`unhandledRejection`事件。如果 Promise 内部有未捕获的错误，会直接终止进程，并且进程的退出码不为 0。

#### 例子4
```javascript
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  setTimeout(function () { throw new Error('test') }, 0)
});
promise.then(function (value) { console.log(value) });
// ok
// Uncaught Error: test
```
上面代码中，Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

### Promise.prototype.finally()
`finally()`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。finally本质上是then方法的特例。

```javascript
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

#### 实现
```javascript
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```
- `finally`方法总是会返回原来的值

```javascript
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})

// reject 的值是 3
Promise.reject(3).finally(() => {})
```

### Promise.all()
`Promise.all()`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```javascript
const p = Promise.all([p1, p2, p3]);
```
`Promise.all()`方法接受一个数组作为参数，`p1`、`p2`、`p3`都是 Promise 实例，如果不是，就会先调用`Promise.resolve`方法，将参数转为 Promise 实例，再进一步处理。另外，`Promise.all()`方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况：
1. 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
2. 只要`p1`、`p2`、`p3`之中**有一个**被`rejected`，`p`的状态就变成`rejected`，此时**第一个**被`reject`的实例的返回值，会传递给`p`的回调函数。

#### 例子1
```javascript
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```

#### 例子2
```javascript
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));

// ["hello", Error: 报错了]
```
- 如果作为参数的 Promise 实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法。

```javascript
// 如果p2没有自己的catch方法，就会调用Promise.all()的catch方法。

const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错了
```

### Promise.race()
```javascript
const p = Promise.race([p1, p2, p3]);
```
只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

```javascript
// 如果 5 秒之内fetch方法无法返回结果，变量p的状态就会变为rejected，从而触发catch方法指定的回调函数
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

### Promise.allSettled()
- `Promise.allSettled()`方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。
- 只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。
- 该方法返回的新的 Promise 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`。

```javascript
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

#### 例子1
```javascript
const promises = [ fetch('index.html'), fetch('https://does-not-exist/') ];
const results = await Promise.allSettled(promises);

// 过滤出成功的请求
const successfulPromises = results.filter(p => p.status === 'fulfilled');

// 过滤出失败的请求，并输出原因
const errors = results
  .filter(p => p.status === 'rejected')
  .map(p => p.reason);
```

#### `Promise.all()`无法确定所有的请求都结束
```javascript
const urls = [ /* ... */ ];
const requests = urls.map(x => fetch(x));

try {
  await Promise.all(requests);
  console.log('所有请求都成功。');
} catch {
  console.log('至少一个请求失败，其他请求可能还没结束。');
}
```

### Promise.any()
- 该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回。
- 只要参数实例**有一个**变成fulfilled状态，包装实例就会变成fulfilled状态。
- 如果所有参数实例**都**变成rejected状态，包装实例就会变成rejected状态。

```javascript
const promises = [
  fetch('/endpoint-a').then(() => 'a'),
  fetch('/endpoint-b').then(() => 'b'),
  fetch('/endpoint-c').then(() => 'c'),
];
try {
  const first = await Promise.any(promises);
  console.log(first);
} catch (error) {
  console.log(error);
}
```

#### 抛错
- `Promise.any()`抛出的错误是一个 [AggregateError](https://developer.mozilla.org/en-us/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 实例。
- 它相当于一个数组，每个成员对应一个被rejected的操作所抛出的错误。

#### 例子1
```javascript
// 捕捉错误时，如果不用try...catch结构和 await 命令，可以像下面这样写

Promise.any(promises).then(
  (first) => {
    // Any of the promises was fulfilled.
  },
  (error) => {
    // All of the promises were rejected.
  }
);
```

#### 例子2
```javascript
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results); // [-1, Infinity]
});
```

### Promise.resolve()
- 将现有对象转为 Promise 对象

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

#### `Promise.resolve()`方法的参数的四种情况
##### 1. 参数是一个 Promise 实例
- 不做任何修改、原封不动地返回这个实例。

##### 2. 参数是一个`thenable`对象
- 将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then()`方法。

```javascript
// thenable对象指的是具有then方法的对象
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);  // 42
});
```

##### 3. 参数不是具有`then()`方法的对象，或根本就不是对象
- 返回一个新的 Promise 对象，状态为resolved。

```javascript
const p = Promise.resolve('Hello');

p.then(function (s) {
  console.log(s)
});
// Hello
```
上面代码生成一个新的 Promise 对象的实例`p`。由于字符串`Hello`不属于异步操作（判断方法是字符串对象不具有 then 方法），返回 Promise 实例的状态从一生成就是`resolved`，所以回调函数会立即执行。`Promise.resolve()`方法的参数，会同时传给回调函数。

##### 4. 不带有任何参数
- 直接返回一个resolved状态的 Promise 对象。
- 立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

```javascript
// 在下一轮“事件循环”开始时执行
setTimeout(function () {
  console.log('three');
}, 0);

// 在本轮“事件循环”结束时执行
Promise.resolve().then(function () {
  console.log('two');
});

// 立即执行
console.log('one');

// one
// two
// three
```

### Promise.reject()
- 返回一个新的 Promise 实例，该实例的状态为`rejected`。
- `Promise.reject()`方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。

```javascript
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了

Promise.reject('出错了')
.catch(e => {
  console.log(e === '出错了')
})
// true
```

## Promise库
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html)
- [Q](https://note.youdao.com/)

## 学习资料
- https://es6.ruanyifeng.com/#docs/promise
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises
