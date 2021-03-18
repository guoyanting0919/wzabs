<template>
  <div class="Floor">
    <div class="FloorInfo" :style="{'background-color':data.topBackgroundColor,'color':data.topColor}">
      <div class="FloorInfoBox">
        <div v-html="data.topText"></div>
      </div>
    </div>
    <div class="FloorComp" :style="{'background-color':data.bottomBackgroundColor,'color':data.bottomColor}">
      <div class="FloorCompBox">
        <div v-html="data.bottomText"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:["data"]
}
</script>

<style lang="scss" scoped>
.Floor {
  min-height: 150px;
  .FloorInfo {
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
  }
  .FloorComp {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  }
  .FloorCompBox {
    text-align: center;
  }
}
</style>
