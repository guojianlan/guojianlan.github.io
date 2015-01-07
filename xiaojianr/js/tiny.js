// JavaScript Document
/*Tiny.js组件库*/
(function(window, undefined)
{	
	/*xuanzq*/
	var __T = function(select, context) {
		if (!select) {
			return false;
		}

		/* 绑定window.onload函数 */
		if (typeof select == "function") {
			__T.ready(select);
			return;
		}

		/* 添加一个属性值不存在的函数 */
		if (typeof select == "string" && typeof context == "function") {
			if (!__T[select]) {
				__T[select] = context;
			}
			else {
				__T.alert("函数" + select + "已加载");
				return false;
			}
			if (arguments[2] == true) {
				__T.ready(__T[select]);
			}
			return __T[select];
		}

		if (typeof select == "string" && context != null && typeof context == "object" && !context['style']) {
			if (!__T[select]) {
				__T[select] = context;
			} else {
				__T.alert("对象" + select + "已加载");
				return false;
			}
			return __T[select];
		}
		return new __T.query(select, context).getDocument();
	},

	/* 去除左右空格正则 */
	trimLeft = /^\s+/,                                    /* 左空格 */
	trimRight = /\s+$/,

	/* 验证字符串 */
	numberString = /^()|()|()$/
	mobileReg = /^1[358]\d{9}$/,                          /* 手机号码 */
	idcardReg =	/^([1-9]{0,1})?(\d){1,16}((\d)|x)?$/i,    /* 身份证号码 */

	/* 选择器 */
	tagReg = /^([0-9A-Za-z]+)$/i,   /* 标签 */
	idReg  = /^#[^\.<=>#]+$/,   /* 元素 */
	classReg = /^\.([^\.<=>]+)$/,
	nameReg = /^([0-9A-Za-z]+)\s*=\s*([\w\d]+)$/i;

	/* 引用窗体自身 */
	__T.window = window;

	/* 引用DOM树 */
	__T.document = window.document;

	/* 是否开启程序调试 */
	__T.debug = 0;

	/* 调试信息集合 */
	__T.ExceptionCollection = new Array();

	/* 添加一条调试错误信息 */
	__T.exceptionAppend = function() {
		if (!__T.ExceptionCollection)
		{
			__T.ExceptionCollection = new Array();
		}
		__T.ExceptionCollection.push({"reason": arguments[0], "url": arguments[1] , "line": arguments[2]});
		if (__T.debug)
		{
			var string = "";
			for (var i in __T.ExceptionCollection)
			{
				string += "<b>原因： </b>" + __T.ExceptionCollection[i]['reason'] + "<br />";
				string += "<b>URL： </b>"  + __T.ExceptionCollection[i]['url'] + "<br />";
				string += "<b>LINE： </b>" + __T.ExceptionCollection[i]['line'] + "<br />";
			}
			// alert(string);
			// $.alert(string);
			try
			{
			__T.alert(string,"错误提示");
			}
			catch(e)
			{
				
				string = "错误原因： " + __T.ExceptionCollection[i]['reason'] + "\n";
				string += "URL："  + __T.ExceptionCollection[i]['url'] + "\n";
				string += "LINE：" + __T.ExceptionCollection[i]['line'] + "\n";	
				alert(string);
			}
		}    /* end of if (__T.debug) */
	} /* end of __T.ExceptionAppend = function() { */


	/* 绑定错误提示事件 */
	__T.window.onerror = __T.exceptionAppend;

	/* 继承元素 */
	/* @param: destination 继承对象 */
	/* @param: source 继承源对象 */
	__T.extend = function(source) {
		var destination, source;
		if (arguments.length == 2) 
		{
			destination = arguments[0];
			source = arguments[1];
		} 
		else 
		{
			destination = this;
		}
		for (var property in source) 
		{
			destination[property] = source[property];
		}
	} /* end of __T.extend... */

	/* 元素蜘蛛爬行树 */
	__T.query = function(spider, handle) {
		spider = spider.toString().trim();
		if (spider === "body" || !handle ) {
			handle = document;
		}
		this.spider = spider;
		this.handle = handle;
	}

	__T.query.prototype = {
		getDocument : function() {

			var match, i;
			if(this.spider.length == 0) 
			{
				return false;
			}
			if (this.spider.match(idReg)) 
			{
				return this.handle.getElementById(this.spider.substr(1));
			}
			else if (this.spider.match(tagReg)) 
			{
				i = this.handle.getElementsByTagName(this.spider.replace(tagReg, '$1'));
				if (this.spider == 'body') 
				{
					var htmlbody = document.all 
					? document.documentElement
					: document.body;
					return htmlbody;
				} 
				else if (this.spider == 'head') 
				{
					i = i[0];
				}
				return i;
			}
			else if (match = this.spider.match(nameReg))
			{
				var elements = new Array();
				if (document.all)
				{
					all = this.handle.all;

					for (i = 0 ; i < all.length ; i++)
					{

						if (all[i][match[1]] == match[2])
						{
							elements.push(all[i]);
						}
					}
				}
				else
				{
					if ( match[1] == 'name')
					{

						elements = document.getElementsByName(match[2]);
					}
					else
					{
						all = this.handle.getElementsByTagName("*");
						for (i = 0 ; i < all.length ; i++)
						{
							if (all[i][match[1]] == match[2])
							{
								elements.push(all[i]);
							}
						}
					}
				}
				return elements;
			}
			else if (match = this.spider.match(classReg))
			{
				var elements = new Array();

				if (document.all)
				{
					all = this.handle.all;

					for (i = 0 ; i < all.length ; i++)
					{	
						var cn = all[i]['className'];
						var cns = [];
						if (!cn) {continue;}
						if (cn.trim().indexOf(' ') > -1)
						{
							var cns = cn.split(' ');
							
							for (var c = 0,clen = cns.length; c < clen;c++)
							{
								if (cns[c] == match[1])
								{	
									elements.push(all[i]);
									break;
								}	
							}
							continue;
						}
						else if (all[i]['className'] == match[1])
							{
								elements.push(all[i]);
							}	
					}
				}
				else
				{
						all = this.handle.getElementsByTagName("*");
						for (i = 0 ; i < all.length ; i++)
						{
							var cn = all[i]['className'];
							var cns = [];
							if (!cn) {continue;}
							if (cn.trim().indexOf(' ') > -1)
							{
								var cns = cn.split(' ');
								
								for (var c = 0,clen = cns.length; c < clen;c++)
								{
									if (cns[c] == match[1])
									{	
										elements.push(all[i]);
										break;
									}	
								}
								continue;
							}
							else if (all[i]['className'] == match[1])
								{
									elements.push(all[i]);
								}
						}
				}
				return elements;				
			}
		}
	}
	;

	__T.extend(__T.query,
	{
		allElements: null,
		getAllElements: function() {
			if (!this.allElements)
			{
				this.allElements = (document.all) ? document.all : this.handle.getElementsByTagName("*");
			}
		}

	});
	/* 类型判断 */
	__T.extend({
		/* 获取对象类型 */
		type: function(object) {
			return (!object && object != 0) ? new String(object) : typeof object;
		},

		/* 是否为数字类型 */
		isNumeric: function(number) {
			return !isNaN(parseFloat(number)) && isFinite(number);;
		},

		/* 是否为整数 */
		isInt: function(number) {
			return (parseInt(number) == number) ? true : false;
		},

		/* 是否为十进制浮点数 */
		isFloat: function(number) {
			return (/^\-?\d+\.\d+/).test(number);
		},
		/* 是否为函数 */
		isFunction: function(handle) {
			return typeof handle == "function" ? true : false;
		},
		/* 是否为全英文 */
		isEnglish: function(string) {
			return (/^[a-zA-Z]+$/).test(string);
		},

		/* 是否全为小写字母 */
		isLower: function(string) {
			return (/^[a-z]+$/).test(string);
		},

		/* 是否全为大写字母 */
		isUpper: function() {
			return (/^[A-Z]+$/).test(string);
		},

		/* 是否全为汉字 */
		isChinese: function(string) {
			return (/^[\u4e00-\u8fa5]+$/).test(string);
		},

		/* 是否为符合格式的URL格式 */
		isUrl: function(string) {
			return (/^(http:\/\/])?\w+(\.\w+)+((\/\w*)*)?$/).test(string);
		},

		/* 是否为邮件地址 */
		isEmail: function(string) {
			return (/^([\-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/).test(string);
		},
		/* 是否为域名 */
		isDomain: function(string) {
			return  (!/^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(la))$/).test(string);
		},
		/* 是否为数组 */
		isArray: function( arrayObj ) {
			return arrayObj && (typeof arrayObj === 'object') &&   (typeof arrayObj.length === 'number') &&  (typeof arrayObj.splice === 'function')
		},

		/* 是否未定义 */
		isUndefined: function(variable) {
			return (typeof variable == 'undefined') ? true : false;
		},

		/* 检查是否为IE */
		isIE: function() {
			return (!document.all) ? false : true;
		},

		/* 是否为IE6 */
		isIE6: function() {
			return (navigator.userAgent.indexOf("MSIE 6") > -1) ? true : false;
		},

		/* 是否为IE7 */
		isIE7: function() {
			return (navigator.userAgent.indexOf("MSIE 7") > -1) ? true : false;
		},

		/* 是否为IE8 */
		isIE8: function() {
			return (navigator.userAgent.indexOf("MSIE 8") > -1) ? true : false;
		},

		/* 是否为IE9 */
		isIE9: function() {
			return (navigator.userAgent.indexOf("MSIE 9") > -1) ? true : false;
		},
		/* 火狐 */
		isFireFox: function() {
			return (navigator.userAgent.indexOf("Firefox") > -1) ? true : false;
		},

		/* 是否为谷歌浏览器 */
		isChrome: function() {
			return   (navigator.userAgent.indexOf("Chrome") > -1) ? true : false;
		},

		/* 是否手机号码 */
		isMobileCode: function(string) {
			return mobileReg.test(string);
		},

		/* 是否身份证 */
		isIdcard: function(string) {
			return idcardReg.test(string);
		},
		/* 是否为空对象 */
		isEmptyObject: function(object) {
			for (var name in object )
			{
				return false;
			}
			return true;
		},
		/* 获取一个空对象 */
		getEmptyObject: function() {
			return {};
		},
		/* 空函数 */
		emptyFunc: function(){}

	});


	/* 字符串扩展 */
	__T.extend(window.String.prototype, {
		trim: function() {
			return this.replace(trimLeft, '').replace(trimRight, '');
		},
		ltrim: function() {
			return this.replace(trimLeft, '');
		},
		rtrim: function() {
			return this.replace(trimRight, '');
		},
		/* 解析JSON字符串 */
		parseJSON: function() {
			/* 使用eval */
			try
			{
				return	eval('(' + this.trim() + ')');
			}
			catch(e)
			{
				return false;
			}
		},
		/* 解析XML字符串 */
		parseXML: function() {
			var xml, tmp, data = this;
			try
			{
				/* 标准解析XML方式 */
				if ( window.DOMParser )
				{
					tmp = new DOMParser();
					xml = tmp.parseFromString( data , "text/xml" );
				}
				else /* IE */
				{
					xml = new ActiveXObject( "Microsoft.XMLDOM" );
					xml.async = "false";
					xml.loadXML( data );
				}
			}
			catch( e )
			{
				xml = undefined;
			}
			if (!xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length)
			{
				return false;
			}
			return xml;
		},
		isNumeric: function() {
			return __T.isNumeric(this);
		},
		isInt: function() {
			return __T.isInt(this);
		},
		isEnglish: function() {
			return __T.isEnglish(this);
		},
		isChinese: function() {
			return __T.isChinese(this);
		},
		isFloat: function() {
			return __T.isFloat(this);
		},
		isMobileCode: function() {
			return __T.isMobileCode(this);
		},
		isIdcard: function() {
			return __T.isIdcard(this);
		},
		isLower: function() {
			return __T.isLower(this);
		},
		isUpper: function() {
			return __T.isUpper(this);
		},
		isUrl: function() {
			return __T.isUrl(this);
		},
		isEmail: function() {
			return __T.isEmail(this);
		},
		isDomain: function() {
			return __T.isDomain(this);
		},
        getLength: function() {  
            var len = 0;  
            for (var i = 0; i < this.length; i++) {  
                if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {  
                    len += 2;  
                } else {  
                    len ++;  
                }  
            }  
            return len;  
        },  

		/* 字符串MD5加密 */
		md5: function() {
			var hexcase = 0, b64pad = "", chrsz = 8;
			hashMd5 = function(s) {
				return binl2hex(core_md5(str2binl(s), s.length * chrsz));
			}
			core_md5 = function(x, len) {
				x[len >> 5] |= 0x80 << ((len) % 32);
				x[(((len + 64) >>> 9) << 4) + 14] = len;
				var a = 1732584193;
				var b = -271733879;
				var c = -1732584194;
				var d = 271733878;
				for(var i = 0; i < x.length; i += 16)
				{
					var olda = a; var oldb = b;var oldc = c; var oldd = d;
					a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
					d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
					c = md5_ff(c, d, a, b, x[i+ 2], 17, 606105819);
					b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
					a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
					d = md5_ff(d, a, b, c, x[i+ 5], 12, 1200080426);
					c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
					b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
					a = md5_ff(a, b, c, d, x[i+ 8], 7 , 1770035416);
					d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
					c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
					b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
					a = md5_ff(a, b, c, d, x[i+12], 7 , 1804603682);
					d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
					c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
					b = md5_ff(b, c, d, a, x[i+15], 22, 1236535329);

					a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
					d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
					c = md5_gg(c, d, a, b, x[i+11], 14, 643717713);
					b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
					a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
					d = md5_gg(d, a, b, c, x[i+10], 9 , 38016083);
					c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
					b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
					a = md5_gg(a, b, c, d, x[i+ 9], 5 , 568446438);
					d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
					c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
					b = md5_gg(b, c, d, a, x[i+ 8], 20, 1163531501);
					a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
					d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
					c = md5_gg(c, d, a, b, x[i+ 7], 14, 1735328473);
					b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

					a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
					d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
					c = md5_hh(c, d, a, b, x[i+11], 16, 1839030562);
					b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
					a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
					d = md5_hh(d, a, b, c, x[i+ 4], 11, 1272893353);
					c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
					b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
					a = md5_hh(a, b, c, d, x[i+13], 4 , 681279174);
					d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
					c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
					b = md5_hh(b, c, d, a, x[i+ 6], 23, 76029189);
					a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
					d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
					c = md5_hh(c, d, a, b, x[i+15], 16, 530742520);
					b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

					a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
					d = md5_ii(d, a, b, c, x[i+ 7], 10, 1126891415);
					c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
					b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
					a = md5_ii(a, b, c, d, x[i+12], 6 , 1700485571);
					d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
					c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
					b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
					a = md5_ii(a, b, c, d, x[i+ 8], 6 , 1873313359);
					d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
					c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
					b = md5_ii(b, c, d, a, x[i+13], 21, 1309151649);
					a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
					d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
					c = md5_ii(c, d, a, b, x[i+ 2], 15, 718787259);
					b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

					a = safe_add(a, olda);
					b = safe_add(b, oldb);
					c = safe_add(c, oldc);
					d = safe_add(d, oldd);
				}
				return Array(a, b, c, d);
			}

			md5_cmn = function (q, a, b, x, s, t) {
				return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
			}
			md5_ff = function (a, b, c, d, x, s, t) {
				return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
			}
			md5_gg = function (a, b, c, d, x, s, t) {
				return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
			}
			md5_hh = function (a, b, c, d, x, s, t) {
				return md5_cmn(b ^ c ^ d, a, b, x, s, t);
			}
			md5_ii = function (a, b, c, d, x, s, t) {
				return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
			}

			core_hmac_md5 = function (key, data) {
				var bkey = str2binl(key);
				if (bkey.length > 16)
				{
					bkey = core_md5(bkey, key.length * chrsz);
				}
				var ipad = Array(16), opad = Array(16);
				for(var i = 0; i < 16; i++)
				{
					ipad[i] = bkey[i] ^ 0x36363636;
					opad[i] = bkey[i] ^ 0x5C5C5C5C;
				}
				var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
				return core_md5(opad.concat(hash), 512 + 128);
			}

			safe_add = function (x, y) {
				var lsw = (x & 0xFFFF) + (y & 0xFFFF);
				var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
				return (msw << 16) | (lsw & 0xFFFF);
			}

			bit_rol = function(num, cnt) {
				return (num << cnt) | (num >>> (32 - cnt));
			}
			str2binl = function(str) {
				var bin = Array();
				var mask = (1 << chrsz) - 1;
				for(var i = 0; i < str.length * chrsz; i += chrsz)
				{
					bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
				}
				return bin;
			}
			binl2hex = function(binarray) {
				var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
				var str = "";
				for(var i = 0; i < binarray.length * 4; i++)
				{
					str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
					hex_tab.charAt((binarray[i>>2] >> ((i%4)*8 )) & 0xF);
				}
				return str;
			}
			return hashMd5(this);
		},    /* end of md5: function() { */
		/* 字符串转换为整数 */
		toInt: function() {
			return parseInt(this);
		},
		/* 字符串转换为浮点数 */
		toFloat: function() {
			return parseFloat(this);
		},
		/* 字符串Base64位编码 */
		base64Encode: function() {
			var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
			out = "", i = 0, len = this.length,
			c1, c2, c3;
			while (i < len)
			{
				c1 = this.charCodeAt(i++) & 0xff;
				if (i == len)
				{
					out += base64encodechars.charAt(c1 >> 2);
					out += base64encodechars.charAt((c1 & 0x3) << 4);
					out += "==";
					break;
				}
				c2 =this.charCodeAt(i++);
				if (i == len)
				{
					out += base64encodechars.charAt(c1 >> 2);
					out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
					out += base64encodechars.charAt((c2 & 0xf) << 2);
					out += "=";
					break;
				}
				c3 = this.charCodeAt(i++);
				out += base64encodechars.charAt(c1 >> 2);
				out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
				out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
				out += base64encodechars.charAt(c3 & 0x3f);
			}  /* end of while (i < len) */
			return out;
		},
		/* base64解码 */
		base64Decode: function() {
			var base64decodechars = new Array(
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
			52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
			-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
			15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
			-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
			41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
			),
			c1, c2, c3, c4,
			i = 0, len = this.length, out = "";
			while (i < len)
			{
				do
				{
					c1 = base64decodechars[this.charCodeAt(i++) & 0xff];
				} while (i < len && c1 == -1);  /* end of do */

				if (c1 == -1)
				{
					break;
				}

				do
				{
					c2 = base64decodechars[this.charCodeAt(i++) & 0xff];
				} while (i < len && c2 == -1);  /* end of do */

				if (c2 == -1)
				{
					break;
				}
				out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

				do
				{
					c3 = this.charCodeAt(i++) & 0xff;
					if (c3 == 61)
					{
						return out;
					}
					c3 = base64decodechars[c3];
				} while (i < len && c3 == -1);

				if (c3 == -1)
				{
					break;
				}

				out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

				do
				{
					c4 = this.charCodeAt(i++) & 0xff;
					if (c4 == 61)
					{
						return out;
					}
					c4 = base64decodechars[c4];
				} while (i < len && c4 == -1);

				if (c4 == -1)
				{
					break;
				}
				out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
			}
			return out;
		} /* end of base64Decode: function() { */

	});

	__T.extend({
		/* 查询某个值是否在数组中 */
		inArray: function(value, array) {
			for (var i = 0, len = array.length; i < len; i++)
			{
				if (array[i] == value)
				{
					return true;
				}
			}
			return false;
		},
		/* 数组去重，适用所有类型，但时间复杂度为n的平方 */
		arrayUnique: function(array) {
			for (var i = 0; i < array.length; i++)
			{
				for (var j = i + 1; j < array.length; j++)
				{
					if (array[i] === array[j])
					{
						array.splice(j, 1);
						j--;
					}
				}
			}
			return array;
		},
		/* 数组去重，适用于数组元素全为object，时间复杂度为n */
		arrayObjectUnique: function(array) {
			var re=[];
			for (var i = 0, l = array.length; i < l; i++)
			{
				if (typeof array[i]["_uniqObjects"] == "undefined")
				{
					array[i]["_uniqObjects"] = 1;
					re.push(array[i]);
				}
			}
			// 取出标签
			for (var i = 0, l = re.length; i < l; i++)
			{
				delete re[i]["_uniqObjects"];
			}
			return re;

		},
		/* 遍历数组或对象 */
		each: function(object, callback, args) {
			var name, i = 0,
			length = object.length,
			isObj = length === undefined || __T.isFunction(object);
			if (args)
			{
				if (isObj)
				{
					for (name in object)
					{
						if (callback.apply( object[ name ], args ) === false)
						{
							break;
						}
					}
				}
				else
				{
					for (; i < length;)
					{
						if ( callback.apply( object[ i++ ], args ) === false )
						{
							break;
						}
					}
				}
			}
			else
			{
				if (isObj)
				{
					for (name in object)
					{
						if (callback.call(object[ name ], name, object[ name ]) === false)
						{
							break;
						}
					}
				}
				else
				{
					for (; i < length;)
					{
						if (callback.call(object[ i ], i, object[ i++ ]) === false)
						{
							break;
						}
					}
				}
			}
			return object;
		}
	});

	// alert(new
	// String("www.sdfdfsdfsdfsdfbaidu.com").base64Encode().base64Decode());


	/* 伪多线程处理 */
	__T.extend({
		_threadInsance: new Array(),
		_intervalInsance: new Array(),

		/* 延时单例处理 */
		threadSingle: function(input, interval) {
			var interval = parseInt(interval),
			name = __T.isFunction(input)? input.toString().md5() : input.md5();
			if (__T._threadInstance[name])
			{
				clearTimeout(__T._threadInstance[name]);
			}
			__T._threadInstance[name] = setTimeout(input, interval);
		},

		/* 定时循环单例处理 */
		interval: function(input, interval) {
			var interval = parseInt(interval),
			name = __T.isFunction(input)? input.toString().md5() : input.md5();
			if (__T._intervalInsance[name])
			{
				clearTimeout(__T._intervalInsance[name]);
			}
			__T._intervalInsance[name] = setInterval(input, interval);
		}
	});

    /*异步多线程容器*/
    __T.threadInstances = new Array();

    /*异步多线程单例模式*/
    __T.singletonThread = function (string)
    {
        var interval = parseInt(arguments[1]);

        if (__T.threadInstances[string])
        {
            clearTimeout(__T.threadInstances[string]);
        }

        __T.threadInstances[string] = setTimeout(string, interval);
    }
    
	/* 输入框只允许输入数字 */
	__T.onlyInt = function(id) {
		id = (typeof id == 'string' ) ?__T("#" + id) : id;
		if (!id)
		{
			return;
		}
		var onlyInt = function() {
			this.value = this.value.replace(/\D/g,'');
			if (this.value == '' || this.value == '0')
			{
				this.value = '';
			}
		}
		__T.bind(id, 'keyup', onlyInt);
		__T.bind(id, 'change', onlyInt);
		__T.bind(id, 'afterpaste', onlyInt);
	}
	__T.onlyString = function(id) {
		if (typeof id != 'string' )
		{
			return;
		}

		id = this(id );
		if(!id)
		{
			return;
		}

		id.onkeyup = id.onafterpaste = function() {
			this.value = this.value.repalce(/\W/g,'');
		}
		if (typeof(id.onchange) == "function")
		{
			id.onchange();
		}
	}


	/* 元素操作 */

	// 生成DOM
	__T.createElement = function(tagName, attributes) {
		var element = document.createElement(tagName);
		if (attributes)
		{
			for (var name in attributes)
			{
				if (attributes.hasOwnProperty(name))
				{
					if ((name === "class") || (name === "className"))
					{
						element.className = attributes[name];
					}
					else if (name === "style")
					{
						element.style.cssText = attributes[name];
					}
					else
					{
						element.setAttribute(name, attributes[name]);
					}
				}
			}
		}
		return element;
	}

	/* 元素加载盒子 */
	__T.LoadelementBox = function(e) {
		var ebox = __T('#LoadelementBox');
		if (!e)
		{
			return false;
		}

		if (!ebox)
		{
			ebox = document.createElement("DIV");
			ebox.id = 'LoadelementBox';
			ebox.style.cssText = "display:block;";
			this.insertBody(ebox);
		}
		ebox.appendChild(e);
		return true;
	},

	/* 事件 */

	__T.bind = function(element, type, handle) {
		if (element.addEventListener)
		{
			element.addEventListener(type, handle, false);
		}
		else if(element.attachEvent)
		{
			element.attachEvent("on" + type, handle);
		}
		else
		{
			element["on" + type] = handle;
		}
	}

	// 移除事件
	__T.unbind = function(element, type, handle) {
		if (element.removeEventListener)
		{
			element.removeEventListener(type, handle, false);
		}
		else if (element.detachEvent)
		{
			element.detachEvent("on" + type, handle);
		}
		else
		{
			element["on" + type] = null;
		}
	}


	// 获取event对象
	__T.getEvent = function() {
		if (document.all)
		{
			return window.event;
		}
		func = getEvent.caller;
		while (func != null)
		{
			var arg0 = func.arguments[0];
			if (arg0)
			{
				if((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation))  return arg0;
			}
			func = func.caller;
		}
		return null;
	}


	// 获取target对象(须先获取event对象)
	__T.getEventTarget = function(e) {
		return e.target || e.srcElement;
	}

	// 加载完成后绑定事件
	__T.ready = function(callback) {
		if (!__T.isFunction(callback) && typeof callback == "string")
		{
			eval("callback = function(){"+ callback + "}");
		}
		__T.bind(window, 'load', callback);
	}

	/* Location 操作类库 */
	__T.reload = function() {
		if (!arguments[1])
		{
			if (!arguments[0])
			{
				location.reload() ;
			}
			else
			{
				location.assign(arguments[0]);
			}
		}
		else
		{
			setTimeout(' location.assign("' + arguments[0] +'")', parseInt(arguments[1]) * 1000);
		}
	}


	/* 设置cookie作用域 */
	__T.cookieDomain = '';

	/* 设置域名 */
	__T.setDomain = function(string)
	{
		if (!string)
		{
			return;
		}
		__T.document.domain = string;
		__T.cookieDomain = string;
	}

	/**/
	__T.getNameValue = function(name)
	{
		var doNum = document.getElementsByName(name);
		if (!doNum)
		{
			return;
		}

		var dos = 0;
		for (i = 0; i < doNum.length; i++)
		{

			if (doNum[i].checked)
			{
				dos = doNum[i].value;
				return dos;
			}

		}

	}

	/* 加载 */

	// 插入Head后面
	__T.insertHead = function(obj) {
		document.getElementsByTagName("head")[0].appendChild(obj);
	}

	// 插入Body前面
	__T.insertBody = function(obj) {
		document.getElementsByTagName("body")[0].insertBefore(obj, document.getElementsByTagName("body")[0].childNodes[0]);
	}

	// 加载页面
	__T.load = function(url,callBack) {
		this.get(url, '', callBack);
	}

	// 动态加载CSS文件
	__T.loadCss = function(url) {
		var css =__T.createElement("link", { "href":url,"rel":"stylesheet", "type":"text/css"});
		__T.insertHead(css);
	}

	// 动态加载外部JS文件
	__T.loadScript = function(url) {
		setTimeout(function() {
			var script =__T.createElement("script", { "src" : url, "type" : "text/javascript" });
			__T.insertHead(script);
		},0);
	}


	/* Cookie操作函数 */
	// 设置
	__T.setCookie = function() {
		if (arguments.length == 2 )
		{
			var exp  = new Date();
			exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000 / 2);
			document.cookie = arguments[0] + "=" + escape (arguments[1]) + ";expires=" + exp.toGMTString() + ";path=/";
		}
		else if (arguments.length == 3)
		{
			var exp  = new Date();
			exp.setTime(exp.getTime() + arguments[2] * 24 * 60 * 60 * 1000 / 2);
			document.cookie = arguments[0] + "=" + escape (arguments[1]) + ";expires=" + exp.toGMTString() + ";path=/;domain=" +__T.cookieDomain;
		}
		else
		{
			alert("操作错误！");
		}
	}

	// 获取
	__T.getCookie = function (name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		return (arr != null) ? unescape(arr[2]) : null;
	}

	// 删除
	__T.delCookie = function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = this.getCookie(name);
		if (cval != null)
		{
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;domain=" +__T.cookieDomain;
		}
	}

	/* AJAX操作类 */
	__T.extend({
		ajaxInit: function(url, settings) {
			if (typeof url == "object")
			{
				settings = url;
				url = settings["url"];
			}
			else if (typeof url == "string" && typeof settings != "object")
			{
				settings = {};
			}

			this.getHttpRequest = function() {
				var httpRequest;
				try
				{
					httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(e)
				{
					try
					{
						httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(e2)
					{
						httpRequest = false;
					}
				}
				if ((!httpRequest) && (typeof XMLHttpRequest != 'undefined'))
				{
					httpRequest = new XMLHttpRequest();
				}
				return httpRequest;
			}

			this.requestHeader = {};
			var xmlHttp = this.getHttpRequest(),
			post = this;

			this.httpResponse = function() {
				if (xmlHttp.readyState == 4)
				{
					var response = xmlHttp.responseText;
					
					if (typeof settings["dataType"] == "string")
					{
						switch(settings["dataType"].toUpperCase())
						{
							case "JSON" :
							response = response.parseJSON();
							break;
							case "XML" :
							response = response.parseXML();
							break;
							default:
							break;
						}
					}
					if ((settings['callback'] != null) && (typeof settings['callback'] == "function"))
					{
						settings['callback'](response, xmlHttp, post);
					}
				}
			}

			this.toQueryString = function(object) {
				var query = '';
				for (var param in object)
				{
					query += param + "=" + encodeURIComponent(object[param]) + "&"
				}
				return query.substring(0, query.length - 1);
			}

			this.getRequestHeader = function(header) {
				if (typeof header == "object")
				{
					this.requestHeader = header;
				}
				return this.requestHeader;
			}

			this.invoke = function() {
				if (xmlHttp)
				{
					/* 如果url为空，则返回xmlHttp */
					if (!url)
					{
						return xmlHttp;
					}

					var requestHeader =  this.getRequestHeader((typeof settings['headers'] == "object") ?
					settings['headers'] : undefined),
					data = (typeof settings["data"] == "object") ? this.toQueryString(settings["data"]) : "";
					var method = "GET";
                        
					if (settings['method'] != null && settings['method'].toUpperCase() == "POST")
					{
						method = "POST";
						requestHeader["Content-type"] =  "application/x-www-form-urlencoded";
					}
					else
					{
						if (data)
						{
							if (url.indexOf('?') < 0)
							{
								url += '?';
							}
							url += "&" + data;
						}
						data = null;
					}
					xmlHttp.onreadystatechange = this.httpResponse;
					xmlHttp.open(method, url, true, settings["userId"], settings["password"]);
					for (var param in requestHeader)
					{	
						xmlHttp.setRequestHeader(param, requestHeader[param]);
					}
					xmlHttp.send(data);
				}
			}
		},
		/* ajax完全版 */
		ajax: function(url, settings) {
			return new __T.ajaxInit(url, settings).invoke();
		},
		/* get方式转换 */
		get: function (url, data, callback, type) {
			if (__T.isFunction(data))
			{
				callback = data;
				data = {};
			}
			return __T.ajax(url, {"method": "GET", "callback": callback, "data": data, "dataType": type});
		},
		/* get方式转换为JSON */
		getJSON: function (url, data, callback) {
			if (__T.isFunction(data))
			{
				callback = data;
				data = {};
			}	
			var query = '';
			for (var param in data)
			{
				query += param + "=" + encodeURIComponent(data[param]) + "&";
			}
			var cb = 'jsonp' + new Date(). getTime();
			if (!__T['jsonp'])
			{
				__T['jsonp'] = {};
			}
			if (!__T['jsonp'][cb])
			{
				__T['jsonp'][cb] = function(res){
					callback(res);
				}
			}	
			
			query += "jsonpCallback=$.jsonp." + cb;
			url += (url.indexOf("?") > -1) ? query : "?" + query;
			__T.loadScript(url);
		},
		/* get方式转换为XML */
		getXML: function (url, data, callback) {
			return __T.get(url, data, callback, "XML");
		},

		/* POST方式 */
		post: function (url, data, callback, type) {
			return __T.ajax(url, {"method": "POST", "callback": callback, "data": data, "dataType": type});
		}

	});

	/* 功能性设计 */
	__T.show = function() {
		if(!arguments[0]) return false;
		arguments[0].style.display = 'block';
	}

	__T.hide = function() {
		var element = arguments[0];
		var timeout = arguments[1];
		switch(timeout)
		{
			case 'fast' :
			timeout = 0.5;
			break;
			case 'normal' :
			timeout = 2;
			break;
			case 'slow' :
			timeout = 5;
			break;
			default :
			timeout = parseInt(timeout);
			break;
		}
		if (timeout == 0)
		{
			element.style.display = 'none';
		}
		else
		{
			setTimeout("$('#" + element.id + "').style.display='none'", timeout * 1000);
		}
	},

	/* 滑动舌签 简单幻灯片 */
	__T.door = function(c) {
		new slidingDoors(c);
	}

	// 得到页面长和宽
	__T.getWH = function() {
		var s;
		var r = {};
		if (!arguments[0])
		{
			s = this('body');

		}
		else
		{
			s = arguments[0];
		}
		r.width = Math.max(s.scrollWidth, s.clientWidth);
		r.height = Math.max(s.scrollHeight, s.clientHeight);
		return r;
	},

	// 格式化金额
	__T.fmoney = function(s, n,data) {
		var i,r,l,t;
		n = ((n > 0) && (n <= 20)) ? n : 2;
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
		t = "";
		for (i = 0; i < l.length; i ++ )
		{
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		r = t.split("").reverse().join("") + "." + r;

		if ( typeof data == 'string')
		{
			r = data + r
		}
		return r;
	}


	/* 遮罩层 */

	// 显示
	__T.showCover = function (x) {
		window.focus();
		coverDIV.show(x);
	}

	// 隐藏
	__T.hideCover = function() {
		coverDIV.hide();
	}

	__T.extend({
		popUpLayers: {
			fId: "Load_Iframe",
			dId: "Load_Iframe_Div",
			biId: "Load_Iframe_Main",
			bId: "Load_Iframe_Border",
			divs: new Array(),
			fwidth: 0,
			fheight: 0,
			position: null,
			top: 0,
			current:null,
			init:function() {
				var i;
				var param = arguments[0] ? arguments[0] : '';
				var showtype = arguments[1] ? arguments[1] : 'DIV';
				this.fwidth = parseInt(arguments[2] ? arguments[2] : "500");
				this.fheight = parseInt(arguments[3] ? arguments[3] : "290");

				/* 弹出层设置 */
				var f =__T("#" + this.fId);
				var d =__T("#" + this.dId);
				var bi =__T("#" + this.biId);
				var b =__T("#" + this.bId);
				var position = __T.isIE6() ? 'absolute' : 'fixed';

				__T.showCover(1);

				if (!f)
				{
					b = document.createElement("DIV");
					bi = document.createElement("DIV");
					bi.id = this.biId;
					b.id = this.bId;
					bi.innerHTML = '<iframe style="overflow:hidden" scrolling="no" frameborder="0" id="Load_Iframe" ></iframe><div style="" id="Load_Iframe_Div" ></div>';
					bi.style.cssText = 'position:' + position + ';width:0px;height:0px; background:#fff; z-index:100001; top:100px; left:100px;opacity:1; -moz-opacity:1; filter:alpha(opacity=100);';
					b.style.cssText = 'position:' + position +  '; z-index:100000; top:100px; left:100px;opacity:0.3; -moz-opacity:0.3; filter:alpha(opacity=30);';

					__T.LoadelementBox(b);
					__T.LoadelementBox(bi);

					f =__T("#" + this.fId);
					d =__T("#" + this.dId);


					f.onload = function() {
						__T.showCover(2);
					}

				}

				if (showtype == 'DIV')
				{
					var md5 = 'Load_Iframe_Div_' + param.md5();
					var di;
					for (i = 0; i < this.divs.length ; i++)
					{
						if (this.divs[i].id == md5)
						{
							di = this.divs[i];
						}
						this.divs[i].style.display = 'none';

					}
					if (!di)
					{
						di = document.createElement('DIV');
						di.innerHTML = param;
						di.id = md5;
						if (d.childNodes[0])
						{
							d.insertBefore(di,d.childNodes[0]);
						}
						else
						{
							d.appendChild(di);
						}
						this.divs.push(di);
					}
					di.style.display = '';
					d.style.display = 'none';
					f.style.display = 'none';
					this.current = d;
				}
				else
				{
					f.src = param;
					d.style.display = 'none';
					f.style.display = 'none';
					this.current = f;

				}
				this.current["isInit"] = false;
				this.show();
				return ;
			},
			_show: function() {
				var parent = __T.popUpLayers;
				var f =__T("#" + parent.fId);
				var d =__T("#" + parent.dId);
				var bi =__T("#" + parent.biId);
				var b =__T("#" + parent.bId);

				if (parent.top ==__T('body').scrollTop && (parent.current && parent.current["isInit"]))
				{
					return;
				}

				var bodyWidth =__T.getWH().width;

				// 弹出层设置
				var biWidth = __T.popUpLayers.fwidth; // 弹出层容器位置设置
				var biHeight = __T.popUpLayers.fheight;

				var biLeft = window.screen.width/2 - parent.fwidth/2;

				parent.top =__T('body').scrollTop;
				var biTop = __T.isIE6() ? (parent.top  + window.screen.height/2 - parent.fheight/2-200) : (window.screen.height/2 - parent.fheight/2-200);

				var bWidth = parent.fwidth + 16; 	 // 弹出层边框位置设置;
				var bHeight = parent.fheight + 16 ;
				var bLeft = biLeft - 8;
				var bTop = biTop - 8;
	
				bi.style.width = biWidth + 'px';
				bi.style.height =  biHeight + 'px';

				bi.style.left = biLeft + 'px';
				b.style.width = bWidth + 'px';
				b.style.height = bHeight + 'px';
				b.style.left = bLeft + 'px';
				parent.topBiTop = biTop;
				parent.topBTop = bTop;
				b.style.top = bTop + 'px';
				bi.style.top = biTop + 'px';
				f.style.width = d.style.width = parent.fwidth + 'px';
				f.style.height = d.style.height = parent.fheight + 'px';
				if (!parent.current["isInit"])
				{
					// __T.gradualChange(bi);
				}
				parent.current["isInit"] = true;

				parent.current.style.display = "";

			},
			interval:null,
			show:function() { // 显示弹出层
				__T("#" + this.biId).style.display = '';
				__T("#" + this.bId).style.display = '';
				this.current.style.display = "";
				if (this.current && !this.current["isInit"])
				{

					this._show();
				}
				this.interval = setInterval(this._show, 1000);

			},
			hide:function() { // 隐藏弹出层
				if (this.interval)
				{
					clearInterval(this.interval);
				}
				if (__T("#" + this.biId))
				{
					__T("#" + this.biId).style.display = 'none';
				}

				if (__T("#" + this.bId))
				{
					__T("#" + this.bId).style.display = 'none';
				}
				__T.hideCover();
			}
		},
		popShow: function(string) {

			if ((!string))
			{
				return;
			}
			var funcName = string.md5();
			if (!__T.popUpLayers[funcName])
			{
				var pop = function() {
					var me = arguments.callee;
					__T.popUpLayers.init(me.str, me.type, me.width, me.height);
				}
				pop.self = arguments;
				pop.str = arguments[0];
				pop.type = arguments[1];
				pop.width = arguments[2];
				pop.height = arguments[3];
				__T.popUpLayers[funcName] = pop;

			}
			if(__T.popUpLayers[funcName])
			{
				__T.popUpLayers[funcName]();
			}
		}
	});


	__T.gradualChange = function(element, speed, start, end) {
		start = parseInt(start);
		end = parseInt(end);
		speed = parseInt(speed);
		(start > 100 || start < 0 || !start) && (start = 10);
		(end > 100 || end < 0 || !end) && (end = 100);
		(speed == "slow") && (speed = 500);
		(speed == "quick") && (speed == 100);
		(speed == "middle") && (speed == 200);
		(speed < 0 || speed > 60000 || !speed) && (speed = 10);
		(element != null && typeof element == "string") && (element = __T("#" + element));
		if (!element || (end == start) || (speed == 0))
		{
			return;
		}
		var t  = function(ox) {
			var handle = arguments.callee;
			var type = (handle.start - handle.end > 0) ? true : false;
			if ((type && handle.end > ox) || (!type && handle.end < ox))
			{
				return;
			}
			if (__T.isIE())
			{
				handle.element.style.filter = "alpha(opacity=" + ox + ")";
			}
			else
			{
				handle.element.style.opacity = ox / 100;
			}
			if (handle.start - handle.end > 0)
			{
				ox -= 10;
			}
			else
			{
				if (ox < 80)
				{
					ox += 20;
				}
				ox += 10;
			}
			if (__T.gradualChange.timeoutCollection[this.index])
			{
				clearTimeout(__T.gradualChange.timeoutCollection[this.index]);
			}
			__T.gradualChange.timeoutCollection[this.index] = setTimeout("__T.gradualChangeExec(" + ox + ")", handle.interval);
		};
		t.element = element;
		t.start = start;
		t.end = end;
		t.interval = speed;
		t.index = element.toString() + speed + start + end;
		t(start);
		__T.gradualChangeExec = t;
	}

	__T.gradualChange.timeoutCollection = {};

	// 隐藏弹出层
	__T.hideDIV = function() {
		__T.popUpLayers.hide();
	}


	// 弹出对话框
	__T.alert = function(string) {
		__T.messageBox.show(string);
	}

	// 复制内容
	__T.copyLink = function(content) {
		if (typeof(content) =='object')
		{
			content = content.value;
		}

		if (window.clipboardData)
		{
			if (window.clipboardData.setData("Text", content))
			{
				__T.alert("你已复制成功!");
			}
		}
		else
		{
			__T.alert("浏览器不支持自动复制，请手动复制");
		}
	}

	/* 格式化日期 */
	__T.getLocTime = function(nS) {
		return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日|六|七|一|二|三|四|五|星期/g, "");
	}

	/* 获取表单内所选项的值 */
	__T.getNameValue = function (name) {
		var i;
		var dos = 0;
		var doNum =__T("name=" + name);
		if (!doNum)
		{
			return;
		}

		for (i = 0; i < doNum.length; i++)
		{
			if (doNum[i].checked == true)
			{
				return  doNum[i].value;
			}
		}
	}
	
	/**
	 * 获取元素坐标定位
	 */
	__T.getPos = function (el) {
		 var ua = navigator.userAgent.toLowerCase();
		 var isOpera = (ua.indexOf('opera') != -1);
		 var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof;
		 el = (__T.type(el) == 'String') ? __T("#" + el) : el;
		 if (el.parentNode === null || el.style.display == 'none')
		 {
			 return false;
		 }
		 
		 var parent = null;
		 var pos = [];     
		 var box;     
		 if(el.getBoundingClientRect)    //IE
		 {         
			 box = el.getBoundingClientRect();
			 var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
			 var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
			 return {x:box.left + scrollLeft, y:box.top + scrollTop};
		 }
		 else if(document.getBoxObjectFor)    // gecko    
		 {
			 box = document.getBoxObjectFor(el); 
			 var borderLeft = (el.style.borderLeftWidth)?parseInt(el.style.borderLeftWidth):0; 
			 var borderTop = (el.style.borderTopWidth)?parseInt(el.style.borderTopWidth):0; 
			 pos = [box.x - borderLeft, box.y - borderTop];
		 }
		 else    // safari & opera    
		 {
			 pos = [el.offsetLeft, el.offsetTop];  
			 parent = el.offsetParent;     
			 if (parent != el) 
			 { 
				 while (parent) 
				 {  
					 pos[0] += parent.offsetLeft; 
					 pos[1] += parent.offsetTop; 
					 parent = parent.offsetParent;
				 }  
			 }  
			 if (ua.indexOf('opera') != -1 || ( ua.indexOf('safari') != -1 && el.style.position == 'absolute' )) 
			 { 
				 pos[0] -= document.body.offsetLeft;
				 pos[1] -= document.body.offsetTop;         
			 }    
		 }              

		 parent = (el.parentNode)  ? el.parentNode : null;
		 while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') // account for any scrolled ancestors
		 { 
			 pos[0] -= parent.scrollLeft;
			 pos[1] -= parent.scrollTop;
			 parent = (parent.parentNode)  ? parent.parentNode : null;

		 }
		 	return {x:pos[0], y:pos[1]};
		}	

	__T.slide = function(options, height) {
		var slide = new __T.slideCreate();
		var id = __T.slideCollection.length;
		__T.slideCollection[id] = slide;
		slide.id = id;
		slide.setOptions(options, height);
		slide.start();
		return slide;

	}

	__T.slideCollection = new Array();
	__T.slideCreate = function(options) {
		this.beSwitchs = new Array();   /* 被切换的元素 */
		this.switchs = new Array();    /* 启动切换的触发元素 */
		this.cutoverType = 1;   /* 幻灯片切换方式99 随机切换 0 直接切换, 1 = 上下切换 2 左右切换 3 透明切换 */
		this.cutoverInterval = 5   /* 为整数秒,最小为1 最大为60 */;
		this.currentId = 0;   /* 当前展示的Id */
		this.lastId = 0;   /* 需要被切换的ID */
		this.timeHandle = null;
		this.width = 500;
		this.height = 300;
        this.onClass = "on";
        this.offClass = "";
		this.tHandle = null;
		this.mainBox = null;
		this.clickBox = null;
		this.isClick = false;
		/* 设置 */
		this.setOptions = function(options, height) {
			if (typeof options == "object")
			{
				this.cutoverType = (!__T.isNumeric(options["type"])) ? 1  :  parseInt(options["type"]);
				(this.cutoverType < 0 || this.cutoverType > 3) && (this.cutoverType = 99);
				(options["interval"] != undefined) && (this.cutoverInterval = parseInt(options["interval"]));
				(options["on"] != undefined) && (this.onClass = options["on"]);
				(options["off"] != undefined) && (this.offClass = options["off"]);
				(options["click"] != undefined) && (this.offClass = options["click"]);
				(this.cutoverInterval < 1 || this.cutoverInterval > 60) && (this.cutoverInterval = 5);
				if ((options["beSwitchs"] != undefined) && (options["switchs"] != undefined))
				{
					var length = Math.min(options["beSwitchs"].length, options['switchs'].length);
					for (var i = 0; i < length; i++)
					{
						this.addGroup(options["beSwitchs"][i], options['switchs'][i]);
					}
				}
			}
			else
			{
				this.type == "auto";
				__T.isNumeric(options) && (this.width = options);
				__T.isNumeric(height) && (this.height = height);
				this.createSlide();
			}
		}
		this.createSlide = function() {
			var id = String("sidle_" + this.id).md5(),
			clickId = id.md5();
			string = '<div style="width:' + this.width + 'px;height:' + this.height + 'px;overflow:hidden;" id="'  + id + '"><div  style="float:right;position:absolute;bottom:0px;right:0px;z-index:1005" id="' + clickId + '">';
			document.write(string + '</div></div>');
			this.mainBox = __T("#" + id);
			this.clickBox = __T("#" + clickId);
		}
		this.add = function(src, href) {
			if (!href) {href = "/";}
			var image = document.createElement("IMG");
			image.src = src;
			image.h = href;
			image.onclick = function(){window.open(this.h);}
			image.style.cssText = "width:" + this.width + "px;height:" + this.height + "px;position:absolute;opacity:1; -moz-opacity:1; filter:alpha(opacity=100);cursor:poniter";
			this.beSwitchs.push(image);
			this.mainBox.appendChild(image);
			var span = document.createElement("SPAN");
			this.switchs.push(span);
			span.id = this.switchs.length;
			
			if (this.isClick)
			{	
				span.onclick = this.clickCutover;
			}
			else
			{
				span.onmouseover = this.clickCutover;
			}
			span.style.cssText = "display:block;margin:2px 1px;padding:2px 5px;width:25px;text-align:center;float:left;cursor:pointer;background:#aaa;opacity:0.7; -moz-opacity:0.7; filter:alpha(opacity=70)";
			span.innerHTML = this.switchs.length;
			this.clickBox.appendChild(span);
			return this;
		}
		this.clickCutover = function() {
			var parent = arguments.callee.parent;
			parent.lastId = parent.currentId;
			parent.currentId = this.id;
			if (!parent.timeHandle)
			{
				clearTimeout(parent.timeHandle);
			}
			parent.cutover();
		}
		/* 添加一张幻灯片 */
		this.addGroup = function(beSwitch, switching) {
			var bs = __T.getWH(beSwitch);
			beSwitch.width = bs.width;
			beSwitch.height = bs.height;
			this.beSwitchs.push(beSwitch);
			switching.id = this.switchs.length;
			this.switchs.push(switching);
			if (this.isClick)

			{	
				switching.onclick = this.clickCutover;
			}
			else
			{
				switching.onmouseover = this.clickCutover;
			}
		}

		this.start = function() {
			if (this.beSwitchs.length <= 1)
			{
				return;
			}
			this.cutover();
		}

		this.clickCutover.parent = this;

		/* 执行切换 */
		this.cutover = function() {
			if (this.timeHandle)
			{
				clearTimeout(this.timeHandle)
			}
			var downId;
			if (this.currentId >= this.beSwitchs.length)
			{
				this.currentId = 0;
			}
			this.beSwitchs[this.currentId].style.display = "none";
			for (var cid = this.currentId, len = this.beSwitchs.length, index = len - 1, i = 0; i < len; i++)
			{
				if (cid == len)
				{
					cid = 0;
				}
				if (index >= len)
				{
					index = 0;
				}
				this.beSwitchs[cid].style.zIndex = index;
				if (index == len - 2)
				{
					downId = cid;
				}
                
				this.switchs[i].className = (this.currentId == i  || (this.currentId == 0 && i == this.beSwitchs.length)) ?
				this.onClass : this.offClass;

				index++;
				cid++;
			}

			var types = [0, 1, 2, 3];
			var ix = this.cutoverType;
			if (!__T.inArray(this.cutoverType, types) )
			{
				var ix = Math.ceil(Math.random() * 3);
			}

			if (ix == 3)
			{
				__T.gradualChange(this.beSwitchs[this.currentId], 100, 0, 100);

			}
			else if (ix == 1)
			{

				if (this.currentId < this.lastId)
				{
					this.downToUp(this.currentId , downId , this.beSwitchs[this.currentId].height);
				}
				else
				{
					this.upToDown(this.currentId , downId , this.beSwitchs[this.currentId].height);
				}

			}
			else if (ix == 2)
			{
				if (this.currentId >= this.lastId)
				{
					this.leftToRight(this.currentId , downId , this.beSwitchs[this.currentId].height);
				}
				else
				{
					this.rightToLeft(this.currentId , downId , this.beSwitchs[this.currentId].height);
				}
			}
			this.beSwitchs[this.currentId].style.display = "";
			this.lastId = parseInt(this.currentId);
			this.currentId++;
			this.timeHandle = setTimeout("__T.slideCollection[" + this.id + "].cutover()", this.cutoverInterval * 1000);
		}

		this.upToDown = function(currentId,downId, top)
		{
			if (top <= 0 ) {
				this.beSwitchs[downId].style.marginTop = "0px";
				this.beSwitchs[currentId].style.marginTop = "0px";
				if (this.tHandle)
				{
					clearTimeout(this.tHandle);
				}
				return;
			}

			this.beSwitchs[currentId].style.marginTop = -1 * top + "px";
			this.beSwitchs[downId].style.marginTop = String((this.beSwitchs[downId].height - top)) + "px";
			var one = Math.ceil(this.beSwitchs[downId].height / 30 * 0.2);
			top -= one;
			if (top >= 30)
			{
				top -= one * 8;
			}
			if (!this.tHandle)
			{
				this.beSwitchs[downId].style.marginLeft = "0px";
				this.beSwitchs[currentId].style.marginLeft = "0px";
				clearTimeout(this.tHandle);
			}
			this.tHandle = setTimeout("__T.slideCollection[" + this.id + "].upToDown(" + currentId + "," + downId + "," + top + ")", 10);
		}

		this.downToUp = function(currentId,downId, top)
		{
			if (top <= 0 ) {
				this.beSwitchs[downId].style.marginTop = "0px";
				this.beSwitchs[currentId].style.marginTop = "0px";
				if (this.tHandle)
				{
					clearTimeout(this.tHandle);
				}
				return;
			}

			this.beSwitchs[currentId].style.marginTop = String(top) + "px";
			this.beSwitchs[downId].style.marginTop = String(-1 * (this.beSwitchs[downId].height - top)) + "px";
			var one = Math.ceil(this.beSwitchs[downId].height / 20 * 0.1);
			top -= one;
			if (top >= 30)
			{
				top -= one * 8;
			}
			if (!this.tHandle)
			{
				this.beSwitchs[downId].style.marginLeft = "0px";
				this.beSwitchs[currentId].style.marginLeft = "0px";
				clearTimeout(this.tHandle);
			}
			this.tHandle = setTimeout("__T.slideCollection[" + this.id + "].downToUp(" + currentId + "," + downId + "," + top + ")", 10);
		}

		this.leftToRight = function(currentId,downId, top)
		{
			if (top <= 0 ) {
				this.beSwitchs[downId].style.marginLeft = "0px";
				this.beSwitchs[currentId].style.marginLeft = "0px";
				if (this.tHandle)
				{
					clearTimeout(this.tHandle);
				}
				return;
			}

			this.beSwitchs[currentId].style.marginLeft = -1 * top + "px";
			this.beSwitchs[downId].style.marginLeft = String((this.beSwitchs[downId].width - top)) + "px";
			var one = Math.ceil(this.beSwitchs[downId].width / 20 * 0.1);
			top -= one;
			if (top >= 30)
			{
				top -= one * 8;
			}
			if (!this.tHandle)
			{
				this.beSwitchs[downId].style.marginLeft = "0px";
				this.beSwitchs[currentId].style.marginLeft = "0px";
				clearTimeout(this.tHandle);
			}
			this.tHandle = setTimeout("__T.slideCollection[" + this.id + "].leftToRight(" + currentId + "," + downId + "," + top + ")", 10);
		}

		this.rightToLeft = function(currentId,downId, top)
		{
			if (top <= 0 ) {
				this.beSwitchs[downId].style.marginLeft = "0px";
				this.beSwitchs[currentId].style.marginLeft = "0px";
				if (this.tHandle)
				{
					clearTimeout(this.tHandle);
				}
				return;
			}

			this.beSwitchs[currentId].style.marginLeft = top + "px";
			this.beSwitchs[downId].style.marginLeft = String(-1* (this.beSwitchs[downId].width - top)) + "px";
			var one = Math.ceil(this.beSwitchs[downId].width / 20 * 0.1);
			top -= one;
			if (top >= 30)
			{
				top -= one * 8;
			}
			if (!this.tHandle)
			{
				this.beSwitchs[downId].style.marginLeft = "0px";
				this.beSwitchs[currentId].style.marginLeft = "0px";
				clearTimeout(this.tHandle);
			}
			this.tHandle = setTimeout("__T.slideCollection[" + this.id + "].rightToLeft(" + currentId + "," + downId + "," + top + ")", 10);
		}
	}

	/* 原型库 */


	// 舌签原型
	var slidingDoors = function(c){
		this.id = c['id'];
		this.on = ' ' + c['on'];
		this.off = ' ' + c['off'];
		this.mouse = c['mouse'];
		this.div = c['tagname'] ? c['tagname'] : "DIV";
		this.loop = c['loop'] ? c['loop'] : false;
		this.intval = c['intval'] ? parseInt(c['intval']) : 2;
		this.j = $('#' + this.id).getElementsByTagName(this.div);
		this.count = this.j.length;
		this.slidingDoor = function() {
			var e, i = 0;
			for (var k = 0; k < this.j.length; k++)
			{
				e = this.j[k];
				e.next = (k < this.j.length - 1) ? this.j[k + 1] : this.j[0];
				e.aid = this.id;
				e.id = this.id + '_door_' + k;
				e.parents = this.j;
				e.on = this.on;
				e.off = this.off;
				e.div = this.div;
				e.count =  this.count - 1;
				e.intval = this.intval;
				e.loop = this.loop;
				e.brothers = __T("#" + e.aid).getElementsByTagName(e.div);
				e.brother = __T("#" + e.getAttribute('value'));
				if (!e.brother)
				{
					e.getAttribute('value');
					return;
				}
				e.oldClassName = (e.className.trim() && e.className.trim() != this.on.trim()) ? e.className : false;
				e.mouse = function () {
					for (var i = 0; i < this.parents.length; i++)
					{
						if (this.parents[i] == 'length')
						{
							continue;
						}

						if (this.parents[i] == this)
						{

							this.className = (this.oldClassName) ? (this.oldClassName + this.on) : this.on;
							if (this.parents[i].brother)
							{
								this.parents[i].brother.style.display = '';
							}
						}
						else
						{
							this.parents[i].className = (this.parents[i].oldClassName) ? (this.parents[i].oldClassName + this.parents[i].off) : this.parents[i].off;
							if (this.parents[i].brother)
							{
								this.parents[i].brother.style.display = 'none';
							}
						}

					}

					if (arguments[0] == 'loop' && this.loop)
					{
						setTimeout("__T('#" + this.next.id + "').mouse('loop');", this.intval * 1000);
					}
				}

				if (!this.mouse)
				{
					e.onmouseover =	e.mouse;
				}
				else
				{
					e.onclick = e.mouse;
				}
			}

			if(this.loop)
			{
				setTimeout("__T('#" + this.id + '_door_' + '0' + "').mouse('loop');", this.intval * 1000);
			}
		}

		this.slidingDoor();
	}

	/* 弹出层 */



	// 遮罩层原型
	var coverDIV = {
		show:function(x) {
			var z = this.load();
			var r =__T.getWH();
			z.style.width = r.width + 'px';
			z.style.height = r.height + 'px';
			z.style.display = "";
			if (x == 1)
			{
				z.style.backgroundColor = "#666";
			}
			else if (x == 2)
			{
				z.style.backgroundColor = "#aaa";
				// __T.gradualChange(z,100,10,60);
			}


		},
		hide:function() {
			this.load().style.display = "none";
		},
		load:function() {
			var z =__T('#Load_Zhezhaoceng');
			if (!z)
			{
				z = document.createElement("DIV");
				z.id = 'Load_Zhezhaoceng';
				z.style.cssText = 'position:absolute; width:100%; height:100%; background:#000; z-index:99999; top:0; left:0; opacity:0.4; -moz-opacity:0.4; filter:alpha(opacity=40);';
				__T.LoadelementBox(z);
				z =__T('#Load_Zhezhaoceng');
			}
			return z;
		}
	}

	
	// 弹出提示框原型
	__T.messageBox = {
		loadMsgbox:function() {
			var msgBox =__T('#Load_Messagebox');
			var str = '<div style="font-size:12px" id="Load_Messagebox">' +
			'<div class="ziliaoA">' +
			'<div style="background:#CE1E1E;height:30px;line-height:30px;padding:0px 10px;color:#FFFFFF; border-bottom:1px solid #000"><div style="float:left">提示</div><a onclick="__T.hideDIV()" style="float:right;cursor:pointer;color:#FFFFFF">关闭</a></div>'+
			'<div style="padding:5px 10px">' +
			'<dl style="min-height:50px;_height:50px" id="Load_Msgbox_Content"></dl>' +
			'<dl><span onclick="__T.hideDIV()" class="button02" style=""><span style="margin-left:145px;text-align:center;width:60px;height:22px;line-height:22px;cursor:pointer;display:block;padding:2px;background:#CE1E1E;border:1px solid #000;color:#FFFFFF">确定</span></span></dl>'+
			'</div></div></div>'
			if (!msgBox)
			{
				__T.popShow(str, 'DIV',400,139);
				msgBox = __T('#Load_Messagebox');
			}
			else
			{
				__T.popShow(str, 'DIV', 400, 139);
			}
			return msgBox;
		},
		show:function(message, subject) {
			window.focus();
			if (!subject)
			{
				subject = "提示";
			}
			if (!message)
			{
				message = "";
			}
			var msgBox = this.loadMsgbox();
			__T("#Load_Msgbox_Content").innerHTML = message;
		},
		hide:function(e, t) {
			__T.hideDIV(e, t);
		}
	}

	__T.apply = function(object, fun) {
		return function() {
			return fun.apply(object, arguments);
		}
	}

	__T.each = function(list, fun){
		for (var i = 0, len = list.length; i < len; i++) { fun(list[i], i); }
	};

	__T.upload = function() {
		return new fileUpload(arguments[0],arguments[1],arguments[2]);
	};

	// 文件上传类
	var fileUpload = function() {
		this.initialize.apply(this, arguments);
	}

	fileUpload.prototype = {

		// 表单对象，文件控件存放空间
		initialize: function(form, folder, options) {

			// 表单
			this.Form =__T("#" + form);

			// 文件控件存放空间
			this.Folder =__T("#" + folder);

			// 文件集合
			this.Files = [];

			this.SetOptions(options);

			this.FileName = this.options.FileName;
			this._FrameName = this.options.FrameName;
			this.Limit = this.options.Limit;
			this.Distinct = !!this.options.Distinct;
			this.ExtIn = this.options.ExtIn;
			this.ExtOut = this.options.ExtOut;

			this.onIniFile = this.options.onIniFile;
			this.onEmpty = this.options.onEmpty;
			this.onNotExtIn = this.options.onNotExtIn;
			this.onExtOut = this.options.onExtOut;
			this.onLimite = this.options.onLimite;
			this.onSame = this.options.onSame;
			this.onFail = this.options.onFail;
			this.onIni = this.options.onIni;
			this.onComplete = this.options.onComplete;
			this.className = this.options.className

			if (!this._FrameName)
			{
				// 为每个实例创建不同的iframe
				this._FrameName = "uploadFrame_" + Math.floor(Math.random() * 1000);

				// ie不能修改iframe的name
				var oFrame =  __T.isIE() ? document.createElement("<iframe name=\"" + this._FrameName + "\" >")  : document.createElement("iframe");

				// 为ff设置name
				oFrame.name = this._FrameName;
				oFrame.style.display = "none";

                this._isInit = false;
				__T.bind(oFrame, "load", __T.apply(this, this.completeUpload));

				// 在ie文档未加载完用appendChild会报错
				document.body.insertBefore(oFrame, document.body.childNodes[0]);
			}

			// 设置form属性，关键是target要指向iframe
			this.Form.target = this._FrameName;
			this.Form.method = "post";

			// 注意ie的form没有enctype属性，要用encoding
			this.Form.encoding = "multipart/form-data";

			// 整理一次
			this.Ini();
		},
		// 设置默认属性
		SetOptions: function(options) {
			this.options = {// 默认值
				FileName:	"Files[]",// 文件上传控件的name，配合后台使用
				FrameName:	"",// iframe的name，要自定义iframe的话这里设置name
				onIniFile:	function(){},// 整理文件时执行(其中参数是file对象)
				onEmpty:	function(){},// 文件空值时执行
				Limit:		10,// 文件数限制，0为不限制
				onLimite:	function(){},// 超过文件数限制时执行
				Distinct:	true,// 是否不允许相同文件
				onSame:		function(){},// 有相同文件时执行
				ExtIn:		["gif","jpg","rar","zip","iso","swf","exe",'txt'],// 允许后缀名
				onNotExtIn:	function(){},// 不是允许后缀名时执行
				ExtOut:		[],// 禁止后缀名，当设置了ExtIn则ExtOut无效
				onExtOut:	function(){},// 是禁止后缀名时执行
				onFail:		function(){},// 文件不通过检测时执行(其中参数是file对象)
				onIni:		function(){}, // 重置时执行,
				onComplete : function() {}, //完成上传时调用 
				className : ""
			};
			__T.extend(this.options, options || {});
		},
		// 整理空间
		Ini: function() {

			// 整理文件集合
			this.Files = [];

			// 整理文件空间，把有值的file放入文件集合
			__T.each(this.Folder.getElementsByTagName("input"),__T.apply(this, function(o) {
				if (o.type == "file")
				{	
					o.value && this.Files.push(o);
					this.onIniFile(o);
				}
			}))

			// 插入一个新的file
			var file = document.createElement("input");
			file.name = this.FileName;
			file.type = "file";
			file.className = this.className;

			file.onchange =__T.apply(this, function() {
				// 是否为单文件模式
			
				if (this.options.isSingleton && this.Files.length > 0)
				{
					this.Clear();
					this.Files = [];
				}

				//this.Ini();
				var s =this.Check(file);	
				if (this.options.isSingleton && s)
				{
					this.Form.submit();
				}


			});

			this.Folder.appendChild(file);

			// 执行附加程序
			this.onIni();
		},

		// 检测file对象
		Check: function(file) {

			// 检测变量
			var bCheck = true;

			// 空值、文件数限制、后缀名、相同文件检测
			if (!file.value)
			{
				bCheck = false;
				this.onEmpty();
			}
			else if (this.Limit && (this.Files.length >= this.Limit))
			{
				bCheck = false;
				this.onLimite();
			}
			else if ((!!this.ExtIn.length) && !RegExp("\.(" + this.ExtIn.join("|") + ")$", "i").test(file.value))
			{
				// 检测是否允许后缀名
				bCheck = false;
				this.onNotExtIn();
			}
			else if (!!this.ExtOut.length && RegExp("\.(" + this.ExtOut.join("|") + ")$", "i").test(file.value))
			{
				// 检测是否禁止后缀名
				bCheck = false;
				this.onExtOut();
			} else if (!!this.Distinct)
			{
				__T.each(this.Files, function(o) {
					if (o.value == file.value)
					{
						bCheck = false;
					}
				});

				if (!bCheck)
				{
					this.onSame();
				}
			}

			// 没有通过检测
			if (!bCheck)
			{
				this.onFail(file);
			}
			return bCheck;

		},

		// 删除指定file
		Delete: function(file) {
			// 移除指定file
			this.Folder.removeChild(file); this.Ini();
		},

		// 删除全部file
		Clear: function() {
		
			// 清空文件空间
			__T.each(this.Files,__T.apply(this, function(o) {
				
				this.Folder.removeChild(o);
			}
			));
			this.Ini();
		},

		completeUpload : function() {
            if (!this._isInit)
            {
				this._isInit = true;
				return false;
            }

		    var frame = window.frames[this._FrameName];
			var content = frame.document.documentElement.outerHTML ;
			if (content != "")
			{
				var reg = /<\/?[^>]*>/g;
			    content = content.replace(reg, '');
				var json = content.parseJSON(content);
				this.onComplete(json);
			}
			
		}
	}
	
	//悬浮提示框
	__T(function(){
		var popElements = __T('.T_PopupTrigger');
		var msgBox = __T("#__Load_POPUP_MSG");
		if (!msgBox)
		{
			msgBox = document.createElement("DIV");
			msgBox.id = '__Load_POPUP_MSG';
			msgBox.style.cssText = 'position:absolute; background:#FFF3E9;line-height:22px;'
			+ 'display:none;padding:10px 20px;border:1px solid #FFC56A;color:#000; z-index:999; top:0; left:0;';
			__T.LoadelementBox(msgBox);
		}
		
		for (var i = 0; i < popElements.length; i++)
		{
			popElements[i].onmouseover = function() {
				var left = $.getPos(this);
				var top = left.y + this.offsetHeight;
				left = left.x + this.offsetWidth;
				var msgBox = __T("#__Load_POPUP_MSG");
				msgBox .style.display = 'block';
				msgBox .innerHTML = this.getAttribute("data-popupmsg");
				left = (left > 800) 
				? left - msgBox.offsetWidth - this.offsetWidth 
				: left + this.offsetWidth;
				msgBox.style.top = top + "px";
				msgBox.style.left = left + "px";
			}
			popElements[i].onmouseout =  function() {
				__T("#__Load_POPUP_MSG").style.display = 'none';
			}
		}
	});
	
	window.__T =window.$ = __T;

})(window);

