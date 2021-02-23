/*
JS设计模式     23种设计模式 5大设计原则
最常用的设计模式：
创建型：
1 单例模式
2 工厂模式
3 原型模式

结构型：
1 适配器模式
2 代理模式

行为型：
1 策略模式
2 迭代器模式
3 观察者模式
4 命令模式
5 状态模式
 */

/*
工厂模式：创建对象不暴露创建逻辑，通过一个共同的接口来实现新对象的创建，工厂模式是替代new操作的一种模式。
 优点：
 1 创建函数于构造函数分离
 2 符合开放封闭原则（OCP）
 */
//demo1:ES5
function CreatePerson(name,age) {
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.sayName = function () {
        return this.name;
    };
    return obj;
}
var p1 = CreatePerson('Tom',20);//或者new CreatePerson('Tom',20)
var p2 = CreatePerson('Lily',21);
//demo2 ES6
class  Creator {
    create(name){
        return new Animal(name)
    }
}
class Animal {
    construnctor(name){
        this.name = name;
    }
}
let creator = new Creator();
let duck = creator.create('duck');
let cat  = creator.create('cat');
console.log(duck.name);//duck
console.log(cat.name);//cat

/*
单例模式：一个类仅有一个实例
 */
//demo1 ES5
var Singleton = function (name) {
    this.name = name;
};
Singleton.prototype.sayName = function () {
    return this.name;
};
var getInstance = function () {//立即执行函数的目的是防止闭包变量instance变量污染
    var instance;
    return function (name){
        if(!instance){
            instance = new Singleton(name);
        }
        return instance;
    }

}();
var s1 = getInstance();
var s2 = getInstance();
s1 == s2;//true

//更改getInstance使其更通用，以获取任何类的的实例
var getInstance = function (fn) {
    var instance;
    return function () {
        if(!instance){
            instance = fn.apply(this,arguments);
        }
        return instance;
    }
};
let instanceManager = getInstance(function (name) {
    let singleton = new Singleton(name);
    return singleton;
});
instanceManager('Tom').sayName();//Tom
instanceManager('Tina').sayName();//Tom

//demo2 ES6
class Singleton{
    constructor(name){
        this.name = name;
    }
    sayName(){
        return this.name
    }
}
Singleton.getInstance = function () {//定义一个获取实例的静态方法
    let instance;
    return function (name){
        if(!instance){
            instance = new Singleton(name)
        }
        return instance
    }
}();
let instance1 = Singleton.getInstance('aa');
let instance2 = Singleton.getInstance('bb');
instance1.sayName();//aa
instance2.sayName();//aa


/*
适配器模式：解决两个软件实体间不兼容的问题，使用适配器后，可以使原本不兼容的软件实体一起工作
别名：包装器wrapper
场景：当我们试图调用某个接口时，发现这个接口并不符合目前的需求。有两种解决办法：1.修改原来的接口，但是如果我们要调用的接口使经过压缩过的代码，修改原接口不现实。2.创建一个适配器，将原接口转换为我们需要的另一个接口。
 */
class GoogleMap {
    show(){
        console.log('渲染google地图')
    }
}
class BaiduMap {
    display(){
        console.log('渲染百度地图')
    }
}
function render(map) {
    if(map.show instanceof Function){
        map.show();
    }
}
class BaiduMapAdapter { //定义一个百度map类适配器
    show(){
        let baiduMap = new BaiduMap();
        return baiduMap.display();
    }
}
render(new GoogleMap());
render(new BaiduMapAdapter());

/*
代理模式：为一个对象提供一个代用品或者占位符，以便控制对它的访问
场景：使用代理对象加载图片，当网络不好的时候，图片的加载需要一段时间，这就会产生空白，影响用户体验，我们可以用一张loading图片占位，等图片加载完再设置src属性
 */
