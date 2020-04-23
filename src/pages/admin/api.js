import Vue from 'vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import utils from '@/utils/utils'
import storage from '@/utils/storage'

Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'

export default {
  // 登录
  login (username, password) {
    return ajax('/user-center/token/login', 'post', {
      data: {
        username,
        password
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  logout () {
    return ajax('logout', 'get')
  },
  getProfile () {
    return ajax('/user-center/profile', 'get')
  },
  // 获取公告列表
  getAnnouncementList (offset, limit) {
    return ajax('/content-center/admin/announcement', 'get', {
      params: {
        paging: true,
        offset,
        limit
      }
    })
  },
  // 删除公告
  deleteAnnouncement (id) {
    var url = 'content-center/admin/announcement/' + String(id)
    return ajax(url, 'delete')
  },
  // 修改公告
  updateAnnouncement (data) {
    return ajax('content-center/admin/announcement', 'put', {
      data
    })
  },
  // 添加公告
  createAnnouncement (data) {
    return ajax('content-center/admin/announcement', 'post', {
      data
    })
  },
  // 获取用户列表
  getUserList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('user-center/admin/users', 'get', {
      params: params
    })
  },
  // 获取单个用户信息
  getUser (uid) {
    var url = 'user-center/admin/user/' + String(uid)
    return ajax(url, 'get')
  },
  getRoles () {
    var url = 'user-center/admin/role'
    return ajax(url, 'get')
  },
  // 编辑用户
  editUser (data) {
    return ajax('user-center/admin/user', 'put', {
      data
    })
  },
  editUserRoles (uid, data) {
    var url = 'user-center/super/admin/userrole/' + String(uid)
    return ajax(url, 'put', {
      data
    })
  },
  deleteUsers (data) {
    return ajax('user-center/super/admin/userrole', 'delete', {
      data
    })
  },
  importUsers (users) {
    return ajax('user-center/admin/user', 'post', {
      data: {
        users
      }
    })
  },
  generateUser (data) {
    return ajax('user-center/admin/generate_user', 'post', {
      data
    })
  },
  getLanguages () {
    return ajax('content-center/public/languages', 'get')
  },
  getWebsiteConfig () {
    return ajax('content-center/public/website', 'get')
  },
  editWebsiteConfig (data) {
    return ajax('admin/website', 'post', {
      data
    })
  },
  getJudgeServer () {
    return ajax('admin/judge_server', 'get')
  },
  deleteJudgeServer (hostname) {
    return ajax('admin/judge_server', 'delete', {
      params: {
        hostname: hostname
      }
    })
  },
  updateJudgeServer (data) {
    return ajax('admin/judge_server', 'put', {
      data
    })
  },
  getInvalidTestCaseList () {
    return ajax('admin/prune_test_case', 'get')
  },
  pruneTestCase (id) {
    return ajax('admin/prune_test_case', 'delete', {
      params: {
        id
      }
    })
  },
  createContest (data) {
    return ajax('admin/contest', 'post', {
      data
    })
  },
  getContest (id) {
    return ajax('admin/contest', 'get', {
      params: {
        id
      }
    })
  },
  editContest (data) {
    return ajax('admin/contest', 'put', {
      data
    })
  },
  getContestList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('admin/contest', 'get', {
      params: params
    })
  },
  getContestAnnouncementList (contestID) {
    return ajax('admin/contest/announcement', 'get', {
      params: {
        contest_id: contestID
      }
    })
  },
  createContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'post', {
      data
    })
  },
  deleteContestAnnouncement (id) {
    return ajax('admin/contest/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  updateContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'put', {
      data
    })
  },
  getProblemTagList () {
    return ajax('content-center/problem/tags', 'get')
  },
  compileSPJ (data) {
    return ajax('content-center/admin/compile_spj', 'post', {
      data
    })
  },
  createProblem (data) {
    return ajax('content-center/admin/problem', 'post', {
      data
    })
  },
  editProblem (data) {
    return ajax('content-center/admin/problem', 'put', {
      data
    })
  },
  deleteProblem (pid) {
    return ajax('content-center/admin/problem', 'delete', {
      params: {
        pid
      }
    })
  },
  getProblem (problemID) {
    var url = 'content-center/admin/problem/' + String(problemID)
    return ajax(url, 'get')
  },
  getProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('content-center/admin/problems', 'get', {
      params
    })
  },
  getContestProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('content-center/admin/contest/problems', 'get', {
      params
    })
  },
  getContestProblem (id) {
    return ajax('content-center/admin/contest/problem', 'get', {
      params: {
        id
      }
    })
  },
  createContestProblem (data) {
    return ajax('admin/contest/problem', 'post', {
      data
    })
  },
  editContestProblem (data) {
    return ajax('admin/contest/problem', 'put', {
      data
    })
  },
  deleteContestProblem (id) {
    return ajax('admin/contest/problem', 'delete', {
      params: {
        id
      }
    })
  },
  makeContestProblemPublic (data) {
    return ajax('admin/contest_problem/make_public', 'post', {
      data
    })
  },
  addProblemFromPublic (data) {
    return ajax('admin/contest/add_problem_from_public', 'post', {
      data
    })
  },
  exportSelectedProblems (data) {
    return ajax('/admin/export/problems', 'post', {
      data
    })
  },
  getReleaseNotes () {
    return ajax('admin/versions', 'get')
  },
  getDashboardInfo () {
    return ajax('admin/dashboard_info', 'get')
  }
}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax (url, method, options) {
  if (options !== undefined) {
    var {params = {}, data = {}, headers = {}} = options
  } else {
    params = data = headers = {}
  }
  // data = qs.stringify(data)
  // var headers = {
  //   Authorization: 'Bearer ' + jwt
  // }
  let jwt = storage.get('JWT')
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
  if (headers['Content-Type'] !== undefined) {
    axios.defaults.headers['Content-Type'] = headers['Content-Type']
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      data = qs.stringify(data)
    }
  } else {
    axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      if (res.data.error !== null) {
        Vue.prototype.$error(res.data.data)
        reject(res)
        if (res.data.error.startsWith('40')) {
          router.push({name: 'login'})
        }
        if (res.data.data.startsWith('Please login')) {
          router.push({name: 'login'})
        }
      } else {
        resolve(res)
        if (method !== 'get') {
          Vue.prototype.$success('Succeeded')
        }
      }
    }, res => {
      // API请求异常，一般为Server error 或 network error
      reject(res)
      Vue.prototype.$error(res.data.data)
    })
  })
}
