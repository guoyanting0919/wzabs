<template>
  <div class="editModel">
    <div class="editModelTitle">
      <h2 class="editModelTitleH2">頁首設定</h2>
      <el-button type="primary" @click="sub">儲存頁首</el-button>
    </div>
    <el-form label-width="100px">
      <div style="display: flex">
        <el-form-item label="Logo圖片">
          <el-upload
            :show-file-list="false"
            :action="$store.state.apiBase + 'Img'"
            :headers="{ authorization: 'Bearer ' + $store.state.token }"
            :on-success="successUpdataLogo"
          >
            <el-button size="small" type="primary">選擇檔案</el-button>
          </el-upload>
          <a :href="dataObj.logo">{{ dataObj.logo }}</a>
        </el-form-item>
        <!--<el-form-item label="頁首背景圖片">
          <el-upload
            :show-file-list="false"
            :action="$store.state.apiBase+'Img'"
            :headers="{'authorization':'Bearer '+$store.state.token}"
            :on-success="successUpdataBackgroundImage"
          >
            <el-button size="small" type="primary">選擇檔案</el-button>
          </el-upload>       
        </el-form-item>-->
        <el-form-item label="頁首背景顏色">
          <el-color-picker v-model="dataObj.backgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="頁首文字顏色">
          <el-color-picker v-model="dataObj.color"></el-color-picker>
        </el-form-item>
      </div>
    </el-form>
    <Top :data="dataObj"></Top>
  </div>
</template>

<script>
import moment from "moment";
import Top from "@/components/editModel/Top";
export default {
  components: { Top },
  data() {
    return {
      formData: {},
      dataObj: {
        logo: "",
        backgroundImage: "",
        backgroundColor: "#fff",
        color: "#000",
      },
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      await this.$api.GetMasterSetById({ Id: 1 }).then((res) => {
        this.formData = res.data.response;
        this.dataObj = JSON.parse(this.formData.Contents);
      });
    },
    async sub() {
      this.formData.Contents = JSON.stringify(this.dataObj);
      await this.$api.PutMasterSet(this.formData).then((res) => {
        if (res.data.success) {
          this.$alertM.fire({
            icon: res.data.success ? "success" : "error",
            title: res.data.msg,
          });
        }
      });
      await this.getData();
    },
    successUpdataLogo(res, file) {
      if (res.success) {
        console.log(res);
        this.dataObj.logo =
          this.$store.state.fileBase + "files/" + res.response;
        console.log(this.dataObj.logo);
      }
    },
    successUpdataBackgroundImage(res, file) {
      if (res.success) {
        this.dataObj.backgroundImage =
          this.$store.state.fileBase + res.response;
        console.log(this.dataObj.backgroundImage);
      }
    },
  },
};
</script>