<template>
  <div id="FormModelList">
    <el-dialog :close-on-click-modal="false" :title="'表單預覽'" :visible.sync="dialogVisiblePreview" width="50%">
      <!--預覽-->
      <FormModelTable :data="FormRow.FormDtlDTO" v-if="FormRow.FormDtlDTO && FormRow.FormDtlDTO.length > 0"></FormModelTable>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'表單複製'" :visible.sync="copyVisible" width="50%">
      <!--預覽-->
      <el-form label-width="80px">
        <el-form-item label="表單名稱">
          <el-input v-model="FormRow.FormName"></el-input>
        </el-form-item>
      </el-form>
      <h2>表單預覽</h2>
      <FormModelTable :data="FormRow.FormDtlDTO" v-if="FormRow.FormDtlDTO && FormRow.FormDtlDTO.length > 0"></FormModelTable>
      <div class="formButtonList">
        <el-button type="primary" @click="toCopy">複製表單</el-button>
      </div>
    </el-dialog>

    <div class="buttonList">
      <el-input style="width: 240px" placeholder="請輸入關鍵字" v-model="search.key" @change="toSearch"></el-input>
      <el-button type="primary" ref="search" @click="toSearch">搜尋</el-button>
      <el-button type="primary" @click="$router.push({ name: 'FormModelEdit' })">新增</el-button>
      <el-button type="danger" @click="batchDel">批量刪除</el-button>
      <el-popover placement="bottom-start" width="200" trigger="hover" content="請下載範本並修改，在活動前一週寄給報名者填寫並於活動當日繳交，或參考範本製作Goolge表單。">
        <el-button slot="reference" type="primary">
          <a class="text-white" href="https://d007.wzu.edu.tw/datas/upload/files/Documents/TOCC.odt" download="防疫評估表範本" target="_blank">防疫評估表範本(衛保組提供)</a>
        </el-button>
      </el-popover>
    </div>

    <div class="tableD">
      <el-table header-cell-class-name="tableHeader" :data="list.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="報名表名稱" prop="FormName" min-width="90" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<template slot-scope="scope"></template>-->
            <div class="iconList">
              <el-tooltip class="item" effect="dark" content="預覽" placement="top" :open-delay="500">
                <div class="iconListD" @click="preview(scope.row.Id)">
                  <i class="el-icon-view"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="複製" placement="top" :open-delay="500">
                <div class="iconListD" @click="copy(scope.row)">
                  <i class="el-icon-document-copy"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="編輯" placement="top" :open-delay="500" v-if="scope.row.UnitCode != ' '">
                <div class="iconListD" @click="
                    $router.push({
                      name: 'FormModelEdit',
                      query: { Id: scope.row.Id },
                    })
                  ">
                  <i class="myicon-edit"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="刪除" placement="top" :open-delay="500" v-if="scope.row.UnitCode != ' '">
                <div class="iconListD" @click="del(scope.row.Id)">
                  <i class="myicon-delete"></i>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page :now="search.page" :count="list.pageCount" :rightPage="5" :leftPage="5" @changePage="changePage"></Page>
  </div>
</template>

<script>
import Page from "@/components/Page.vue";
import FormModelTable from "@/components/FormModelTable";
export default {
  data() {
    return {
      buttonList: [],
      search: {
        page: 1,
        key: "",
      },
      list: [],
      changeList: [],
      FormRow: "",
      dialogVisiblePreview: false,
      copyVisible: false,
      form: "",
      blank: {
        Name: "",
        Description: "",
        Enabled: true,
      },
    };
  },
  components: { Page, FormModelTable },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    await this.getData(this.search);
    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    async getData(x) {
      this.$store.dispatch("loadingHandler", true);
      this.list = await this.$api.GetForm(x).then((res) => res.data.response);
      this.$store.dispatch("loadingHandler", false);
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
    toSearch() {
      this.changePage(1);
    },
    changePage(x) {
      this.search.page = x;
      this.getData(this.search);
    },
    async del(x, y = true) {
      if (y) {
        let yes = confirm("確定刪除?");
        if (!yes) return 0;
      }
      this.$store.dispatch("loadingHandler", true);
      let obj = { Id: x };
      await this.$api.DeleteForm(obj).then((res) => {
        if (res.data.success && y) {
          this.getData(this.search);
        }
      });
      this.$store.dispatch("loadingHandler", false);
    },
    handleSelectionChange(val) {
      this.changeList = val;
    },
    async batchDel() {
      let yes = confirm("確定批量刪除?");
      if (!yes) return 0;
      for (let i in this.changeList) {
        await this.del(this.changeList[i].Id, false);
      }
      this.getData(this.search);
    },
    async preview(x) {
      this.$store.dispatch("loadingHandler", true);
      let obj = { Id: x };
      this.FormRow = await this.$api
        .GetFormById(obj)
        .then((res) => res.data.response);
      this.dialogVisiblePreview = !this.dialogVisiblePreview;
      this.$store.dispatch("loadingHandler", false);
    },
    async copy(x) {
      let obj = { Id: x.Id };
      let user = window.localStorage.user
        ? JSON.parse(window.localStorage.user)
        : null;
      this.$store.dispatch("loadingHandler", true);
      this.copyVisible = true;
      this.FormRow = await this.$api
        .GetFormById(obj)
        .then((res) => res.data.response);
      this.FormRow.FormName += " - Copy";
      this.FormRow.UnitCode = user.UnitCode;
      this.$store.dispatch("loadingHandler", false);
    },
    async toCopy() {
      this.$store.dispatch("loadingHandler", true);
      let flag = await this.$api.PostForm(this.FormRow).then((res) => res.data);
      this.$alertM.fire({
        icon: flag.success ? "success" : "error",
        title: flag.msg,
      });
      await this.getData(this.search);
      this.copyVisible = false;
    },
  },
};
</script>
