# 数据结构与算法

## 排序

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

