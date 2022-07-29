
const SET_CART_COUNT = 'SET_CART_COUNT'

const state = {
  nCount: 0
}

const mutations = {
  [SET_CART_COUNT] (state, count) {
    state.nCount = count || 0
  }
}

const actions = {
  getCartCount ({ commit }) {
    return new Promise(function (resolve, reject) {
      window.yhsd.sdk.cart.get(oRes => {
        oRes = oRes.res || {}

        if (oRes.code === 200) {
          commit(SET_CART_COUNT, (oRes.cart || {}).item_count || 0)

          resolve(oRes)
        } else {
          commit(SET_CART_COUNT, 0)

          reject(new Error('购物车数据获取异常'))
        }
      })
    })
  },
  setCartCount ({ commit }, count) {
    commit(SET_CART_COUNT, count)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
