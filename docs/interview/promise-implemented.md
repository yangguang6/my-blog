# 实现 `Promise` 相关

完整实现，参考于 [【译】通过实现 Promise 来加深理解](/translation/implementing-promise) 。

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

    static all(iterable) {
        return new MyPromise((resolve, reject) => {
            const promises = [...iterable]
            const len = promises.length
            !len && resolve([])
            const results = new Array(len)
            let fulfilledNumber = 0
            for (let i = 0; i < len; i++) {
                MyPromise.resolve(promises[i])
                    .then(
                        (res) => {
                            results[i] = res
                            if (++fulfilledNumber === len) {
                                return resolve(results)
                            }
                        },
                        (e) => reject(e)
                    )
            }
        })
    }

    static allSettled(iterable) {
        return new MyPromise((resolve, reject) => {
            const promises = [...iterable]
            const len = promises.length
            !len && resolve([])
            const results = new Array(len)
            let settledNumber = 0
            for (let i = 0; i < len; i++) {
                MyPromise.resolve(promises[i])
                    .then(
                        (res) => {
                            results[i] = {
                                status: 'fulfilled',
                                value: res,
                            }
                            if (++settledNumber === len) {
                                return resolve(results)
                            }
                        },
                        (e) => {
                            results[i] = {
                                status: 'rejected',
                                reason: e,
                            }
                            if (++settledNumber === len) {
                                return resolve(results)
                            }
                        }
                    )
            }
        })
    }

    static race(iterable) {
        return new MyPromise((resolve, reject) => {
            const promises = [...iterable]
            const len = promises.length
            !len && resolve()
            for (let i = 0; i < len; i++) {
                MyPromise.resolve(promises[i]).then(
                    (res) => resolve(res),
                    (e) => reject(e)
                )
            }
        })
    }

    static any(iterable) {
        return new MyPromise((resolve, reject) => {
            const promises = [...iterable]
            const len = promises.length
            const errorMessage = 'All promises were rejected'
            !len && reject(new AggregateError([], errorMessage))
            const results = new Array(len)
            let rejectedNumber = 0
            for (let i = 0; i < len; i++) {
                MyPromise.resolve(promises[i])
                    .then(
                        (res) => resolve(res),
                        (e) => {
                            results[i] = e
                            if (++rejectedNumber === len) {
                                return reject(new AggregateError(results, errorMessage))
                            }
                        }
                    )
            }
        })
    }
}

```
