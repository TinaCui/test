/*以下表格，点击 `#data .date` 后使表格按日期排序，当前是正序则改为倒序，当前是倒序则改为正序。
<table id="data">
    <thead>
    <tr>
    <th class="date"
    >日期</th>
    <th class="total">总次数</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>2017年10月23日</td>
    <td>68,112</td>
    </tr>
    <tr>
    <td>2017年8月6日</td>
    <td>68,020</td>
    </tr>
    <tr>
    <td>2017年11月11日</td>
    <td>69,433</td>
    </tr>
    <tr>
    <td>2016年5月12日</td>
    <td>69,699</td>
    </tr>
    <tr>
    <td>2017年1月18日</td>
    <td>42,565</td>
    </tr>
    </tbody>
    </table>
*/
let flag = true; //是否降序，true表示降序 ，false升序
let dataList = [
    {
        date: '2017年10月23日',
        total: '68,112'
    },
    {
        date: '2017年8月6日',
        total: '68,020'
    },
    {
        date: '2017年11月11日',
        total: '69,433'
    },
    {
        date: '2016年5月12日',
        total: '69,699'
    },
    {
        date: '2017年1月18日',
        total: '42,565'
    }
];
const strConvertNumber = (str) => {
    let arr = str.split(',');
    let num = 0;
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        num += (arr[i] - 0) * Math.pow(1000, len - i - 1);
    }
    return num;
}
const formatToDate = (dateStr)=> {
    let arr = dateStr.match(/\d{1,4}/g);
    return new Date(arr.join('/'));
}
const formatDate = (date) => {

}
const tbodyDom = document.querySelector('#data tbody');

document.querySelector("#data .date").onclick = function () {
    dataList.sort((a,b)=>{
        let aTime = formatToDate(a.date).getTime();
        let bTime = formatToDate(b.date).getTime();
        if (flag) { //降序
            return bTime - aTime;
        }else { //升序
            return aTime - bTime;
        }
    })
    let template = ``;
    for (let item of dataList) {
        template += `<tr><td>${formatDate(item.date)}</td><td>${item.total}</td></tr>`
    }

    tbodyDom.innerHTML = template;
    flag = !flag;
}

/*
如下，实现 `calc` 方法，可以将输入的数拆解为尽可能多的乘数，所有数相乘等于输入数。
/**
 * @param {number} n 乘积
 * @return {Array} 拆解后的乘数
 */
/*function calc(n) {

}
console.log(calc(2));

// [2]
console.log(calc(8));

// [2, 2, 2]
console.log(calc(24));

// [2, 2, 2, 3]
console.log(calc(30));

// [2, 3, 5]*/

function calc(n) {
    let result = [];
    let temp = n;
    for(let i = 2; i <= temp; i++) {
        if (temp % i === 0) {
            result.push(i);
            temp = temp / i;
            i--;
        }
    }
    return result;
}
