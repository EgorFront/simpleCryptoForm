import Vue from 'vue'
import Vuex from 'vuex'

import { processOperation } from './fakeServer.js'

Vue.use(Vuex)

const dealForm = {
  namespaced: true,
  state: () => ({
    currentKick: 500,
    currentEth: 1200,
  }),
  getters: {
    getCurrentKick: (state) => state.currentKick || 0,
    getCurrentEth: (state) => state.currentEth || 0,
  },
  mutations: {
    updateData: (state, { kick, eth }) => (
      (state.currentKick = kick), (state.currentEth = eth)
    ),
  },
  actions: {
    async makeOperation({ state, commit }, { price, amount, total, type }) {
      try {
        const payload = {
          price,
          amount,
          total,
          type,
        }

        const data = await processOperation(payload, state)
        commit('updateData', data)
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
  },
}

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    dealForm,
  },
})
