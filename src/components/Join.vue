<template>
  <div id="ActivityJoin">
    <div class="form">
      <div class="formLeft">
        <el-input v-model="searchData.key" placeholder="請輸入職編/學號/姓名" @keyup.prevent.native.enter="search"></el-input>
        <div class="formButtonList">
          <el-button type="primary" @click="search">搜尋</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table ref="table" header-cell-class-name="tableHeader" :data="MemberList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="#">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="職編/學號" prop="Account" sortable></el-table-column>
        <el-table-column label="姓名" prop="Name" sortable></el-table-column>
      </el-table>
    </div>
    <div class="formButtonList" v-if="changeList.length">
      <el-button type="primary" @click="subWithMail">儲存並發送郵件</el-button>
      <el-button type="primary" @click="sub">儲存並返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      ActivityData: "",
      MemberList: [],
      FormData: "",
      searchData: {
        key: "",
      },
      form: {},
      changeUnit: "",
      changeList: [],
      UnitList: [],
    };
  },
  computed: {
    getMember() {
      return this.MemberList.filter((res) => res.UnitCode == this.changeUnit);
    },
  },
  async created() {
    this.ActivityData = await this.$api
      .GetActivityById({ Id: this.data.Id })
      .then((res) => res.data.response);
    this.FormData = await this.$api
      .GetFormById({ Id: this.data.FormId })
      .then((res) => res.data.response);
    this.UnitList = await this.$api.GetUnits().then((res) => res.data);
    //this.MemberList=await this.$api.GetMemberNoPage().then(res=>res.data)
    this.form.ActivityId = this.data.Id;
  },
  methods: {
    async sub() {
      this.$store.dispatch("loadingHandler", true);

      let msgBox = [];

      for (let item of this.changeList) {
        let msgList = {};
        /* 取得該成員ID */
        let userData = await this.$api
          .GetByAccount({ account: item.Account })
          .then((res) => res.data.response);

        let form = {
          id: 0,
          memberId: userData.Id,
          activityId: this.ActivityData.Id,
          status: 0,
          joinType: 2,
        };

        let flag = await this.$api
          .PostActivityRegisterNoEmail(form)
          .then((res) => res.data);

        msgList = {
          name: userData.UserName,
          success: flag.success,
          msg: flag.msg,
        };
        msgBox.push(msgList);

        /* 報名資訊 */
        if (flag.success) {
          let form2 = [];
          for (let item2 of this.FormData.FormDtlDTO) {
            let obj = {};
            if (item2.MemberColumn == " ") item2.MemberColumn = null;
            if (item2.MemberColumn) {
              obj = {
                ActivityRegisterId: flag.response,
                FormDtlId: item2.Id,
                Id: item2.Id,
                inputVal: userData[item2.MemberColumn],
              };
            } else {
              obj = {
                ActivityRegisterId: flag.response,
                FormDtlId: item2.Id,
                Id: item2.Id,
                inputVal: "",
              };
            }
            form2.push(obj);
          }
          let flag2 = await this.$api
            .PostActivityRegisterDtl(form2)
            .then((res) => res.data);
        }
      }
      if (msgBox.length > 0) {
        const newMessage = [];
        const peopleFull = (currentValue) =>
          currentValue.msg == "報名人數已達上限";

        if (msgBox.every(peopleFull)) {
          this.$alertM.fire({
            icon: "error",
            title: "報名人數已達上限",
          });
        } else {
          let newMSG = "";
          msgBox.forEach((res) => {
            newMSG = "'" + res.name + "'" + res.msg;
            newMessage.push(newMSG);
          });
          this.$alertM.fire({
            icon: "info",
            title: newMessage,
          });
        }
      }

      this.$refs.table.clearSelection(this.changeList);
      this.searchData.key = "";
      this.$store.dispatch("loadingHandler", false);
    },

    async subWithMail() {
      this.$store.dispatch("loadingHandler", true);

      let msgBox = [];

      for (let item of this.changeList) {
        let msgList = {};
        /* 取得該成員ID */
        let userData = await this.$api
          .GetByAccount({ account: item.Account })
          .then((res) => res.data.response);

        let form = {
          id: 0,
          memberId: userData.Id,
          activityId: this.ActivityData.Id,
          status: 0,
          joinType: 2,
        };

        let flag = await this.$api
          .PostAndSendMail(form)
          .then((res) => res.data);

        msgList = {
          name: userData.UserName,
          success: flag.success,
          msg: flag.msg,
        };
        msgBox.push(msgList);

        /* 報名資訊 */
        if (flag.success) {
          let form2 = [];
          for (let item2 of this.FormData.FormDtlDTO) {
            let obj = {};
            if (item2.MemberColumn == " ") item2.MemberColumn = null;
            if (item2.MemberColumn) {
              obj = {
                ActivityRegisterId: flag.response,
                FormDtlId: item2.Id,
                Id: item2.Id,
                inputVal: userData[item2.MemberColumn],
              };
            } else {
              obj = {
                ActivityRegisterId: flag.response,
                FormDtlId: item2.Id,
                Id: item2.Id,
                inputVal: "",
              };
            }
            form2.push(obj);
          }
          let flag2 = await this.$api
            .PostActivityRegisterDtl(form2)
            .then((res) => res.data);
        }
      }

      if (msgBox.length > 0) {
        const newMessage = [];
        const peopleFull = (currentValue) =>
          currentValue.msg == "報名人數已達上限";

        if (msgBox.every(peopleFull)) {
          this.$alertM.fire({
            icon: "error",
            title: "報名人數已達上限",
          });
        } else {
          let newMSG = "";
          msgBox.forEach((res) => {
            newMSG = "'" + res.name + "'" + res.msg;
            newMessage.push(newMSG);
          });
          this.$alertM.fire({
            icon: "info",
            title: newMessage,
          });
        }
      }

      this.$refs.table.clearSelection(this.changeList);
      this.searchData.key = "";
      this.$store.dispatch("loadingHandler", false);
    },
    search2() {
      console.log("wayne?");
    },
    async search() {
      this.$store.dispatch("loadingHandler", true);
      this.MemberList = await this.$api
        .GetAdminUserByKey(this.searchData)
        .then((res) => res.data.response);
      this.$store.dispatch("loadingHandler", false);
    },
    handleSelectionChange(val) {
      this.changeList = val;
    },
  },
};
</script>

<style lang="scss" scoped>
#ActivityJoin {
  .table {
    max-height: 500px;
    overflow-y: scroll;
  }
}
</style>
