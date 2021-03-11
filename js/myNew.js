/**
 * 功能：模拟实现new
 * new 做了什么：
 * 1：创建一个新对象，并继承构造函数的原型（var Fn = function(){};方法1：var obj = {};obj.__proto = Fn.prototype;方法二：var obj = Object.create(Fn)方法实现），这一步是为了继承构造函数原型的属性和方法
 * 2：执行构造函数，并将构造函数内的this指定为第一步新创建的对象，这一步是为了执行构造函数的赋值操作
 * 3：如果执行构造函数返回的是对象，则将该对象返回，否则返回第一步创建的对象
 * 作者：cuicui
 * 日期： 2020/6/2
 */

// new是关键字,这里我们用函数来模拟,new Foo(args) <=> myNew(Foo, args)
function myNew(fn, ...args) {
    if (typeof fn !== "function") {
        throw TypeError("")
    }
    let obj = Object.create(fn.prototype);//1：创建一个新对象，并继承构造函数的原型（通过Object.create()方法实现），这一步是为了继承构造函数原型的属性和方法
    let result = fn.apply(obj,args); //2：执行构造函数，并将构造函数内的this指定为第一步新创建的对象，这一步是为了执行构造函数的赋值操作
    return typeof result === "object" && result !== null ? result : obj //3：如果执行构造函数返回的是对象，则将该对象返回，否则返回第一步创建的对象
}

//case1:构造函数不返回对象（即result值为undefined）
function Foo(name) {
    this.name = name;
}

let newFoo = myNew(Foo, 'cuicui');
console.log(newFoo)                 // Foo {name: "cuicui"}
console.log(newFoo instanceof Foo)  // true
console.log(newFoo.__proto__ === Foo.prototype) //true

//case 2:构造器返回对象(result值为{name})
function Bar(name) {
    return {
        name
    }
}

let newBar = myNew(Bar, 'cuicui');
console.log(newBar) //{name:"cuicui"}
console.log(newBar instanceof Bar) //false
console.log(newBar.__proto__ === Bar.prototype) //false


