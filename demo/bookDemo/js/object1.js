//es5 Object.create

//p  object
//继承函数
"use strict";
function inherit(p){
	if(p == null){
		throw TypeError();
	}
	if(Object.create){
		return Object.create(p);
	}
	var t = typeof p;
	if(t!=="object" && t!=="function"){
		throw TypeError();
	}
	function f(){}
	f.prototype=p;
	return new f();
}
var o = {x:"hehe"}
var fn = inherit(o);
console.log(fn);

//extend 枚举对象中得所有属性
function extend(o,p){
	for(var attr in p){
		o[attr] = p[attr];
	}
	return o;
}	
var p = {x:1,y:2}
var o = extend({},p);
console.log(o)

//merge 将p中所有的属性复制在o中，不覆盖o中已有的属性
function merge(o,p){
	for(var attr in p){
		if(o.hasOwnProperty(attr)){
			continue;
		}
		o[attr] = p[attr];
	}
	return o;
}	
var p = {x:1,y:2};
var o = merge({x:2},p);
console.log(o)

//获取相同名称的属性o,p
function restrict(o,p){
	for(var attr in o){
		if(!(attr in p)){
			delete o[attr];
		}
	}
	return o;
}
var p = {x:1,y:2};
var o = restrict({x:2,z:3},p);
console.log(o);

//删除和p有相同属性名的属性
function subtract(o,p){
	for(var attr in p ){
		delete o[attr];
	}
	return o;
}
var p = {x:1,y:2};
var o = subtract({x:2,z:3},p);
console.log(o);

//返回一个新对象，这个对象同时含有o 和 p 的属性,如果相同取p的属性
function union(o,p){
	return extend(extend({},o),p);
}
console.log(union({x:1},{y:2}));
//返回一个o 和 p同时拥有的属性，p的忽略
function intersection(o,p){
	return restrict(extend({},o),p);
}
console.log(intersection({x:1,y:1},{y:2}));

function bindThis(f,oTarget){
	return function(){
		return f.apply(oTarget,arguments);
	}
}
var g = bindThis(function(x,y){
	return this.text+x+y;
},{text:1})
console.log(g(2,3));

function getUrlParam(sUrl, sKey) {
    var sublen = sUrl.indexOf("?")+1;
    if(sublen){
    	var subStr = sUrl.slice(sublen);
    	var subarr = subStr.split('&');
    	var subarrlen = subarr.length;
    	var returnarr = [];
    	for(var i =0 ; i<subarrlen;i++){
    		var aStr = subarr[i].split('=');
    		if(aStr[0]==sKey){
    			returnarr.push(aStr[1]);
    		}
    	}
    	return returnarr;
    }
}
console.log(getUrlParam('http://www.nowcoder.com?key=1&key=2&key=3&test=4#hehe', 'key'));

function classof(o){
	if(o===null){
		return 'Null';
	}
	if(o===undefined){
		return "Undefined"
	}
	return Object.prototype.toString.call(o).slice(8,-1);
}
console.log(classof([1,2,3]));


// function isArrayLike(o){
// 	if( o && (typeof o == "object") && isFiniteo0.length) && o.length>=0 && o.length==Math.floor(o.ength) && o.length<4294967296){
// 		return true
// 	}else{
// 		return false;
// 	}
// }
//测试bind apply call
function sum(y){
	return this.x+y;
}
var g = sum.apply({x:10},[2]);
function bindTh(f,o){
	if(f.bind){
		return f.bind(o);
	}
	else{
		return function(){
			return f.apply(o,arguments);
		}
	}
}
var sumx = bindTh(sum,{x:1});
console.log(sumx(2));

function sum2(x,y){
	return x+y;
}
var g = sum2.bind(null,1);
console.log(g(3));
console.log(g(5));
var g = sum2.apply(null,[2,2]);
console.log(g);
//es3 仿照bind
if(!Function.prototype.bind){
	Function.prototype.bind = function(o){
		var self = this,boundargs=arguments;
		return function(){
			var args=[],i;
			for(var i=1;i<boundargs.length;i++){
				args.push(boundargs[i]);
			}
			for(var i=0;i<arguments.length;i++){
				args.push(boundargs[i]);
			}
			return self.apply(o,args);
		}
	}
}
//map
var map = Array.prototype.map?function(a,f){
	return a.map(f);
}:function(a,f){
	var result = [];
	for(var i=0;i<a.length;i++){
		result[i] = f.call(null,a[i],i);
	}
}
Array.prototype.map=function(f){
	var result=[]
	for(var i = 0;i<this.length;i++){
			result[i] = f.apply(null,[this[i],i]);
	}
}
var a = [1,3,5];
a.map(function(x){
	console.log(x+2);
});
Array.prototype.reduce = function(callback,opt_initialValue){
	if(null === this || 'undefined' === typeof this){
		 throw new TypeError('Array.prototype.reduce called on null or undefined');
	}
	if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
	var index,value,length = this.length>>>0,isValueSet=false;
	//如果传入第二个参数
	if(arguments.length>1){
		//初始化参数
		value = opt_initialValue;
		isValueSet = true;
	}
	for(index=0;index<length;++index){
		if(this.hasOwnProperty(index)){
			//如果没有传入第二个参数，则使用数组下标为0的做初始值
			if(isValueSet){
				value = callback.call(null,value,this[index], index, this);
			}else{
				value = this[index];
				isValueSet = true;
			}
		}
	}
	 if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
}

function reduce(a,f,init){
	var i=0,len=a.length>>>0,accumulator,isValueSet=false;
	if(init){
		isValueSet = true;
		accumulator=init;
	}
	for(i=0;i<len;++i){
		if(a.hasOwnProperty(i)){
			//如果没有传入第二个参数，则使用数组下标为0的做初始值
			if(isValueSet){
				accumulator = f.call(null,accumulator,a[i], i, a);
			}else{
				accumulator = a[i];
				isValueSet = true;
			}
		}
	}
	return accumulator;
}
console.log(reduce([1,2],function(x,y){return x+y}));
