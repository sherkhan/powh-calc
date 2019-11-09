import Vue from 'vue'
import App from './App.vue'
import { Button,
  Select, 
  Row,
  Col,
  Input,
  InputNumber,
  Container,
  Form, 
  FormItem, 
  Card,
  Table,
TableColumn} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
 


Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Container)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)

Vue.use(VueAxios, axios)

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
