import Vue from 'vue'
import store from '@/store'
import axios from 'axios'
import qs from 'qs'
import storage from '@/utils/storage'

Vue.prototype.$http = axios
Vue.prototype.$qs = qs
axios.defaults.baseURL = '/api'
// axios.defaults.xsrfHeaderName = 'Authorization'
// axios.defaults.xsrfCookieName = 'csrftoken'

export default {
  getWebsiteConf (params) {
    return ajax('content-center/public/website', 'get', {
      params
    })
  },
  getAnnouncementList (offset, limit) {
    let params = {
      offset: offset,
      limit: limit
    }
    return ajax('content-center/public/announcement', 'get', {
      params
    })
  },
  login (data) {
    return ajax('user-center/token/login', 'post', {
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  checkUsernameOrEmail (username, email) {
    return ajax('user-center/public/check_username_or_email', 'post', {
      data: {
        nickname: username,
        email: email
      }
    })
  },
  // 注册
  register (data) {
    return ajax('user-center/public/register', 'post', {
      data
    })
  },
  logout () {
    // return ajax('logout', 'get')
  },
  getCaptcha () {
    return ajax('captcha', 'get')
  },
  getUserInfo () {
    return ajax('user-center/profile', 'get')
  },
  updateProfile (profile) {
    return ajax('user-center/profile', 'put', {
      data: profile,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  freshDisplayID (userID) {
    return ajax('profile/fresh_display_id', 'get', {
      params: {
        user_id: userID
      }
    })
  },
  twoFactorAuth (method, data) {
    return ajax('two_factor_auth', method, {
      data
    })
  },
  tfaRequiredCheck (username) {
    return ajax('tfa_required', 'post', {
      data: {
        username
      }
    })
  },
  applyResetPassword (data) {
    return ajax('apply_reset_password', 'post', {
      data
    })
  },
  resetPassword (data) {
    return ajax('reset_password', 'post', {
      data
    })
  },
  changePassword (data) {
    return ajax('user-center/profile/password', 'put', {
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  changeEmail (data) {
    return ajax('user-center/profile/email', 'put', {
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  getLanguages () {
    return ajax('content-center/public/languages', 'get')
  },
  getProblemTagList () {
    return ajax('content-center/public/tags', 'get')
  },
  getProblemList (offset, limit, searchParams) {
    let params = {
      paging: true,
      offset,
      limit
    }
    Object.keys(searchParams).forEach((element) => {
      if (searchParams[element]) {
        params[element] = searchParams[element]
      }
    })
    return ajax('content-center/public/problems', 'get', {
      params: params
    })
  },
  pickone () {
    return ajax('pickone', 'get')
  },
  getProblem (problemID) {
    var url = 'content-center/public/problem/' + String(problemID)
    return ajax(url, 'get')
  },
  getContestList (offset, limit, searchParams) {
    let params = {
      offset,
      limit
    }
    if (searchParams !== undefined) {
      Object.keys(searchParams).forEach((element) => {
        if (searchParams[element]) {
          params[element] = searchParams[element]
        }
      })
    }
    return ajax('content-center/public/contests', 'get', {
      params
    })
  },
  getContest (cid) {
    var url = 'content-center/contest/' + String(cid)
    return ajax(url, 'get')
  },
  getContestAccess (cid) {
    var url = 'content-center/contest/access/' + String(cid)
    return ajax(url, 'get')
  },
  checkContestPassword (contestID, password) {
    return ajax('contest/password', 'post', {
      data: {
        cid: contestID,
        password
      }
    })
  },
  getContestAnnouncementList (contestId) {
    var url = 'content-center/contest/announcement/' + String(contestId)
    return ajax(url, 'get')
  },
  getContestProblemList (contestId) {
    var url = 'content-center/contest/problems/' + String(contestId)
    return ajax(url, 'get')
  },
  getContestProblem (contestProblemID) {
    var url = 'content-center/contest/problem/' + String(contestProblemID)
    return ajax(url, 'get')
  },
  submitCode (data) {
    return ajax('content-center/submission', 'post', {
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  getSubmissionList (offset, limit, params) {
    params.limit = limit
    params.offset = offset
    return ajax('content-center/public/submissions', 'get', {
      params
    })
  },
  getContestSubmissionList (offset, limit, params) {
    params.limit = limit
    params.offset = offset
    let contestId = params['contest_id']
    var url = 'content-center/public/contest_submissions/' + String(contestId)
    delete params['contest_id']
    return ajax(url, 'get', {
      params
    })
  },
  getSubmission (submissionId) {
    return ajax('content-center/submission', 'get', {
      params: {
        submissionId
      }
    })
  },
  submissionExists (problemID) {
    return ajax('content-center/submission_exists', 'get', {
      params: {
        problem_id: problemID
      }
    })
  },
  submissionRejudge (id) {
    return ajax('admin/submission/rejudge', 'get', {
      params: {
        id
      }
    })
  },
  updateSubmission (data) {
    return ajax('content-center/submission', 'put', {
      data
    })
  },
  getSolvedProblems () {
    return ajax('content-center/problem/solved', 'get')
  },
  getUserRank (offset, limit, rule = 'acm') {
    let params = {
      offset,
      limit,
      rule
    }
    return ajax('user_rank', 'get', {
      params
    })
  },
  getContestRank (params) {
    return ajax('contest_rank', 'get', {
      params
    })
  },
  getACMACInfo (params) {
    return ajax('admin/contest/acm_helper', 'get', {
      params
    })
  },
  updateACInfoCheckedStatus (data) {
    return ajax('admin/contest/acm_helper', 'put', {
      data
    })
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
        if (res.data.data !== undefined || res.data.data !== null) {
          Vue.prototype.$error(res.data.data)
        }
        reject(res)
        if (res.data.data.startsWith('Please login again')) {
          store.dispatch('changeModalStatus', {'mode': 'login', 'visible': true})
        }
      } else {
        resolve(res)
      }
    }, res => {
      console.log(res)
      // API请求异常，一般为Server error 或 network error
      reject(res)
    })
  })
}
