<template>
  <div class="Top" :style="{'background-image':'url('+data.backgroundImage+')','background-color':data.backgroundColor}">
    <div class="TopBox">
      <i class="el-icon-s-unfold TopBoxIcon" @click="$emit('getMenuSet',true)"></i>
        <img class="TopBoxLogo" :src="data.logo" />
        <i class="el-icon-user-solid TopBoxIcon"></i>
      <div class="TopBoxMenu">
        <div class="TopBoxMenuItem" :style="{'color':data.color}">行事曆</div>
        <div class="TopBoxMenuItem" :style="{'color':data.color}">活動/會議列表</div>
        <div class="TopBoxMenuItem" :style="{'color':data.color}">登入</div>
        <div class="TopBoxMenuItem" :style="{'color':data.color}">登出</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:["data"]
};
</script>

<style lang="scss" scoped>
.Top {
  height: 80px;
  background-color: #ff0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  .TopBox {
    display: flex;
    width: 1400px;
    height: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .TopBoxLogo {
    cursor: pointer;
  }
  .TopBoxMenu {
    display: flex;
    align-items: center;
  }
  .TopBoxMenuItem {
    margin: 0 20px 0 0;
    color: #fff;
    cursor: pointer;
    &:hover {
      border-width: 0 0 1px 0;
      border-color: #fff;
      border-style: solid;
    }
  }
  .TopBoxIcon {
    display: none;
    color: #fff;
    font-size: 40px;
  }
}
</style>