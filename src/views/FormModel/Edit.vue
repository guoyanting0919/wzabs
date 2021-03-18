<template>
  <div id="FormModelEdit">
    <el-dialog :close-on-click-modal="false" :title="'表單預覽'" :visible.sync="dialogVisiblePreview" width="50%">
      <!--預覽-->
      <div v-if="dialogVisiblePreview">
        <FormModelTable :data="form.FormDtlDTO" v-if="form.FormDtlDTO && form.FormDtlDTO.length > 0"></FormModelTable>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="isAdd ? '新增' : '修改'" :visible.sync="dialogVisible" width="50%">
      <!--新增&修改-->
      <el-form :model="rowForm" :rules="rules_addColumn" ref="form_addColumn" label-width="100px">
        <!--<el-form-item label="列">
          <el-select v-model="rowForm.CRow">
            <el-option
              v-for="(item,index) in arrayEx(1,form.FormDtlDTO.length+1).reverse()"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!--<el-form-item label="寬度">
          <el-select v-model="rowForm.CGrid">
            <el-option :label="'全滿'" :value="24"></el-option>
            <el-option :label="'二分之一'" :value="12"></el-option>
            <el-option :label="'四分之一'" :value="6"></el-option>
            <el-option :label="'八分之一'" :value="3"></el-option>
          </el-select>-->
        <!--<el-tooltip
            class="item"
            effect="dark"
            content="一列有24格，若選1格，該欄位會佔1/24列之寬度，以此類推..."
            placement="top-start"
          >
            <i class="el-icon-info" style="cursor: pointer;"></i>
          </el-tooltip>-->
        <!--</el-form-item>-->
        <el-form-item label="欄位名稱" prop="ColumnName">
          <el-input v-model="rowForm.ColumnName"></el-input>
        </el-form-item>

        <el-form-item label="欄位類型" v-if="!rowForm.MemberColumn">
          <el-select v-model="rowForm.ColumnType" @change="setProfileColumn(rowForm.ColumnType)">
            <el-option :label="'單行文字'" :value="1"></el-option>
            <!-- <el-option :label="'單行-帶分隔符'" :value="2"></el-option> -->
            <el-option :label="'核取方塊'" :value="3"></el-option>
            <el-option :label="'選擇鈕'" :value="4"></el-option>
            <el-option :label="'下拉清單'" :value="5"></el-option>
            <el-option :label="'檔案類型'" :value="6"></el-option>
            <!-- <el-option :label="'聯動下拉單'" :value="7"></el-option> -->
            <!-- <el-option :label="'多行文字'" :value="8"></el-option> -->
          </el-select>
        </el-form-item>
        <div class="el-form-item_tableBox" v-if="rowForm.ColumnType == 2 && dialogVisible">
          <el-table header-cell-class-name="tableHeader" :data="rowForm.ProfileColumn">
            <el-table-column label="寬度">
              <template slot-scope="scope">
                <el-input v-model="scope.row.width"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分隔符">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mark"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="iconList">
                  <el-button type="danger" @click="delFormRowItem(scope.$index)">刪除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="SeparateBox">
            <div class="SeparateBoxItem" v-for="(item, index) in rowForm.ProfileColumn" :key="index" :style="{ width: item.width + '%' }">
              <el-input></el-input>
              <span>{{ item.mark }}</span>
            </div>
          </div>
          <div class="formButtonList">
            <el-button type="primary" @click="addFormRowItem(true)">新增選項</el-button>
          </div>
        </div>
        <div class="el-form-item_tableBox" v-if="
            (rowForm.ColumnType == 3 ||
              rowForm.ColumnType == 4 ||
              rowForm.ColumnType == 5) &&
            dialogVisible &&
            rowForm.MemberColumn != 'Sex'
          ">
          <el-checkbox v-model="valueBind">指定值綁定</el-checkbox>
          <el-table header-cell-class-name="tableHeader" :data="rowForm.ProfileColumn">
            <el-table-column label="選項名稱">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" @input="valueToBind(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="指定值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="iconList">
                  <el-button type="danger" @click="delFormRowItem(scope.$index)">刪除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="formButtonList">
            <el-button type="primary" @click="addFormRowItem()">新增選項</el-button>
          </div>
        </div>
        <div class="rowFormTree" v-if="rowForm.ColumnType == 7 && dialogVisible">
          <el-checkbox v-model="valueBind">指定值綁定</el-checkbox>
          <el-tree :data="rowForm.ProfileColumn" node-key="id" default-expand-all :expand-on-click-node="false">
            <div class="customTreeNode" slot-scope="{ node, data }">
              <div class="customTreeNodeTitle">選項名稱</div>
              <el-input v-model="data.label" @input="valueToBind(data)"></el-input>
              <div class="customTreeNodeTitle">指定值</div>
              <el-input v-model="data.value"></el-input>
              <div class="iconList">
                <el-button type="success" @click="append(data)">新增選項</el-button>
                <el-button type="danger" @click="remove(node, data)">刪除選項</el-button>
              </div>
            </div>
          </el-tree>
          <div class="formButtonList">
            <el-button type="primary" @click="parentAppend">新增首級選項</el-button>
          </div>
        </div>

        <el-form-item label="數值類型">
          <el-select v-model="rowForm.ColumnMode">
            <el-option :label="'任何文字'" :value="1"></el-option>
            <el-option :label="'日期'" :value="2"></el-option>
            <!-- <el-option :label="'整數數值'" :value="3"></el-option> -->
            <!-- <el-option :label="'任何數值'" :value="4"></el-option> -->
            <el-option :label="'E-mail'" :value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="欄位設定">
          <el-select v-model="rowForm.ColumnSet">
            <el-option :label="'不允許空白'" :value="1"></el-option>
            <el-option :label="'允許空白'" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="會員欄位關聯">
          <el-select v-model="rowForm.MemberColumn" @change="changeMemberColumn">
            <el-option :label="'請選擇'" :value="null"></el-option>
            <el-option :label="'會員帳號'" :value="'UserAccount'"></el-option>
            <el-option :label="'姓名'" :value="'UserName'"></el-option>
            <el-option :label="'電子郵件'" :value="'UserEmail'"></el-option>
            <el-option :label="'學校名稱'" :value="'UserSchool'"></el-option>
            <el-option :label="'所屬單位'" :value="'UnitName'"></el-option>
            <el-option :label="'身分證字號'" :value="'UID'"></el-option>
            <el-option :label="'性別'" :value="'Sex'"></el-option>
            <el-option :label="'職別'" :value="'UserTitle'"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="欄位備註">
          <el-input v-model="rowForm.ColumnRemark" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="是否為唯一鍵">
          <el-radio-group v-model="rowForm.IsKeyWord">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <p class="red">此為判別重複報名的選項 通常設定在電子郵件或帳號</p>
        </el-form-item>
      </el-form>
      <div class="formButtonList">
        <el-button type="primary" @click="subRow()">確定</el-button>
      </div>
    </el-dialog>

    <Title :title="$router.currentRoute.query.Id ? '表單模組編輯' : '表單模組新增'"></Title>

    <div class="form">
      <!-- 表單 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="表單名稱" prop="FormName">
          <el-input style="width: 598px" v-model="form.FormName"></el-input>
        </el-form-item>
        <el-form-item label="所屬類別" prop="UnitCode">
          <el-select placeholder="請選擇" v-model="form.UnitCode">
            <el-option v-for="(item, index) in UnitList" :label="item.UntNameFull" :value="item.UntId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="製作方式">
          <el-radio-group v-model="importForm.IsImport">
            <el-radio :label="false">從空白表單開始建立</el-radio>
            <el-radio :label="true">從範本開始建立表單</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item v-if="importForm.IsImport">
          <el-select placeholder="請選擇所屬類別" v-model="importForm.cUnit">
            <el-option v-for="(item, index) in UnitList" :label="item.UntNameFull" :value="item.UntId" :key="index"></el-option>
          </el-select>
          <el-select placeholder="請選擇表單名稱" v-model="importForm.cForm" @change="importFormData">
            <el-option v-for="(item, index) in filterFormList" :label="item.FormName" :value="item.Id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="啟用">
          <el-radio-group v-model="form.IsEnable">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="表單說明">
          <el-input style="width: 598px" v-model="form.FormSummary"></el-input>
        </el-form-item>

        <!-- <el-form-item label="表單說明" prop="FormSummary">
          <Ck v-model="form.FormSummary" :width="'598px'"></Ck>
        </el-form-item> -->
        <!-- <el-form-item label="底部說明" prop="FormFooter">
          <Ck v-model="form.FormFooter" :width="'598px'"></Ck>
        </el-form-item> -->
        <el-form-item label="報名按鈕名稱">
          <el-input style="width: 598px" v-model="form.AddButtonLab"></el-input>
        </el-form-item>
        <el-form-item label="取消按鈕名稱">
          <el-input style="width: 598px" v-model="form.CancelButtonLab"></el-input>
        </el-form-item>

        <el-form-item label="成功訊息">
          <el-input style="width: 598px" v-model="form.SuccessMsg"></el-input>
        </el-form-item>

        <!-- <el-form-item label="成功訊息">
          <Ck v-model="form.SuccessMsg" :width="'598px'"></Ck>
        </el-form-item> -->
      </el-form>

      <!-- 欄位管理 -->
      <div class="tableD">
        <div class="tableDTitle">欄位管理</div>

        <el-table header-cell-class-name="tableHeader" :data="form.FormDtlDTO">
          <!--<el-table-column label="列" prop="CRow"></el-table-column>
          <el-table-column label="格" prop="CGrid"></el-table-column>-->
          <el-table-column label="#">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="欄位名稱" prop="ColumnName"></el-table-column>
          <el-table-column label="欄位類型">
            <template slot-scope="scope">{{
              scope.row.ColumnType == 1
                ? "單行文字"
                : scope.row.ColumnType == 2
                ? "單行-帶分隔符"
                : scope.row.ColumnType == 3
                ? "核取方塊"
                : scope.row.ColumnType == 4
                ? "選擇鈕"
                : scope.row.ColumnType == 5
                ? "下拉清單"
                : scope.row.ColumnType == 6
                ? "檔案類型"
                : scope.row.ColumnType == 7
                ? "聯動下拉單"
                : "多行文字"
            }}</template>
          </el-table-column>
          <el-table-column label="數值類型">
            <template slot-scope="scope">
              {{
              scope.row.ColumnMode == 1
                ? "任何文字"
                : scope.row.ColumnMode == 2
                ? "日期"
                : scope.row.ColumnMode == 3
                ? "整數數值"
                : scope.row.ColumnMode == 4
                ? "任何數值"
                : "E-mail"
              }}
            </template>
          </el-table-column>
          <el-table-column label="欄位設定">
            <template slot-scope="scope">
              {{
              scope.row.ColumnSet == 1 ? "不允許空白" : "允許空白"
              }}
            </template>
          </el-table-column>
          <el-table-column label="欄位備註" prop="ColumnRemark"></el-table-column>
          <el-table-column label="是否為唯一鍵">
            <template slot-scope="scope">{{
              scope.row.IsKeyWord ? "是" : "否"
            }}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <!--<template slot-scope="scope"></template>-->
              <div class="iconList">
                <div class="iconListD" @click="
                    ArrayMove(
                      form.FormDtlDTO,
                      scope.$index,
                      scope.$index - 1 == -1
                        ? form.FormDtlDTO.length - 1
                        : scope.$index - 1,
                      scope.row
                    )
                  ">
                  <i class="MenuSortListIcon myicon-arrow-up-2"></i>
                </div>

                <div class="iconListD" @click="
                    ArrayMove(
                      form.FormDtlDTO,
                      scope.$index,
                      scope.$index + 1 == form.FormDtlDTO.length
                        ? 0
                        : scope.$index + 1,
                      scope.row
                    )
                  ">
                  <i class="MenuSortListIcon myicon-arrow-down-2"></i>
                </div>

                <el-tooltip class="item" effect="dark" content="編輯" placement="top" :open-delay="500">
                  <div class="iconListD" @click="
                      getRowIndex = scope.$index;
                      showDialog(scope.row);
                    ">
                    <i class="myicon-edit"></i>
                  </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刪除" placement="top" :open-delay="500">
                  <div class="iconListD" @click="delRow(scope.$index)">
                    <i class="myicon-delete"></i>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="formButtonList">
          <el-button type="primary" @click="showDialog()">新增一列</el-button>
          <el-button type="primary" @click="preview">預覽</el-button>
          <el-button type="primary" @click="sub('form')">儲存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import FormModelTable from "@/components/FormModelTable";
import Ck from "@/components/Ck";
export default {
  data() {
    return {
      valueBind: true,
      SeparateData: [
        { width: "25", mark: "-" },
        { width: "25", mark: "-" },
        { width: "50", mark: "-" },
      ],
      CascaderData: [
        {
          id: 1,
          label: "",
          value: "",
          children: null,
        },
        {
          id: 2,
          label: "",
          value: "",
          children: null,
        },
        {
          id: 3,
          label: "",
          value: "",
          children: null,
        },
      ],
      dialogVisible: false,
      dialogVisiblePreview: false,
      isAdd: true,
      importForm: {
        IsImport: false,
        cUnit: "",
        cForm: [],
      },
      FormList: [],
      UnitList: [],
      form: {
        Id: 0,
        FormName: "", //表單名稱
        UnitCode: "", //所屬單位(空值代表公用)
        FormSummary: "", //表單說明
        FormFooter: "", //表單底部
        AddButtonLab: "確認資料", //報名按鈕名稱
        CancelButtonLab: "取消", //取消按鈕名稱
        IsEnable: true, //啟用
        SuccessMsg: "恭喜您完成本次報名", //成功訊息
        FormDtlDTO: [],
      },
      rules: {
        FormName: [
          { required: true, message: "此欄位為必填", trigger: "blur" },
        ],
        UnitCode: [
          { required: true, message: "此欄位為必填", trigger: "change" },
        ],
        FormSummary: [
          { required: true, message: "此欄位為必填", trigger: "blur" },
        ],
        FormFooter: [
          { required: true, message: "此欄位為必填", trigger: "blur" },
        ],
      },
      getRowIndex: "",
      rowForm: "",
      rules_addColumn: {
        ColumnName: [
          { required: true, message: "此欄位為必填", trigger: "blur" },
        ],
      },
      rowFormBlank: {
        Id: 0,
        FormId: 0, //表單ID
        CRow: 1, //列
        CGrid: 24, //格數
        ColumnName: "", //欄位名稱
        ColumnType: 1, //欄位類型(1:單行文字 ,2:單行-帶分隔符,3:核取方塊,4:選擇鈕,5:下拉清單,6:檔案類型,7:聯動下拉單,8:多行文字)
        ProfileColumn: "", //欄位類型內容 JSON
        ColumnMode: 1, //數值類型(1:任何文字,2,日期,3:整數數值,4:任何數值,5:E-mail)
        ColumnSet: 2, //欄位設定(1:不允許空白,2:允許空白)
        ColumnRemark: "", //欄位備註
        MemberColumn: null,
        IsKeyWord: false, //是否為唯一鍵
      },
    };
  },
  watch: {
    form: {
      handler(newVal) {
        //console.log(newVal)
        this.form = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    filterFormList() {
      return this.FormList.filter(
        (res) => res.UnitCode == this.importForm.cUnit || res.UnitCode == " "
      );
    },
  },
  components: { Title, FormModelTable, Ck },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    if (this.$router.currentRoute.query.Id) {
      let obj = { Id: this.$router.currentRoute.query.Id };
      this.form = await this.$api
        .GetFormById(obj)
        .then((res) => res.data.response);
    }
    if (!this.form.FormDtlDTO) {
      this.form.FormDtlDTO = [];
    }
    let userData = await this.$api
      .GetAdminUserById({ Id: JSON.parse(localStorage.user).Id })
      .then((res) => res.data.response);
    this.UnitList = await this.$api.GetUnits().then((res) => res.data);
    this.UnitList = this.UnitList.filter(
      (res) => userData.CtrlUnits.indexOf(res.UntId) != -1
    );
    this.FormList = await this.$api.GetFormNoPage().then((res) => res.data);
    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    async sub(form) {
      const vm = this;
      let flag;
      // this.$store.dispatch("loadingHandler", true);
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          /* 編輯 */
          if (this.$route.query.Id) {
            this.form.FormDtlDTO.forEach((res) => {
              res.FormId = this.form.Id;
            });
            await this.$api
              .PutForm(this.form)
              .then((res) => {
                flag = res.data.msg;
              })
              .catch(() => "網路錯誤");
          } else {
            /* 新增 */
            if (this.form.FormDtlDTO.length > 0) {
              this.form.FormDtlDTO.forEach((res) => {
                res.FormId = 0;
              });
              await this.$api
                .PostForm(this.form)
                .then((res) => {
                  flag = res.data.msg;
                  vm.$alertM.fire({
                    icon: flag == "網路錯誤" ? "error" : "success",
                    title: flag,
                  });
                })
                .catch(() => "網路錯誤");
            } else {
              vm.$alertM.fire({
                icon: "error",
                title: "【欄位管理】至少須有一項！",
              });
              return 0;
            }
          }
          this.$router.push({ path: "/FormModel/List" });
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
    async importFormData() {
      this.$store.dispatch("loadingHandler", true);
      let Id = this.form.Id;
      let FormName = this.form.FormName;
      let UnitCode = this.form.UnitCode;
      this.form = await this.$api
        .GetFormById({ Id: this.importForm.cForm })
        .then((res) => res.data.response);
      this.form.Id = Id;
      this.form.FormName = FormName;
      this.form.UnitCode = UnitCode;
      for (let item of this.form.FormDtlDTO) {
        item.FormId = Id;
      }
      this.$store.dispatch("loadingHandler", false);
    },
    subRow() {
      this.$refs.form_addColumn.validate((valid) => {
        if (valid) {
          this.dialogVisible = !this.dialogVisible;
          if (
            this.rowForm.ColumnType == 2 ||
            this.rowForm.ColumnType == 3 ||
            this.rowForm.ColumnType == 4 ||
            this.rowForm.ColumnType == 5 ||
            this.rowForm.ColumnType == 7
          ) {
            this.rowForm.ProfileColumn = JSON.stringify(
              this.rowForm.ProfileColumn
            );
          }
          if (this.isAdd) {
            this.addRow();
          } else {
            this.editRow();
          }
        }
      });
    },
    addRow() {
      this.form.FormDtlDTO.push(this.rowForm);
    },
    editRow() {
      this.form.FormDtlDTO[this.getRowIndex] = this.rowForm;
      this.form.FormDtlDTO.push({});
      this.form.FormDtlDTO.splice(this.form.FormDtlDTO.length - 1, 1);
    },
    delRow(x) {
      this.form.FormDtlDTO.splice(x, 1);
    },
    showDialog(x) {
      if (x) {
        this.isAdd = false;
        this.rowForm = JSON.parse(JSON.stringify(x));
      } else {
        this.isAdd = true;
        this.rowForm = JSON.parse(JSON.stringify(this.rowFormBlank));
        this.rowForm.CRow = this.form.FormDtlDTO.length + 1;
      }
      if (
        this.rowForm.ColumnType == 2 ||
        this.rowForm.ColumnType == 3 ||
        this.rowForm.ColumnType == 4 ||
        this.rowForm.ColumnType == 5 ||
        this.rowForm.ColumnType == 7
      ) {
        this.rowForm.ProfileColumn = JSON.parse(this.rowForm.ProfileColumn);
      }
      this.dialogVisible = !this.dialogVisible;
    },
    setProfileColumn(x) {
      //選擇類型時帶入預設值
      if (x == 2) {
        this.rowForm.ProfileColumn = JSON.parse(
          JSON.stringify(this.SeparateData)
        );
      } else if (x == 3 || x == 4 || x == 5) {
        this.rowForm.ProfileColumn = [];
      } else if (x == 7) {
        this.rowForm.ProfileColumn = JSON.parse(
          JSON.stringify(this.CascaderData)
        );
      } else {
        this.rowForm.ProfileColumn = "";
      }
    },
    addFormRowItem(Separate = false) {
      if (!Separate) this.rowForm.ProfileColumn.push({ name: "", value: "" });
      else this.rowForm.ProfileColumn.push({ width: "25", mark: "-" });
    },
    delFormRowItem(x) {
      this.rowForm.ProfileColumn.splice(x, 1);
    },
    append(data) {
      if (!data.children) data.children = [];
      data.children.push({
        id: new Date().getTime(),
        value: "",
        label: "",
        children: null,
      });
      this.$forceUpdate();
    },
    remove(node, data) {
      let parent = node.parent;
      let children = parent.data.children || parent.data;
      let index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      console.log("parent", parent);
      if (!node.parent.data.length || !node.parent.data.children.length) {
        node.parent.data.children = null;
        console.log(this.rowForm.ProfileColumn);
      }
    },
    parentAppend() {
      this.rowForm.ProfileColumn.push({
        id: new Date().getTime(),
        value: "",
        label: "",
        children: null,
      });
    },
    preview() {
      this.dialogVisiblePreview = !this.dialogVisiblePreview;
    },
    arrayEx(start, end) {
      let arr = [];
      for (let i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    },
    changeMemberColumn() {
      this.rowForm.ColumnType = 1;
    },
    valueToBind(x) {
      if (this.valueBind) {
        let name = x.name || x.label;
        x.value = name;
      }
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
  },
};
</script>