class MyImage {
    constructor(){
        this.img = new Image();
        document.body.appendChild(this.img)
    }
    setSrc(src){
        this.img.src = src;
    }
}
class ProxyImage {
    constructor(){
        this.proxyImg = new Image();//代理图片变量表示从服务器端下载的图片
    }
    setSrc(src){
        let myImageObj = new MyImage();//页面要展示的图片
        myImageObj.img.src = 'file://xxx.png';//本地图片
        this.proxyImg.src = src;
        this.proxyImg.onload = function () { //服务器的图片下载完毕后替换页面的图片src
            myImageObj.src = src;
        }
    }
}
var proxyImage = new ProxyImage();
proxyImage.setSrc('http://xxx.png');

/*
策略模式：定义一系列算法，定义一个统一的接口将他们都封装起来，并使他们可以替换
 */
var fnA = function (val) {
    return val * 1;
}
var funB = function (val) {
    return val * 2;
}
var funC = function (val) {
    return val * 3;
}
var calculate = function (fn,val) {
    return fn(val);
}
//调用不同的算法得到不同的结果
console.log(calculate(fnA,100));//100
console.log(calculate(fnB,100));//200
console.log(calculate(fnC,100));//300

/*
迭代器模式：提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
ES6迭代器：
Array
Map
Set
String
typeArray
arguments
NodeList
以上有序数据集合都部署了Symbol.iterator属性，属性值是一个函数，执行这个函数返回一个迭代器，调用迭代器的next方法，可以顺序访问子元素

任何有[Symbol.iterator]属性的数据都可以用for...of遍历循环
 */
//获取Array的迭代器
let arr = [1,2,3,4];
let it = arr[Symbol.iterator]();
console.log(it.next());//1
console.log(it.next());//2
console.log(it.next());//3
console.log(it.next());//4


/*
观察者模式（订阅-发布模式）：定义对象间的一对多关系，当一个对象发生变化时，所有依赖他的对象都将得到通知。在JavaScript中，我们一般用事件模型来替代传统的发布-订阅模式。
 */
//先订阅后发布
class  Event {
    constructor() {
        this.eventTypeObj = {}
    }
    on(eventType,fn){//将fn添加到eventType事件队列中
        if(!this.eventTypeObj[eventType]){
            this.eventTypeObj[eventType] = [];
        }
        this.eventTypeObj[eventType].push(fn);
    }
    emit(){
        let eventType = Array.prototype.shift.apply(arguments);
        let eventList = this.eventTypeObj[eventType];
        for(let i = 0; i < eventList.length;i++){
            eventList[i].apply(eventList[i],arguments);
        }
    }
    remove(eventType,fn){
        let eventList = this.eventTypeObj[eventType];
        if(!eventList){//如果没有人订阅该事件，直接返回false
            return  false;
        }
        if(!fn){//如果没有传入回调函数，则该订阅类型的事件全部取消
            eventList && (eventList.length = 0);
        }else{
            for(let i = 0;i < eventList.length; i++){
                if(fn === eventList[i]){
                    eventList.splice(i,1);
                    i--;
                }
            }
        }
    }
}
let handleFn = function (data) {
    console.log(data);
};
let event = new Event();
event.on('click',handleFn);//订阅click类型的事件handleFn
event.emit('click',1);//发布click类型的事件，输出1
event.remove('click',handleFn)//取消订阅
event.emit('click',1);//取消订阅后再发布，不输出

