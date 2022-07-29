
const CLEAR_SELECT_ADDRESS = 'CLEAR_SELECT_ADDRESS'
const SET_SELECT_ADDRESS = 'SET_SELECT_ADDRESS'

const state = {
  oSelected: {}
}

const mutations = {
  [CLEAR_SELECT_ADDRESS] (state) {
    state.oSelected = {}
  },
  [SET_SELECT_ADDRESS] (state, address) {
    state.oSelected = JSON.parse(JSON.stringify(address || {}))
  }
}

const actions = {
  clearSelectAddress ({ commit }) {
    commit(CLEAR_SELECT_ADDRESS)
  },
  setSelectAddress ({ commit }, address) {
    commit(SET_SELECT_ADDRESS, address)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
