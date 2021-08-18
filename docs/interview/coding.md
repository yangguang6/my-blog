# Coding

## 1. 对象属性的嵌套转换

### 题目描述

输入：  

```javascript
const foo1 = {
    'A': 1,
    'B.A': 2,
    'B.B': 4,
    'CC.D.E': 3,
    'CC.D.F': 5
}
```

输出：  

```javascript
const foo1 = {
    'A': 1,
    'B': {
        'A': 2,
        'B': 4
    },
    'CC': {
        'D': {
            'E': 3,
            'F': 5
        }
    }
}
```

### 实现

```javascript
function handleObject(obj) {
  const keys = Object.keys(obj)
  const result = {}
  keys.forEach((key) => {
    const ks = key.split('.')
    const value = obj[key]
    let tmp = result
    const lastIndex = ks.length - 1
    ks.forEach((k, index) => {
      if (index === lastIndex) {
        tmp[k] = value
      } else {
        if (tmp[k]) {
          tmp = tmp[k]
        } else {
          tmp = tmp[k] = {}
        }
      }
    })
  })
  return result
}
```
