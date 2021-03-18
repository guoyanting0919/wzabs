<template>
  <div id="ActivityEdit" @click="canSave = true">
    <div class="Step">
      <el-steps :active="step" style="width: 1000px">
        <el-step
          title="步驟一：活動基本確認"
          @click.native="subTemp('form', 1)"
          style="cursor: pointer"
        ></el-step>
        <el-step
          title="步驟二：前台資訊確認"
          @click.native="subTemp('form', 2)"
          style="cursor: pointer"
        ></el-step>
        <el-step
          title="步驟三：報名欄位確認"
          @click.native="subTemp('form', 3)"
          style="cursor: pointer"
        ></el-step>
      </el-steps>
    </div>
    <Title
      :title="
        step == 1
          ? '步驟一：活動基本確認'
          : step == 2
          ? '步驟二：前台資訊確認'
          : '步驟三：報名欄位確認'
      "
    ></Title>
    <div class="form">
      <el-form ref="form" :rules="rules" label-width="150px" :model="form">
        <div v-if="step == 1">
          <el-form-item label="活動名稱" prop="ActName">
            <el-input style="width: 300px" v-model="form.ActName"></el-input>
          </el-form-item>
          <el-form-item label="主辦單位">
            <el-input
              style="width: 300px"
              v-model="form.ActOrganizer"
            ></el-input>
            <p class="red">請填寫完整校名+單位全名，</p>
            <p class="red">如：文藻外語大學學生事務處生活輔導組</p>
            <p class="red">請填寫完整校名+學院全名+系所全名，</p>
            <p class="red">如：文藻外語大學歐亞語文學院法國語文系</p>
          </el-form-item>
          <el-form-item label="活動類別" prop="ActTypeId">
            <el-select v-model="form.ActTypeId" placeholder="請選擇">
              <el-option
                v-for="item in $store.state.actType"
                :key="item.Id"
                :label="item.title"
                :value="item.Id"
              ></el-option>
            </el-select>
            <el-input
              style="width: 240px"
              v-model="form.ActTypeOther"
              v-if="form.ActTypeId == 5"
            ></el-input>
            <p class="red">
              與論文發表有關的活動，請選學術研討會，其他與講授有關的活動，請選研習。
            </p>
          </el-form-item>
          <el-form-item label="活動型態">
            <el-select v-model="form.ActCategoryId" placeholder="請選擇">
              <el-option
                v-for="item in $store.state.actCategory"
                :key="item.Id"
                :label="item.title"
                :value="item.Id"
              ></el-option>
            </el-select>
            <el-input
              style="width: 240px"
              v-model="form.ActCategoryOther"
              v-if="form.ActCategoryId == 3"
            ></el-input>
          </el-form-item>
          <el-form-item label="簡單說明">
            <Ck
              v-model="form.ActSummary"
              :width="'598px'"
              v-if="step == 1"
            ></Ck>
          </el-form-item>
          <el-form-item label="上傳圖檔">
            <div v-for="(item, index) in form.ActImg" :key="index">
              <a
                :href="$store.state.fileBase + item.response"
                target="_blank"
                >{{ item.response }}</a
              >
              <el-button
                type="danger"
                class="removeFile"
                @click="FilesRemove(index, 'ActImg')"
                >刪除</el-button
              >
            </div>
            <el-upload
              :show-file-list="false"
              :action="$store.state.apiBase + 'Img'"
              :headers="{ authorization: 'Bearer ' + $store.state.token }"
              :on-success="
                (res, file) => {
                  return successUpdata(res, file, 'ActImg', true);
                }
              "
            >
              <el-button size="small" type="primary">點擊上傳</el-button>
            </el-upload>
            <p class="red">推薦尺寸為350px * 200px</p>
            <p class="red">若為滿版，推薦尺寸則為寬度1000px，高度不限</p>
          </el-form-item>
          <el-form-item label="頁面布局">
            <p>請選擇頁面佈局</p>
            <p class="red">此設定為圖片與文字於前台顯示之版面配置。</p>
            <el-radio-group v-model="form.WebMode">
              <el-radio :label="1">
                <img src="@/assets/img/GroupLeft.svg" />
              </el-radio>
              <el-radio :label="2">
                <img src="@/assets/img/GroupRight.svg" />
              </el-radio>
              <el-radio :label="3">
                <img src="@/assets/img/GroupCenter.svg" />
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活動開始時間">
            <el-date-picker
              v-model="form.ActStartDate"
              type="datetime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="請選擇日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活動結束時間">
            <el-date-picker
              v-model="form.ActEndDate"
              type="datetime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="請選擇日期"
            ></el-date-picker>
            <p class="red">
              請務必設定正確的活動開始與結束時間，以免造成前台顯示錯誤，與匯入錯誤
              資訊至教師歷程中。
            </p>
          </el-form-item>
          <el-form-item label="前台公布日期">
            <el-date-picker
              v-model="form.ShowDate"
              type="date"
              placeholder="請選擇日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="前台失效日期">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              placeholder="請選擇日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="是否開啟報到代碼">
            <el-radio-group v-model="form.HasCheckInCode">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="證書底圖">
            <el-select
              v-model="changeCateTemp"
              @change="form.CertificateId = null"
            >
              <el-option
                v-for="(item, index) in UnitList"
                :label="item.UntNameFull"
                :value="item.UntId"
                :key="index"
              ></el-option>
            </el-select>
            <el-select v-model="form.CertificateId">
              <el-option
                v-for="(item, index) in getCateTemp"
                :label="item.CertName"
                :value="item.Id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="證書字號">
            ({{ getEndYear ? getEndYear - 1911 : " " }})
            <el-input
              v-model="form.CertificateNo"
              style="width: 240px"
            ></el-input
            >第XXX號
          </el-form-item>
          <el-form-item
            label="上傳徵稿檔案"
            v-if="form.ActCategoryId == 2 && form.ActTypeId == 1"
          >
            <div v-for="(item, index) in form.SolicitFile" :key="index">
              <a
                :href="$store.state.fileBase + item.response"
                target="_blank"
                >{{ item.response }}</a
              >
              <el-button
                type="danger"
                class="removeFile"
                @click="FilesRemove(index, 'SolicitFile')"
                >刪除</el-button
              >
            </div>
            <el-upload
              :show-file-list="false"
              :action="$store.state.apiBase + 'Img'"
              :headers="{ authorization: 'Bearer ' + $store.state.token }"
              :on-success="
                (res, file) => {
                  return successUpdata(res, file, 'SolicitFile', true);
                }
              "
            >
              <el-button size="small" type="primary">點擊上傳</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="舉辦國家">
            <el-select v-model="form.ActCountry" placeholder="請選擇">
              <el-option
                v-for="(item, index) in $store.state.Country"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活動使用語言">
            <el-select v-model="form.UseLanguage" placeholder="請選擇">
              <el-option label="中文" value="中文"></el-option>
              <el-option label="外語" value="外語"></el-option>
              <el-option label="中文和外語" value="中文和外語"></el-option>
            </el-select>
            <el-input
              style="width: 240px"
              v-model="form.UseLanguageOther"
              v-if="
                form.UseLanguage == '外語' || form.UseLanguage == '中文和外語'
              "
              placeholder="請輸入外語語言"
            ></el-input>
          </el-form-item>
          <el-form-item label="活動地點">
            <el-input style="width: 240px" v-model="form.ActAddr"></el-input>
            <p class="red">活動使用之地點如：Z1205、化雨堂。</p>
          </el-form-item>
          <el-form-item label="活動時數">
            <el-input-number
              v-model="form.ActTime"
              :precision="1"
              :step="0.1"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="報名通知Email">
            <el-input style="width: 300px" v-model="form.NoticEmail"></el-input>
            <p class="red">如有多個 email 請以逗號區隔</p>
          </el-form-item>
          <el-form-item label="上限人數">
            <el-input-number v-model="form.MaxUser" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="啟用">
            <el-checkbox v-model="form.isEnable"></el-checkbox>
          </el-form-item>
          <el-form-item label="個資聲明" prop="IndividualStatementId">
            <el-select
              v-model="form.IndividualStatementId"
              placeholder="請選擇"
            >
              <el-option
                v-for="item in IndividualStatementModuleList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="step == 2">
          <el-form-item label="公告單位">
            <el-input
              style="width: 100%"
              v-model="form.ShowUnit"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="活動內容">
            <el-input
              style="width: 100%"
              v-model="form.ShowActContents"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="活動時間">
            <el-input
              style="width: 100%"
              v-model="form.ShowActDate"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="活動地點">
            <el-input
              style="width: 100%"
              v-model="form.ShowActAddr"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="相關網址">
            <el-input
              style="width: 100%"
              v-model="form.ShowAcrUrl"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="聯絡人">
            <el-input
              style="width: 100%"
              v-model="form.ShowContactName"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="活動使用語言">
            <el-input
              style="width: 100%"
              v-model="form.ShowUseLanguage"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="活動時數">
            <el-input
              style="width: 100%"
              v-model="form.ShowActTime"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="所有附件">
            <el-table :data="form.AttachmentFiles" style="width: 800px">
              <el-table-column label="附件名稱" prop="response">
                <template slot-scope="scope">{{
                  scope.row.path[0].response
                }}</template>
              </el-table-column>
              <el-table-column label="附件類別">
                <template slot-scope="scope">
                  <div v-html="scope.row.type"></div>
                </template>
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
                    <a
                      :href="$store.state.fileBase + scope.row.path[0].response"
                      target="_blank"
                    >
                      <el-button type="primary">下載</el-button>
                    </a>
                    <el-button
                      type="danger"
                      style="margin: 0 0 0 10px"
                      @click="FilesRemove(scope.$index)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="上傳附件">
            <div style="display: flex">
              <el-select v-model="addFileForm.type" placeholder="請選擇">
                <el-option label="議程" :value="'議程'"></el-option>
                <el-option label="徵稿啟示" :value="'徵稿啟示'"></el-option>
                <el-option label="其他" :value="'其他'"></el-option>
              </el-select>
              <el-upload
                :show-file-list="false"
                :action="$store.state.apiBase + 'Img'"
                :headers="{ authorization: 'Bearer ' + $store.state.token }"
                :on-success="
                  (res, file) => {
                    return successUpdata(
                      res,
                      file,
                      'path',
                      true,
                      'addFileForm'
                    );
                  }
                "
              >
                <el-button size="small" type="primary">點擊上傳</el-button>
              </el-upload>
              <a
                v-for="(item, index) in addFileForm.path"
                :href="$store.state.fileBase + item.response"
                :key="index"
                target="_blank"
                >{{ item.response }}</a
              >
            </div>
          </el-form-item>
          <el-form-item label="附件說明">
            <el-input v-model="addFileForm.remark"></el-input>
            <el-button
              type="primary"
              style="margin: 0 0 0 10px"
              @click="toAddFile"
              v-if="addFileForm.path.length"
              >確定上傳</el-button
            >
          </el-form-item>
        </div>
        <div v-if="step == 3">
          <el-form-item label="報名表單" prop="FormId">
            <el-select
              v-model="form.FormId"
              placeholder="請選擇"
              @change="
                GetFormById(form.FormId);
                clear();
              "
            >
              <el-option :label="'請選擇'" value></el-option>
              <el-option
                v-for="(item, index) in FormList"
                :key="index"
                :label="item.FormName"
                :value="item.Id"
              ></el-option>
            </el-select>
            <p class="red">
              待完成表單編輯後，需從下拉式選單中，選取新建表單後才可繼續如下設定。
            </p>
          </el-form-item>
          <el-form-item label="報名開始時間">
            <el-date-picker
              v-model="form.SignupStartDate"
              type="datetime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="選擇日期時間"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="報名結束時間">
            <el-date-picker
              v-model="form.SignupEndDate"
              type="datetime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="選擇日期時間"
            ></el-date-picker>
            <p class="red">
              務必設定正確，以避免活動結束且簽核，仍可報名等情況發生。
            </p>
          </el-form-item>
          <el-form-item label="允許取消報名">
            <el-radio-group v-model="form.HasCancelBtn">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <p class="red">
              如欲開啟前台提供報名連結請選「是」，若不須進行報名程序請選「否」。
            </p>
          </el-form-item>
          <el-form-item label="請設置已報名名單欄位">
            <el-select
              v-model="form.RegisterColumns"
              placeholder="請選擇"
              multiple
              style="width: 300px"
            >
              <el-option
                v-for="(item, index) in getFormData.FormDtlDTO"
                :key="index"
                :label="item.ColumnName"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
            <p class="red">
              如欲前台顯示參與人員名單，請依需求設定，如否則免。
            </p>
          </el-form-item>
          <el-form-item label="請設置識別證欄位">
            <el-select
              v-model="form.IdentifyColumns"
              placeholder="請選擇"
              multiple
              style="width: 300px"
            >
              <el-option
                v-for="(item, index) in getFormData.FormDtlDTO"
                :key="index"
                :label="item.ColumnName"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
            <p class="red">
              本系統提供自動產出識別證之功能，請依單位需求設定，如否則免。
            </p>
          </el-form-item>
          <el-form-item label="請設置簽到表顯示">
            <el-select
              v-model="form.SignInColumns"
              placeholder="請選擇"
              multiple
              style="width: 300px"
            >
              <el-option :label="'序號'" :value="'序號'"></el-option>
              <el-option :label="'代理人'" :value="'代理人'"></el-option>
              <el-option :label="'參與狀況'" :value="'參與狀況'"></el-option>
              <el-option
                v-for="(item, index) in getFormData.FormDtlDTO"
                :key="index"
                :label="item.ColumnName"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
            <p class="red">
              如欲使用本系統產出之簽到表，請依需求設定，如否則免。
            </p>
          </el-form-item>
          <el-form-item label="請設置證書審核欄位">
            <el-select
              v-model="form.CertificateColumns"
              placeholder="請選擇"
              multiple
              style="width: 300px"
            >
              <el-option
                v-for="(item, index) in getFormData.FormDtlDTO"
                :key="index"
                :label="item.ColumnName"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
            <p class="red">
              如使用本系統產出證書，請務必設定，建議設定基本欄位為「單位」和「姓名」。
            </p>
          </el-form-item>
          <el-form-item label="活動資訊清單">
            <div
              class="MenuSortList"
              v-for="(item, index) in form.MenuSort"
              :key="index"
            >
              <el-checkbox v-model="item.Enable">{{ item.title }}</el-checkbox>
              <div class="MenuSortListIconBox">
                <i
                  class="MenuSortListIcon myicon-arrow-up-2"
                  @click="
                    ArrayMove(
                      form.MenuSort,
                      index,
                      index - 1 == -1 ? 7 : index - 1
                    )
                  "
                ></i>
                <i
                  class="MenuSortListIcon myicon-arrow-down-2"
                  @click="
                    ArrayMove(
                      form.MenuSort,
                      index,
                      index + 1 == 8 ? 0 : index + 1
                    )
                  "
                ></i>
              </div>
            </div>
            <p class="red">依需求設定欲於前台顯現提供閱覽之項目。</p>
          </el-form-item>
          <el-form-item label="發佈到行事曆">
            <el-radio-group v-model="form.PostToCalendar">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="交通指引">
            <el-select v-model="form.TrafficType" placeholder="請選擇">
              <el-option :label="'校內'" :value="1"></el-option>
              <el-option :label="'校外'" :value="2"></el-option>
            </el-select>
            <div v-for="(item, index) in form.TrafficFile" :key="index">
              <a
                :href="$store.state.fileBase + item.response"
                target="_blank"
                >{{ item.response }}</a
              >
              <el-button
                type="danger"
                class="removeFile"
                @click="FilesRemove(index, 'TrafficFile')"
                >刪除</el-button
              >
            </div>
            <el-upload
              :show-file-list="false"
              :action="$store.state.apiBase + 'Img'"
              accept=".pdf, .PDF"
              :headers="{ authorization: 'Bearer ' + $store.state.token }"
              :on-success="
                (res, file) => {
                  return successUpdata(res, file, 'TrafficFile', true);
                }
              "
              v-if="form.TrafficType == 2"
            >
              <el-button size="small" type="primary">點擊上傳</el-button>
            </el-upload>
            <p class="red">若選"其他"，則需上傳檔案(僅限PDF檔)</p>
          </el-form-item>
          <el-form-item label="QRcode密碼">
            <el-input style="width: 240px" v-model="form.QRCodePwd"></el-input>
            <p class="red">如需使用QRcode報到，請設定QRcode密碼</p>
          </el-form-item>
        </div>
      </el-form>
      <div class="formButtonList">
        <el-button @click="step--" v-if="step > 1">上一步</el-button>
        <el-button @click="subTemp('form', step + 1)" v-if="step < 3"
          >下一步</el-button
        >
        <el-button type="primary" v-if="step == 3" @click="sub('form')"
          >儲存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Ck from "@/components/Ck";
