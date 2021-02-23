/**
 * 功能：原型 原型链
 * 作者：cuicui
 * 日期： 2020/9/7
 */


/**
 * 每个对象都具有一个名为__proto__的属性；
 * 每个构造函数都有prototype对象
 * 因为：Object和Function都是构造函数，所有构造函数都是Function的实例，
 * 所以：Object instanceof Function === true,Object.__proto__ === Function.prototype,Function.__proto__ === Function.prototype
 * 因为：Function.prototype 是Object的实例对象
 * 所以：Function.prototype.__proto__ === Object.prototype
 */
var foo = {}, //foo 是Object的实例
    F = function(){};  //F是Function的实例

Object.prototype.a = 'value a';
Function.prototype.b = 'value b';

console.log(foo.a)  // value a ， 原型链查找路径是:foo自身:没有-->foo.__proto__（Object.prototype）：找到a
console.log(foo.b)  // undefined, 原型链查找路径是:foo自身:没有-->foo.__proto__（Object.prototype）：没有 -->Object.prototype.__proto__:没有，输出undefined
console.log(F.a)    // value a,  原型链查找路径是: F自身：没有-->F.__proto__(Function.prototype):没有 --> Function.prototype.__proto__(Object.prototype):找到a
console.log(F.b)    // value b,原型链查找路径是: F自身：没有-->F.__proto__(Function.prototype):找到b
