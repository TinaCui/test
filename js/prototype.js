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
    F = function () {
    };  //F是Function的实例

Object.prototype.a = 'value a';
Function.prototype.b = 'value b';

console.log(foo.a)  // value a ， 原型链查找路径是:foo自身:没有-->foo.__proto__（Object.prototype）：找到a
console.log(foo.b)  // undefined, 原型链查找路径是:foo自身:没有-->foo.__proto__（Object.prototype）：没有 -->Object.prototype.__proto__:没有，输出undefined
console.log(F.a)    // value a,  原型链查找路径是: F自身：没有-->F.__proto__(Function.prototype):没有 --> Function.prototype.__proto__(Object.prototype):找到a
console.log(F.b)    // value b,原型链查找路径是: F自身：没有-->F.__proto__(Function.prototype):找到b

/*----------------------继承方法---------------------------------------------------------------------------------------------------------*/
/**
 * 原型链继承：
 * 缺点：1.不能向父类传参
 * 2.父类引用类型被所有实例共享
 *
 */
function Parent() {
    this.color = ['red', 'green', 'blue'];
}

function Child() {

}

Child.prototype = new Parent();

let child1 = new Child();
let child2 = new Child();
child1.color.push('grey');
console.log(child1.color); //['red','green','blue','grey']
console.log(child2.color); //['red','green','blue','grey']


/**
 * 构造函数继承
 * 优点：解决原型链继承的缺点
 * 1.可以向父类传参
 * 2.避免了所有实例共享父类引用类型
 *
 * 缺点：
 * 每次实例化都要重新创建父类的方法。
 */
function Parent(name) {
    this.name = name;
    this.color = ['red', 'green', 'blue'];
    this.sayName = function () {
        console.log(this.name);
    }
}

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

let child1 = new Child('cc', 21);
let child2 = new Child('dd', 22);
child1.color.push('grey');
console.log(child1.color); //['red','green','blue','grey']
console.log(child2.color); //['red','green','blue']

/**
 * 组合式继承：原型链继承和构造函数继承的组合使用。
 * 解决了构造函数继承的缺点。将方法放到父类原型上，然后通过原型链方法继承父类原型上的方法。
 *
 * 缺点：调用了两次父类构造函数。
 */

function Parent(name) {
    this.name = name;
    this.color = ['red', 'green', 'blue'];
}
Parent.prototype.sayName = function () {  //将方法放到父类原型上
    console.log(this.name);
}

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

Child.prototype = new Parent();

let child1 = new Child('cc', 21);
let child2 = new Child('dd', 22);
child1.color.push('grey');
console.log(child1.color); //['red','green','blue','grey']
console.log(child2.color); //['red','green','blue']
child1.sayName(); //cc
child2.sayName(); //dd

/**
* 原型式继承
*/
//es6:Object.create()
//es5
function createObj(o) {
    let F = function(){};
    F.prototype = o;
    return new F()
}



/**
 * 寄生式 :在原型式的基础上包了一层函数，函数返回Object.create()创建的对象。
 */

function createObj(o) {
    let obj = Object.create(o);
    //可以给obj添加方法
    return obj
}

/**
 * 寄生组合式继承：修复了组合继承调用两次父类的缺点。完美实现了继承~~~~
 */

function inheritPrototype(child, parent){
    let prototype = Object.create(parent.prototype);
    prototype.constructor = child;//增强对象
    child.prototype = prototype;
}
