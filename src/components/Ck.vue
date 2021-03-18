<template>
  <div id="ckComp" :style="{'width':width}">
    <ckeditor :value="value" @input="updata"></ckeditor>
  </div>
</template>

<script>
export default {
  name: "Ck",
  props: ["value", "width"],
  data() {
    return {
      ckContent: "",
    };
  },
  methods: {
    updata(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style lang='scss'>
#ckComp {
  width: 100%;
  margin: 0 0 10px 0;
  .ck.ck-editor {
    width: 100% !important;
  }
}
</style>