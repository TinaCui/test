/*异步*/
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
Function.prototype.bind = function(context){
    var fn = this;
    return function(){
        fn.apply(context,arguments);
    }
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

/*节流函数:预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期
实现原理是：当用户触发一个事件时，先setTimeout让这个事件延迟一会儿再执行，如果这个时间间隔内有触发了这个事件，那就clear掉原来的定时器，在setTimeout一个新的定时器延迟一会儿再执行
*/
function throttle(fn,wait,mustRun){
    var timer,
        startTime = new Date();

    return function() {
        var context = this,
            args = arguments,
            curTime = new Date();
        clearTimeout(timer);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
            func.apply(context,args);
            startTime = curTime;
        // 没达到触发间隔，重新设定定时器
        }else{
            timer = setTimeout(func, wait);
        }
    };
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
        timer = setTimeout({
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
