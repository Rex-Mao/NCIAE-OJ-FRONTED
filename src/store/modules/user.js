import types from '../types'
import api from '@oj/api'
import storage from '@/utils/storage'
import i18n from '@/i18n'
import { STORAGE_KEY, USER_TYPE, PROBLEM_PERMISSION } from '@/utils/constants'

const state = {
  profile: {},
  jwt: null
}

const getters = {
  user: state => state.profile.user || {},
  profile: state => state.profile,
  jwt: state => state.jwt || '',
  isAuthenticated: (state, getters) => {
    return !!getters.user.uid
  },
  isAdminRole: (state, getters) => {
    return getters.user.admin_type === USER_TYPE.ADMIN ||
      getters.user.admin_type === USER_TYPE.SUPER_ADMIN
  },
  isSuperAdmin: (state, getters) => {
    return getters.user.admin_type === USER_TYPE.SUPER_ADMIN
  },
  hasProblemPermission: (state, getters) => {
    return getters.user.problem_permission !== PROBLEM_PERMISSION.NONE
  },
  getUser: (state, getters) => {
    var data = {
      uid: getters.user.uid,
      nickname: getters.user.nickname
    }
    return data
  }
}

const mutations = {
  [types.CHANGE_PROFILE] (state, {profile}) {
    state.profile = profile
    if (profile.user !== undefined) {
      if (profile.user.language) {
        i18n.locale = profile.user.language || 'en-US'
      }
      storage.set(STORAGE_KEY.AUTHED, !!profile.user.nickname)
    } else {
      i18n.locale = 'en-US'
      storage.set(STORAGE_KEY.AUTHED, false)
    }
  },
  [types.CHANGE_JWT] (state, {jwt}) {
    state.jwt = jwt
    if (jwt === null) {
      if (storage.get('JWT') !== null || storage.get('JWT') !== undefined) {
        storage.remove('JWT')
      }
    }
    storage.set('JWT', jwt)
  }
}

const actions = {
  getProfile ({commit}) {
    api.getUserInfo().then(res => {
      commit(types.CHANGE_PROFILE, {
        profile: res.data.data || {}
      })
    })
  },
  clearProfile ({commit}) {
    commit(types.CHANGE_PROFILE, {
      profile: {
        user: {
          language: 'en-US'
        }
      }
    })
    storage.clear()
  },
  clearJwt ({commit}) {
    commit(types.CHANGE_JWT, {
      jwt: null
    })
    storage.clear()
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
