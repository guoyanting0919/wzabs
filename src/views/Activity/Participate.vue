<template>
  <div id="ActivityParticipate">
    <el-dialog :close-on-click-modal="false" title="匯入參與者" :visible.sync="importBoxShow" width="500px">
      <div>
        <p>匯入參與者表單:請先利用"匯出參與者表單"格式匯入</p>
        <p>
          匯入參與者帳號:<a href="./download/Sample.xlsx" download>範例檔(下載)</a>
        </p>
      </div>
      <div class="formButtonList">
        <el-upload style="margin: 0 12px 0 0" :action="
            $store.state.apiBase +
            'ActivityRegister/ImportActMemberExcel/xlsx?ActId=' +
            $router.currentRoute.query.ActivityId
          " :headers="{ authorization: 'Bearer ' + $store.state.token }" :on-success="successUpload" :on-error="successUpload">
          <el-button type="primary">匯入參與者表單</el-button>
        </el-upload>
        <el-upload :action="
            $store.state.apiBase +
            'ActivityRegister/ImportActExcel/xlsx?ActId=' +
            $router.currentRoute.query.ActivityId
          " :headers="{ authorization: 'Bearer ' + $store.state.token }" :on-success="successUpload" :on-error="successUpload">
          <el-button type="primary">匯入參與者帳號</el-button>
        </el-upload>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="請輸入郵件內容" :visible.sync="inputHTMLSetNoShow" width="1000px">
      <Ck v-model="email.htmltxt"></Ck>
      <div class="formButtonList">
        <el-button type="primary" @click="forSendEmail(2)">確定發送</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="修改" :visible.sync="isEdit" width="500px">
      <el-tabs v-model="editType" type="card">
        <el-tab-pane label="用户管理" name="1">
          <el-form ref="form" label-width="150px">
            <el-form-item v-for="(item, index) in editUser.form" :label="idToTitle(item.FormDtlId).ColumnName" :key="index">
              <el-input v-model="item.InputVal"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="2">
          <el-form ref="form" label-width="150px">
            <el-form-item label="參與狀態">
              <el-select v-model="editUser.user.Status" placeholder="請選擇參與狀態">
                <el-option v-for="(item, index) in this.$store.state.EventStatus" :key="item.index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="參與方式">
              <el-select v-model="editUser.user.JoinType" placeholder="請選擇參與方式">
                <el-option v-for="(item, index) in this.$store.state.JoinType" :key="item.index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="授課或系所相關">
              <el-select
                v-model="editUser.user.IsTeach"
                placeholder="請選擇授課或系所相關"
              >
                <el-option :value="true" label="是"></el-option>
                <el-option :value="false" label="否"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="參與時數">
              <el-input-number v-model="editUser.user.JoinTime" :precision="1" :step="0.1" :min="0"></el-input-number>
            </el-form-item>
            <!--<el-form-item label="服務名稱">
              <el-input style="width:300px;" v-model="editUser.user.ServiceName"></el-input>
            </el-form-item>-->
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="formButtonList">
        <el-button type="primary" @click="sub">儲存並返回</el-button>
      </div>
    </el-dialog>

    <Title :title="$router.currentRoute.meta.title + ' - ' + ActivityData.ActName"></Title>

    <div class="buttonBox" v-if="ActivityData.Status == 'W'">
      <!-- 第一排按鈕 -->
      <div class="btnCol">
        <el-button @click="exportTable">匯出簽到表</el-button>
        <el-button @click="forSendEmail(1)" :disabled="!updatedIds.length">發送通知郵件</el-button>
        <el-button @click="inputHTMLSetNoShow = true" :disabled="!updatedIds.length">發送郵件</el-button>
        <el-button @click="SetNo" :disabled="!updatedIds.length || !canExport">生成聘函/證書字號</el-button>
        <el-button @click="handleDeleteMembers" :disabled="!updatedIds.length">刪除</el-button>
      </div>

      <!-- 第二排按鈕 -->
      <div class="btnCol">
        <el-select v-model="eventStatus" placeholder="請選擇參與狀態">
          <el-option v-for="(item, index) in this.$store.state.EventStatus" :key="item.index" :label="item" :value="String(index)"></el-option>
        </el-select>

        <el-select v-model="JoinType" placeholder="請選擇參與方式">
          <el-option v-for="(item, index) in this.$store.state.JoinType" :key="item.index" :label="item" :value="String(index)"></el-option>
        </el-select>

        <el-input style="width: 230px" v-model="serviceHour" placeholder="更改參與時數"></el-input>

        <el-button @click="handleConfirmChange">確定變更</el-button>
      </div>

      <!-- 第三排按鈕 -->
      <div class="btnCol">
        <el-button @click="toDownload">匯出參與表單</el-button>
        <el-button @click="importBoxShow = true">匯入參與者</el-button>
      </div>

      <!-- <el-button
            :disabled="!eventStatus || updatedIds.length == 0"
            @click="UpdateBatchMeeting('1')"
            >更改參與狀態</el-button
          > -->
      <!-- <div class="buttonBoxItem">
          <el-select v-model="isTeach" placeholder="請選擇授課或系所相關">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
          <el-button
            :disabled="!isTeach || updatedIds.length == 0"
            @click="UpdateBatchMeeting('3')"
            >更改授課或系所相關</el-button
          >
          <div class="buttonBoxItemText">登錄原則</div>
        </div> -->
      <!--<div class="buttonBoxItem">
          <el-button @click="changeToTop" :disabled="updatedIds.length!==1">移動到頂端</el-button>
          <el-button @click="changeSortUp" :disabled="updatedIds.length!==1">上移</el-button>
          <el-button @click="changeSortDown" :disabled="updatedIds.length!==1">下移</el-button>
          <el-button @click="changeSortBottom" :disabled="updatedIds.length!==1">移動到底部</el-button>
          <el-button @click="sortConfirm">更改排序</el-button>
        </div>-->
      <!-- <el-button
            :disabled="!JoinType || updatedIds.length == 0"
            @click="UpdateBatchMeeting('2')"
            >更改參與方式</el-button
          > -->
      <!-- <el-button
            :disabled="!serviceHour || updatedIds.length == 0"
            @click="PostBatchJoinTime"
            >更改參與時數</el-button
          > -->
    </div>

    <el-table v-if="completeList" header-cell-class-name="tableHeader" :data="list" style="width: 100%" ref="articleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="報名序號" :prop="'報名序號'" sortable></el-table-column>
      <el-table-column label="參與狀態" :prop="'Status'" sortable>
        <template slot-scope="scope">{{
          $store.state.EventStatus[scope.row["參與狀態"]]
        }}</template>
      </el-table-column>
      <el-table-column label="參與方式" :prop="JoinType" sortable>
        <template slot-scope="scope">{{
          $store.state.JoinType[scope.row["參與方式"]]
        }}</template>
      </el-table-column>
      <el-table-column label="證書字號" :prop="JoinType" sortable>
        <template slot-scope="scope">
          {{ scope.row.CertificateNo || "無" }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in listTitle" :label="item" :key="index" :prop="item" sortable>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :open-delay="500" placement="top-start">
            <div slot="content">
              <span>{{ scope.row[item] }}</span>
            </div>
            <span class="textOverflow">{{ scope.row[item] }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column label="授課或系所相關" sortable>
        <template slot-scope="scope">{{
          isTeachFilter(scope.row.IsTeach)
        }}</template>
      </el-table-column> -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <div class="iconList">
            <div class="iconListD" @click="
                ArrayMove(
                  list,
                  scope.$index,
                  scope.$index - 1 == -1 ? list.length - 1 : scope.$index - 1,
                  scope.row
                );
                ChangeActSort();
              ">
              <i class="MenuSortListIcon myicon-arrow-up-2"></i>
            </div>

            <div class="iconListD" @click="
                ArrayMove(
                  list,
                  scope.$index,
                  scope.$index + 1 == list.length ? 0 : scope.$index + 1,
                  scope.row
                );
                ChangeActSort();
              ">
              <i class="MenuSortListIcon myicon-arrow-down-2"></i>
            </div>

            <el-tooltip class="item" effect="dark" content="列印證書" placement="top" :open-delay="500" v-if="scope.row.RegistNo">
              <a :href="$store.state.fileBase + scope.row.RegistNo + '.pdf'" target="_blank">
                <div class="iconListD" @click="showPreview(scope.row)">
                  <i class="el-icon-tickets"></i>
                </div>
              </a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="編輯" placement="top" :open-delay="500" v-if="ActivityData.Status == 'W'">
              <div class="iconListD" @click="toEdit(scope.row)">
                <i class="myicon-edit"></i>
              </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刪除" placement="top" :open-delay="500" v-if="ActivityData.Status == 'W'">
              <div class="iconListD" @click="del(scope.row.RegId)">
                <i class="myicon-delete"></i>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="statusBox" style="display:flex">
      <p class='statusItem'>已報名:{{ joinNum('0') }}人</p>
      <p class='statusItem'>參加:{{ joinNum('1') }}人</p>
      <p class='statusItem'>主辦:{{ joinNum('2') }}人</p>
      <p class='statusItem'>取消:{{ joinNum('3') }}人</p>
      <p class='statusItem'>合計:{{ completeList.length }}人</p>

    </div>
    <CertificatePreview :user="userData" :act="ActivityData" :img="CertificateTemp.CertBackImg" :text="CertificateTempType[0].CertContents" ref="Preview" v-if="
        CertificateTemp &&
        CertificateTemp.CertBackImg &&
        CertificateTempType[0] &&
        CertificateTempType[0].CertContents
      "></CertificatePreview>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import CertificatePreview from "@/components/CertificatePreview.vue";
import Ck from "@/components/Ck.vue";
export default {
  components: { Title, CertificatePreview, Ck },
  data() {
    return {
      serviceHour: "",
      importBoxShow: false,
      inputHTMLSetNoShow: false,
      CertificatePreviewShow: false,
      CertificateTemp: "",
      CertificateTempType: "",
      ActivityData: "",
      userData: "",
      FormData: "",
      step: 1,
      list: [],
      eventStatus: "",
      JoinType: "",
      isTeach: "",
      serviceName: "",
      updatedIds: [],
      isEdit: false,
      inputHTMLShow: false,
      editType: "1",
      editUser: {
        form: [],
        user: {},
      },
      email: {
        actId: "",
        memberIds: "",
        useDefault: "",
        htmltxt: "",
      },
    };
  },
  computed: {
    listNum() {
      return this.list.filter(
        (res) => res["參與狀態"] == 1 || res["參與狀態"] == 2
      ).length;
    },
    listTitle() {
      let arr = this.list[0] ? Object.keys(this.list[0]) : [];
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
      return vm.list.map((member) => {
        idx++;
        return member;
      });
    },
    completeList() {
      return this.sortList.sort(function (a, b) {
        return a["報名序號"] - b["報名序號"];
      });
    },

    canExport() {
      return (
        this.completeList.filter((item) => {
          return (
            this.updatedIds.includes(item.RegId) &&
            (item.參與狀態 == "1" || item.參與狀態 == "2")
          );
        }).length > 0
      );
      // let num = 0;
      // for (let item of this.updatedIds) {
      //   let data = this.list.filter((res) => res.RegId == item)[0];
      //   if (data?.Status == 1 || data?.Status == 2) {
      //     num++;
      //   }
      // }
      // if (num == this.updatedIds.length) {
      //   return true;
      // } else {
      //   return false;
      // }
    },
  },
  methods: {
    async getData() {
      const vm = this;
      let obj = {
        actId: this.$router.currentRoute.query.ActivityId,
        regsDate: "",
        regeDate: "",
        cDate: "",
        eDate: "",
      };
      await vm.$api.GetRegisterJoinData(obj).then((res) => {
        vm.list = res.data;
        console.log(vm.list);
        vm.list.forEach((res) => (res.Sort = Number(res.Sort)));
      });
      this.$store.dispatch("loadingHandler", false);
      this.importBoxShow = false;
    },

    /* 批量刪除 */
    handleDeleteMembers() {
      const vm = this;
      let flag = confirm("確定刪除?");
      if (!flag) return 0;
      this.$store.dispatch("loadingHandler", true);
      vm.updatedIds.forEach((x, idx) => {
        // x -> 人員ID   idx -> index  updatedIds.length -> 勾選數量
        // console.log(x, idx, vm.updatedIds.length);
        vm.$api
          .DeleteActivityRegister({
            Id: x,
          })
          .then((res) => {
            if (vm.updatedIds.length == idx + 1) {
              vm.getData();
            }
          });
      });
    },
    handleConfirmChange() {
      const vm = this;
      let ids = JSON.parse(JSON.stringify(vm.updatedIds));
      let arr = [];
      if (ids.length !== 0) {
        if (vm.JoinType && !vm.eventStatus) {
          arr.push("2");
        } else if (vm.eventStatus && !vm.JoinType) {
          arr.push("1");
        } else if (vm.JoinType && vm.eventStatus) {
          arr.push("2", "1");
        }
        async function UPD() {
          for (let index = 0; index < arr.length; index++) {
            await vm.UpdateBatchMeeting(arr[index], ids);
          }
        }
        UPD();
      } else {
        vm.$alertM.fire({
          icon: "error",
          title: "請選擇至少一項欲更改之項目",
        });
      }
    },
    joinNum(status) {
      return this.completeList.filter((i) => i.參與狀態 == status).length;
    },
    handleSelectionChange(val) {
      const vm = this;
      vm.updatedIds = val.map((member) => {
        return member.RegId;
      });
    },
    isTeachFilter(item) {
      return item == "True" ? "是" : "否";
    },
    async UpdateBatchMeeting(uType, ids) {
      console.log("api");
      const vm = this;
      let data = ids;
      let uValue = uType == "1" ? vm.eventStatus : vm.JoinType;
      let params = {
        uType,
        uValue: uValue || 0,
        uService: vm.serviceName || "",
      };
      await vm.$api.UpdateBatchMeeting(params, data).then((res) => {
        vm.getData();
        // vm.serviceName = "";
        // vm.eventStatus = "";
        // vm.JoinType = "";
        // vm.isTeach = "";
        // if (res.data.success) {
        //   vm.$alertM.fire({
        //     icon: "success",
        //     title: res.data.msg,
        //   });
        //   // vm.getData();
        // } else {
        //   vm.$alertM.fire({
        //     icon: "error",
        //     title: res.data.msg,
        //   });
        // }
      });
    },

    changeSortUp() {
      const vm = this;
      let sortId = vm.updatedIds.join();
      let num;
      let flag = true;
      vm.sortList.map((member) => {
        if (member.Id == sortId) {
          num = member.Sort;
          member.Sort = member.Sort - 1;
          return member;
        } else {
          return member;
        }
      });
      vm.sortList.map((member) => {
        if (member.Sort == num - 1 && flag) {
          member.Sort = member.Sort + 1;
          flag = false;
          return member;
        } else {
          return member;
        }
      });
    },
    changeSortDown() {
      const vm = this;
      let sortId = vm.updatedIds.join();
      let num;
      let flag = true;
      vm.sortList.map((member) => {
        if (member.Id == sortId) {
          num = member.Sort;
          member.Sort = member.Sort + 1;
          return member;
        } else {
          return member;
        }
      });
      vm.sortList.map((member) => {
        if (member.Sort == num + 1 && flag) {
          flag = false;
          return member;
        } else {
          if (member.Sort == num + 1) {
            member.Sort = member.Sort - 1;
          } else {
            return member;
          }
        }
      });
    },
    changeToTop() {
      const vm = this;
      let sortId = vm.updatedIds.join();
      let num = [];
      vm.sortList.map((m) => {
        if (m.Id === sortId) {
          num.push(m);
        }
      });
      let theSort = num[0].Sort;
      // console.log(theSort);
      vm.sortList.map((member) => {
        if (member.Id == sortId) {
          member.Sort = 1;
          return member;
        } else {
          if (member.Sort <= theSort) {
            member.Sort = member.Sort + 1;
            return member;
          } else {
            return member;
          }
        }
      });
    },
    changeSortBottom() {
      const vm = this;
      let sortId = vm.updatedIds.join();
      let num = [];
      vm.sortList.map((m) => {
        if (m.Id === sortId) {
          num.push(m);
        }
      });
      let theSort = num[0].Sort;
      let max = vm.sortList.length;
      // console.log(theSort);
      vm.sortList.map((member) => {
        if (member.Id == sortId) {
          member.Sort = max;
          return member;
        } else {
          if (member.Sort >= theSort) {
            member.Sort = member.Sort - 1;
            return member;
          } else {
            return member;
          }
        }
      });
    },
    sortConfirm() {
      const vm = this;
      let data = [];
      vm.sortList.forEach((member) => {
        let obj = {
          id: member.Id,
          sort: member.Sort,
        };
        data.push(obj);
      });
      console.log(data);
      vm.$api.ChangeSort(data).then((res) => {
        if (res.data.success) {
          vm.$alertM.fire({
            icon: "success",
            title: res.data.msg,
          });
          vm.getData();
        }
      });
    },
    async del(x) {
      let flag = confirm("確定刪除?");
      if (!flag) return 0;
      const vm = this;
      await vm.$api
        .DeleteActivityRegister({
          Id: x,
        })
        .then((res) => {
          this.$alertM.fire({
            icon: res.data.success ? "success" : "error",
            title: res.data.msg,
          });
        });
      vm.getData();
    },
    async toEdit(x) {
      this.$store.dispatch("loadingHandler", true);
      this.editUser.form = await this.$api
        .GetByActivityRegisterId({ ActivityRegisterId: x.RegId })
        .then((res) => res.data.response);
      this.editUser.user = await this.$api
        .GetActivityRegisterByUserId({ Id: x.RegId })
        .then((res) => res.data.response);
      this.isEdit = true;
      this.$store.dispatch("loadingHandler", false);
    },
    async sub() {
      const vm = this;
      let count = 0;
      this.$store.dispatch("loadingHandler", true);
      await vm.$api.PutActivityRegister(this.editUser.user).then((res) => {
        count++;
      });
      await vm.$api.PutActivityRegisterDtl(this.editUser.form).then((res) => {
        count++;
      });
      if (count == 2) {
        this.$alertM.fire({
          icon: "success",
          title: "更改成功",
        });
        this.isEdit = false;
      }
      vm.getData();
      this.$store.dispatch("loadingHandler", false);
    },
    idToTitle(x) {
      return this.FormData.FormDtlDTO.filter((res) => res.Id == x)[0];
    },
    toDownload() {
      window.open(
        this.$store.state.apiBase +
          "ActivityRegister/GetActMemberExcel?ActivityId=" +
          this.$router.currentRoute.query.ActivityId
      );
    },
    delay(x) {
      return new Promise(function (resolve) {
        setTimeout(() => {
          resolve();
        }, x);
      });
    },
    async showPreview(x) {
      if (!this.ActivityData.CertificateId) {
        this.$alertM.fire({
          icon: "error",
          title: "該活動沒設置證書底圖",
        });
        return 0;
      }
      this.$store.dispatch("loadingHandler", true);

      this.userData = await this.$api
        .GetMemberById({ Id: x.MemberId })
        .then((res) => res.data.response);

      this.CertificateTemp = await this.$api
        .GetCertificateContentById({ id: this.ActivityData.CertificateId })
        .then((res) => res.data.response);

      this.CertificateTempType = await this.$api
        .GetCertificateContentByActivityId({
          ActivityId: this.$router.currentRoute.query.ActivityId,
        })
        .then((res) => res.data.response);

      this.CertificatePreviewShow = true;
      await this.delay(500);
      // this.$refs.Preview.toPrint();
      this.$store.dispatch("loadingHandler", false);
    },

    async exportTable() {
      let path = await this.$api
        .OutputSignExcel({ actId: this.$router.currentRoute.query.ActivityId })
        .then((res) => res.data);
      window.open(this.$store.state.OutputSignExcelBase + path);
    },
    async forSendEmail(x) {
      this.$store.dispatch("loadingHandler", true);
      for (let item of this.updatedIds) {
        let memberIds = this.list.filter((res) => res.RegId == item)[0].MemId;
        this.email.actId = this.$router.currentRoute.query.ActivityId;
        this.email.memberIds = memberIds;
        this.email.useDefault = x;
        if (x == 1) this.email.htmltxt = "";
        await this.$api.SendMail(this.email);
      }
      this.$alertM.fire({
        icon: "success",
        title: "郵件批量發送完成",
      });
      this.inputHTMLShow = false;
      //this.$refs.articleTable.clearSelection();
      this.$store.dispatch("loadingHandler", false);
    },
    async SetNo() {
      this.$store.dispatch("loadingHandler", true);
      let setNoItems = this.completeList.filter((item) => {
        return (
          this.updatedIds.includes(item.RegId) &&
          (item.參與狀態 == "1" || item.參與狀態 == "2")
        );
      });

      console.log(setNoItems);

      let resStatus = [];
      for (let [idx, item] of setNoItems.entries()) {
        let obj = {
          activityRegId: item.RegId,
          memberId: item.MemId,
        };
        let name = item["姓名/Name"] || "主辦";
        console.log(item);
        this.$api.SetNo(obj).then((res) => {
          if (!res.data.success) {
            resStatus.push(`${name}${res.data.msg}無法生成證書`);
          }

          if (idx == setNoItems.length - 1) {
            this.$alertM.fire({
              icon: resStatus.length == 0 ? "success" : "error",
              title: resStatus.length == 0 ? "批量生成完畢" : resStatus,
            });
            this.getData();
          }
        });
      }

      this.$store.dispatch("loadingHandler", false);
    },

    async PostBatchJoinTime() {
      this.$store.dispatch("loadingHandler", true);
      let data = { list: this.updatedIds, jointime: this.serviceHour };
      let flag = await this.$api
        .PostBatchJoinTime(data)
        .then((res) => res.data);
      this.$alertM.fire({
        icon: "success",
        title: flag.msg,
      });
      this.$store.dispatch("loadingHandler", false);
    },
    successUpload(res) {
      this.$alertM.fire({
        icon: res.success ? "success" : "error",
        title: res.msg,
      });
      this.getData();
    },
    ArrayMove(arr, old_index, new_index, row) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      row.CRow = new_index + 1;
      return arr;
    },
    async ChangeActSort() {
      this.$store.dispatch("loadingHandler", true);
      let arr = [];
      for (let item of this.list) {
        arr.push(item.RegId);
      }
      await this.$api.ChangeActSort(arr);
      await this.getData();
      this.$store.dispatch("loadingHandler", false);
    },
  },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    this.getData();
    this.ActivityData = await this.$api
      .GetActivityById({ Id: this.$router.currentRoute.query.ActivityId })
      .then((res) => res.data.response);
    this.FormData = await this.$api
      .GetFormById({ Id: this.ActivityData.FormId })
      .then((res) => res.data.response);
    this.$store.dispatch("loadingHandler", false);
  },
};
</script>