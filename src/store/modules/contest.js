import moment from 'moment'
import types from '../types'
import api from '@oj/api'
import { CONTEST_STATUS, USER_TYPE, CONTEST_TYPE } from '@/utils/constants'

const state = {
  now: moment(),
  access: false,
  rankLimit: 30,
  forceUpdate: false,
  contest: {
    createUsername: '',
    cPublic: CONTEST_TYPE.PUBLIC
  },
  contestProblems: [],
  itemVisible: {
    menu: true,
    chart: true,
    realName: false
  }
}

const getters = {
  // contest 是否加载完成
  contestLoaded: (state) => {
    return !!state.contest.status
  },
  contestStatus: (state, getters) => {
    if (!getters.contestLoaded) return null
    let startTime = state.contest.startTime
    let endTime = state.contest.endTime
    let now = state.now

    if (startTime > now) {
      return CONTEST_STATUS.NOT_START
    } else if (endTime < now) {
      return CONTEST_STATUS.ENDED
    } else {
      return CONTEST_STATUS.UNDERWAY
    }
  },
  contestRuleType: (state) => {
    return 'ACM'
  },
  isContestAdmin: (state, getters, _, rootGetters) => {
    return rootGetters.isAuthenticated &&
      (state.contest.createUsername === rootGetters.user.nickname)
      // @TODO change this area when you rebuild the project
      // (state.contest.createUsername === rootGetters.user.nickname || rootGetters.user.admin_type === USER_TYPE.SUPER_ADMIN)
  },
  contestMenuDisabled: (state, getters) => {
    if (getters.isContestAdmin) return false
    if (state.contest.cPublic === CONTEST_TYPE.PUBLIC) {
      return getters.contestStatus === CONTEST_STATUS.NOT_START
    }
    return !state.access
  },
  OIContestRealTimePermission: (state, getters, _, rootGetters) => {
    if (getters.contestRuleType === 'ACM' || getters.contestStatus === CONTEST_STATUS.ENDED) {
      return true
    }
    return true || getters.isContestAdmin
  },
  problemSubmitDisabled: (state, getters, _, rootGetters) => {
    if (getters.contestStatus === CONTEST_STATUS.ENDED) {
      return true
    } else if (getters.contestStatus === CONTEST_STATUS.NOT_START) {
      return !getters.isContestAdmin
    }
    // @TODO remember reset the status
    // return false
    return !rootGetters.isAuthenticated
  },
  passwordFormVisible: (state, getters) => {
    return state.contest.cPublic !== CONTEST_TYPE.PUBLIC && !state.access && !getters.isContestAdmin
  },
  contestStartTime: (state) => {
    return moment(state.contest.startTime)
  },
  contestEndTime: (state) => {
    return moment(state.contest.endTime)
  },
  countdown: (state, getters) => {
    if (getters.contestStatus === CONTEST_STATUS.NOT_START) {
      let duration = moment.duration(getters.contestStartTime.diff(state.now, 'seconds'), 'seconds')
      // time is too long
      if (duration.weeks() > 0) {
        return 'Start At ' + duration.humanize()
      }
      let texts = [Math.floor(duration.asHours()), duration.minutes(), duration.seconds()]
      return '-' + texts.join(':')
    } else if (getters.contestStatus === CONTEST_STATUS.UNDERWAY) {
      let duration = moment.duration(getters.contestEndTime.diff(state.now, 'seconds'), 'seconds')
      let texts = [Math.floor(duration.asHours()), duration.minutes(), duration.seconds()]
      return '-' + texts.join(':')
    } else {
      return 'Ended'
    }
  }
}

const mutations = {
  [types.CHANGE_CONTEST] (state, payload) {
    state.contest = payload.contest
  },
  [types.CHANGE_CONTEST_ITEM_VISIBLE] (state, payload) {
    state.itemVisible = {...state.itemVisible, ...payload}
  },
  [types.CHANGE_RANK_FORCE_UPDATE] (state, payload) {
    state.forceUpdate = payload.value
  },
  [types.CHANGE_CONTEST_PROBLEMS] (state, payload) {
    state.contestProblems = payload.contestProblems
  },
  [types.CHANGE_CONTEST_RANK_LIMIT] (state, payload) {
    state.rankLimit = payload.rankLimit
  },
  [types.CONTEST_ACCESS] (state, payload) {
    state.access = payload.access
  },
  [types.CLEAR_CONTEST] (state) {
    state.contest = {created_by: {}}
    state.contestProblems = []
    state.access = false
    state.itemVisible = {
      menu: true,
      chart: true,
      realName: false
    }
    state.forceUpdate = false
  },
  [types.NOW] (state, payload) {
    state.now = payload.now
  },
  [types.NOW_ADD_1S] (state) {
    state.now = moment(state.now.add(1, 's'))
  }
}

const actions = {
  getContest ({commit, rootState, dispatch}) {
    return new Promise((resolve, reject) => {
      api.getContest(rootState.route.params.contestID).then((res) => {
        resolve(res)
        let contest = res.data.data
        commit(types.CHANGE_CONTEST, {contest: contest})
        commit(types.NOW, {now: moment(contest.now)})
        if (contest.cPublic === CONTEST_TYPE.PRIVATE) {
          dispatch('getContestAccess')
        }
      }, err => {
        reject(err)
      })
    })
  },
  getContestProblems ({commit, rootState}) {
    return new Promise((resolve, reject) => {
      api.getContestProblemList(rootState.route.params.contestID).then(res => {
        res.data.data.results.sort((a, b) => {
          if (a.displayId === b.displayId) {
            return 0
          } else if (a.displayId > b.displayId) {
            return 1
          }
          return -1
        })
        commit(types.CHANGE_CONTEST_PROBLEMS, {contestProblems: res.data.data.results})
        resolve(res)
      }, () => {
        commit(types.CHANGE_CONTEST_PROBLEMS, {contestProblems: []})
      })
    })
  },
  getContestAccess ({commit, rootState}) {
    return new Promise((resolve, reject) => {
      api.getContestAccess(rootState.route.params.contestID).then(res => {
        commit(types.CONTEST_ACCESS, {access: res.data.data.access})
        resolve(res)
      }).catch()
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
