
const CLEAR_ACCOUNT = 'CLEAR_ACCOUNT'
const SET_ACCOUNT_INFO = 'SET_ACCOUNT_INFO'

const state = {
  isChecked: false,
  isSigned: false,
  oInfo: {}
}

const mutations = {
  [CLEAR_ACCOUNT] (state) {
    state.isChecked = false
    state.isSigned = false
    state.oInfo = {}
  },
  [SET_ACCOUNT_INFO] (state, oInfo) {
    state.oInfo = JSON.parse(JSON.stringify(oInfo || {})) // 深拷贝

    state.isChecked = true
    state.isSigned = !!(state.oInfo.id)
  }
}

const actions = {
  clearAccount ({ commit }) {
    commit(CLEAR_ACCOUNT)
  },
  getAccountInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      window.yhsd.sdk.account.current(oRes => {
        oRes = oRes.res || {}

        if (oRes.code === 200 && (oRes.customer || {}).id > 0) {
          commit(SET_ACCOUNT_INFO, oRes.customer)

          resolve(oRes)
        } else {
          commit(SET_ACCOUNT_INFO, {})

          reject(new Error('状态异常'))
        }
      })
    })
  },
  setAccountInfo ({ commit }, oInfo) {
    commit(SET_ACCOUNT_INFO, oInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
