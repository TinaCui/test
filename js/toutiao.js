/*输出结果是：
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
//注意：await后面的代码虽然算作宏任务，但是和普通的微任务不在一个维度，位于更上一层的任务队列，所以优先级要比其他（在下面定义的）微任务要高；所以'async1 end'比promise2先输出
async function async1(){
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2(){
    console.log('async2');
}
console.log('script start');
setTimeout(function(){
    console.log('setTimeout');
},0);
async1();
new Promise(function(resolve){
    console.log('promise1');
    resolve();
}).then(function(){
    console.log('promise2');
})
console.log('script end');


/*如果将promise代码移到async之前定义，那么promise2比async1 end先输出
输出结果为：
promise1
script start
async1 start
async2
script end
promise2
async1 end
setTimeout
*/
async function async1(){
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2(){
    console.log('async2');
}
console.log('script start');
setTimeout(function(){
    console.log('setTimeout');
},0);
async1();
new Promise(function(resolve){
    console.log('promise1');
    resolve();
}).then(function(){
    console.log('promise2');
})
console.log('script end');


/*实现Function的bind方法，使得以下程序最后能输出‘success’*/
/**
 * 1.bind()除了this还接收其他参数，bind()返回的函数也接收参数，这两部分的参数都要传给返回的函数
 * 2.new的优先级：如果bind绑定后的函数被new了，那么此时this指向就发生改变。此时的this就是当前函数的实例（this）,而不是传入的（context）
 * 3.没有保留原函数在原型链上的属性和方法
 * @param context
 * @param args
 * @return {fn}
 */
Function.prototype.bind = function(context,...args){
    if (typeof this !== 'function') {
        throw TypeError("Bind must be called on a function")
    }
    let self = this;
    let fn = function(){
        //如果当前函数的this指向的是构造函数中的this 则判定为new 操作
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.apply(arguments)));
    }
    // 继承原型上的属性和方法
    fn.prototype = Object.create(self.prototype);
    return fn;
}

function Animal(name,color){
    this.name = name;
    this.color = color;
}
Animal.prototype.say = function(){
    return `I'm a ${this.color} ${this.name}`;
}
const Cat = Animal.bind(null,'cat');
console.log(Cat);
const cat = new Cat('white');
if(cat.say()==='I\'m a white cat' && cat instanceof Animal ){
    console.log('success');
}


/*如果上题要求不允许使用apply call等方法，则需要手动实现apply 或者call*/
/**
 * 实现Function原型上apply方法
 * @param context 上下文
 * @param args 参数为数组
 */
Function.prototype.apply = function(context,args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

/**
 * 实现Function原型上call方法
 * @param context 上下文
 * @param args 参数一个个列出
 */
Function.prototype.call = function (context, ...args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}



/*节流函数:函数节流指的是某个函数在一定时间间隔内（例如 3 秒）只执行一次，在这 3 秒内 无视后来产生的函数调用请求
(预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期)
实现原理是：当用户触发一个事件时，先setTimeout让这个事件延迟一会儿再执行，如果这个时间间隔内有触发了这个事件，那就clear掉原来的定时器，在setTimeout一个新的定时器延迟一会儿再执行
*/
/*function throttle(fn,wait,mustRun){
    let timer,
        startTime = Date.now();

    return function() {
        let context = this,
            args = arguments,
            curTime = Date.now();
        clearTimeout(timer);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
            fn.apply(context,args);
            startTime = curTime;
        // 没达到触发间隔，重新设定定时器
        }else{
            timer = setTimeout(func, wait);
        }
    };
}*/


function throttle(fn,wait) {
    let timer,
        firstTime = true;
    return function () {
        if(firstTime) { //第一次调用不需要延迟
            fn.apply(this,arguments);
            firstTime = false;
            return;
        }
        if (timer) {
            return;
        }
        timer = setTimeout(()=>{
            clearTimeout(timer);
            fn.apply(this, arguments);
        },wait)

    }

}

function throttle(fn,wait) {
    let startTime = Date.now();
    return function () {
        let now = Date.now();
        if(now - startTime >= wait) {
            fn.apply(this, arguments);
            startTime = now;
        }
    }
}
/*
函数防抖:函数防抖就是让某个函数在上一次执行后，满足等待某个时间内不再触发此函数后再执行，而在这个等待时间内再次触发此函数，等待时间会重新计算。

*/
function debounce(fn,delay){
    var timer = null;
    return function(){
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(context,args);
        },delay);
    }
}

