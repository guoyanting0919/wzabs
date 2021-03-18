<template>
  <div id="carousel">
    <HeaderModel></HeaderModel>
    <FloorModel></FloorModel>
  </div>
</template>

<script>
import HeaderModel from "@/components/editModel/HeaderModel.vue"
import FloorModel from "@/components/editModel/FloorModel.vue"
export default {
  components:{HeaderModel,FloorModel}
};
</script>