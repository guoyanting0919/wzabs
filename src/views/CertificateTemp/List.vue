<template>
  <div id="certificateList">
    <!-- headerBox -->
    <div class="fw featureBox">
      <HeaderBox @searchHandler="searchHandler" @handleAddOrEdit="handleAddOrEdit" :buttonList="buttonList" :searchLoading="searchLoading"></HeaderBox>
      <el-button class="ml-10" type="primary">
        <a href="./download/證書底圖範本.pptx" download="證書底圖範本.pptx">證書範本</a>
      </el-button>
    </div>

    <!-- mainBox -->
    <div class="mainTable">
      <div class="tableContainer mt-5" v-if="certificateData">
        <el-table header-cell-class-name="tableHeader" :data="certificateData" empty-text="暫無資料" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="CertName" label="證書模組名稱" sortable></el-table-column>
          <el-table-column label="單位" sortable>
            <template slot-scope="scope">
              <div v-if="
                  filterId(scope.row.UnitCode) &&
                  filterId(scope.row.UnitCode).UntNameFull
                ">
                {{ filterId(scope.row.UnitCode).UntNameFull }}
              </div>
            </template>
          </el-table-column>

          <el-table-column width="250" prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button class="outline" size="mini" @click="toPreveiw(scope.row)">預覽</el-button>
              <el-button class="outline" size="mini" v-if="hasBtn('btnEdit')" @click="handleAddOrEdit('edit', scope.row)">編輯</el-button>
              <el-button v-if="hasBtn('btnDelete')" type="danger" class="outline" size="mini" @click="deleteHandler(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- pagination -->
    <Page :now="currentPage" :count="list.pageCount" :rightPage="5" :leftPage="5" @changePage="getCertificate"></Page>

    <!-- addOrEditDialog -->
    <el-dialog :close-on-click-modal="false" custom-class="addOrEditDialog" :title="addOrEdit" :visible.sync="addOrEditDialog">
      <ValidationObserver ref="obs">
        <div class="inputBox">
          <p class="inputTitle">證書模組名稱</p>
          <ValidationProvider name="請輸入證書模組名稱!!" rules="required" v-slot="{ errors, classes }">
            <el-input :class="classes" style="width: 300px" v-model="listNameInput" placeholder="請輸入證書模組名稱"></el-input>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <p class="red">
          名稱規範：西元年月日單位名稱職稱一級主管姓名。例：20210201 教務處教務長 <u>林耀堂</u>
        </p>

        <div class="inputBox">
          <div class="inputTitle">單位</div>
          <ValidationProvider name="請選擇單位!!" rules="required" v-slot="{ errors, classes }">
            <el-select filterable no-match-text="暫無資料" :class="classes" v-if="userControlUnit" v-model="unitSelete" placeholder="請選擇單位">
              <el-option v-for="unit in userControlUnit" :key="unit.UntId" :label="unit.UntNameFull" :value="unit.UntId"></el-option>
            </el-select>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <p class="red">
          背景圖推薦尺寸為轉換成A4大小不變形之尺寸，如794px x 1122px、595px x
          842px等等...
        </p>
        <div class="inputBox">
          <p class="inputTitle">背景圖上傳</p>
          <el-upload ref="upload" class="upload-demo" :action="$store.state.apiBase + 'Img'" list-type="text" :headers="uploadHeader" :on-success="successUpload">
            <el-tooltip :open-delay="500" class="item" effect="dark" placement="top-start">
              <div slot="content">
                檔案格式限制:doc/docx/xls/xlsx/ppt/pttx/pdf/jpg/png
                <br />檔案大小限制:10MB
              </div>
              <el-button size="small" type="primary">選擇上傳文件</el-button>
            </el-tooltip>
          </el-upload>
        </div>

        <div class="inputBox">
          <div class="inputTitle">已上傳文件</div>
          <p class="noFiles" v-if="uploadUrl === ''">尚未上傳文件</p>

          <div v-if="uploadUrl !== ''">
            <el-button class="downloadBtn" size="mini">
              <el-tooltip :open-delay="500" class="item" effect="dark" :content="uploadUrl" placement="top-start">
                <p class="fileName" v-if="uploadUrl">
                  <i @click.capture="delFile(index)" class="fas fa-trash-alt"></i>
                  {{ uploadUrl }}
                </p>
              </el-tooltip>
            </el-button>
          </div>
        </div>
      </ValidationObserver>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button v-if="addOrEdit === '新增'" type="primary" @click="addHandler">新 增</el-button>
        <el-button v-else type="primary" @click="editHandler">編 輯</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
