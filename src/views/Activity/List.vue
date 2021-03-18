<template>
  <div id="ActivityList">
    <el-dialog :close-on-click-modal="false" :title="'報到QRCode'" :visible.sync="showQRCode" width="500px">
      <div style="display: flex; justify-content: center; flex-direction: column">
        <div style="display: flex; justify-content: center">
          <img :src="QRCodeURL" class="showQRCode" style="width: 300px; height: 300px" />
        </div>
        <div class="formButtonList">
          <el-button type="primary" @click="toPrintQRCode">列印</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="manuscript" :close-on-click-modal="false" :title="'編輯底稿 - ' + ManuscriptTitle" :visible.sync="showManuscript" width="1000px">
      <p class="red manuscript__summary">*更新底稿後,如需使用新底稿樣式,需至參與狀態重新生成證書字號</p>
      <CertificateContent :data="CertificateContentList" @reGetCertificateContent="EditManuscript"></CertificateContent>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="'新增報名 - ' + showJoinData.ActName" :visible.sync="showJoin" width="500px">
      <Join :data="showJoinData" v-if="showJoin"></Join>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="'活動複製'" :visible.sync="copyVisible" width="50%">
      <!--預覽-->
      <el-form label-width="80px">
        <el-form-item label="活動名稱">
          <el-input v-model="actForm.ActName"></el-input>
        </el-form-item>
      </el-form>
      <div class="formButtonList">
        <el-button type="primary" @click="toCopy">複製活動</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="報到" :visible.sync="checkIn" width="500px">
      <div class="actName">
        <strong>活動名稱：</strong>
        <p>{{card.ActivityName}}</p>
      </div>
      <el-form ref="form" label-width="150px" @submit.native.prevent>
        <el-form-item :label="'報到/簽退'">
          <el-radio-group v-model="card.type" @change="checkInUser = ''">
            <el-radio :label="1">報到</el-radio>
            <el-radio :label="2">簽退</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="'身分證(校外)/教職員證/學生證'">
          <el-input v-model="card.account" style="width: 240px" @change="codeComplete" clearable></el-input>
        </el-form-item>
        <!--<el-form-item label="參與人姓名">
          <el-input style="width:240px;" v-model="searchResult"></el-input>
        </el-form-item>-->
        <p style="
            text-align: center;
            padding: 10px 0;
            color: #090;
            font-size: 22px;
          " v-if="checkInUser && checkInUser.success">
          {{
            checkInUser.acc +
            checkInUser.response +
            (card.type === 1 ? "報到" : "簽退") +
            "成功!"
          }}
        </p>
        <p style="
            text-align: center;
            padding: 10px 0;
            color: #f00;
            font-size: 22px;
          " v-if="checkInUser && !checkInUser.success">
          {{ checkInUser.acc }}{{ card.type === 1 ? "報到" : "簽退" }}失敗!
        </p>
        <p></p>
        <div class="checkInButton" @click="codeComplete">
          <div class="checkInSuccess">
            <i class="el-icon-success"></i>
            <div>{{ card.type === 1 ? "報到完成" : "簽退完成" }}</div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog class="reportModal" :close-on-click-modal="false" title="報表" :visible.sync="showChart" width="1400px">
      <el-form ref="form" label-width="150px" :model="ChartForm">
        <div style="display: flex; justify-content: center">
          <el-form-item label="報名日期範圍(開始)">
            <el-date-picker style="width: 300px" v-model="ChartForm.sDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="報名日期範圍(結束)">
            <el-date-picker style="width: 300px" v-model="ChartForm.eDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </div>
        <div style="display: flex; justify-content: center">
          <el-form-item label="報到日期範圍(開始)">
            <el-date-picker style="width: 300px" v-model="ChartForm.regsDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="報到日期範圍(結束)">
            <el-date-picker style="width: 300px" v-model="ChartForm.regeDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </div>
        <div class="reportColumn" v-if="chartList.length > 0">
          <label class="reportColumn__title">報表欄位（<a @click="showCheckBox = !showCheckBox">{{!showCheckBox ? "顯示" : "隱藏"}}</a>）</label>
          <div class="reportColumn__select" v-if="showCheckBox">
            <el-checkbox-group v-for="(item, index) in checkList" v-model="item.Enable" :key="index" style="margin: 0 10px 0 0" @change="$forceUpdate()">
              <el-checkbox :label="item.title" :value="true"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <!-- <div class="fw"> -->
        <!-- <el-form-item label="報表欄位" prop="ActTypeId" class="chart-el-checkbox" v-if="chartList">
          <el-checkbox-group v-for="(item, index) in checkList" v-model="item.Enable" :key="index" style="margin: 0 10px 0 0" @change="$forceUpdate()">
            <el-checkbox :label="item.title" :value="true"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <!-- </div> -->

      </el-form>

      <div class="formButtonList">
        <el-button type="primary" @click="getChart">搜尋</el-button>
        <el-button type="primary" @click="toDownload" v-if="chartList">下載</el-button>
      </div>

      <el-table header-cell-class-name="tableHeader" :data="chartList" style="width: 100%" v-if="chartList">
        <el-table-column label="#" prop="ActName">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column v-for="(item, index) in checkList" :label="item.title" :prop="item.title" :key="index" v-if="item.Enable"></el-table-column>
      </el-table>
    </el-dialog>

    <div class="buttonList">
      <el-input style="width: 240px" v-model="search.key" placeholder="關鍵字" @keyup.enter.native="toSearch"></el-input>
      <el-date-picker value-format="yyyy-MM-dd" v-model="search.sDate" placeholder="開始日期"></el-date-picker>
      <el-date-picker value-format="yyyy-MM-dd" v-model="search.eDate" placeholder="結束日期"></el-date-picker>
      <el-select v-model="search.status">
        <el-option label="全部" value=""></el-option>
        <el-option label="待審核" value="W"></el-option>
        <el-option label="審核中" value="I"></el-option>
        <el-option label="已簽核" value="E"></el-option>
      </el-select>
      <el-button type="primary" @click="toSearch">搜尋</el-button>
      <el-button type="primary" @click="$router.push({ name: 'ActivityEdit' })">新增</el-button>
    </div>
    <div class="tableD">
      <el-table header-cell-class-name="tableHeader" :data="list.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="活動日期" prop="ActStartDate" sortable>
          <template slot-scope="scope">
            <p class="m-0">{{YYMMDD(scope.row.ActStartDate)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="活動名稱" prop="ActName" sortable></el-table-column>
        <el-table-column label="主辦單位" prop="ActOrganizer" sortable></el-table-column>
        <el-table-column label="承辦人" prop="CreateUser" sortable></el-table-column>

        <!-- <el-table-column label="活動類別" sortable>
          <template slot-scope="scope">
            <div v-if="findActType(scope.row.ActTypeId)">
              {{ findActType(scope.row.ActTypeId).title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="報名表單" prop="FormName" sortable></el-table-column>
        <el-table-column label="簽核狀態" prop="ArchiveStatus" sortable>
          <template slot-scope="scope">
            {{
              scope.row.Status == "W"
                ? "待審核"
                : scope.row.Status == "I"
                ? "審核中"
                : scope.row.Status == "E"
                ? "已簽核"
                : "未簽核"
            }}
          </template>
        </el-table-column> -->
        <!--<el-table-column label="匯入狀態" prop="ArchiveFiles" sortable>
          <template slot-scope="scope">{{getFileNum(scope.row.ArchiveFiles) ? "已匯入" : "未匯入"}}</template>
        </el-table-column>-->
        <el-table-column label="操作" width="420">
          <template slot-scope="scope">
            <!--<template slot-scope="scope"></template>-->
            <div class="iconList">
              <el-tooltip class="item" effect="dark" :content="'報到QRCode'" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="getQRCode(scope.row)">
                  <img class="" src="../../assets/svg/qrcode.svg" />
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'瀏覽'" placement="top" :open-delay="500" v-if="!showIcons(scope.row.Status)">
                <div class="iconListD" @click="goEdit(scope.row.Id)">
                  <i :class="'el-icon-view'"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'編輯'" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="goEdit(scope.row.Id)">
                  <i :class="'myicon-edit'"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="報表" placement="top" :open-delay="500">
                <div class="iconListD" @click="openChart(scope.row.Id)">
                  <i class="myicon-bar"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="新增報名" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="toShowJoin(scope.row)">
                  <i class="myicon-fa-solid_plus"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="報到" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="openCheckIn(scope.row)">
                  <i class="myicon-check-in"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="參與狀態" placement="top" :open-delay="500">
                <div class="iconListD" @click="goParticipate(scope.row.Id)">
                  <i class="myicon-twoPeople"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="編輯底稿" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="
                    ManuscriptTitle = scope.row.ActName;
                    EditManuscript({ ActivityId: scope.row.Id });
                  ">
                  <i class="myicon-mail"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="簽核" placement="top" :open-delay="500">
                <div class="iconListD" @click="goComplete(scope.row.Id)">
                  <i class="myicon-disk"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="識別證" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="goIdentificationCard(scope.row.Id)">
                  <i class="myicon-Identification-card"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="複製" placement="top" :open-delay="500">
                <div class="iconListD" @click="copy(scope.row)">
                  <i class="el-icon-document-copy"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="刪除" placement="top" :open-delay="500" v-if="showIcons(scope.row.Status)">
                <div class="iconListD" @click="del(scope.row)">
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
import moment from "moment";

import CertificateContent from "@/components/CertificateContent.vue";
import Join from "@/components/Join.vue";
import Page from "@/components/Page.vue";
export default {
  data() {
    return {
      showCheckBox: true,
      showQRCode: false,
      QRCodeURL: "",
      copyVisible: false,
      actForm: "",
      search: {
        sDate: "",
        eDate: "",
        status: "",
        page: this.$store.state.activeListPage || 1,
        key: "",
      },
      ChartForm: {
        ActivityId: "",
        sDate: "",
        eDate: "",
        regsDate: "",
        regeDate: "",
      },
      card: {
        ActivityName: "",
        ActivityId: "",
        account: "",
        type: 1,
      },
      searchResult: "",
      checkIn: false,
      checkInUser: "",
      showChart: false,
      ManuscriptTitle: "",
      showManuscript: false,
      showJoin: false,
      showJoinData: "",
      checkInNum: "1",
      searchData: [
        { id: 9789864778454, title: "與土地共築雙老夢" },
        { id: 4712847842243, title: "熱泡立體茶包" },
      ],
      list: [],
      FormList: [],
      changeList: [],
      chartList: "",
      tableTitle: [],
      checkList: [],
      CertificateContentList: [],
    };
  },
  watch: {
    tableTitle: {
      handler(val) {
        console.log(val);
      },
      deep: true,
    },
  },
  computed: {
    YYMMDD() {
      return (date) => moment(date).format("YYYY-MM-DD");
    },
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
    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    async getData(x) {
      this.$store.dispatch("loadingHandler", true);
      this.list = await this.$api
        .GetActivity(x)
        .then((res) => res.data.response);
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
    async codeComplete() {
      if (this.card.account) {
        this.$store.dispatch("loadingHandler", true);
        let flag = await this.$api
          .OtherCheckIn(this.card)
          .then((res) => res.data);
        flag.acc = this.card.account;
        this.checkInUser = flag;
        this.card.account = "";
        this.$store.dispatch("loadingHandler", false);
      } else {
        this.$alertT.fire({
          icon: "error",
          title: `請輸入身分證(校外)/教職員`,
        });
      }
    },
    async del(x, y = true) {
      if (y) {
        let yes = confirm("確定刪除?");
        if (!yes) return 0;
      }
      this.$store.dispatch("loadingHandler", true);
      let obj = { Id: x.Id };
      let obj2 = {
        actName: x.ActName,
        sDate: x.ActStartDate,
        eDate: x.ActEndDate,
      };
      await this.$api.GetCalendarEvent(obj2).then(async (res) => {
        console.log(res);
        await this.$api.DelEvent({ id: res.data.response });
      });
      await this.$api.DeleteActivity(obj).then((res) => {
        this.$alertT.fire({
          icon: res.data.success ? "success" : "error",
          title: `${res.data.msg}`,
        });
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
    findActType(x) {
      return this.$store.state.actType.filter((res) => res.Id == x)[0];
    },
    findActCategory(x) {
      return this.$store.state.actCategory.filter((res) => res.Id == x)[0];
    },
    findFormName(x) {
      return this.FormList.filter((res) => res.Id == x)[0];
    },
    getFileNum(x) {
      return JSON.parse(x).allFile.length > 0;
    },
    getTableCol(list, Id) {
      return list.filter((res) => res.FormDtlId == Id)[0];
    },
    openChart(x) {
      this.chartList = "";
      this.tableTitle = [];
      this.showChart = true;
      this.ChartForm.actId = x;
    },
    openCheckIn(data) {
      this.checkInUser = "";
      this.card.ActivityId = data.Id;
      this.card.ActivityName = data.ActName;
      this.checkIn = true;
    },
    async getChart() {
      this.chartList = [];
      this.tableTitle = [];
      this.checkList = [];
      this.chartList = await this.$api
        .GetRegisterReportData(this.ChartForm)
        .then((res) => res.data);
      for (let item of this.tableTitle) {
        item.Enable = true;
      }
      for (let item of Object.keys(this.chartList[0])) {
        let obj = {};
        obj.title = item;
        obj.Enable = true;
        this.checkList.push(obj);
      }
      console.log("ttt", this.checkList);
    },
    async EditManuscript(x) {
      this.$store.dispatch("loadingHandler", true);
      this.showManuscript = true;
      this.CertificateContentList = await this.$api
        .GetCertificateContentByActivityId(x)
        .then((res) => res.data.response);
      this.$store.dispatch("loadingHandler", false);
    },
    toShowJoin(x) {
      this.showJoinData = x;
      this.showJoin = true;
    },
    ConvertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";
      var title = Object.keys(array[0]);
      for (let i = 0; i < title.length; i++) {
        str += title[i] + ",";
      }
      str += "\r\n";
      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          if (String(array[i][index]).indexOf("#") != -1) continue;
          if (line != "") line += ",";

          line += array[i][index];
        }

        str += line + "\r\n";
      }

      return str;
    },
    async convertAndExport(obj, name = "data") {
      var csv = this.ConvertToCSV(obj);
      await this.delay(1000);
      var fileName = name;
      var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csv); //encodeURI用來轉為UTF-8編碼
      await this.delay(1000);
      var link = document.createElement("a");
      var body = document.querySelectorAll("body")[0];
      body.appendChild(link);
      link.download = fileName + ".csv";
      link.href = uri;
      link.click();
      link.remove();
    },
    delay(x) {
      return new Promise(function (resolve) {
        setTimeout(() => {
          resolve();
        }, x);
      });
    },
    toExportData() {
      let arr = [];
      let farr = this.checkList.filter((res) => res.Enable);
      console.log(this.checkList);

      for (let item of this.chartList) {
        let obj = {};
        for (let item2 of farr) {
          obj[item2.title] = item[item2.title];
        }
        arr.push(obj);
      }
      return arr;
      /*for (let data1 of this.chartList) {
        for (let data2 of data1.ActivityRegisterFormDtlViewModel) {
          data2.Enable = false;
          for (let data3 of farr) {
            if (data2.FormDtl == data3.ColumnName) {
              data2.Enable = true;
            }
          }
        }
      }*/
    },
    async toDownload() {
      this.$store.dispatch("loadingHandler", true);
      await this.convertAndExport(this.toExportData(), "報名");
      this.$store.dispatch("loadingHandler", false);
    },
    async copy(x) {
      let obj = { Id: x.Id };
      let user = window.localStorage.user
        ? JSON.parse(window.localStorage.user)
        : null;
      this.$store.dispatch("loadingHandler", true);
      this.copyVisible = true;
      this.actForm = await this.$api
        .GetActivityById(obj)
        .then((res) => res.data.response);
      this.actForm.ActName += " - Copy";
      this.actForm.UnitCode = user.UnitCode;
      this.$store.dispatch("loadingHandler", false);
    },
    async toCopy() {
      this.$store.dispatch("loadingHandler", true);
      let flag = await this.$api
        .PostActivity(this.actForm)
        .then((res) => res.data);
      this.$alertM.fire({
        icon: flag.success ? "success" : "error",
        title: flag.msg,
      });
      await this.getData(this.search);
      this.copyVisible = false;
    },
    async getQRCode(x) {
      this.$store.dispatch("loadingHandler", true);
      await this.$api.GetActImage({ actId: x.Id }).then((res) => {
        this.QRCodeURL = res.data.response;
      });
      this.showQRCode = true;
      this.$store.dispatch("loadingHandler", false);
    },
    toPrintQRCode() {
      let myWindow = window.open("", "", "width=500,height=500");
      myWindow.document.write("<img src='" + this.QRCodeURL + "'>");
      myWindow.document.close(); //missing code
      myWindow.focus();
      myWindow.print();
    },
    showIcons(x) {
      return x == "W";
    },
    goEdit(id) {
      console.log(id);
      this.$router.push({
        name: "ActivityEdit",
        query: { Id: id },
      });
      this.$store.dispatch("SaveActiveListPage", this.search.page);
    },
    goParticipate(id) {
      this.$router.push({
        name: "ActivityParticipate",
        query: { ActivityId: id },
      });
      this.$store.dispatch("SaveActiveListPage", this.search.page);
    },
    goComplete(id) {
      this.$router.push({
        name: "ActivityComplete",
        query: { Id: id },
      });
      this.$store.dispatch("SaveActiveListPage", this.search.page);
    },
    goIdentificationCard(id) {
      this.$router.push({
        name: "ActivityIdentificationCard",
        query: { ActivityId: id },
      });
      this.$store.dispatch("SaveActiveListPage", this.search.page);
    },
  },
};
</script>
