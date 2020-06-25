import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    regiao: "NITEROI",
  },
  mutations: {
    select (state, regiaoNova) {
      state.regiao = regiaoNova
    }
  }
})