import moment from "moment";
export default {
  data() {
    return {
      tempId: "",
      step: 1,
      canSave: false,
      UnitList: [],
      FormList: [],
      CateTemp: [],
      changeCateTemp: "",
      IndividualStatementModuleList: [],
      getFormData: "",
      addFileForm: {
        type: "議程",
        path: [],
        remark: "",
      },
      form: {
        MaxUser: 999,
        ActCategoryId: "", //活動種類ID
        ActCategoryOther: "", //所屬分類其他
        IndividualStatementId: "", //個資同意書ID
        ActName: "", //活動名稱
        ActOrganizer: "", //主辦單位
        ActSummary: "", //活動簡介
        ActImg: "[]", //活動圖片
        ActStartDate: "", //活動開始日
        ActEndDate: "", //活動結束日
        ShowDate: "", //顯示時間開始日
        EndDate: "", //顯示時間結束日
        HasCheckInCode: true, //是否開啟報到代碼
        CertificateId: null, //證書ID
        CertificateNo: "", //證書字號
        ActTypeId: "", //活動型態ID
        ActTypeOther: "", //活動型態其他
        SolicitFile: "[]", //徵選檔案
        ActCountry: "中華民國", //活動國家
        UseLanguage: "", //使用語言
        UseLanguageOther: "", //使用語言其他
        ActAddr: "", //活動地點
        ActTime: 0, //活動時數
        NoticEmail: "", //通知報名信箱
        ShowUnit: "", //公告單位
        ShowActContents: "", //活動內容
        ShowActDate: "", //活動時間
        ShowActAddr: "", //活動地點
        ShowAcrUrl: "", //相關網址
        ShowContactName: "", //聯絡人
        ShowUseLanguage: "", //活動使用語言
        ShowActTime: "", //活動時數
        WebMode: 1, //頁面布局
        AttachmentFiles: "[]", //附件檔案
        FormId: 17, //表單ID
        SignupStartDate: "", //報名開始日
        SignupEndDate: "", //報名結束日
        HasCancelBtn: true, //允許取消報名
        RegisterColumns: "[]", //報名表欄位
        IdentifyColumns: "[]", //識別證欄位
        SignInColumns: "[]", //簽到表欄位
        CertificateColumns: "[]", //證書欄位
        MenuSort:
          '[{"Id":1,"title":"線上報名","Enable":true},{"Id":2,"title":"檔案下載","Enable":true},{"Id":3,"title":"活動詳情","Enable":true},{"Id":4,"title":"已報名名單","Enable":true},{"Id":5,"title":"交通指引","Enable":true},{"Id":6,"title":"本校平面圖","Enable":true}]', //Menu選項及順序
        PostToCalendar: true, //是否發布至行事曆
        ArchiveFiles:
          '{"start":"","end":"","auth":"","noAuth":"","allFile":[]}', //簽核檔案
        ArchiveStatus: false, //簽核狀態
        TrafficType: 1, //
        TrafficFile: "[]", //
        QRCodePwd: "", //
        isEnable: false,
      },
      rules: {
        ActTypeId: [{ required: true, message: " ", trigger: "blur" }],
        IndividualStatementId: [
          { required: true, message: " ", trigger: "blur" },
        ],
        ActName: [{ required: true, message: " ", trigger: "blur" }],
        FormId: [{ required: true, message: " ", trigger: "blur" }],
      },
    };
  },
  watch: {},
  computed: {
    /*getFileList() {
      return JSON.parse(this.form.AttachmentFiles) ? JSON.parse(this.form.AttachmentFiles) : []
    },*/
    getMenuSort() {
      return JSON.parse(this.form.MenuSort)
        ? JSON.parse(this.form.MenuSort)
        : [];
    },
    getCateTemp() {
      return this.CateTemp.filter((res) => res.UnitCode == this.changeCateTemp);
    },
    userInfo() {
      return JSON.parse(window.localStorage.getItem("user"));
    },
    getEndYear() {
      return moment(this.form.ActEndDate).format("YYYY") != "Invalid date"
        ? moment(this.form.ActEndDate).format("YYYY")
        : "";
    },
  },
  components: { Title, Ck },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    let userData = await this.$api
      .GetAdminUserById({ Id: JSON.parse(localStorage.user).Id })
      .then((res) => res.data.response);
    this.UnitList = await this.$api.GetUnits().then((res) => res.data);
    this.UnitList = this.UnitList.filter(
      (res) => userData.CtrlUnits.indexOf(res.UntId) != -1
    );
    this.FormList = await this.$api.GetFormNoPage().then((res) => res.data);
    this.FormList = this.FormList.filter(
      (res) =>
        userData.CtrlUnits.indexOf(res.UnitCode) != -1 || res.UnitCode == " "
    );
    this.CateTemp = await this.$api
      .GetCertificateTempNoPage()
      .then((res) => res.data.response);
    this.IndividualStatementModuleList = await this.$api
      .GetIndividualStatementModuleNoPage()
      .then((res) => res.data);
    if (this.$router.currentRoute.query.Id) {
      let obj = { Id: this.$router.currentRoute.query.Id };
      this.form = await this.$api
        .GetActivityById(obj)
        .then((res) => res.data.response);
      if (this.form.CertificateId)
        this.changeCateTemp = this.CateTemp.filter(
          (res) => res.Id == this.form.CertificateId
        )[0].UnitCode;
    }
    if (this.form.FormId) {
      await this.GetFormById(this.form.FormId);
    }

    if (!this.$router.currentRoute.query.Id) {
      this.form.NoticEmail = this.userInfo.Email;
    }

    this.form.ActImg = JSON.parse(this.form.ActImg);
    this.form.MenuSort = JSON.parse(this.form.MenuSort);
    this.form.IdentifyColumns = JSON.parse(this.form.IdentifyColumns);
    this.form.RegisterColumns = JSON.parse(this.form.RegisterColumns);
    this.form.SignInColumns = JSON.parse(this.form.SignInColumns);
    this.form.CertificateColumns = JSON.parse(this.form.CertificateColumns);
    this.form.AttachmentFiles = JSON.parse(this.form.AttachmentFiles);
    this.form.SolicitFile = JSON.parse(this.form.SolicitFile);
    this.form.TrafficFile = JSON.parse(this.form.TrafficFile);

    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    async subTemp(formName, step) {
      //暫存
      if (step > 1) {
        if (
          !this.form.ActName ||
          !this.form.ActTypeId ||
          !this.form.IndividualStatementId
        ) {
          this.$alertM.fire({
            icon: "error",
            title: "必填欄位請填完整",
          });
          return false;
        }
      }
      this.form.ActImg =
        typeof this.form.ActImg !== "string"
          ? JSON.stringify(this.form.ActImg)
          : "[]";
      this.form.MenuSort =
        typeof this.form.MenuSort !== "string"
          ? JSON.stringify(this.form.MenuSort)
          : "[]";
      this.form.IdentifyColumns =
        typeof this.form.IdentifyColumns !== "string"
          ? JSON.stringify(this.form.IdentifyColumns)
          : "[]";
      this.form.RegisterColumns =
        typeof this.form.RegisterColumns !== "string"
          ? JSON.stringify(this.form.RegisterColumns)
          : "[]";
      this.form.SignInColumns =
        typeof this.form.SignInColumns !== "string"
          ? JSON.stringify(this.form.SignInColumns)
          : "[]";
      this.form.CertificateColumns =
        typeof this.form.CertificateColumns !== "string"
          ? JSON.stringify(this.form.CertificateColumns)
          : "[]";
      this.form.AttachmentFiles =
        typeof this.form.AttachmentFiles !== "string"
          ? JSON.stringify(this.form.AttachmentFiles)
          : "[]";
      this.form.SolicitFile =
        typeof this.form.SolicitFile !== "string"
          ? JSON.stringify(this.form.SolicitFile)
          : "[]";
      this.form.TrafficFile =
        typeof this.form.TrafficFile !== "string"
          ? JSON.stringify(this.form.TrafficFile)
          : "[]";
      if (!this.$router.currentRoute.query.Id && !this.tempId) {
        await this.$api
          .PostActivity(this.form)
          .then((res) => {
            this.tempId = res.data.response;
          })
          .catch(() => "網路錯誤");
        this.form.ActImg = JSON.parse(this.form.ActImg);
        this.form.MenuSort = JSON.parse(this.form.MenuSort);
        this.form.IdentifyColumns = JSON.parse(this.form.IdentifyColumns);
        this.form.RegisterColumns = JSON.parse(this.form.RegisterColumns);
        this.form.SignInColumns = JSON.parse(this.form.SignInColumns);
        this.form.CertificateColumns = JSON.parse(this.form.CertificateColumns);
        this.form.AttachmentFiles = JSON.parse(this.form.AttachmentFiles);
        this.form.SolicitFile = JSON.parse(this.form.SolicitFile);
        this.form.TrafficFile = JSON.parse(this.form.TrafficFile);
        this.$store.dispatch("loadingHandler", false);
        this.step = step;
        return 0;
      }
      if (this.tempId || this.$router.currentRoute.query.Id) {
        let flag = "";
        console.log("call", this.form);
        this.form.Id = Number(
          this.tempId || this.$router.currentRoute.query.Id
        );
        await this.$api
          .PutActivity(this.form)
          .then((res) => {
            flag = res.data.msg;
          })
          .catch(() => "網路錯誤");
        this.form.ActImg = JSON.parse(this.form.ActImg);
        this.form.MenuSort = JSON.parse(this.form.MenuSort);
        this.form.IdentifyColumns = JSON.parse(this.form.IdentifyColumns);
        this.form.RegisterColumns = JSON.parse(this.form.RegisterColumns);
        this.form.SignInColumns = JSON.parse(this.form.SignInColumns);
        this.form.CertificateColumns = JSON.parse(this.form.CertificateColumns);
        this.form.AttachmentFiles = JSON.parse(this.form.AttachmentFiles);
        this.form.SolicitFile = JSON.parse(this.form.SolicitFile);
        this.form.TrafficFile = JSON.parse(this.form.TrafficFile);
        this.$store.dispatch("loadingHandler", false);
        this.step = step;
        return 0;
      }
    },
    async sub(form) {
      const vm = this;
      let flag = "";
      // this.$store.dispatch("loadingHandler", true);

      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.form.ActImg = JSON.stringify(this.form.ActImg);
          this.form.MenuSort = JSON.stringify(this.form.MenuSort);
          this.form.IdentifyColumns = JSON.stringify(this.form.IdentifyColumns);
          this.form.RegisterColumns = JSON.stringify(this.form.RegisterColumns);
          this.form.SignInColumns = JSON.stringify(this.form.SignInColumns);
          this.form.CertificateColumns = JSON.stringify(
            this.form.CertificateColumns
          );
          this.form.AttachmentFiles = JSON.stringify(this.form.AttachmentFiles);
          this.form.SolicitFile = JSON.stringify(this.form.SolicitFile);
          this.form.TrafficFile = JSON.stringify(this.form.TrafficFile);
          if (this.form.PostToCalendar) {
            this.subToCalendar();
          }
          if (this.$router.currentRoute.query.Id || this.tempId) {
            this.form.Id = this.$router.currentRoute.query.Id || this.tempId;
            await this.$api
              .PutActivity(this.form)
              .then((res) => {
                flag = res.data.msg;
                vm.$alertM.fire({
                  icon: flag == "網路錯誤" ? "error" : "success",
                  title: flag,
                });
              })
              .catch(() => "網路錯誤");
          } else {
            await this.$api
              .PostActivity(this.form)
              .then((res) => {
                flag = res.data.msg;
                vm.$alertM.fire({
                  icon: flag == "網路錯誤" ? "error" : "success",
                  title: flag,
                });
              })
              .catch(() => "網路錯誤");
          }
          this.$router.push({ path: "/Activity/List" });
          this.$store.dispatch("loadingHandler", false);
        } else {
          vm.$alertM.fire({
            icon: "error",
            title: "請檢查欄位是否正確填寫",
          });
          return false;
        }
      });
    },
    async subToCalendar() {
      let CalendarEventForm = {
        Id: 0,
        EventName: this.form.ActName,
        EventTypeId: 134,
        Summary: this.form.ActSummary,
        EventStartDate: this.form.ActStartDate,
        EventEndDate: this.form.ActEndDate,
        EventAddr: this.form.ActAddr,
        ShowStartDate: this.form.ShoDate,
        ShowEndDate: this.form.EndDate,
        PushData: false,
        UnitCode: JSON.parse(localStorage.user).UnitCode,
        attachDocList: JSON.parse(this.form.AttachmentFiles)
          .map((res) => res.path[0].response)
          .join(","),
        LinkUrl: this.form.ShowAcrUrl,
        JoinUsers: [],
      };
      return this.$api.AddEvent(CalendarEventForm).then((res) => res);
    },
    successUpdata(res, file, name, clear = false, target = "form") {
      if (clear) {
        this[target][name] = [];
      }
      res.remark = "";
      this[target][name].push(res);
    },
    FilesRemove(x, target = "AttachmentFiles") {
      this.form[target].splice(x, 1);
    },
    ArrayMove(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
    },
    async GetFormById(x) {
      if (!x) return 0;
      this.$store.dispatch("loadingHandler", true);
      this.getFormData = await this.$api
        .GetFormById({ Id: x })
        .then((res) => res.data.response);
      this.$store.dispatch("loadingHandler", false);
    },
    clear() {
      this.form.RegisterColumns = [];
      this.form.IdentifyColumns = [];
      this.form.SignInColumns = ["序號", "代理人", "參與狀況"];
      this.form.CertificateColumns = [];
    },
    toAddFile() {
      if (!this.addFileForm.path) {
        this.$alertM.fire({
          icon: "error",
          title: "請上傳檔案",
        });
        return 0;
      }
      this.form.AttachmentFiles.push(this.addFileForm);
      this.addFileForm = {
        type: "議程",
        path: "",
        remark: "",
      };
      console.log(this.form.AttachmentFiles);
    },
    CertificateNoGet() {
      this.form.CertificateNo = moment(this.form.ActEndDate).format("YYYY");
    },
  },
};
</script>
