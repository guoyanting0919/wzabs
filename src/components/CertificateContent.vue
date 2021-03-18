<template>
  <div id="CertificateContent">
    <el-dialog :close-on-click-modal="false" title="編輯底稿" :visible.sync="showForm" width="1000px">
      <el-form ref="form" label-width="150px" :model="form">
        <div style="display:flex;justify-content: center;padding:0 0 20px 0;">
          <el-button type="primary" @click="showRowList=!showRowList">常用插入欄位</el-button>
        </div>
        <div class="CertificateContentText" v-if="showRowList">
          <div class="CertificateContentTextItem">{{form.CertType=='郵件' ? '%cust' : '%cmname'}} = 使用者姓名</div>
          <div class="CertificateContentTextItem">%name = 活動名稱</div>
          <div class="CertificateContentTextItem">%unit = 主辦單位</div>
          <div class="CertificateContentTextItem">%actcg = 種類</div>
          <div class="CertificateContentTextItem">%acttype = 活動型態</div>
          <div class="CertificateContentTextItem">%area = 活動地點</div>
          <div class="CertificateContentTextItem">%begin = 開始日期</div>
          <div class="CertificateContentTextItem">%end = 結束日期</div>
          <div class="CertificateContentTextItem">%hours = 時數</div>
          <div class="CertificateContentTextItem">%regNo = 證書字號</div>
        </div>
        <el-form-item label="底稿名稱" prop="CertName">
          <el-input v-model="form.CertName"></el-input>
        </el-form-item>
        <el-form-item label="底稿主旨" prop="CertTitle">
          <el-input v-model="form.CertTitle"></el-input>
        </el-form-item>
        <el-form-item label="底稿內容" prop="CertContents">
          <!--<Ck v-model="form.CertContents"></Ck>-->
          <ckeditor v-model="form.CertContents"></ckeditor>
        </el-form-item>
        <el-form-item label="備註" prop="Remark">
          <el-input v-model="form.Remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="formButtonList">
        <el-button type="primary" @click="sub()">儲存</el-button>
        <el-button type="primary" @click="preveiw()" v-if="!CertificatePreviewShow&&form.CertType!='郵件'">預覽</el-button>
        <el-button type="danger" @click="CertificatePreviewShow=false" v-if="CertificatePreviewShow&&form.CertType!='郵件'">關閉預覽</el-button>
      </div>
      <CertificatePreview :user="userData" :act="actData" :img="CertificateTemp.CertBackImg" :text="form.CertContents" ref="Preview" v-if="CertificatePreviewShow"></CertificatePreview>
    </el-dialog>

    <el-table header-cell-class-name="tableHeader" :data="data" style="width: 100%">
      <el-table-column label="底稿名稱" prop="CertName"></el-table-column>
      <el-table-column label="底稿類型" prop="CertType"></el-table-column>
      <el-table-column label="底稿主旨" prop="CertTitle"></el-table-column>
      <el-table-column label="操作" prop="ActName">
        <template slot-scope="scope">
          <div class="iconList">
            <el-tooltip class="item" effect="dark" content="編輯" placement="top" :open-delay="500">
              <div class="iconListD" @click="editCer(scope.row)">
                <i class="myicon-edit"></i>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Ck from "@/components/Ck";
import CertificatePreview from "@/components/CertificatePreview.vue";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  components: { Ck, CertificatePreview },
  data() {
    return {
      showRowList: false,
      showForm: false,
      form: {},
      CertificateTemp: "",
      CertificatePreviewShow: false,
      userData: {
        Id: 1,
        Sex: "男",
        Source: "School",
        UID: "A123456789",
        UnitCode: "測試單位",
        UnitName: "測試單位",
        UserAccount: "Test1234",
        UserEmail: "Test1234@test.com",
        UserName: "測試",
        UserSchool: "測試學校",
        UserTitle: "測試職稱",
        regNo: "測試字號00001",
      },
    };
  },
  watch: {
    showForm(newVal) {
      this.CertificatePreviewShow = false;
    },
  },
  methods: {
    editCer(x) {
      this.showForm = true;
      this.form = JSON.parse(JSON.stringify(x));
    },
    async sub() {
      this.$store.dispatch("loadingHandler", true);
      let flag = await this.$api
        .PutCertificateContentByActivityId(this.form)
        .then((res) => res.data);
      this.$alertM.fire({
        icon: flag.success ? "success" : "error",
        title: flag.msg,
      });
      this.$emit("reGetCertificateContent", {
        ActivityId: this.form.ActivityId,
      });
      this.$store.dispatch("loadingHandler", false);
      this.showForm = false;
    },
    async preveiw() {
      this.$store.dispatch("loadingHandler", true);
      this.actData = await this.$api
        .GetActivityById({ Id: this.form.ActivityId })
        .then((res) => res.data.response);
      if (!this.actData.CertificateId) {
        this.$alertM.fire({
          icon: "error",
          title: "該活動沒設置證書底圖",
        });
        this.$store.dispatch("loadingHandler", false);
        return 0;
      }
      this.CertificateTemp = await this.$api
        .GetCertificateContentById({ id: this.actData.CertificateId })
        .then((res) => res.data.response);
      this.CertificatePreviewShow = true;
      this.$store.dispatch("loadingHandler", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.CertificateContentText {
  display: flex;
  padding: 0 0 20px 0;
}
.CertificateContentTextItem {
  width: 400px;
  margin: 0 20px 0 0;
}
</style>