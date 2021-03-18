<template>
  <div id="ActivityList">
    <el-dialog :close-on-click-modal="false" :title="'簽核'" :visible.sync="showEdit" width="50%">
      <el-form label-width="80px">
        <el-form-item label="審核狀態">
          <el-select v-model="subForm.Status">
            <el-option label="通過" :value=1></el-option>
            <el-option label="退回補充" :value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="備註">
          <el-select v-model="subForm.myRemark" multiple style="width: 100%">
            <el-option label="「活動類別」及對應之「活動型態」有誤，請修正" value="「活動類別」及對應之「活動型態」有誤，請修正"></el-option>
            <el-option label="「證書字號」未依文藻+單位簡稱方式命名，請修正。" value="「證書字號」未依文藻+單位簡稱方式命名，請修正。"></el-option>
            <el-option label="「參與狀態」與「參與方式」有誤，請修正。" value="「參與狀態」與「參與方式」有誤，請修正。"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
          <el-input placeholder="請輸入原因" style="margin-top: 1rem" v-if="includesOther()" v-model="subForm.RemarkReason"></el-input>
        </el-form-item>
      </el-form>
      <div class="formButtonList">
        <el-button :disabled="!subForm.Status != ''" type="primary" @click="toEdit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'簽核流程'" :visible.sync="showProcess" width="70%">
      <div>
        <h2>簽核流程</h2>
        <el-table header-cell-class-name="tableHeader" :data="GetActivityFlowByActIdList" style="width: 100%">
          <el-table-column width="100" label="順序" prop="Sort" sortable></el-table-column>
          <el-table-column label="審核人" prop="UserId">
            <template slot-scope="scope">
              <span>{{
                checkType(scope.row.UserId, scope.row.CheckType)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="審核狀態" prop="Status" sortable>
            <template slot-scope="scope">{{
              $store.state.CompleteState[scope.row.Status]
            }}</template>
          </el-table-column>
          <!-- <el-table-column label="簽核時間" prop="CreateDate" sortable>
            <template slot-scope="scope">{{
              YYYYMMDDhhmmss(scope.row.CreateDate)
            }}</template>
          </el-table-column> -->
        </el-table>
      </div>
      <div>
        <h2>簽核紀錄</h2>
        <el-table header-cell-class-name="tableHeader" :data="GetActivityFlowLogList" style="width: 100%">
          <el-table-column label="順序">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="審核人" prop="UserId">
            <template slot-scope="scope">
              <span>{{
                checkType(scope.row.UserId, scope.row.CheckType)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="審核狀態" prop="Status" sortable>
            <template slot-scope="scope">{{
              $store.state.CompleteState[scope.row.Status]
            }}</template>
          </el-table-column>
          <el-table-column label="備註" prop="Remark" sortable></el-table-column>
          <el-table-column label="簽核時間" prop="CreateDate" sortable>
            <template slot-scope="scope">{{
              YYYYMMDDhhmmss(scope.row.CreateDate)
            }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'下載檔案'" :visible.sync="showDownload" width="50%">
      <div v-if="downloadData.allFile && downloadData.allFile[0]">
        <el-table :data="downloadData.allFile" style="width: 800px">
          <el-table-column label="附件名稱" prop="response">
            <template slot-scope="scope">{{
              scope.row.path[0].response
            }}</template>
          </el-table-column>
          <el-table-column label="附件說明">
            <template slot-scope="scope">
              <div v-html="scope.row.remark"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--<template slot-scope="scope"></template>-->
              <div class="iconList">
                <a :href="`${fileBase}Files/${scope.row.path[0].response}`" target="_blank">
                  <el-button type="primary">下載</el-button>
                </a>
                <!--<el-button type="danger" style="margin:0 0 0 10px;" @click="FilesRemove(scope.$index)">刪除</el-button>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <p style="color:red;text-align:center">無相關檔案下載</p>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'報表'" :visible.sync="showMember" width="70%" style="height:100vh">
      <!-- <div class="el-dialog__title" style="margin: 20px 0">雲科大報表</div> -->
      <el-table header-cell-class-name="tableHeader" :data="NYUSTList" style="width: 100%" height="600" ref="articleTable">
        <el-table-column v-for="(item, index) in NYlistTitle" :label="item" :prop="item" :key="index" width='170' sortable></el-table-column>
        <el-table-column width='170' prop="證書連結" label="證書連結" sortable>
          <template slot-scope="scope">
            <i v-if="!scope.row.證書連結" class="fas fa-times"></i>
            <a v-else :href="scope.row.證書連結">連結</a>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'活動明細'" :visible.sync="showDetail" width="30%">
      <el-form label-width="100px">
        <el-form-item label="活動名稱">{{ DetailList.ActName }}</el-form-item>
        <el-form-item label="活動種類">{{
          getActType(DetailList.ActTypeId) &&
          getActType(DetailList.ActTypeId).title
            ? getActType(DetailList.ActTypeId).title
            : ""
        }}</el-form-item>
        <el-form-item label="活動型態">
          {{
            getActCategory(DetailList.ActCategoryId) &&
            getActCategory(DetailList.ActCategoryId).title
              ? getActCategory(DetailList.ActCategoryId).title
              : ""
          }}</el-form-item>
        <el-form-item label="活動開始日">{{
          YYYYMMDDhhmmss(DetailList.ActStartDate)
        }}</el-form-item>
        <el-form-item label="活動結束日">{{
          YYYYMMDDhhmmss(DetailList.ActEndDate)
        }}</el-form-item>
        <el-form-item label="主辦單位">{{
          DetailList.ActOrganizer
        }}</el-form-item>
        <el-form-item label="活動國家">{{
          DetailList.ActCountry
        }}</el-form-item>
      </el-form>
    </el-dialog>

    <div style="margin: 0 0 20px 0" v-if="changeList.length">
      <el-button type="primary" @click="forToEdit">批次通過</el-button>
    </div>
    <div>
      <span>請選擇簽核代理人</span>
      <el-select style="margin: 0.5rem" @change="handleAgentChange()" v-model="userAgent" placeholder="請選擇簽核代理人">
        <el-option v-for="item in userAgentList" :key="item.EmpId" :label="item.EmpName" :value="item.EmpId">
        </el-option>
      </el-select>
    </div>
    <div class="tableD">
      <el-table header-cell-class-name="tableHeader" :data="list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="活動名稱" width="150" prop="ActName" sortable></el-table-column>
        <el-table-column label="申請人" min-width="150" prop="CreateName" sortable></el-table-column>
        <el-table-column label="送出日期" prop="CreateDate" width="150" sortable></el-table-column>

        <el-table-column width="120" label="簽核狀態" prop="Status" sortable>
          <template slot-scope="scope">{{
            $store.state.CompleteState[scope.row.Status]
          }}</template>
        </el-table-column>

        <el-table-column width="150" label="簽到單掃描檔">
          <template slot-scope="scope">
            <i class="fas" :class="
                hasFile(scope.row.hasFile, '簽到單掃描檔')
                  ? 'fa-check'
                  : 'fa-times'
              "></i>
          </template>
        </el-table-column>

        <el-table-column width="150" label="徵稿啟事">
          <template slot-scope="scope">
            <i class="fas" :class="
                hasFile(scope.row.hasFile, '徵稿啟事') ? 'fa-check' : 'fa-times'
              "></i>
          </template>
        </el-table-column>

        <el-table-column width="150" label="研習活動錄影(音)著作權授權同意書">
          <template slot-scope="scope">
            <i class="fas" :class="
                hasFile(scope.row.hasFile, '研習活動錄影(音)著作權授權同意書')
                  ? 'fa-check'
                  : 'fa-times'
              "></i>
          </template>
        </el-table-column>

        <el-table-column width="150" label="主持人參與證明">
          <template slot-scope="scope">
            <i class="fas" :class="
                hasFile(scope.row.hasFile, '主持人參與證明')
                  ? 'fa-check'
                  : 'fa-times'
              "></i>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <div class="iconList">
              <el-tooltip class="item" effect="dark" content="簽核" placement="top" :open-delay="500">
                <div class="iconListD" @click="edit(scope.row)">

                  <i class="el-icon-document-checked"></i>
                </div>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="簽核流程" placement="top" :open-delay="500">
                <div class="iconListD" @click="Process(scope.row)">
                  <i class="el-icon-tickets"></i>
                  <!-- <i class="el-icon-document-checked"></i> -->
                </div>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="報表" placement="top" :open-delay="500">
                <div class="iconListD" @click="member(scope.row)">
                  <i class="myicon-bar"></i>
                </div>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="檔案下載" placement="top" :open-delay="500">
                <div class="iconListD" @click="download(scope.row)">
                  <i class="el-icon-download"></i>
                </div>
              </el-tooltip>
              <!-- 
              <el-tooltip class="item" effect="dark" content="活動明細" placement="top" :open-delay="500">
                <div class="iconListD" @click="detail(scope.row)">
                  <i class="el-icon-tickets"></i>
                </div>
              </el-tooltip> -->

            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import CertificateContent from "@/components/CertificateContent.vue";
import Join from "@/components/Join.vue";
import Page from "@/components/Page.vue";
export default {
  data() {
    return {
      /* fileBase */
      fileBase: process.env.VUE_APP_FILESURL,
      /* 簽核代理人列表 */
      userAgentList: "",
      userAgent: "",

      listQuery: {
        AgentAcc: "",
        UnitCode: "",
      },

      GetActivityFlowLogList: [],
      GetActivityFlowByActIdList: [],
      TitleList: [
        { title: "ActName", chinese: "活動名稱" },
        { title: "ActCategoryId", chinese: "活動種類" },
        { title: "ActTypeId", chinese: "活動型態" },
        { title: "ActStartDate", chinese: "活動開始日" },
        { title: "ActEndDate", chinese: "活動結束日" },
        { title: "ActOrganizer", chinese: "主辦單位" },
        { title: "ActCountry", chinese: "活動國家" },
      ],
      showEdit: false,
      showDownload: false,
      showMember: false,
      MemberList: [],
      NYUSTList: [],
      showDetail: false,
      showProcess: false,
      DetailList: [],
      downloadData: "",
      actForm: "",
      /*search:{
        page: 1,
        key: ""
      },*/
      subForm: {
        state: "",
        Status: "通過",
        remark: [],
        RemarkReason: "",
      },
      card: {
        ActivityId: "",
        account: "",
      },
      searchResult: "",
      checkIn: false,
      showChart: false,
      ManuscriptTitle: "",
      showManuscript: false,
      showJoin: false,
      showJoinData: "",
      checkInNum: "1",
      list: [],
      FormList: [],
      changeList: [],
      chartList: "",
    };
  },
  components: { Page, CertificateContent, Join },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    await this.getData(this.search);
    this.FormList = await this.$api.GetFormNoPage().then((res) => res.data);
    this.getUserAgent();
    this.$store.dispatch("loadingHandler", false);
  },
  computed: {
    DetailListTitle() {
      return Object.keys(this.DetailList);
    },
    userInfo() {
      return JSON.parse(window.localStorage.getItem("user"));
    },
    NYlistTitle() {
      let arr =
        this.NYUSTList && this.NYUSTList[0]
          ? Object.keys(this.NYUSTList[0])
          : [];
      arr = arr.filter((item) => {
        return item != "證書連結";
      });
      return arr;
    },
    listTitle() {
      let arr = this.MemberList[0] ? Object.keys(this.MemberList[0]) : [];
      arr = arr.filter(
        (res) =>
          res != "Status" &&
          res != "ServiceName" &&
          res != "JoinType" &&
          res != "IsTeach" &&
          res != "AgentName" &&
          res != "AgentEmail" &&
          res != "MemberId" &&
          res != "Id" &&
          res != "Sort" &&
          res != "RegistNo" &&
          res != "ActId" &&
          res != "RegId" &&
          res != "MemId" &&
          res != "參與狀態" &&
          res != "參與方式" &&
          res != "授課或系所相關" &&
          res != "CRow" &&
          res != "報名序號"
      );
      return arr;
    },
    sortList() {
      const vm = this;
      let idx = 1;
      let arr = [];
      return vm.MemberList.map((member) => {
        member.Sort = idx;
        idx++;
        return member;
      });
    },
    completeList() {
      return this.sortList.sort(function (a, b) {
        return a.Sort - b.Sort;
      });
    },
  },
  methods: {
    /* checkType */
    checkType(user, colType) {
      if (colType == "User" || colType == "CreateUser") {
        return user.split("/")[0];
      } else {
        return user.split("/")[1];
      }
    },
    /* 獲取代理人能簽核的資料 */
    handleAgentChange() {
      console.log(this.userAgent);
      let arr = this.userAgentList.filter((a) => {
        return a.EmpId === this.userAgent;
      });

      this.listQuery.AgentAcc = this.userAgent;
      this.listQuery.UnitCode = arr[0].AgUntid;
      this.getData();
    },
    /* 獲取簽核代理人資料 */
    getUserAgent() {
      this.$api.GetUserAgent().then((res) => {
        console.log(res);
        this.userAgentList = res.data.response;
      });
    },
    includesOther() {
      return this.subForm.myRemark?.includes("其他");
    },
    hasFile(item, type) {
      return item.includes(type);
    },
    async getData() {
      this.$store.dispatch("loadingHandler", true);
      this.$api.GetActivityFlow(this.listQuery).then((res) => {
        this.list = res.data.response;
        this.list.map((l) => {
          l.hasFile = JSON.parse(l.AttachFiles).allFile.map((f) => {
            return f.type;
          });
        });
      });
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
    edit(x) {
      this.subForm = JSON.parse(JSON.stringify(x));
      // this.subForm.myRemark = [];
      this.$set(this.subForm, "myRemark", []);
      this.$set(this.subForm, "Status", "");
      this.showEdit = true;
      console.log(this.subForm);
    },
    async toEdit() {
      this.subForm.myRemark = this.subForm.myRemark.filter((r) => r !== "其他");
      this.subForm.RemarkReason
        ? this.subForm.myRemark.push(this.subForm.RemarkReason)
        : (this.subForm.myRemark = this.subForm.myRemark);

      this.subForm.Remark = this.subForm.myRemark.join(",");

      // console.log(this.subForm.Remark);
      let flag = await this.$api
        .SetActivityFlowStatusById(this.subForm)
        .then((res) => res.data);
      this.$alertM.fire({
        icon: flag.success ? "success" : "error",
        title: flag.msg,
      });
      await this.getData();
      this.showEdit = false;
    },
    async forToEdit() {
      this.$store.dispatch("loadingHandler", true);
      for (let item of this.changeList) {
        let form = {
          FlowId: item.FlowId,
          Status: 1,
          remark: [],
        };
        await this.$api.SetActivityFlowStatusById(form).then((res) => res.data);
      }
      this.$alertM.fire({
        icon: "success",
        title: "批量審核完成",
      });
      await this.getData();
      this.$store.dispatch("loadingHandler", false);
    },
    handleSelectionChange(val) {
      this.changeList = val;
    },
    download(x) {
      this.downloadData = JSON.parse(x.AttachFiles);
      console.log(this.downloadData);
      this.showDownload = true;
    },
    async member(x) {
      this.MemberList = await this.$api
        .GetRegisterJoinData({
          actId: x.ActId,
        })
        .then((res) => res.data);
      this.NYUSTList = await this.$api
        .GetActivityExcelList({ actid: x.ActId })
        .then((res) => res.data.response);
      this.showMember = true;
    },
    async detail(x) {
      this.DetailList = await this.$api
        .GetActivityById({ Id: x.ActId })
        .then((res) => res.data.response);
      this.showDetail = true;
    },
    isTeachFilter(item) {
      return item == "True" ? "是" : "否";
    },
    getActCategory(x) {
      return this.$store.state.actCategory.filter((res) => res.Id == x)[0];
    },
    getActType(x) {
      return this.$store.state.actType.filter((res) => res.Id == x)[0];
    },
    YYYYMMDDhhmmss(x) {
      return moment(x).format("YYYY-MM-DD HH:mm:ss");
    },
    async Process(x) {
      this.GetActivityFlowLogList = await this.$api
        .GetActivityFlowLog({
          actId: x.ActId,
        })
        .then((res) => res.data.response);
      this.GetActivityFlowByActIdList = await this.$api
        .GetActivityFlowByActId({
          actId: x.ActId,
        })
        .then((res) => res.data.response);
      this.showProcess = true;
    },
    //FilesRemove(x,target='ArchiveFiles') {
    //  this.form.ArchiveFiles.allFile.splice(x,1)
    //},
  },
};
</script>
<style lang="scss">
.fa-check {
  color: green;
}
.fa-times {
  color: red;
}
</style>
