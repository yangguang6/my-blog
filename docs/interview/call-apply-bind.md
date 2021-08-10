# call

## 思路

## 实现

```javascript
Function.prototype.myCall = function call (thisArg = globalThis, ...args) {
    const fn = Symbol('fn')
    thisArg[fn] = this
    const res = thisArg[fn](...args)
    delete thisArg[fn]
    return res
}
```

## 测试

```javascript

```
