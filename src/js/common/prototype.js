import Vue from 'vue';
import Axios from 'axios';
import {initShareMenu} from "./global";
Vue.prototype.$initShareMenu = initShareMenu;
Vue.prototype.$fetch = (url,param,timeout=8000)=>{
    return new Promise((revolved,reject)=>{
        Axios({
            method: 'post',
            url: url,
            data: param,
            timeout:timeout,
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: [function (data) {
                if(!data){return};//get请求，无需处理
                function each(object, callback){
                    let name,
                    i = 0,
                    length = object.length,
                    isObj = length === undefined || Object.prototype.toString.call(object) == "[object Function]";
                    if (isObj) {
                        for (name in object) {
                            if (callback.call(object[name], name, object[name]) === false) {
                                break;
                            }
                        }
                    }
                    else {
                        for (let value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) {
                        }
                    }
                    return object;
                }
                function serialize(params,obj,scope){
                    let type, array = Object.prototype.toString.call(obj) == "[object Array]", hash = Object.prototype.toString.call(obj) == "[object Object]"
                    each(obj, function(key, value) {
                      type = Object.prototype.toString.call(value);
                      if (scope) key = scope + '[' + (hash || type == '[object Object]' || type == '[object Array]' ? key : '') + ']'
                      if (!scope && array) params.add(value.name, value.value)
                      else if (type == "[object Array]" || (type == "[object Object]"))
                        serialize(params, value, key)
                      else params.add(key, value)
                    })
                  }
                let param = function(obj){
                    let params = []
                    params.add = function(key, value) {
                      if ( Object.prototype.toString.call(value) == "[object Function]") value = value()
                      if (value == null) value = ""
                      this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
                    }
                    serialize(params, obj)
                    return params.join('&').replace(/%20/g, '+')
                }
                return param(data);
            }]
        }).then(data=>{
            revolved(data.data);
        }).catch(e=>{
            reject("系统繁忙，请稍后重试");
        });
    });
};
Date.prototype.format = function(fmt){
    let o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
String.prototype.escapeHTML = function(){
    return this.replace(/&/g, "＆").replace(/</g, "＜").replace(/>/g, "＞").replace(/"/g, "＂").replace(/'/g, "＇").replace(/…/g, "...");
};
String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.unescapeHTML = function(){
    return this.replace(/＆/g, "&").replace(/＞/g, ">").replace(/＜/g, "<").replace(/＂/g, '"').replace(/＇/g, "'");
};