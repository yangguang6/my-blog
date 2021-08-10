# 实现 `Promise` 相关

## Promise

## Promise.resolve()

## Promise.reject()

## Promise.all()

## Promise.allSettled()

## Promise.race()

## Promise.any()


```javascript
const addToTaskQueue = (task) => queueMicrotask(task)
const isThenable = (value) => typeof value === 'object' && value.then && typeof value.then === 'function'

class MyPromise {
    #promiseState = 'pending'
    #promiseResult
    #fulfillmentTasks = []
    #rejectionTasks = []
    #alreadyResolved = false

    constructor(executor) {
        try {
            executor(this.#resolve, this.#reject)
        } catch (e) {
            return MyPromise.reject(e)
        }
    }

    #resolve = (value) => {
        if (this.#alreadyResolved) { return this }
        this.#alreadyResolved = true

        if (isThenable(value)) {
            value.then((result) => this.#doFulfill(result), (error) => this.#doReject(error))
        } else {
            this.#doFulfill(value)
        }

        return this
    }

    #reject = (error) => {
        if (this.#alreadyResolved) { return this }
        this.#alreadyResolved = true
        this.#doReject(error)
        return this
    }

    #doFulfill(value) {
        this.#promiseState = 'fulfilled'
        this.#promiseResult = value
        this.#clearAndEnqueueTasks(this.#fulfillmentTasks)
    }

    #doReject(error) {
        this.#promiseState = 'rejected'
        this.#promiseResult = error
        this.#clearAndEnqueueTasks(this.#rejectionTasks)
    }

    #clearAndEnqueueTasks(tasks) {
        this.#fulfillmentTasks = []
        this.#rejectionTasks = []
        tasks.forEach(addToTaskQueue)
    }

    #runReactionSafely(reaction, resolve, reject) {
        try {
            const returned = reaction(this.#promiseResult)
            resolve(returned)
        } catch (e) {
            reject(e)
        }
    }

    then (onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            const fulfillmentTask = () => {
                if (typeof onFulfilled === 'function') {
                    this.#runReactionSafely(onFulfilled, resolve, reject)
                } else {
                    resolve(this.#promiseResult)
                }
            }
            const rejectionTask = () => {
                if (typeof onRejected === 'function') {
                    this.#runReactionSafely(onRejected, resolve, reject)
                } else {
                    reject(this.#promiseResult)
                }
            }

            switch (this.#promiseState) {
                case 'fulfilled':
                    addToTaskQueue(fulfillmentTask)
                    break
                case 'rejected':
                    addToTaskQueue(rejectionTask)
                    break
                case 'pending':
                    this.#fulfillmentTasks.push(fulfillmentTask)
                    this.#rejectionTasks.push(rejectionTask)
                    break
                default:
                    throw Error()
            }
        })
    }

    catch (onRejected) {
        return this.then(null, onRejected)
    }

    finally (onFinally) {
        return this.then(
            (value) => { onFinally(); return value },
            (error) => { onFinally(); throw error },
        )
    }

    static resolve(value) {
        if (isThenable(value)) { return value }
        return new MyPromise((resolve) => resolve(value))
    }

    static reject(error) {
        return new MyPromise((resolve, reject) => reject(error))
    }

    static all(iterator) {
        return new MyPromise((resolve, reject) => {
            const promises = [...iterator]
            const len = promises.length
            const results = new Array(len)
            let fulfilledNumber = 0
            for (let i = 0; i < len; i++) {
                promises[i].then((res) => {
                    results[i] = res
                    if (++fulfilledNumber === len) {
                        return resolve(results)
                    }
                }).catch((e) => {
                    return reject(e)
                })
            }
        })
    }

    static allSettled() {}

    static race() {}

    static any() {}
}

const p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        return resolve('resolved1')
    }, 1000)
})
console.log(p)
p.then((res) => {
    console.log('res1', res)
    // throw new Error('error!')
    return MyPromise.resolve(Promise.resolve(444))
    // return 444
}).then((res) => {
    console.log('res2', res)
}).catch((e) => {
    console.log('error', e)
})

p.then((res) => {
    console.log('res4', res)
})

p.finally(() => {
    console.log('finally')
    throw Error('666')
    // return 666
}).then((res) => {
    console.log('res3', res)
}).catch((e) => {
    console.log('error2', e)
})

```