import Page from "../../components/Page";
import moment from "moment";
import Ck from "@/components/Ck";
export default {
  name: "UserRoles",
  components: { HeaderBox, Page, Ck },
  data() {
    return {
      list: "",
      form: {
        FormSummary: "",
      },
      unitsData: [],
      addOrEditDialog: false,
      listNameInput: "",
      roleStatusSelect: "",
      listCk: "",
      buttonList: [],
      keyWordInput: "",
      certificateData: "",
      currentPage: 1,
      totalCount: "",
      pageSize: "",
      searchLoading: false,
      addLoading: false,
      editLoading: false,
      addOrEdit: "新增",
      editId: "",
      uploadHeader: {
        Authorization: `Bearer ${window.localStorage.getItem("Token")}`,
      },
      uploadUrl: "",
      unitSelete: "",
    };
  },
  computed: {
    certificateDataFilter() {
      let data = this.certificateData;
      data.map((role) => {
        role.CreateTime = moment(role.CreateTime).format("YYYY-MM-DD");
      });
      return data;
    },
    userControlUnit() {
      const vm = this;
      let userCtrl = JSON.parse(window.localStorage.getItem("user")).CtrlUnits;
      // let arr = userCtrl.map((uc) => {
      //   return vm.unitsData.filter((unit) => {
      //     return unit.UntId === uc;
      //   })[0];
      // });
      let arr = [];
      userCtrl.forEach((u) => {
        vm.unitsData.forEach((u1) => {
          if (u === u1.UntId) {
            arr.push(u1);
          }
        });
      });
      return arr;
    },
  },
  methods: {
    getUnits() {
      const vm = this;
      vm.$api.GetUnits().then((res) => {
        vm.unitsData = res.data;
      });
    },
    getButtonList(routePath, routers) {
      const vm = this;
      let buttonList = [];
      routers.forEach((element) => {
        if (routePath && element.path) {
          let path = routePath.toLowerCase();
          if (element.path && element.path.toLowerCase() === path) {
            buttonList = element.children;
            vm.buttonList = buttonList;
            return;
          } else if (element.children) {
            this.getButtonList(path, element.children);
          }
        }
      });
      return buttonList;
    },
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some((btn) => btn.iconCls == btnType);
      // return true;
    },
    async handleAddOrEdit(act, info = "") {
      const vm = this;
      if (vm.$refs.obs) {
        await vm.$refs.obs.reset();
      }
      vm.listNameInput = "";
      vm.uploadUrl = "";
      vm.unitSelete = "";
      vm.addOrEdit = "新增";
      if (act === "add") {
        vm.addOrEditDialog = true;
      } else {
        console.log(info);
        vm.addOrEdit = "編輯";
        vm.addOrEditDialog = true;
        vm.listNameInput = info.CertName;
        vm.unitSelete = info.UnitCode;
        vm.editId = info.Id;
        vm.uploadUrl = info.CertBackImg;
      }
    },
    async addHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$alertM.fire({
          icon: "error",
          title: "請確認欄位是否正確填寫",
        });
      } else {
        vm.addLoading = true;
        let CertName = vm.listNameInput;
        let CertBackImg = vm.uploadUrl;
        let UnitCode = vm.unitSelete;
        let params = {
          CertName,
          CertBackImg,
          UnitCode,
        };
        vm.$api.PostCertificateTemp(params).then((res) => {
          vm.getCertificate();
          console.log(res);
          vm.addOrEditDialog = false;
          vm.addLoading = false;
          vm.$alertM.fire({
            icon: "success",
            title: `模組 ${name} 添加成功 ! `,
          });
        });
      }
    },
    searchHandler({ page, key }) {
      const vm = this;
      vm.searchLoading = true;
      vm.keyWordInput = key;
      let params = {
        key,
        page,
      };
      vm.$api.GetCertificateTemp(params).then((res) => {
        console.log(res);
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.certificateData = res.data.response.data;
        vm.searchLoading = false;
        vm.currentPage = 1;
      });
    },
    deleteHandler(list) {
      const vm = this;
      console.log(list);
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除模組 ${list.CertName} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f3e52",
        cancelButtonColor: "#522f2f",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let params = {
            id: list.Id,
          };
          vm.$api.DeleteCertificateTemp(params).then((res) => {
            vm.getCertificate();
            vm.$alertT.fire({
              icon: res.data.success ? "success" : "error",
              title: `表單 ${res.data.msg}`,
            });
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消刪除`,
          });
        }
      });
    },
    async editHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$alertM.fire({
          icon: "error",
          title: `請確認欄位是否正確填寫`,
        });
      } else {
        vm.editLoading = true;
        let Id = vm.editId;
        let CertName = vm.listNameInput;
        let CertBackImg = vm.uploadUrl;
        let UnitCode = vm.unitSelete;
        let params = {
          Id,
          CertName,
          CertBackImg,
          UnitCode,
          //   createUser: "string",
          //   createDate: "2020-07-13T10:25:02.797Z",
          //   modifyUser: "string",
          //   modifyDate: "2020-07-13T10:25:02.797Z"
        };
        vm.$api.PutCertificateTemp(params).then((res) => {
          vm.getCertificate();
          this.addOrEditDialog = false;
          vm.editLoading = false;
          vm.$alertM.fire({
            icon: "success",
            title: `模組 ${CertName} 更新成功 ! `,
          });
        });
      }
    },
    successUpload(res) {
      const vm = this;
      vm.uploadUrl = res.response;
      vm.$nextTick(() => {
        vm.$refs.upload.clearFiles();
      });
    },
    delFile() {
      const vm = this;
      vm.uploadUrl = "";
    },
    // fileName(url) {
    //   if (url) {
    //     return url.split("\\")[1].split(".")[0];
    //   }
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    async getCertificate(page = 1, key) {
      const vm = this;
      let params = {
        key: vm.keyWordInput,
        page,
      };
      await vm.$api.GetCertificateTemp(params).then((res) => {
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.certificateData = res.data.response.data;
        vm.list = res.data.response;
        vm.currentPage = page;
        vm.$store.dispatch("loadingHandler", false);
      });
    },
    filterId(x) {
      return this.unitsData.filter((res) => res.UntId == x)[0];
    },
    toPreveiw(x) {
      window.open(this.$store.state.fileBase + "Files/" + x.CertBackImg);
    },
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getUnits();
    this.getButtonList(this.$route.path, routers);

    await this.getCertificate();

    this.$store.dispatch("loadingHandler", false);
  },
};
</script>

<style lang='scss'>
.featureBox {
  display: flex;
  align-items: start;
  .ml-10 {
    margin-left: 10px;
    a {
      color: white;
    }
  }
}
</style>