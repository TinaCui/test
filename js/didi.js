/*输出以下程序*/
setTimeout(function(){
   console.log('1'); 
},0);
new Promise(function(resolved,rejected){
    console.log('2');
    for(let i= 0 ;i<10000;i++){
        i=9999 && resolve();//执行resolve方法后，下面的代码还是会执行，正常情况下，可使用return结束执行。
    }
    console.log('3');
}).then(function(){
    console.log('4');
});
console.log('5');
//2 
//3
//5
//4
//1


 var obj = {
     a:1,
     b:function(){
         console.log(this.a);
     },
     c:function(){
         (function (){
             console.log(this.a);//this 指向 window
         })();
     }
 }
 obj.b();
 obj.c();