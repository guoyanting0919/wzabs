import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    tokenExpire: "",
    tagsStoreList: [],
    ActivityFlow: [],
    isLoading: false,
    // fileBase: "https://enroll.wzu.edu.tw/",
    // apiBase: "https://enroll.wzu.edu.tw/api/",
    // OutputSignExcelBase: "https://enroll.wzu.edu.tw/",
    // ActivityFrontDetail:
    //   "https://enroll.wzu.edu.tw/WZActivityFront/#/Activity/Detail?Id=",
    fileBase: process.env.VUE_APP_FILESURL,
    apiBase: process.env.VUE_APP_OIDC_BASEURL,
    OutputSignExcelBase: process.env.VUE_APP_FILESURL,
    ActivityFrontDetail:
      process.env.VUE_APP_FILESURL + "/WZActivityFront/#/Activity/Detail?Id=",

    actCategory: [
      { Id: 1, title: "無" },
      { Id: 2, title: "公開徵稿" },
      { Id: 3, title: "其他形式" },
    ],
    actType: [
      {
        Id: 1,
        title: "學術研討會",
        item: [
          { Id: 2, title: "公開徵稿" },
          { Id: 3, title: "其他形式" },
        ],
      },
      { Id: 2, title: "作品發表會（含展覽）", item: [] },
      { Id: 3, title: "研習", item: [] },
      { Id: 4, title: "其他", item: [] },
    ],
    JoinType: ["主持人(單位主管或計畫主持人)", "主講人", "參與人員"],
    EventStatus: ["已報名", "參加", "主辦", "取消"], //"候補"  "缺席",
    CompleteState: ["待審核", "通過", "退回補充"],
    Country: [
      "大陸地區",
      "大韓民國(南韓)",
      "中華民國",
      "日本",
      "以色列",
      "西班牙王國",
      "法國",
      "美國",
      "英國",
      "香港",
      "泰王國(泰國)",
      "馬來西亞",
      "捷克共和國",
      "菲律賓共和國",
      "越南社會主義共和國",
      "奧地利共和國",
      "愛爾蘭共和國",
      "新加坡共和國",
      "德意志聯邦共和國",
    ],
    activeListPage: "",
  },
  actions: {
    //loading
    loadingHandler(context, payload) {
      context.commit("LOADING", payload);
    },
    ActivityFlow(context, payload) {
      context.commit("ActivityFlow", payload);
    },
    SaveActiveListPage(context, payload) {
      context.commit("SETACTIVELISTPAGE", payload);
    },
  },
  mutations: {
    LOADING(state, payload) {
      state.isLoading = payload;
    },
    SAVE_TOKEN(state, data) {
      state.token = data;
      window.localStorage.setItem("Token", data);
    },
    SAVE_TOKEN_EXPIRE(state, data) {
      state.tokenExpire = data;
      window.localStorage.setItem("TokenExpire", data);
    },
    SAVE_TAG_DATA(state, data) {
      state.tagsStoreList = data;
      sessionStorage.setItem("Tags", data);
    },
    ActivityFlow(state, data) {
      state.ActivityFlow = data;
    },
    SETACTIVELISTPAGE(state, data) {
      state.activeListPage = data;
    },
    // GET_BUTTON_LIST(state,{routePath, routers}){

    // }
  },

  modules: {},
});
