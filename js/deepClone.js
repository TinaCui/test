/**
 * 阿里、腾讯面试题
 * 功能：深度拷贝 尽可能多的考虑拷贝对象的类型,可能为基本类型，对象，数组，函数等。
 * 作者：cuicui
 * 日期： 2021/2/22
 */

/**
 * 判断一个变量是否是对象或者数组
 * @param obj
 * @return {boolean}
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]' || Object.prototype.toString.call(obj) === '[object Array]'
}

/**
 * 深拷贝，需考虑循环引用，即对象的属性值为对象本身，或者为该属性的任意上级 比如 a.b = a; a.b.c = a.b
 * 解决方案：只需要判断一个对象的字段是否引用了这个对象或这个对象的任意父级即可
 * @param obj
 * @return {*}
 */
function deepClone(obj,map=new Map()) {
    let objClone;
    if(isObject(obj)) { //obj为对象或者数组
        objClone = obj instanceof Array ? [] : {};

        if(map.get(obj)) {
            return map.get(obj);
        }
        map.set(obj, objClone);

        for (let key in obj) {
            if ( obj[key] && typeof obj[key] === 'object') {
                objClone[key] = deepClone(obj[key], map);
            }else {
                objClone[key] = obj[key];
            }
        }
        return objClone;
    }

    if(typeof obj === 'function') {
        objClone = new obj().constructor;
        return objClone;
    }

    return obj;
}
let a1 = { b: { c: 1}};
deepClone(a1);
let a2 = {b: 2};
a2.c = a2;
deepClone(a2);

/*
方法二：
当obj为数组或者对象时，可以使用JSON.parse(JOSN.stringify(obj))深拷贝，但问题是：
JSON.stringify() 无法正确转换对象的部分属性

undefiend
Function
RegExp（正则表达式，转换后变成了空对象）
Date（转换后变成了字符串，而非 Date 类的对象）



例子：
obj = JSON.stringify({
    a: undefined,
    b: function(){},
    c: /abc/,
    d: new Date()
});
console.log(obj) // "{"c":{},"d":"2021-02-02T19:40:12.346Z"}"
console.log(JSON.parse(obj)) // {c: {}, d: "2021-02-02T19:40:12.346Z"}

丢失属性a，和b，c属性变成空对象，d属性转换后变成了字符串，而非 Date 类的对象
 */



/**
 * 实现浅拷贝的方法：数组的concat()，slice()，Array.from()，Object.assign()等
 */
