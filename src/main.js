import "babel-polyfill"
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./api/apis";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/zh-TW";
import { extend, ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import { configure } from "vee-validate";
import VueSweetalert2 from "vue-sweetalert2";
//import CKEditor from "@ckeditor/ckeditor5-vue";
import CKEditor from 'ckeditor4-vue';

import "./icon/css/Glyphter.css"
import "element-ui/lib/theme-chalk/index.css";
import "sweetalert2/dist/sweetalert2.min.css";

configure({
  classes: {
    valid: "valid",
    invalid: "invalid",
  },
});
extend("required", {
  ...required,
  message: "{_field_}",
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.use(VueAxios, axios);

Vue.use(ElementUI, { locale });
Vue.use(VueSweetalert2);
Vue.use(CKEditor);

const alertT = Vue.prototype.$swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Vue.prototype.$swal.stopTimer);
    toast.addEventListener("mouseleave", Vue.prototype.$swal.resumeTimer);
  },
});

const alertM = Vue.prototype.$swal.mixin({
  toast: false,
  position: "center",
  showConfirmButton: true,
  showCloseButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Vue.prototype.$swal.stopTimer);
    toast.addEventListener("mouseleave", Vue.prototype.$swal.resumeTimer);
  },
});

// console.log(alert);

// all(建議放套件Css下層)
import "../src/assets/all.scss";

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$alertT = alertT;
Vue.prototype.$alertM = alertM;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
