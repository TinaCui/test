/**
 * 功能：实现一个getter方法,获取指定字符串key的值。
 * 举例：
 * const a = {b:{c:{d:2}}}
 * getter(a, 'b.c.d');
 *
 * const a = {b: [{c:3}]}
 * getter(a, 'b[0].c')
 *
 * 考虑字符串key更复杂的情况，比如：'b[0].a[1][2].c[1]'
 * @param obj
 * @param keyStr
 */
function getter(obj, keyStr) {
    let keyArr = keyStr.split('.');
    if (keyArr.length === 0) return;

    let value;
    let key = keyArr[0];
    if (key.includes('[') && key.includes(']')) {
        let keyStart = key.substring(0, key.indexOf('[')); //'b'
        let indexes = key.match(/\[\d\]/g).map(item => (parseInt(item.substring(1, item.length - 1)))); // [0]
        value = obj[keyStart]; //[{c:3}]
        for (let index of indexes) {
            value = value[index];
        }
    } else {
        value = obj[key]
    }
    if (keyArr.length === 1) {
        return value;

    }
    return getter(value, keyArr.slice(1).join('.'));
}

const a = {b: [{c: 3}]}
getter(a, 'b[0].c') //3
const f = {b: [[{d: [2]}], {c: 3}]}
getter(f, 'b[0][0].d[0]') //2

/**
 * 功能：实现一个setter函数，为给定的对象修改指定字符串key的值
 * 举例：
 * setter(n, "a.b.c.d", 3);
 * console.log(n.a.b.c.d); //3
 * setter(n, "a.b.bx", 1);
 * console.log(n.a.b.bx); //1
 * @param obj 给定的对象
 * @param keyStr  字符串key
 * @param value   值
 */

function setter(obj, keyStr, value) {
    let keyArr = keyStr.split('.');
    if (keyArr.length === 0) return;

    if (keyArr.length === 1) {
        obj[keyArr[0]] = value;
        return;
    }
    setter(obj[keyArr[0]], keyArr.slice(1).join('.'), value);

}
