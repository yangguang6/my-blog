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
- 递归：递归地对基准前后的子数组进行分区。


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

## 搜索

### 顺序搜索

#### 思路

- 遍历数组
- 找到跟目标值相等的元素，就返回它的下标
- 遍历结束后，如果没有搜索到目标值，就返回-1

#### 实现

```javascript
Array.prototype.sequentialSearch = function (item) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === item) {
            return i
        }
    }
    return -1
}
```

#### 时间复杂度

- 遍历数组是一个循环操作
- 时间复杂度：O(n)

### 二分搜索

#### 思路

前提：数组有序

- 从数组的中间元素开始，如果中间元素正好是目标值，则搜索结束
- 如果目标值大于或者小于中间元素，则在大于或小于中间元素的那一半数组中搜索

#### 实现

```javascript
Array.prototype.binarySearch = function (item) {
    let low = 0
    let high = this.length - 1
    while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const element = this[mid]
        if (element < item) {
            low = mid + 1
        } else if (element > item) {
            high = mid - 1
        } else {
            return mid
        }
    }
    return -1
}
```

#### 时间复杂度

- 每一次比较都使搜索范围缩小一半
- 时间复杂度：O(logN)

### 例题

- [21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)
- [374. 猜数字大小](https://leetcode-cn.com/problems/guess-number-higher-or-lower/)

