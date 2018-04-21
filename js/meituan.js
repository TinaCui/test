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