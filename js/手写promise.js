/**
 * 功能：手写Promise构造函数 https://segmentfault.com/a/1190000020505870
 * 作者：cuicui
 * 日期： 2020/8/11
 */

/**
 *
 * @param executor 立即执行函数
 * @constructor
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const FAIL = 'fail';

function Promise(executor) {
    let _this = this;
    _this.$$status = PENDING;
    _this.value; //成功时结果，称为终值
    _this.reason; //失败时原因，称为拒因
    _this.onFulfilled = []; //成功时回调函数列表，之所以是数组是因为：可能存在分别调用了多次then的情况，
    _this.onRejected = []; //失败时回调函数列表
    try {
        executor(resolve.bind(_this), reject.bind(_this));
    } catch (e) {
        reject(e);
    }

    function resolve(value) {
        if (_this.$$status === PENDING) {
            _this.$$status = FULFILLED;
            _this.value = value;
            _this.onFulfilled.forEach(fn => fn(value));
        }
    }

    function reject(reason) {
        if (_this.$$status === PENDING) {
            _this.$$status = FAIL;
            _this.reason = reason;
            _this.onRejected.forEach(fn => fn(reason));
        }
    }
}

/**
 * 传入成功和失败回调函数，根据promise实例的状态决定立即执行，还是将参数加入回调函数列表。返回一个新的promise对象
 * @param onFulfilled promise对象状态为success时执行
 * @param onRejected promise对象状态为fail时执行
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
    let _this = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value; //值传递性
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => reason;//值传递性
    let promise2 = new Promise((resolve, reject)=>{
        if (this.$$status === FULFILLED) {
            setTimeout(()=>{
                try {
                    let x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                }catch (e) {
                    reject(e);
                }
            })
        } else if (this.$$status === FAIL) {
            setTimeout(()=>{
                try{
                    let x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                }catch (e) {
                    reject(e)
                }
            })
        } else if (this.$$status === PENDING) {
            this.onFulfilled.push(()=>{
                setTimeout(()=>{
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch (e) {
                        reject(e);
                    }
                })
            });
            this.onRejected.push(()=>{
                setTimeout(()=>{
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch (e) {
                        reject(e);
                    }
                })
            });
        }
    })

    return promise2;
}

/**
 * 主要为了处理then回调函数执行后的返回值x为promise对象或者函数的情况。
 * promise的解决过程：
 1.x 与 promise 相等，以 TypeError 为据因拒绝执行 promise
 2.x 为 Promise
 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
 如果 x 处于执行态，用相同的值执行 promise
 如果 x 处于拒绝态，用相同的据因拒绝 promise
 2.1
 */
function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x){
        reject(new TypeError('Chaining cycle'))
    }
    if(x && typeof x === 'object' || typeof x === 'function'){
        let used;
        try {
            let then = x.then  //x是promise对象时，将x的终值（value，resolve函数的参数）作为promise2的终值传递下去
            if(typeof then === 'function'){
                then.call(x, (y)=>{ //y为x（promise对象）的终值
                    if (used) return;
                    used = true
                    resolvePromise(promise2, y, resolve, reject)
                }, (r) =>{
                    if (used) return;
                    used = true
                    reject(r)
                })
            } else {
                if (used) return;
                used = true
                resolve(x)
            }
        } catch(e){
            if (used) return;
            used = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}


/**
 * 使用Promise实现每隔1秒输出1,2,3
 */

const arr = [1,2,3];
arr.reduce((p,x)=>{
    return p.then(()=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(console.log(x));
            },1000)
        })
    })
},Promise.resolve())




/**
 红灯3秒亮一次，黄灯2秒亮一次，绿灯1秒亮一次；如何让三个灯不断交替重复亮灯？（用Promise实现）三个亮灯函数已经存在：
 */

function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}

function light(time, cb) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            cb();
            resolve();
        },time)
    })
}

//方法一：用promise实现
function step() {
    Promise.resolve().then(()=>{
        return light(3000, red) //light函数返回的是promise对象，该对象的状态必须是fulfilled，才可执行下面的then
    }).then(()=>{
        return light(2000, yellow)
    }).then(()=>{
        return light(1000, green)
    }).then(()=>{
        return step();
    })
}

step();

//方法二：用async await实现
async function main() {
    while (true) {
      await light(3000, red);
      await light(2000, yellow);
      await light(1000, green);
    }
}
main()




/**
 * 实现mergePromise函数
 *实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。
 */

const time = (timer) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timer)
    })
}
const ajax1 = () => time(2000).then(() => {
    console.log(1);
    return 1
})
const ajax2 = () => time(1000).then(() => {
    console.log(2);
    return 2
})
const ajax3 = () => time(1000).then(() => {
    console.log(3);
    return 3
})

function mergePromise (ajaxArray) {
    let data = [];
    let promise = Promise.resolve();
    ajaxArray.forEach((ajax)=>{
        promise = promise.then(ajax).then(res=>{
            data.push(res);
            return data;
        })
    })
    return promise;
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log("done");
    console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]


/**
 *封装一个异步加载图片的方法
 * 只需要在图片的onload函数中，使用resolve返回一下就可以了。
 */

function loadImg(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve(img)
        }
        img.error = function () {
            reject(new Error('Could not load image at '+ url))
        }
        img.src = url;
    })
}
