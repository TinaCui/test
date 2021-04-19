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


/*=======================柯里化Currying=================================================================================================*/

/**
 * 柯里化：把接受多个参数的函数转换成接受一个单一参数的函数：https://segmentfault.com/a/1190000018265172/
 *
 */


/*---------------------将普通函数add柯里化--------------------------------------------------------------------*/
//方法一
var add = function(num1, num2) {
    return num1 + num2;
}
function curry(add) {
    var arr = [];

    return function reply() {
        var arg = Array.prototype.slice.call(arguments);
        arr = arr.concat(arg);

        if (arg.length === 0) { // 递归结束条件，修改为 传入空参数
            return arr.reduce(function(p, c) {
                return p = add(p, c);
            }, 0)
        } else {
            return reply;
        }
    }
}
var sum = curry(add);

console.log(sum(4)(3)(2)(1)(5)())   // 15


//方法二：推荐
function curry(f) {
    var len = f.length; //获取函数f的参数个数

    return function t() {
        var innerLength = arguments.length,
            args = Array.prototype.slice.call(arguments);

        if (innerLength >= len) {   // 递归出口，普通函数的参数>=接收到的参数个数
            return f.apply(undefined, args)
        } else {
            return function() {
                var innerArgs = Array.prototype.slice.call(arguments),
                    allArgs = args.concat(innerArgs);

                return t.apply(undefined, allArgs)
            }
        }
    }
}









/*---------------------------------------------------------------------------------------------------*/



/* 经典面试题：实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) == 6;
add(1, 2, 3)(4) == 10;
add(1)(2)(3)(4)(5) == 15;
*/
function add() {
   let args = Array.prototype.slice.call(arguments);

   let _adder = function(){
       args.push(...arguments);
       return _adder;
   }
    _adder.toString = function () {
        return args.reduce((a,b)=>a+b);
    }
   return _adder;
}

add(1)(2)(3) == 6 //true
add(1, 2, 3)(4) == 10; //true
add(1)(2)(3)(4)(5) == 15; //true
