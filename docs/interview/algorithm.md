# 数据结构与算法

## 排序

[动画演示](https://visualgo.net/en/sorting)

![](../images/sort-algorithm.png)

### 插入排序

#### 思路

- 从第二个数开始往前比
- 比它大就往后排
- 以此类推进行到最后一个数

#### 实现

```javascript
Array.prototype.insertionSort = function () {
    for (let i = 1; i < this.length; i++) {
        const temp = this[i]
        let j = i
        while (j > 0) {
            if (this[j - 1] > temp) {
                this[j] = this[j - 1]
            } else {
                break
            }
            --j
        }
        this[j] = temp
    }
}
```

### 归并排序

#### 思路

- 分：把数组劈成两半，再递归地对子数组进行"分"操作，直到分成一个个单独的数。
- 合：把两个数合并为有序数组，再对有序数组进行合并，直到全部子数组合并为一个完整数组。

#### 实现

```javascript
Array.prototype.mergeSort = function () {
    const rec = (arr) => {
        // 分
        if (arr.length === 1) { return arr }
        const mid = Math.floor(arr.length / 2 )
        const left = arr.slice(0, mid)
        const right = arr.slice(mid, arr.length)
        const orderedLeft = rec(left)
        const orderedRight = rec(right)

        // 合
        const res = []
        while (orderedLeft.length || orderedRight.length) {
            if (orderedLeft.length && orderedRight.length) {
                res.push(orderedLeft[0] < orderedRight[0] ? orderedLeft.shift() : orderedRight.shift())
            } else if (orderedLeft.length) {
                res.push(orderedLeft.shift())
            } else if (orderedRight.length) {
                res.push(orderedRight.shift())
            }
        }
        return res
    }
    const orderedArr = rec(this)
    orderedArr.forEach((n, i) => { this[i] = n })
}
```

### 快速排序

#### 思路

- 分区：从数组中任意选择一个"基准"，所有比基准小的元素放在基准前面，比基准大的元素放在基准的后面。
- 递归：递归地对基准前后的自述组进行分区。


#### 实现

```javascript
Array.prototype.quickSort = function () {
    const rec = (arr) => {
        if (arr.length <= 1) { return arr }
        const mid = arr[0]
        const left = []
        const right = []
        for (let i = 1; i < arr.length; i++) {
            const n = arr[i]
            if (n < mid) {
                left.push(n)
            } else {
                right.push(n)
            }
        }
        return [...rec(left), mid, ...rec(right)]
    }
    const res = rec(this)
    res.forEach((v, i) => { this[i] = v })
}
```

#### 时间复杂度

- 递归的时间复杂度：O(logN)
- 分区操作的时间复杂度：O(n)
- 总时间复杂度：O(n*logN)

