import Vue from 'vue'
import App from './App.vue'
import { MdButton } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";

Vue.config.productionTip = false

Vue.use(MdButton)
Vue.use(RangeSlider)
// Vue.use(MdSelect)

const eventHub = new Vue() // Single event hub

Vue.mixin({
  data: function () {
    return {
      eventHub: eventHub
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')

