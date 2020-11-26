/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, str, arr = ['beginTime', 'endTime']) {
	var search = params;
	search[arr[0]] = undefined;
	search[arr[1]] = undefined;
	if (null != str && '' != str) {
		search[arr[0]] = str[0];
		search[arr[1]] = str[1];
	}
	return search;
}

// 回显数据字典
export function showDictName(datas, code) {
	if (!datas || !Array.isArray(datas) || !code) {
		return
	}
	var actions = [];
	Object.keys(datas).filter((key) => {
		if (datas[key].code === ('' + code)) {
			actions.push(datas[key].name);
			return false;
		}
	})
	if (actions.length > 1) {
		return actions.join('-')
	} else if (actions.length === 1) {
		return actions.join('')
	} else {
		return '--'
	}
}
// 回显公司名称
export function showCompanyName(datas, compId) {
	if (!datas || !Array.isArray(datas) || !compId) {
		return
	}
	var actions = [];
	Object.keys(datas).filter((key) => {
		if (datas[key].compId === ('' + compId)) {
			actions.push(datas[key].compName);
			return false;
		}
	})
	if (actions.length) {
		return actions.join('')
	} else {
		return  '--'
	}
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || 0
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData =  cloneData.filter(father => {
	  let branchArr = cloneData.filter(child => {
		//返回每一项的子级数组
		return father[id] === child[parentId]
	  });
	  branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层

	  return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
  }

	// 只能输入字符串大写
	export function strToUpcase(v, reg) {
		let codeReg = reg || new RegExp("[A-Za-z_]+"), //正则 英文 也支持下划线
		str = ''
		for(var i=0; i<v.length; i++){
			if (codeReg.test(v[i])) {
				str += v[i];
			}
		}
		return str.toUpperCase()
	}

// 只能输入某字符， 传入正则即可
	export function limitStr(v, reg) {
		// \u4E00-\u9FA5A-Za-z]+  汉字和英文
		if(!v) return
		let str = ''
		for(var i=0; i<v.length; i++){
			if (reg.test(v[i])) {
				str += v[i];
			}
		}
		return str
	}

	// 缓存读取
	export const storage = {
		get(key) {
			return JSON.parse(sessionStorage.getItem(key))
		},
		set(key, value) {
			sessionStorage.setItem(key, JSON.stringify(value))
		},
		remove(key) {
			sessionStorage.removeItem(key)
		},
		clear() {
			sessionStorage.clear()
		}
	}
