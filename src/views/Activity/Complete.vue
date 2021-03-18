<template>
  <div id="ActivityComplete">
    <Title :title="$router.currentRoute.meta.title"></Title>
    <div class="form" v-if="form.ArchiveFiles">
      <el-form ref="form" label-width="150px">
        <div style="display: flex">
          <el-form-item label="活動實際開始時間">
            <div>{{ YYYYMMDDhhmmss(form.ActStartDate) }}</div>
          </el-form-item>
          <el-form-item label="活動實際結束時間">
            <div>{{ YYYYMMDDhhmmss(form.ActEndDate) }}</div>
          </el-form-item>
        </div>
        <div style="
            border-width: 3px 0 0 0;
            border-style: solid;
            border-color: #dedede;
            padding: 28px 0;
          " v-if="form">
          <el-form-item label="簽到單掃描檔">
            <el-radio-group v-model="form.HasSign">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <span style="padding: 0 0 0 20px">若用紙本簽到，是否有掃描檔?</span>
          </el-form-item>
          <el-form-item label="徵稿啟事">
            <el-radio-group v-model="form.HasCallPapers" @change="importFile">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <span style="padding: 0 0 0 20px">若為學術研討會並公開徵稿，是否有提供徵稿啟事電子檔?</span>
          </el-form-item>
          <el-form-item label="研習活動錄影(音)著作權授權同意書">
            <el-radio-group v-model="form.HasVideoAgree">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <span style="padding: 0 0 0 20px">若活動現場有錄影錄音，是否有提供講者授權同意書?</span>
          </el-form-item>
          <el-form-item label="主持人">
            <el-radio-group v-model="form.HasHoster">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <span style="padding: 0 0 0 20px">主辦單位主管/計畫主持人是否有出席該活動?</span>
          </el-form-item>
        </div>
        <div style="
            border-width: 3px 0;
            border-style: solid;
            border-color: #dedede;
            padding: 28px 0;
          ">
          <el-form-item label="所有附件">
            <el-table :data="form.ArchiveFiles.allFile" style="width: 800px">
              <el-table-column label="附件名稱" prop="response">
                <template slot-scope="scope">{{
                  scope.row.path[0].response
                }}</template>
              </el-table-column>
              <el-table-column label="附件類別" prop="response">
                <template slot-scope="scope">{{ scope.row.type }}</template>
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
                    <a :href="
                        $store.state.fileBase +
                        'Files/' +
                        scope.row.path[0].response
                      " target="_blank">
                      <el-button type="primary">下載</el-button>
                    </a>
                    <el-button type="danger" style="margin: 0 0 0 10px" v-if="form.Status == 'W'" @click="FilesRemove(scope.$index)">刪除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="上傳附件" v-if="form.Status == 'W'">
              <div style="display: flex">
                <el-select v-model="addFileForm.type" placeholder="請選擇">
                  <el-option v-if="form.HasSign" label="簽到單掃描檔" value="簽到單掃描檔"></el-option>
                  <el-option v-if="form.HasCallPapers" label="徵稿啟事" value="徵稿啟事"></el-option>
                  <el-option v-if="form.HasVideoAgree" label="研習活動錄影(音)著作權授權同意書" value="研習活動錄影(音)著作權授權同意書"></el-option>
                  <el-option v-if="form.HasHoster" label="主持人參與證明" value="主持人參與證明"></el-option>
                </el-select>
                <el-upload :show-file-list="false" :action="$store.state.apiBase + 'Img'" :headers="{ authorization: 'Bearer ' + $store.state.token }" :on-success="
                    (res, file) => {
                      return successUpdata(
                        res,
                        file,
                        'path',
                        true,
                        'addFileForm'
                      );
                    }
                  ">
                  <el-button size="small" type="primary">點擊上傳</el-button>
                </el-upload>
                <a v-for="(item, index) in addFileForm.path" :href="$store.state.fileBase + item.response" :key="index" target="_blank">{{ item.response }}</a>
              </div>
            </el-form-item>
            <el-form-item label="附件說明" v-if="form.Status == 'W'">
              <!--<Ck v-model="addFileForm.remark"></Ck>-->
              <el-input style="width: 240px" v-model="addFileForm.remark"></el-input>
              <el-button type="primary" style="margin: 0 0 0 10px" @click="toAddFile" v-if="addFileForm.path.length">確定送出</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <!-- 雲科大報表 -->
      <div>
        <h2>雲科大報表</h2>
        <el-table :data="NYUST_list" header-cell-class-name="tableHeader" max-height="600">
          <el-table-column v-for="(item, index) in listTitle" :label="item" :prop="item" :key="index" sortable></el-table-column>
          <el-table-column label="證書字號">
            <template slot-scope="scope">
              <p v-if="scope.row.證書連結">{{ scope.row.證書字號 }}</p>
              <i v-else class="fa-times fas"></i>
            </template>
          </el-table-column>
          <el-table-column label="證書連結">
            <template slot-scope="scope">
              <a v-if="scope.row.證書連結" target="blank" :href="scope.row.證書連結">
                <i class="el-icon-view"></i></a>
              <i v-else class="fa-times fas"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 簽核紀錄 -->
      <div>
        <h2>簽核紀錄</h2>
        <el-table header-cell-class-name="tableHeader" :data="GetActivityFlowLogList" style="width: 100%" max-height="600">
          <el-table-column label="順序">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="審核人" prop="UserId"></el-table-column>
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
    </div>
    <div class="formButtonList">
      <el-button type="primary" @click="$router.go(-1)">回上一頁</el-button>
      <el-button type="primary" @click="sub" v-if="form.Status == 'W'" :disabled="!canSub">簽核</el-button>
      <span style="display: inline-block; margin-left: 1rem; color: red" v-if="!canSub">請確認對應簽核檔案是否正確上傳</span>
      <el-button type="primary" @click="toEdit" v-if="form.Status == 'I'">取消簽核</el-button>
    </div>
  </div>
