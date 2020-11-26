import Cookies from 'js-cookie';

const TokenKey = 'Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCookie(...args) {
  let reg, result = [], allCookie = document.cookie, _args = args[0] instanceof Array ? args[0] : args
  _args.forEach(function (val, index) {
    reg = new RegExp("(^| )" + val + "=([^;]*)(;|$)")
    try {
      result.push(unescape(reg.exec(allCookie)[2]))
    } catch (e) {
      if (allCookie.indexOf(val) == -1) {
        result = [""];
      } else {
        console.warn("未知异常")
      }
    }
  })
  return result.length > 1 ? result : result[0]
}

export function delCookie(name) {
  let exp = new Date(), cval = getCookie(name)
  exp.setTime(exp.getTime() - 1);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;domain=" + document.domain.split(".").slice(-2).join(".")
  }
}
