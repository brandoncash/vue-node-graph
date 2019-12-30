import Vue from 'vue';
import VueDragscroll from 'vue-dragscroll';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueDragscroll);

new Vue({
  render: h => h(App),
}).$mount('#app');