</template>

<script>
//"archiveFiles": "string",
//"archiveStatus": true,
import moment from "moment";
import Title from "@/components/Title.vue";
export default {
  components: { Title },
  data() {
    return {
      step: 1,
      form: {},
      GetActivityFlowLogList: [],
      addFileForm: {
        type: "",
        path: "",
        remark: "",
      },
      search: {
        key: "",
        startDate: "",
        endDate: "",
        actStatus: "",
        actid: this.$route.query.Id,
      },
      NYUST_list: [],
    };
  },
  computed: {
    showIcons() {
      return this.form.Status == "W";
    },
    canSub() {
      let flag = true;
      if (this.form.HasSign) {
        let num = this.form.ArchiveFiles.allFile.filter(
          (res) => res.type == "簽到單掃描檔"
        ).length;
        if (!num) flag = false;
      }
      if (this.form.HasCallPapers) {
        let num = this.form.ArchiveFiles.allFile.filter(
          (res) => res.type == "徵稿啟事"
        ).length;
        if (!num) flag = false;
      }
      if (this.form.HasVideoAgree) {
        let num = this.form.ArchiveFiles.allFile.filter(
          (res) => res.type == "研習活動錄影(音)著作權授權同意書"
        ).length;
        if (!num) flag = false;
      }
      if (this.form.HasHoster) {
        let num = this.form.ArchiveFiles.allFile?.filter(
          (res) => res.type == "主持人參與證明"
        ).length;
        if (!num) flag = false;
      }
      return flag;
    },
    listTitle() {
      if (this.NYUST_list && this.NYUST_list[0]) {
        return Object.keys(this.NYUST_list[0]).filter(
          (i) => i !== "證書連結" && i !== "證書字號"
        );
      } else {
        return [];
      }
    },
  },
  async created() {
    if (this.$router.currentRoute.query.Id) {
      this.GetActivityFlowLogList = await this.$api
        .GetActivityFlowLog({
          actId: this.$router.currentRoute.query.Id,
        })
        .then((res) => res.data.response);
      this.form = await this.$api
        .GetActivityById({ Id: this.$router.currentRoute.query.Id })
        .then((res) => res.data.response);
      let getFileStatue = JSON.parse(this.form.ArchiveFiles).allFile;
      if (getFileStatue.length === 0 && this.form.Status == "W") {
        this.form.HasSign = true;
        this.form.HasHoster = true;
      }
      if (!this.form.ArchiveFiles) {
        this.form.ArchiveFiles = {
          start: "",
          end: "",
          auth: "",
          noAuth: "",
          allFile: [],
        };
      } else {
        this.form.ArchiveFiles = JSON.parse(this.form.ArchiveFiles);
      }
    }
    this.getData();
  },
  methods: {
    async sub() {
      let flag = "";
      this.$store.dispatch("loadingHandler", true);
      this.form.ArchiveFiles = JSON.stringify(this.form.ArchiveFiles);

      await this.$api.PutActivity(this.form).then((res) => {
        this.setAct();
      });
    },
    setAct() {
      this.$api
        .SetActivityById({
          id: this.$route.query.Id,
        })
        .then((res) => {
          if (!res.data.success) {
            this.$alertM.fire({ icon: "error", title: res.data.msg });
            this.$store.dispatch("loadingHandler", false);
            this.$router.push("/Activity/List");
          } else {
            this.$alertM.fire({ icon: "success", title: res.data.msg });
            this.$store.dispatch("loadingHandler", false);
            this.$router.push("/Activity/List");
          }
        });
    },
    successUpdata(res, file, name, clear = false, target = "form") {
      if (clear) {
        this[target][name] = [];
      }
      res.remark = "";
      this[target][name].push(res);
      console.log(this.addFileForm.path);
    },
    FilesRemove(x, target = "ArchiveFiles") {
      this.form.ArchiveFiles.allFile.splice(x, 1);
    },
    YYYYMMDDhhmmss(x) {
      return moment(x).format("YYYY-MM-DD HH:mm:ss");
    },
    async toEdit() {
      let subForm = {
        actId: this.$router.currentRoute.query.Id,
      };
      let flag = await this.$api
        .CancelFlowStatusBySelf(subForm)
        .then((res) => res.data);
      this.$alertM.fire({
        icon: flag.success ? "success" : "error",
        title: flag.msg,
      });
      if (this.$router.currentRoute.query.Id) {
        this.GetActivityFlowLogList = await this.$api
          .GetActivityFlowLog({
            actId: this.$router.currentRoute.query.Id,
          })
          .then((res) => res.data.response);

        this.form = await this.$api
          .GetActivityById({ Id: this.$router.currentRoute.query.Id })
          .then((res) => res.data.response);
        if (!this.form.ArchiveFiles) {
          this.form.ArchiveFiles = {
            start: "",
            end: "",
            auth: "",
            noAuth: "",
            allFile: [],
          };
        } else {
          this.form.ArchiveFiles = JSON.parse(this.form.ArchiveFiles);
        }
      }
      this.showEdit = false;
    },
    toAddFile() {
      console.log(this.form.ArchiveFiles);
      console.log(this.form.ArchiveFiles.allFile);
      this.form.ArchiveFiles.allFile.push(this.addFileForm);
      this.addFileForm = {
        type: "簽到單掃描檔",
        path: "",
        remark: "",
      };
    },
    importFile(x) {
      if (!x) return 0;
      let arr = JSON.parse(this.form.SolicitFile);
      arr = arr.filter((res) => res);
      if (!arr.length) return 0;
      this.form.ArchiveFiles.allFile.push({
        type: "徵稿啟事",
        path: [arr[0]],
        remark: "",
      });
      console.log(this.form.ArchiveFiles.allFile);
    },
    async getData() {
      this.NYUST_list = await this.$api
        .GetActivityExcelList(this.search)
        .then((res) => res.data.response);
    },
  },
};
</script>
