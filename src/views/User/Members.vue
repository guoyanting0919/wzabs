<template>
  <div id="FormModelList">

    <el-dialog
      :close-on-click-modal="false"
      :title="'編輯'"
      :visible.sync="showEdit"
      width="50%"
    >
      <el-form label-width="100px">
        <el-form-item label="帳號">
          <el-input v-model="form.UserAccount"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.UserName"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.UserEmail"></el-input>
        </el-form-item>
        <el-form-item label="學校">
          <el-input v-model="form.UserSchool"></el-input>
        </el-form-item>
        <el-form-item label="所屬單位">
          <el-input v-model="form.UnitName"></el-input>
        </el-form-item>
        <el-form-item label="性別">
          <el-select v-model="form.Sex">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身分證字號">
          <el-input v-model="form.UID"></el-input>
        </el-form-item>
      </el-form>
      <div class="formButtonList">
        <el-button type="primary" @click="toEdit">確定修改</el-button>
      </div>
      <!--預覽-->
    </el-dialog>

    <div class="buttonList">
      <el-input style="width:240px;" placeholder="請輸入關鍵字" v-model="search.key" @change="toSearch"></el-input>
      <el-button type="primary" ref="search" @click="toSearch">搜尋</el-button>
    </div>

    <div class="tableD">
      <el-table
        header-cell-class-name="tableHeader"
        :data="list.data"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="帳號" prop="UserAccount"></el-table-column>
        <el-table-column label="姓名" prop="UserName"></el-table-column>
        <el-table-column label="Email" prop="UserEmail"></el-table-column>
        <el-table-column label="學校" prop="UserSchool"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<template slot-scope="scope"></template>-->
            <div class="iconList">

              <el-tooltip
                class="item"
                effect="dark"
                content="編輯"
                placement="top"
                :open-delay="500"
                v-if="scope.row.Source!='School'"
              >
                <div
                  class="iconListD"
                  @click="edit(scope.row)"
                >
                  <i class="myicon-edit"></i>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page
      :now="search.page"
      :count="list.pageCount"
      :rightPage="5"
      :leftPage="5"
      @changePage="changePage"
    ></Page>
  </div>
</template>

<script>
import Page from "@/components/Page.vue";
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
      showEdit: false,
      form: "",
      blank: {
        Name: "",
        Description: "",
        Enabled: true,
      },
    };
  },
  components: { Page },
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
      this.list = await this.$api.GetMember(x).then((res) => res.data.response);
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
    async edit(x) {
      this.form=JSON.parse(JSON.stringify(x))
      this.showEdit=true
    },
    async toEdit() {
      this.$store.dispatch("loadingHandler", true);
      let flag=await this.$api.PutMember(this.form).then(res=>res.data)
      this.$alertM.fire({
        icon: flag.success ? "success" : "error",
        title: flag.msg,
      });
      await this.getData(this.search)
      this.showEdit=false
      this.$store.dispatch("loadingHandler", false);
    },
    async del(x, y = true) {
      if (y) {
        let yes = confirm("確定刪除?");
        if (!yes) return 0;
      }
      this.$store.dispatch("loadingHandler", true);
      let obj = { Id: x };
      await this.$api.DelMember(obj).then((res) => {
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
  },
};
</script>