//先发布，再订阅。在发布消息时，把事件缓存起来，等有订阅者时在执行。
class  Event {
    constructor() {
        this.eventTypeObj = {}
        this.cacheObj = {}
    }
    on(eventType,fn){//将fn添加到eventType事件队列中
        if(!this.eventTypeObj[eventType]){
            this.eventTypeObj[eventType] = [];
        }
        this.eventTypeObj[eventType].push(fn);
        if(this.cacheObj[eventType]){//先发布后订阅，执行保存起来的发布事件
            let cacheList = this.cacheObj[eventType];
            for(let cache of cacheList){
                cache();
            }
        }

    }
    emit(){
        let eventType = Array.prototype.shift.apply(arguments);
        let eventList = this.eventTypeObj[eventType];
        let args = arguments;
        let that = this;
        function cache() {
            for(let i = 0; i < eventList.length;i++){
                eventList[i].apply(eventList[i],args);
            }
        }
        cache();//如果先订阅，则直接发布
        if(!this.cacheObj[eventType]){
            this.cacheObj[eventType] = [];
        }
        //如果先发布后订阅，则把发布的事件类型与参数保存起来，等到有订阅后执行
        this.cacheObj[eventType].push(cache);

    }
}

/*
命令模式：在命令的发布者和命令的接受者之间定义一个命令对象，命令对象暴露出一个统一的接口给命令的发布者 ，而命令的发布者不用去管接受者如何执行命令的，做到命令发布者和接受者的解耦。
页面中有三个按钮，给这三个按钮添加不同的功能
 */
//定义一个命令发布者（执行者）的类
class Executor {
    setCommand(btn,command){
        btn.onclick = function () {
            command.execute();
        }
    }
}
//定义一个命令接受者的类
class Menu {
    refresh(){
        console.log('刷新菜单')
    }
    addSubMenu(){
        console.log('增加子菜单')
    }
}

//定义一个刷新菜单的类
class RefreshMenu {
    constructor(receiver){
        this.receiver = receiver;
    }
    execute(){
        this.receiver.refresh();
    }
}
//定义一个增加子菜单的类
class AddSubMenu {
    constructor(receiver){
        this.receiver = receiver;
    }
    execute(){
        this.receiver.addSubMenu();
    }
}
let btn1 = document.getElementById('btn1');
let btn2 = document.getElementById('btn2');
let executor = new Executor();//命令执行者对象
let menu = new Menu;//命令接受者对象
let refreshMenu = new RefreshMenu(menu);//刷新菜单对象
let addSubMenu = new AddSubMenu(menu);//添加子菜单对象
executor.setCommand(btn1,refreshMenu);//btn1执行refreshMenu命令
executor.setCommand(btn2,addSubMenu);//btn2执行addSubMenu命令
 // 如果想给按钮3增加删除菜单的功能，就继续增加删除菜单的命令对象和接收者的具体删除方法，而不必修改命令对象

/*
状态模式：状态模式允许一个对象在其内部状态改变的时候改变行为。这个对象看上去像是改变了它的类一样。状态模式把所研究的对象的行为包装在不同的状态对象里，每一个状态对象都属于一个抽象类的子类，。
状态模式的意图是让一个对象在其内部状态改变的时候，其行为也随之改变。状态模式需要对每一个系统可能取得的状态创立一个状态类的子类。当系统的状态变化时，系统便更改所选的子类。
例子：开关控制电灯，电灯只有一个开关，第一次按下打开弱光 ，第二次按下打开强光，第三次按下关闭
 */
//关闭状态类
class OffLightState {
    constructor(light){
        this.light = light;
    }
    pressBtn(){
        this.light.setState(this.light.weekLightState);
    }
}
//弱光状态类
class WeekLightState {
    constructor(light){
        this.light = light;
    }
    pressBtn(){
        this.light.setState(this.light.strongLightState);
    }
}
//强光状态类
class StrongLightState {
    constructor(light){
        this.light = light;
    }
    pressBtn(){
        this.light.setState(this.light.offLightState)
    }
}
//电灯类
class Light {
    constructor(){
        this.offLightState = new OffLightState(this);
        this.weekLightState = new WeekLightState(this);
        this.strongLightState = new StrongLightState(this);
        this.currentState = null;
    }
    setState(newState){
        this.currentState = newState;
    }
    init(){
        this.currentState = this.offLightState;
    }
}
let light = new Light();
light.init();
let btn = document.getElementById('btn')//开关按钮
btn.onclick = function () {
    light.currentState.pressBtn();
}