<template>
  <div id="header">
    <div class="logoBox" v-if="!isCollapse">文藻活動報名系統</div>
    <div class="logoBox logoBoxCollapse" v-else>
      <img style="width: 100%" src="../assets/img/Wenzao Ursuline Logo_color.png" alt="logo" />
    </div>
    <div class="breads">
      <i :class="{ activeBar: isCollapse }" @click="setCollapse" class="fas fa-bars"></i>

      <!-- breads -->
      <el-breadcrumb separator="/" class="breadItems">
        <el-breadcrumb-item class="breadLink" v-for="item in $route.matched" :key="item.path">
          <router-link :to="item.path" class="breadLink">{{
            item.meta.title
          }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- theme switch -->
    <el-switch @change="changeTheme" class="themeSwitch" v-model="themeMode"></el-switch>
    <router-link :to="{ path: '/Activity/NotComplete' }" style="display: flex; color: #fff" v-if="$store.state.ActivityFlow.length">
      <div class="HeaderBadge">
        <el-badge :value="$store.state.ActivityFlow.length" class="item">
          <div class="HeaderBadgeBox">未簽核</div>
        </el-badge>
      </div>
    </router-link>
    <!-- user -->
    <div class="userBox" v-if="userInfo">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link userinfo-inner userStyle">{{
          userInfo.LoginName + " (" + userInfo.RealName + ")"
        }}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logoutHandler">登出</el-dropdown-item>
          <el-dropdown-item>
            <a target="_blank" class="trainLink" href="https://enroll.wzu.edu.tw/WZActivityFront/#/">活動前台連結</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="cursor: pointer" @click="$router.push('/login')" class="userBox" v-else>
      登入
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isCollapse: false,
      themeMode: true,
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(window.localStorage.getItem("user"));
    },
  },
  created() {
    let router = this.$router.currentRoute;
    if (!this.$store.state.token) return 0;
    // this.$api.GetActivityFlow().then((res) => {
    //   this.$store.state.ActivityFlow = res.data.response;
    // });
  },
  methods: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("getCollapse", this.isCollapse);
    },
    logoutHandler() {
      const vm = this;
      vm.$confirm("即將登出", "提示", {
        type: "info",
        confirmButtonText: "確定",
      })
        .then(() => {
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("Token");
          window.localStorage.removeItem("TokenExpire");
          window.localStorage.removeItem("refreshtime");
          window.localStorage.removeItem("router");
          sessionStorage.removeItem("Tags");
          // this.$store.commit("SAVE_TAG_DATA", "");
          global.antRouter = [];
          vm.$router.push("/");
          window.location.reload();
        })
        .catch(() => {});
    },
    changeTheme() {
      // window.localStorage.setItem("Theme", theme);
      // console.log(theme);
      if (this.themeMode) {
        window.document.documentElement.setAttribute("data-theme", "theme1");
      } else {
        window.document.documentElement.setAttribute("data-theme", "theme2");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.trainLink {
  list-style: none;
  margin: 0;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  outline: 0;

  &:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
</style>