/*
图片懒加载
*/
function lazyLoadImg (){
    var imgs = document.body.querySelectorAll('img');
    var winH = window.innerHeight;//浏览器高度
    var scrollH = document.documentElement.scrollTop||document.body.scrollTop ;//浏览器滚动条滚过的高度

    [].forEach.call(imgs,function(img){
        if(!img.getAttribute('data-src')){
            return false;
        }
         var imageToTop = getTop(img);//图片到顶部的高度
         if(winH + scrollH > imageToTop){
            img.src = img.getAttribute('data-src');
             img.removeAttribute('data-src');
        }
    });
    //判断图片是否全部加载完毕
    var isAllDone = [].forEach.call(imgs,function(img){
        return !img.getAttribute('data-src')
    })
    if(isAllDone){
        window.addEventListener('scroll',lazyLoadImg);
    }

}
function getTop(e){
    var height = e.offsetTop;
    while(e = e.offsetParent){
        height += e.offsetTop;
    }
    return height;
}
/*----------------------------------------------------------------------------------------------------*/

/**
 * 0.1+0.2等于多少，浮点型在内存中如何存储
 * 实际上很简单。对于十进制数值系统（就是我们现实中使用的），它只能表示以进制数的质因子为分母的分数。
 * 10 的质因子有 2 和 5。因此 1/2、1/4、1/5、1/8和 1/10 都可以精确表示，因为这些分母只使用了10的质因子。
 * 相反，1/3、1/6 和 1/7 都是循环小数，因为它们的分母使用了质因子 3 或者 7。二进制下（进制数为2），只有一个质因子，即2。
 * 因此你只能精确表示分母质因子是2的分数。二进制中，1/2、1/4 和 1/8 都可以被精确表示。
 * 但是，1/5 或者 1/10 就变成了循环小数。所以，在十进制中能够精确表示的 0.1 与 0.2（1/10 与 1/5），到了计算机所使用的二进制数值系统中，就变成了循环小数。
 * 当你对这些循环小数进行数学运算时，并将二进制数据转换成人类可读的十进制数据时，会对小数尾部进行截断处理。
 */


/**
 * 考点new关键字都做了哪些工作
 * Object.prototype.a = 'Object'
 * Function.prototype.a = 'Function'
 * function Child() {}
 * let child = new Child()
 * console.log(Child.a) //Function 因为： Child 是Function的实例，所以Child.a === Function.prototype.a
 * console.log(child.a) // Object  因为：child是Object的实例，所以child.a === Object.prototype.a
 *
*/


/**
 * 实现Promise.all方法
 * 要点1：参数必须是个数组，但数据每一项不一定非得是promise，可通过Promise.resolve(value)返回promise对象，value若是promise对象，则返回promise对象，若不是promise对象，
 * 要点2：返回值依然是个promise对象
 */
Promise.all = function (promiseArr) {
    return new Promise(function (resolve, reject) {
        if (!(promiseArr instanceof Array)) {
            throw new TypeError('promiseArr must be array');
        }

        let resultArr = [];
        let count = 0;
        let length = promiseArr.length;

        if (length === 0) resolve(resultArr);

        for (let i in promiseArr) {
            Promise.resolve(promiseArr[i]).then(res => {
                count++;
                resultArr[i] = res;
                if (count === length) {
                    resolve(resultArr);
                }
            },err => {
                reject(err);
            }).catch(err=>{
                console.log(err);
            })
        }
    })
}

let promise1 = new Promise((resolve, reject) => {
    resolve(1);
})
let promise2 = new Promise((resolve, reject) => {
    resolve(2);
})
let promise3 = new Promise((resolve, reject) => {
    resolve(3);
})

Promise.all([promise1,promise2,promise3]).then(arr=> {
    console.log(arr);
})

/**
 * template='<div>{{name}}</div>'
 * data = {
 *     name: 'test'
 * }
 * 实现compile(template,data){}方法使得
 * result = compile(template,data) 输出为'<div>test</div>'
 */

function compile(template, data) {
    let reg = /\{\{(.*)\}\}/g;
    if (reg.test(template)) {
        let key = RegExp.$1;
        let value = data[key]
        return template.replace(reg, value);
    }
}
let result  = compile('<div>{{name}}</div>', {name:'test'});
console.log(result)
