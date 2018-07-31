/**
 * 获取对应key的cookies值
 * 没有则返回空字符串
 * @param  {String} key 要获取的key值
 */
let getCookie = function(key) {
	let r = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)'),
		m = document.cookie.match(r);
	return (!m ? '' : m[1]);
};
let setCookie = function(name, value, expires, path, domain, secure) {
	console.log("setCookie");
	//写入COOKIES
	let exp = new Date();
	expires = arguments[2] || null,
	path = arguments[3] || "/";
	domain = arguments[4] || null;
	secure = arguments[5] || false;
	expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
	document.cookie = name + '=' + escape(value) + ( expires ? ';expires=' + exp.toGMTString() : '') + ( path ? ';path=' + path : '') + ( domain ? ';domain=' + domain : '') + ( secure ? ';secure' : '');
};
let delCookie = function(name, path, domain, secure) {
	console.log("delCookie");
	//删除cookie
	let value = getCookie(name);
	if(value != null) {
		let exp = new Date();
		exp.setMinutes(exp.getMinutes() - 1000);
		path = path || "/";
		document.cookie = name + '=;expires=' + exp.toGMTString() + ( path ? ';path=' + path : '') + ( domain ? ';domain=' + domain : '') + ( secure ? ';secure' : '');
	}
};
let getParameter = function(name,str){
	console.log("getParameter");
    str = str || location.href;
    let r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)"), m = str.match(r);
    return decodeURIComponent(!m ? "" : m[2]);
}
// 浏览器基础信息
let browser={
	versions:function(){
		let u = navigator.userAgent, app = navigator.appVersion;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
			qq: u.match(/\sQQ/i) == " qq" //是否QQ
		};
	}(),
	language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
