/*写一个function，实现parseInt(str)功能（默认10进制）。考虑尽可能多的情况，比如
输入：’aXXX’，输出：NaN  （字母开头）
输入：’1aXXX’，输出：1（数字开头）
输入：’123’，输出：123
输入：’#0b10’，输出：2
输入：null，输出：NaN
输入：undefined，输出：NaN
*/
function parseIntEx(str){
    if(!str){
        return NaN; //NaN是个对象
    }
    let numArr = [];
    if(str.substr(0,3) == '#0b' && !isNaN(str.substring(3,str.length))){
        let rs = 0;
        let oldNum =  str.substring(3,str.length);
        let newNum = [];
        let length = oldNum.length;
        for(let i = 0; i < length;i++){
            let num = oldNum.charAt(i)-'0';//将字符串转化数字
            if(num > 1){//parseInt('123',2)=1
                break;
            }
            newNum.push(num);
            
        }
        for(let j= 0 ; j<newNum.length ; j++){
            rs += (newNum[j]-'0')*Math.pow(2,newNum.length-j-1);
        }
        return rs;
    }
    for(let i = 0;i < str.length ; i++){
        if(!isNaN(str.charAt(i))){
           numArr.push(str.charAt(i));
        }else 
            break;
    }
    if(numArr.length > 0){
        return numArr.join('')-'0';
    }else 
        return NaN;
}
console.log(parseIntEx('123345'));//123345
console.log(parseIntEx('#0b10101'));//21
console.log(parseIntEx('#0b1234'));//1