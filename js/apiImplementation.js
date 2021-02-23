/**
 * 功能：一些原生api的实现
 * 作者：cuicui
 * 日期： 2020/6/12
 */

/**
 * 实现数组原型的some方法，Array.prototype.some(cb)
 * @param cb = (item,index,arr) = {} ，cb一旦返回true将不会再继续执行剩下的数组项
 * @return {boolean} true表示数组中包含满足cb条件的数组项
 */
Array.prototype.some = function (cb) {
    if(!(typeof cb === "function")) {
        throw new TypeError(cb + ' is not a function')
    }
    for (let i = 0; i < this.length; i++) {
        console.log(i);
        if(cb(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

let arr = [1,2,4];
arr.some((item,index,arr) => (item === 2))
