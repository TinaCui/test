/**
 * 功能：手写async
 * 思路：因为generator函数不会自动执行，所以需编写一个自动执行函数，参数为generator函数，返回一个promise。
 * 作者：cuicui
 * 日期： 2021/4/12
 */



const getData = () => new Promise(resolve => setTimeout(() => resolve("data"), 1000))
function* testG() {
    // await被编译成了yield
    const data = yield getData()
    console.log('data: ', data);
    const data2 = yield getData()
    console.log('data2: ', data2);
    return 'success'
}
var gen = testG()
var dataPromise = gen.next() //next函数返回{value:Promise{},done:false}

dataPromise.value.then((value1) => {
    // data1的value被拿到了 继续调用next并且传递给data
    var data2Promise = gen.next(value1); //yield 表达式默认返回值是undefined，通过给下一次的next传参，可改变yield返回值，即value1的值赋值给了data

    // console.log('data: ', data);
    // 此时就会打印出data

    data2Promise.value.then((value2) => {
        // data2的value拿到了 继续调用next并且传递value2
        gen.next(value2)

        // console.log('data2: ', data2);
        // 此时就会打印出data2
    })
})



/*------------根据上面例子的思路，给出的自动执行函数如下--------------------------------------------------------------------------*/

function asyncToGenerator(generatorFunc) {
    return function() { //返回函数是为了给generatorFunc传参
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
}


asyncToGenerator(testG)();
