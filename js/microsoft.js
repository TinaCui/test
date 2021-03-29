/**
 * 给定一个数组，和一个target，求数组中两个数相加等于target，返回这两个数的下标。
 * @param arr
 * @param target
 * @return {Array}
 */
function getTargetIndexs(arr, target) {
    let indexes = [];
    for (let i = 0; i < arr.length; i++) {
        let other = target - arr[i];
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] === other) {
                indexes.push(i);
                indexes.push(j);
            }
        }
    }
    return indexes;
}

function getTargetIndexs(arr, target) {
    let map = {}
    for (let i = 0; i < arr.length; i++) {
        let other = target - arr[i];
        map[arr[i]] = i;
        if (map[other]) {
            return [i, map[other]]
        }
    }
}

// [1,2,3,4,5,6] target = 10
function getTargetIndexs(arr, target) {
    arr.sort((a, b) => {
        return a - b;
    });
    let i = 0, j = arr.length - 1;
    while (i != j) {
        let sum = arr[i] + arr[j];

        if (sum === target) {
            return [i, j];
        } else {
            sum < target ? i++ : j--;
        }
    }
}
