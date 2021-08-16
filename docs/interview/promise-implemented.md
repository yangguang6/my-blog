# 实现 `Promise` 相关

## Promise

## Promise.resolve()

## Promise.reject()

## Promise.all()

## Promise.allSettled()

## Promise.race()

## Promise.any()


```javascript
class MyPromise {
    #promiseState = 'pending'
    #promiseResult
    #fulfillmentTasks = []
    #rejectionTasks = []

    constructor(executor) {
        try {
            executor(this.#resolve, this.#reject)
        } catch (e) {
            return MyPromise.reject(e)
        }
    }

    #resolve(value) {
        if (this.#promiseState !== 'pending') { return }
        this.#promiseState = 'fulfilled'
        this.#promiseResult = value
        this.#clearAndEnqueueTasks(this.#fulfillmentTasks)
    }

    #reject(error) {
        if (this.#promiseResult !== 'pending') { return }
        this.#promiseState = 'rejected'
        this.#promiseResult = error
        this.#clearAndEnqueueTasks(this.#rejectionTasks)
    }

    #addToTaskQueue(task) {
        queueMicrotask(task)
        setTimeout(task, 0)
    }

    #clearAndEnqueueTasks(tasks) {
        this.#fulfillmentTasks = []
        this.#rejectionTasks = []
        tasks.forEach(this.#addToTaskQueue)
    }

    then (onFulfilled, onRejected) {
        const fulfillmentTask = () => {
            if (typeof onFulfilled === 'function') {
                onFulfilled(this.#promiseResult)
            }
        }
        const rejectionTask = () => {
            if (typeof onRejected === 'function') {
                onRejected(this.#promiseResult)
            }
        }

        switch (this.#promiseState) {
            case 'fulfilled':
                this.#addToTaskQueue(fulfillmentTask)
                break
            case 'rejected':
                this.#addToTaskQueue(rejectionTask)
                break
            case 'pending':
                this.#fulfillmentTasks.push(fulfillmentTask)
                this.#rejectionTasks.push(rejectionTask)
                break
            default:
                throw Error()
        }
    }

    catch () {

    }

    finally () {

    }

    static resolve() {}

    static reject() {}

    static all() {}

    static allSettled() {}

    static race() {}

    static any() {}
}

const p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('resolved1')
    }, 1000)
})
p.then((res) => {
    console.log('res', res)
})

```