let scrollFix = function(elem) {
	// Variables to track inputs
	let startTopScroll, noScroll;

	elem = elem || document.querySelector(elem);

	// If there is no element, then do nothing
	if(!elem)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(){
		noScroll = elem.scrollHeight <= elem.clientHeight;

		if(!noScroll){
			startTopScroll = elem.scrollTop;

			if(startTopScroll <= 0)
				elem.scrollTop = 1;

			if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		}
	}, false);

	elem.addEventListener('touchmove', function(event){
		if(noScroll){
			event.preventDefault();
		}
	});
};
let isMobile = function(v){
	console.log("isMobile");
	if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(v))){
		return false;
	}
	return v;
}
let isEmail = function(v){
	console.log("isEmail");
	let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if( reg.test(v) ){
		return v;
	}
	return false;
}
let isWxJsReady = false;
let wxJsConf = function(){
	if (g_sign_package.length == 0 || isWxJsReady ) {
	    return;
	}
	wx.config({
	    debug: false,
	    appId: g_sign_package["appId"],
	    timestamp: g_sign_package["timestamp"],
	    nonceStr: g_sign_package["nonceStr"],
	    signature: g_sign_package["signature"],
	    jsApiList: [
			'showMenuItems',
			'hideMenuItems',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'uploadImage',
			'chooseImage',
			'previewImage',
			'chooseWXPay',
			'getLocalImgData'
	    ]
	});
	wx.ready(function () {
		isWxJsReady = true;
	});
};
let initShareMenu = function(title,desc,link,imgUrl){
	if( imgUrl && imgUrl.match(/^\/\//) ){
		imgUrl = window.location.protocol + imgUrl;
	}
	wx.showMenuItems({
		menuList: [
		    'menuItem:refresh',
		    'menuItem:profile',
			'menuItem:copyUrl',
			'menuItem:share:timeline',
			'menuItem:share:appMessage'
		] // 要显示的菜单项，所有menu项见附录3
    });
    wx.hideMenuItems({
		menuList: [
			'menuItem:share:qq',
			'menuItem:addContact',
		    'menuItem:share:facebook',
		    'menuItem:share:QZone',
		    'menuItem:originPage',
		    'menuItem:readMode',
		    'menuItem:openWithQQBrowser',
		    'menuItem:openWithSafari'
		] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });
    // 在这里调用 API
    wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: link, // 分享链接
          imgUrl:imgUrl,
          success: function () {
                // 用户确认分享后执行的回调函数
                // Util.reportEtag("1.2.1.1");
          },
          cancel: function () {
                // 用户取消分享后执行的回调函数
          }
    });
    wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl:imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
                // 用户确认分享后执行的回调函数
                // Util.reportEtag("1.2.1.2");
          },
          cancel: function () {
                // 用户取消分享后执行的回调函数
          }
    });
};
let initWxAppShare = function (config) {
  var shareTitle = config.title;
  var shareDesc = config.desc;
  var url = config.url;
  var shareLogo = config.imgUrl;
  var callback = config.callback
  xysJs.init({
    wxFriendShare: {
      title: shareTitle,
      desc: shareDesc,
      pic: shareLogo,
      url: url,
      succ: callback
    },
    wxTimelineShare: {
      title: shareTitle,
      desc: shareDesc,
      pic: shareLogo,
      url: url,
      succ: callback
    },
    weiboShare: {
      title: shareTitle,
      desc: shareDesc,
      pic: shareLogo,
      url: url,
      succ: callback
    },
    smsShare: {
      title: shareTitle,
      desc: shareDesc,
      url: url,
      succ: callback
    }
  })
  wx.showMenuItems({
    menuList: [
      'menuItem:refresh',
      'menuItem:share:appMessage',
      'menuItem:profile',
      'menuItem:addContact'
    ] // 要显示的菜单项，所有menu项见附录3
  })
  wx.hideMenuItems({
    menuList: [
      //					'menuItem:share:timeline',
      'menuItem:share:facebook',
      'menuItem:share:QZone',
      'menuItem:copyUrl',
      'menuItem:originPage',
      'menuItem:readMode',
      'menuItem:openWithQQBrowser',
      'menuItem:openWithSafari'
    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
  })
  // 在这里调用 API
  wx.onMenuShareTimeline({
    title: shareTitle, // 分享标题
    link: url, // 分享链接
    imgUrl: shareLogo, // 分享图标
    success: function () {
      callback()
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  })
  wx.onMenuShareAppMessage({
    title: shareTitle, // 分享标题
    desc: shareDesc, // 分享描述
    link: url, // 分享链接
    imgUrl: shareLogo, // 分享图标
    type: '', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      callback()
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  })
}
let eventType = "tap";
if( !browser.versions.mobile ){
	eventType = "click";
}
let antiClickTransparent = ()=>{
	if( $("#antiClickTransparent").length == 0 ){
		$(document.body).append('<div id="antiClickTransparent" style="position:fixed;opacity:0;left:0;top:0;right:0;bottom:0;z-index:9999;"></div>');
	}
	$("#antiClickTransparent")[0].style.display = "block";
	setTimeout(()=>$("#antiClickTransparent")[0].style.display = "none",400);
};
let replace = (str)=>{
	return str.replace(/＜/g,"<").replace(/＞/g,">").replace(/＆/g,"&").replace(/＇/g,"'").replace(/＂/g,'"');
};
function checkIdCard(str, type) {
    if(str == null || str == "") {
        return false;
    }
    let rule;
    if(type == 0) {
        str = str.toUpperCase();
        if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(str))) {
            return false;
        }
        var k,
                p;
        k = str.length;
        if(k == 15) {
            rule = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var splitstr = str.match(rule);
            var idDate = new Date("19" + splitstr[2] + "/" + splitstr[3] + "/" + splitstr[4]);
            var f = (idDate.getYear() == Number(splitstr[2])) && ((idDate.getMonth() + 1) == Number(splitstr[3])) && (idDate.getDate() == Number(splitstr[4]) || (idDate.getDate() == Number(splitstr[4]) - 1));
            if(!f) {
                return false;
            }else {
                return true;
            }
        }
        if(k == 18) {
            rule = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var splitstr = str.match(rule);
            var idDate = new Date(splitstr[2] + "/" + splitstr[3] + "/" + splitstr[4]);
            var f = (idDate.getFullYear() == Number(splitstr[2])) && ((idDate.getMonth() + 1) == Number(splitstr[3])) && (idDate.getDate() == Number(splitstr[4]) || (idDate.getDate() == Number(splitstr[4]) - 1));
            if(!f) {
                return false;
            }else {
                var d;

                var m = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var n = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                var l = 0,
                        h;
                for(h = 0; h < 17; h++) {
                    l += str.substr(h, 1) * m[h];
                }

                d = n[l % 11];
                if(d != str.substr(17, 1)) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    return !/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/.test(str);
};
let getBirthDateByCert = function(cert) {
    if(!cert) {
        return "";
    }
    let year = "1900";
    let month = "1";
    let day = "1";
    if(cert.length == 15) {
        year = "19" + cert.substr(6, 2);
        month = cert.substr(8, 2);
        day = cert.substr(10, 2);
    }else if(cert.length == 18) {
        year = cert.substr(6, 4);
        month = cert.substr(10, 2);
        day = cert.substr(12, 2);
    }else {
        return "";
    }
    return year + "-" + month + "-" + day;
};
let getSex = function(value) {
    //1表示男，0表示女
    if(!value) {
        return false;
    }else if(value.length == 15) {
        return parseInt(value.substr(13, 1), 10) % 2 ? 1 : 0;
    }else if(value.length == 18) {
        return parseInt(value.substr(16, 1), 10) % 2 ? 1 : 0;
    }else {
        return false;
    }
};
let rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };
let copyToClipboard = str => {
	try{
		str+="";
		const el = document.createElement('textarea');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		if( browser.versions.mobile && browser.versions.ios ){
			el.setSelectionRange(0, str.length);
		}else{
			el.select();
		}
		document.execCommand('copy');
		document.body.removeChild(el);
		return true;
	}catch(e){
		return false;
	}
};
console.log('global is load');
export {rAF,wxJsConf,isWxJsReady,checkIdCard,getBirthDateByCert,getSex,getCookie,setCookie,delCookie,getParameter,request,browser,scrollFix,initShareMenu,eventType,antiClickTransparent,isMobile,isEmail,initWxAppShare};