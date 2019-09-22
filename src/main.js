import Vue from 'vue'
import App from './App.vue'
import { Button, Select, Row, Col, Input, Container, Form, FormItem, Card } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
 


Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Container)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Card)

Vue.use(VueAxios, axios)

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
