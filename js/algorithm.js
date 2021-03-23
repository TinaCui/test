/*
快速排序算法
*/

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let leftArr = [];
    let rightArr = [];
    let middle = arr[0];
    for (let i = 1; i < arr.length; i++) {
        arr[i] < middle ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
    }
    return [].concat(quickSort(leftArr), [middle], quickSort(rightArr));
}

function quickSort(arr) {
    if (arr.length <= 1) return arr          //递归终止条件
    const pivot = arr.length / 2 | 0        //基准点
    const pivotValue = arr.splice(pivot, 1)
    const leftArr = []
    const rightArr = []
    arr.forEach(val => {
        val > pivotValue ? rightArr.push(val) : leftArr.push(val)
    })
    return [...quickSort(leftArr), pivotValue, ...quickSort(rightArr)].flat()
}

/*
找出正整数最大差值
*/

function getMaxProfit(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let minPrice = arr[0];
    let maxProfit = 0;
    //需要先进行排序，否则，最小值出现在最大值的后面，下面算法会有误
    arr.sort((a, b) => {
        return a - b
    });
    for (let i = 0; i < arr.length; i++) {
        let currentPrice = arr[i];
        minPrice = Math.min(currentPrice, minPrice);
        let currentProfit = currentPrice - minPrice;
        maxProfit = Math.max(maxProfit, currentProfit);
    }
    return maxProfit;
}


/*
随机生成指定长度的字符串
*/
function randomString(n) {
    let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
    let tmp = '',
        i = 0,
        l = str.length;
    for (i = 0; i < n; i++) {
        tmp += str.charAt(Math.floor(Math.random() * l));
    }
    return tmp;
}

/*
实现类似getElementsByClassName 的功能
*/

function queryClassName(node, name) {
    var starts = '(^|[ \n\r\t\f])',
        ends = '([ \n\r\t\f]|$)';
    var array = [],
        regex = new RegExp(starts + name + ends),
        elements = node.getElementsByTagName("*"),
        length = elements.length,
        i = 0,
        element;

    while (i < length) {
        element = elements[i];
        if (regex.test(element.className)) {
            array.push(element);
        }

        i += 1;
    }

    return array;
}

/* 使用JS 实现二叉查找树(Binary Search Tree)
二叉查找树，也称二叉搜索树、有序二叉树（英语：ordered binary tree）是指一棵空树或者具有下列性质的二叉树：

任意节点的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
任意节点的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
任意节点的左、右子树也分别为二叉查找树；
没有键值相等的节点。二叉查找树相比于其他数据结构的优势在于查找、插入的时间复杂度较低。为O(log n)。二叉查找树是基础性数据结构，用于构建更为抽象的数据结构，如集合、multiset、关联数组等。
*/
class Node {
    constructor(data, left, right) {
        this.data = data;
        this.right = right;
        this.left = left;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(data) {
        let node = new Node(data, null, null);
        if (!this.root) {
            this.root = node;
            return;
        }
        let currentNode = this.root;
        let parent = null;
        while (1) {
            parent = currentNode;
            if (data < currentNode.data) {
                currentNode = parent.left;
                if (currentNode === null) {
                    parent.right = node;//????parent.left = node;
                    break;
                }
            } else if (data > currentNode.data) {
                currentNode = parent.right;
                if (currentNode === null) {
                    parent.left = node;//???? parent.right = node;
                    break;
                }
            }
        }
    }


    find(data) {
        let current = this.root;
        while (current != null) {
            if (current.data == data) {
                break;
            } else if (data < current.data) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return current;
    }

    removeNode(data) {

    }
}


//数组去重的几种方法

/**
 * 方法一：利用Set对象
 * @param arr
 */
function unique(arr) {
    let set = new Set(arr);
    return [...set]; //或者 return Array.from(set);
}

/**
 * 方法二：利用includes 或者indexOf
 * @param arr
 */
function unique(arr) {
    let uniqueArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!uniqueArr.includes(arr[i])) { // 或者 uniqueArr.includes(arr[i]) === -1
            uniqueArr.push(arr[i]);
        }
    }
    return uniqueArr;
}

/**
 * 方法三：利用filter+indexOf去重
 * @param arr
 */
function unique(arr) {
    return arr.filter((item, index) => (arr.indexOf(item) === index));
}


/**
 * 方法四：利用sort先排序,再遍历数组去重
 * @param arr
 */
function unique(arr) {
    let sortedArr = arr.sort();
    for (let i = 1; i < sortedArr.length; i++) {
        if (sortedArr[i] === sortedArr[i - 1]) {
            sortedArr.splice(i, 1);
            i--;
        }
    }
    return sortedArr;
}

/**
 * 方法五：利用Map数据结构
 * @param arr
 */
function unique(arr) {
    let map = new Map();
    let result = [];
    for (let item of arr) {
        if (map.has(item)) {
            map.set(item, true)
        } else {
            map.set(item, false);
            result.push(item);
        }
    }
    return result;
}
