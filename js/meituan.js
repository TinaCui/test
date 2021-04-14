new Promise(function(resolve,reject){
    console.log('a');
	resolve();
}).then(function(a){
    console.log('b');
}).catch(function(a){
    console.log('c');
}).then(function(a){
    console.log('d');
}).catch(function(a){
    console.log('e')
})

//a
//b
//d

/*-----------------------------------------------------------------------*/
//2021.4.8
    function addParams(url, data){
        let params = [];
        for(let key in data) {
            params.push(key + '=' + data[key]);
        }
        if(url.indexOf('#') != -1) {
            let hashIndex = url.indexOf('#');
            if(url.indexOf('?') != -1) {
                return url.slice(0,hashIndex) +"&" + params.join('&') + url.slice(hashIndex);
            }
            return url.slice(0,hashIndex) +"?" + params.join('&') + url.slice(hashIndex);

        }else if(url.indexOf('?') != -1){
            return url + '&' + params.join('&');
        } else {
            return url + '?' + params.join('&');
        }
    }
console.log(addParams('https://a.com', {a: 'b'}));
// https://a.com?a=b
console.log(addParams('https://a.com?a=b', {c: 'd'}));
// https://a.com?a=b&c=d
console.log(addParams('https://a.com#c=b', {a: 'b'}));
// https://a.com?a=b#c=b
console.log(addParams('https://a.com?b=a#c=d', {a: 'b'}));
// https://a.com?b=a&a=b#c=d

/*------------------------------------------------------------------------*/

function counter() {
    let i = 0;
    return function(){
        return i++;
    }
}


const c1 = counter()
const c2 = counter()

c1() // 1
c2() // 1
c1() // 2

/**
 * 实现成async await效果
 * @param time
 * @return {Promise<any>}
 */

var sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}
var gen = function* (){
    yield sleep(1000);
    console.log(new Date().toLocaleString());
    yield sleep(1000);
    console.log(new Date().toLocaleString());

};

function co(generatorFunc){
   /* let g = gen();
    let p1 = g.next();
    p1.value.then(()=>{
        let p2 = g.next();
        p2.value.then(()=>{
            g.next();
        })
    })*/

    const gen = generatorFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
        function step(key, arg) {
            let generatorResult
            try {
                generatorResult = gen[key](arg)
            } catch (error) {
                return reject(error)
            }
            const { value, done } = generatorResult
            if (done) {
                return resolve(value)
            } else {
                return Promise.resolve(value).then(val => step('next', val), err => step('throw', err))
            }
        }
        step("next")
    })


}
co(gen)


/**
 * [{id:1, w: 1}, { id: 2, w: 2}, {id:1, w:2}, {id:2, w:1}]
 数组去重，按 id 保留 w 最大的，位置不变
 [{ id: 2, w: 2}, {id:1, w:2}]
 * @param arr
 * @return {Array}
 */
function uniqueArray(arr){
    let map = new Map();
    let result = [];

    for(let item of arr){
        let existedItem =  map.get(item.id);
        if(existedItem && (item.w > existedItem.w)) {
            map.delete(item.id);
            map.set(item.id, item);
        }else if(!existedItem){
            map.set(item.id, item);
        }


    }

    map.forEach((value, key) => {
        result.push(value)
    })

    return result;
}

let arr = [{id:1, w: 1}, { id: 2, w: 2}, {id:1, w:2}, {id:2, w:1}];
console.log(uniqueArray(arr));

/**
 * 生成一个国际象棋棋盘，返回 n * n 的二维数组
 1 表示 黑，0 表示 白
 * @param n
 * @return {Array}
 */
function gen(n) {
    let result = [];
    for (let i = 1; i <= n; i++) {
        let arr = [];
        for(let j = 1; j <= n; j++) {
            if((i + j)%2 === 0) {
                arr.push(1);
            }else{
                arr.push(0);
            }

        }
        result.push(arr);
    }
    return result;
}

console.log(gen(3))
console.log(gen(4))
