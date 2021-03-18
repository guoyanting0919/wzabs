<template>
  <div id="individualList">
    <el-dialog :close-on-click-modal="false" :title="'個資同意書複製'" :visible.sync="copyVisible" width="50%">
      <!--預覽-->
      <el-form label-width="150px">
        <el-form-item label="個資同意書名稱">
          <el-input v-model="copyData.Name"></el-input>
        </el-form-item>
      </el-form>
      <div class="formButtonList">
        <el-button type="primary" @click="toCopy">複製個資同意書</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="'預覽'" :visible.sync="preveiwVisible" width="50%">
      <div class="showPreview" v-html="previewData"></div>
    </el-dialog>
    <!-- headerBox -->
    <div class="headerBox">
      <HeaderBox @searchHandler="searchHandler" @handleAddOrEdit="handleAddOrEdit" :buttonList="buttonList" :searchLoading="searchLoading"></HeaderBox>
      <el-button class="headerBox__view" type="primary">
        <a href="https://c008.wzu.edu.tw/datas/upload/files/%E4%B8%8B%E8%BC%89%E5%B0%88%E5%8D%80/%E5%80%8B%E8%B3%87/%E5%80%8B%E4%BA%BA%E8%B3%87%E6%96%99%E8%92%90%E9%9B%86%E8%81%B2%E6%98%8E_%E7%AF%84%E6%9C%AC_1100129.docx" download="範本下載(秘書室提供)" target="_blank">範本下載(秘書室提供)</a>
      </el-button>
    </div>

    <!-- mainBox -->
    <div class="mainTable">
      <div class="tableContainer mt-5" v-if="individualData">
        <el-table header-cell-class-name="tableHeader" :data="individualData" empty-text="暫無資料" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="Name" label="個資同意書名稱" sortable></el-table-column>

          <el-table-column width="300" prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button class="outline" size="mini" @click="preview(scope.row)">預覽</el-button>
              <el-button class="outline" size="mini" @click="copy(scope.row)">複製</el-button>
              <el-button class="outline" size="mini" v-if="hasBtn('btnEdit')&&scope.row.UnitCode" @click="handleAddOrEdit('edit',scope.row)">編輯</el-button>
              <el-button v-if="hasBtn('btnDelete')&&scope.row.UnitCode" type="danger" class="outline" size="mini" @click="deleteHandler(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- pagination -->
    <Page :now="currentPage" :count="list.pageCount" :rightPage="5" :leftPage="5" @changePage="getIndividual"></Page>

    <!-- addOrEditDialog -->
    <el-dialog :close-on-click-modal="false" custom-class="addOrEditDialog" :title="addOrEdit" :visible.sync="addOrEditDialog">
      <ValidationObserver ref="obs">
        <div class="inputBox" style="margin-top:3rem">
          <p class="inputTitle">個資同意書名稱</p>
          <ValidationProvider name="請輸入表單名稱!!" rules="required" v-slot="{  errors,classes }">
            <el-input :class="classes" style="width:300px" v-model="listNameInput" placeholder="請輸入表單名稱"></el-input>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="inputBox">
          <p class="inputTitle">個資同意書內容</p>
          <ValidationProvider name="請輸入表單內容!!" rules="required" v-slot="{  errors, }">
            <Ck v-model="form.FormSummary"></Ck>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </ValidationObserver>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button v-if="addOrEdit==='新增'" type="primary" @click="addHandler">新 增</el-button>
        <el-button v-else type="primary" @click="editHandler">儲 存</el-button>
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
        UnitCode: "",
      },
      copyData: "",
      copyVisible: false,
      previewData: "",
      preveiwVisible: false,
      addOrEditDialog: false,
      listNameInput: "",
      roleStatusSelect: "",
      listCk: "",
      buttonList: [],
      keyWordInput: "",
      individualData: "",
      currentPage: 1,
      totalCount: "",
      pageSize: "",
      searchLoading: false,
      addLoading: false,
      editLoading: false,
      addOrEdit: "新增",
      editId: "",
    };
  },
  computed: {
    individualDataFilter() {
      let data = this.individualData;
      data.map((role) => {
        role.CreateTime = moment(role.CreateTime).format("YYYY-MM-DD");
      });
      return data;
    },
    userInfo() {
      return JSON.parse(window.localStorage.getItem("user"));
    },
  },
  methods: {
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
      vm.form.FormSummary = "";
      vm.roleStatusSelect = true;
      vm.addOrEdit = "新增";
      if (act === "add") {
        vm.addOrEditDialog = true;
      } else {
        console.log(info);
        vm.addOrEdit = "編輯";
        vm.addOrEditDialog = true;
        vm.listNameInput = info.Name;
        vm.form.FormSummary = info.Contents;
        vm.form.UnitCode = info.UnitCode;
        vm.editId = info.Id;
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
        let Name = vm.listNameInput;
        let Contents = vm.form.FormSummary;
        let UnitCode = this.userInfo.UnitCode;
        let params = {
          Name,
          Contents,
          UnitCode,
        };
        vm.$api.PostIndividualStatementModule(params).then((res) => {
          vm.getIndividual();
          console.log(res);
          vm.addOrEditDialog = false;
          vm.addLoading = false;
          vm.$alertM.fire({
            icon: "success",
            title: `表單 ${name} 添加成功 ! `,
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
      vm.$api.GetIndividualStatementModule(params).then((res) => {
        console.log(res);
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.individualData = res.data.response.data;
        vm.searchLoading = false;
        vm.currentPage = 1;
      });
    },
    deleteHandler(list) {
      const vm = this;
      console.log(list);
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除表單 ${list.Name} ?`,
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
          vm.$api.DeleteIndividualStatementModule(params).then((res) => {
            vm.getIndividual();
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
        let Name = vm.listNameInput;
        let Contents = vm.form.FormSummary;
        let UnitCode = vm.form.UnitCode;
        let params = {
          Id,
          Name,
          Contents,
          UnitCode,
        };
        vm.$api.PutIndividualStatementModule(params).then((res) => {
          vm.getIndividual();
          this.addOrEditDialog = false;
          vm.editLoading = false;
          vm.$alertM.fire({
            icon: "success",
            title: `表單 ${Name} 更新成功 ! `,
          });
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    async getIndividual(page = 1, key) {
      const vm = this;
      let params = {
        key: vm.keyWordInput,
        page,
      };
      await vm.$api.GetIndividualStatementModule(params).then((res) => {
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.individualData = res.data.response.data;
        vm.list = res.data.response;
        vm.currentPage = page;
        vm.$store.dispatch("loadingHandler", false);
      });
    },
    copy(x) {
      this.copyData = JSON.parse(JSON.stringify(x));
      this.copyData.Name = this.copyData.Name + " - Copy";
      this.copyData.UnitCode = this.userInfo.UnitCode;
      this.copyVisible = true;
    },
    async toCopy() {
      await this.$api
        .PostIndividualStatementModule(this.copyData)
        .then((res) => {
          this.getIndividual();
        });
      this.copyVisible = false;
    },
    preview(x) {
      this.previewData = x.Contents;
      this.preveiwVisible = true;
    },
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);

    await this.getIndividual();

    this.$store.dispatch("loadingHandler", false);
  },
};
</script>

<style lang='scss' scope>
.showPreview {
  list-style: disc;
}
</style>