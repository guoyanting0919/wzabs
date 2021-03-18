<template>
  <div class="org">
    <!-- 可控組織 -->
    <el-col style="margin: 0 1.5rem" :span="8" class="toolbar roles">
      <el-card class="box-card" style="width: 100%">
        <div slot="header" class="authorityHeader">
          <span>擁有組織 </span>
        </div>
        <div class="unitContainer">
          <div
            @click="handleSelectOrg(item.UntId)"
            class="ctrlUnit"
            v-for="item in CtrlUnits"
            :key="item.UntId"
            :class="{ selectedOrg: selectedOrg === item.UntId }"
          >
            {{ item.UntNameFull }}
            <i v-if="selectedOrg === item.UntId" class="fas fa-check"></i>
          </div>
        </div>
      </el-card>
    </el-col>

    <!-- 組織成員 -->
    <el-col :span="12" class="toolbar roles">
      <el-card class="box-card" style="width: 100%">
        <div slot="header" class="authorityHeader">
          <span>組織成員</span>
          <el-button size="mini" @click="handleDialog">新增</el-button>
        </div>
        <div class="memberContainer">
          <div class="ctrlUnit" v-for="item in orgMembers" :key="item.Id">
            <span style="width: 150px; display: inline-block">
              {{ item.RealName }}_{{ item.LoginName }}</span
            >
            <el-button size="mini" type="danger" @click="handleDelete(item.Id)"
              >刪除</el-button
            >
          </div>
        </div>
      </el-card>
    </el-col>

    <!-- 新增dialog -->
    <el-dialog title="新增成員" :visible.sync="addDialog" width="30%">
      <el-select filterable v-model="memberId" placeholder="請選擇">
        <el-option
          v-for="item in userList"
          :key="item.Id"
          :label="`${item.RealName}_${item.LoginName}`"
          :value="item.Id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "org",
  data() {
    return {
      /* 可控組織 */
      CtrlUnits: "",

      /* 選定組織 */
      selectedOrg: "",

      /* 選定成員 */
      memberId: "",

      /* 組織成員 */
      orgMembers: "",

      /* 用戶 */
      userList: "",

      addDialog: false,
    };
  },
  methods: {
    /* 獲取所有組織 並設定可控組織 */
    getUnits() {
      const vm = this;
      vm.$api.GetUnits().then((res) => {
        let arr = JSON.parse(localStorage.getItem("user")).CtrlUnits;
        this.CtrlUnits = res.data.filter((u) => {
          return arr.includes(u.UntId);
        });
        console.log(this.CtrlUnits);
      });
    },

    /* 選擇組織 並獲取該組織下的成員 */
    handleSelectOrg(id) {
      this.selectedOrg = id;
      let params = {
        Org: this.selectedOrg,
        Type: 1,
      };
      this.$api.GetAdminUserByOrgId(params).then((res) => {
        console.log(res.data.response);
        this.orgMembers = res.data.response;
      });
    },

    /* 開啟dialog */
    handleDialog() {
      this.addDialog = true;
      let params = {
        Org: this.selectedOrg,
        Type: 0,
      };
      this.$api.GetAdminUserByOrgId(params).then((res) => {
        console.log(res.data.response);
        this.userList = res.data.response;
      });
    },

    /* 新增成員 */
    handleAdd() {
      let params = {
        userId: this.memberId,
        unitCode: this.selectedOrg,
      };
      this.$api.PutAdminUserByOrgId(params).then((res) => {
        this.addDialog = false;
        this.handleSelectOrg(this.selectedOrg);
      });
    },

    /* 刪除成員 */
    handleDelete(id) {
      let params = {
        userId: id,
        unitCode: this.selectedOrg,
      };
      this.$api.DeleteAdminUserByOrgId(params).then((res) => {
        this.handleSelectOrg(this.selectedOrg);
      });
    },
  },
  mounted() {
    this.getUnits();
  },
};
</script>

<style lang='scss' scoped>
.authorityHeader {
  display: flex;
  justify-content: space-between;
}
.unitContainer {
  display: flex;
  flex-direction: column;
}
.box-card {
  height: calc(100vh - 160px);
  overflow: auto;
}
.ctrlUnit {
  margin-bottom: 0.5rem;
  transition: 0.5s;
  cursor: pointer;

  &.selectedOrg {
    color: green;
  }

  &:hover {
    font-weight: 700;
  }
}
</style>