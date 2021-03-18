<template>
  <div class="editModel">
    <div class="editModelTitle">
      <h2 class="editModelTitleH2">頁尾設定</h2>
      <el-button type="primary" @click="sub">儲存頁尾</el-button>
    </div>
    <el-form label-width="100px">
        <el-form-item label="上方文字">
          <Ck v-model="dataObj.topText" :width="'100%'"></Ck>
        </el-form-item>
      <div style="display:flex;">
        <el-form-item label="上方背景顏色">
          <el-color-picker v-model="dataObj.topBackgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="上方文字顏色">
          <el-color-picker v-model="dataObj.topColor"></el-color-picker>
        </el-form-item>
      </div>
        <el-form-item label="下方文字">
          <Ck v-model="dataObj.bottomText" :width="'100%'"></Ck>
        </el-form-item>
     <div style="display:flex;">
        <el-form-item label="下方背景顏色">
          <el-color-picker v-model="dataObj.bottomBackgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="下方文字顏色">
          <el-color-picker v-model="dataObj.bottomColor"></el-color-picker>
        </el-form-item>
      </div>
    </el-form>
    <Floor :data="dataObj"></Floor>
  </div>
</template>

<script>
import Floor from "@/components/editModel/Floor"
import Ck from "@/components/Ck";

export default {
  components:{Floor,Ck},
  data() {
    return {
      formData:{},
      dataObj:{
        topText:"測試文字",
        topBackgroundColor:"#222",
        topColor:"#fff",
        bottomText:"測試文字",
        bottomBackgroundColor:"#888",
        bottomColor:"#fff",
      }
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    async getData() {
      await this.$api.GetMasterSetById({Id:2}).then(res=>{
        this.formData=res.data.response
        this.dataObj=JSON.parse(this.formData.Contents)
      })
    },
    async sub() {
      this.formData.Contents=JSON.stringify(this.dataObj)
      await this.$api.PutMasterSet(this.formData).then(res=>{
        if(res.data.success) {
          this.$alertM.fire({
            icon: res.data.success ? "success" : "error",
            title: res.data.msg,
          });  
        }
      })
      await this.getData()
    },
  }

}
</script>