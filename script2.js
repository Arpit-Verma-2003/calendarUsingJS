let x = 1;
function call(){
    for(var i=0;i<=10;i++){
        (function(i){
            setTimeout(()=>{
                console.log(i);
            },i*1000);
        })(i);
    }
}
call();
String.prototype.arpit = function(){
    return `${this} Arpit`;
}
s = "hello";
console.log(s.arpit());