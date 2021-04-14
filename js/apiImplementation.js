/**
 * 功能：一些api的实现
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



/*-----------------------实现compose函数---------------------------------------------------------------*/

/**
 * 实现compose函数
 * 特点：
 * 1.后一个函数的返回值作为前一个函数的参数
 * 2.compose返回一个function ，并可以接受多个参数，作为fns最后一个函数的参数
 * @param fns 多个函数作为参数
 */

//redux 写法
//解释：
//假设:fns = [f1, f2, f3]
//loop1:a = f1,b=f2;ret1 = (...args) => f1(f2(...args))
//loop2:a = ret1; b=f3;ret2 = (...args) => ret1(f3(...args))，即 ret2 = (...args) => f1(f2(f3(...args)))

function compose(...fns) {
   if(fns.length === 0) {
       return
   }
   if(fns.length === 1) {
       return fns[0];
   }

   return fns.reduce((a,b)=>(...args)=>a(b(...args)))
}


//loadash 写法 从右到左执行
function compose(...fns) {
    let length = fns.length;

    /*let index = length;
    while(--index > 0) {
        if(typeof fns[index] != "function") {
            throw new TypeError('Expected a function')
        }
    }*/

    return function (...args) {
        let index = length - 1;
        let result = fns[index].apply(this,args);
        while(--index > -1) {
            result = fns[index].call(this,result)
        }
        return result;
    }
}


/*-------------------柯里化Currying-------------------------------------------------------------------------------------------------------------*/

/**
 * 柯里化：把接受多个参数的函数转化成只接受单个参数的函数  ，参考https://www.jianshu.com/p/2975c25e4d71
 *
 */

/*正常正则验证字符串 reg.test(txt)*/

// 普通函数封装后
function check(reg, txt) {
    return reg.test(txt)
}

check(/\d+/g, 'test')       //false
check(/[a-z]+/g, 'test')    //true

// Currying后，好处是：参数复用
function curryingCheck(reg) {
    return function(txt) {
        return reg.test(txt)
    }
}

var hasNumber = curryingCheck(/\d+/g)
var hasLetter = curryingCheck(/[a-z]+/g)

hasNumber('test1')      // true
hasNumber('testtest')   // false
hasLetter('21212')      // false


/* 经典面试题：实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
*/
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}

add(1)(2)(3)                // 6
add(1, 2, 3)(4)             // 10
add(1)(2)(3)(4)(5)          // 15
add(2, 6)(1)                // 9
