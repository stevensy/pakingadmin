import {
  getInfo,
  login,
  logout,
} from '@/api/login';
import {
  delCookie,
  getToken,
  removeToken,
  setToken,
} from '@/utils/auth';
import { storage } from '@/utils/ruoyi';

let appIndex = 0
const user = {
  state: {
    token: getToken(),
    userInfo: undefined,
    roles: [],
    permissions: [],
    auth: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      storage.set('userInfo', userInfo)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      storage.set('roles', roles)
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
      storage.set('permissions', permissions)
    },
    SET_AUTH: (state, auth) => {
      state.auth = auth
      storage.set('auth', auth)
    },
  },

  actions: {
    // 登录
    Login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        login(payload).then(res => {
          if (+res.status === 1) {
            let { account, username, headimgurl, permission } = res.data, userInfo = {
              account,
              username,
              avatar: headimgurl
            }
            commit('SET_USERINFO', userInfo)
            setToken(account)
            commit('SET_TOKEN', account)
            commit('SET_AUTH', permission)
            resolve(res)
          } else {
            reject(err)
          }

        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const avatar = !res.avatarUrl ? require("@/assets/image/profile.jpg") : res.avatarUrl;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          let { realName, id, cityName, serviceJobName, serviceDepName } = res, userInfo = {
            name: realName,
            userId: id,
            jobName: serviceJobName,
            deptName: serviceDepName,
            cityName,
            avatar
          }
          commit('SET_USERINFO', userInfo)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          removeSUID()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }, clearSuid = true, all = false) {
      return new Promise(async resolve => {
        if (clearSuid && all) {
          let projects = ['uam-mgr', 'aist-message-web', 'crm-web', 'task-web', 'trans-web', 'trade-web', 'sign']
          for(let appName of projects){
            let iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.onload = function(){
              appIndex++
              console.log(appIndex, appName)
              if (appIndex >= projects.length) {
                console.log("finished logout!")
                commit('SET_TOKEN', '')
                removeToken()
                delCookie('suid')
                storage.clear()
                resolve()
              }
            };
            iframe.src = `${location.origin}/${appName}/logout`;
            document.body.appendChild(iframe);
          }
        } else {
          commit('SET_TOKEN', '')
          removeToken()
          clearSuid && delCookie('suid')
          storage.clear()
          resolve()
        }
      })
    }
  }
}

export default user
