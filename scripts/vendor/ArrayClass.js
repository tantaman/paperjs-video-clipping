define(["vendor/extendFunc"], function(extend){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

	/**
	* @name vendor.ArrayClass
	* @author Matt Crinklaw
	* @class ArrayClass allows us to extend Array using the Class
	* class syntax.
	* E.g., if you want your new class to be an array
	* while also providing new methods do:
	* var CustomArray = ArrayClass.extend({ customMethod: ... })
	*/
	var ArrayClass = Array;
	ArrayClass.extend = extend;

	return ArrayClass;
});

