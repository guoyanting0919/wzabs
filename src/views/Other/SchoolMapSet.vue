<template>
  <div id="carousel">
    <Ck v-model="data.Contents" :width="'100%'"></Ck>
    <div class="formButtonList">
      <el-button type="primary" @click="sub()">儲存</el-button>
    </div>
  </div>
</template>

<script>
import Ck from "@/components/Ck";

export default {
  data() {
    return {
      data:{}
    }
  },
  components:{Ck},
  async created() {
    this.$store.dispatch("loadingHandler", true);
    await this.getData()
    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    async getData() {
      this.data=await this.$api.GetSchoolContentById({Id:1}).then(res=>res.data.response)
    },
    async sub() {
      this.$store.dispatch("loadingHandler", true);
      await this.$api.PutSchoolContent(this.data).then(res=>{
        if(res.data.success) {
          this.$alertM.fire({
            icon: res.data.success ? "success" : "error",
            title: res.data.msg,
          });  
        }
      })
      await this.getData()
      this.$store.dispatch("loadingHandler", false);
    }
  }
};
</script>