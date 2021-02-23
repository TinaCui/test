/**
 * 阿里面试题
 * 功能：深度拷贝 尽可能多的考虑拷贝对象的类型,可能为基本类型，对象，数组，函数等。
 * 作者：cuicui
 * 日期： 2021/2/22
 */


function deepClone(obj) {
    let objClone;
    if(obj && typeof obj === 'object') { //obj为对象或者数组
        objClone = obj instanceof Array ? [] : {};
        for (let key in obj) {
            if ( obj[key] && typeof obj[key] === 'object') {
                objClone[key] = deepClone(obj[key]);
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


/*
当obj为数组时可以通过如下方法拷贝：
1.[].concat(obj)
2.obj.slice()

问题是：
只能对一位数组进行深拷贝，当数组项是引用类型的时候，只是引用
 */
