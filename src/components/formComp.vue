<template>
  <div class="formComp">
    <!-- <div class="formTitle">{{formData.ColumnName}}</div> -->
    <!-- 單行文字 -->
    <el-input v-if="formData.ColumnType==1&&formData.MemberColumn!='Sex'" v-model="returnValue"></el-input>

    <!-- 單選 -->
    <el-radio-group v-if="formData.ColumnType==4" v-model="returnValue">
      <el-radio
        v-for="itemC in JSON.parse(formData.ProfileColumn)"
        :key="itemC.Id"
        :label="itemC.name"
      ></el-radio>
    </el-radio-group>

    <!-- 單選(性別) -->
    <el-radio-group v-if="formData.MemberColumn=='Sex'" v-model="returnValue" disabled>
      <el-radio :label="'男'">男</el-radio>
      <el-radio :label="'女'">女</el-radio>
    </el-radio-group>

    <!-- 多選 -->
    <el-checkbox-group v-if="formData.ColumnType==3" v-model="returnArrValue">
      <el-checkbox
        v-for="itemC in JSON.parse(formData.ProfileColumn)"
        :key="itemC.Id"
        :label="itemC.name"
      ></el-checkbox>
    </el-checkbox-group>

    <!-- 分隔 -->
    <div style="display: flex;width: 100%;" v-if="formData.ColumnType==2">
      <el-input
        :style="{  width: itemC.width + '%' }"
        v-for="(itemC,indexC) in JSON.parse(formData.ProfileColumn)"
        :key="itemC.Id"
        v-model="selectVal[indexC].value"
      >
        <span v-if="itemC.mark" slot="append">{{itemC.mark}}</span>
      </el-input>
    </div>

    <!-- 下拉input -->
    <el-select v-if="formData.ColumnType==5" v-model="returnValue">
      <el-option
        v-for="itemC in JSON.parse(formData.ProfileColumn)"
        :key="itemC.Id"
        :label="itemC.name"
        :value="itemC.value"
      ></el-option>
    </el-select>

    <!-- 檔案上傳 -->
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="$store.state.apiBase+'Img'"
      list-type="text"
      :headers="uploadHeader"
      :on-success="successUpload"
      v-if="formData.ColumnType==6"
    >
      <el-button size="small" type="primary">選擇檔案</el-button>
    </el-upload>

    <!-- 多行文字 -->
    <el-input v-if="formData.ColumnType==8" v-model="returnValue" type="textarea"></el-input>

    <!-- 關聯選擇 -->
    <el-cascader
      v-if="formData.ColumnType==7"
      v-model="returnValue"
      :options="options"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  name: "formComp",
  props: {
    formData: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  /*watch: {
    formData: {
      handler (newVal) {
        this.formData=newVal
        this.options = this.formData&&this.formData.ProfileColumn ? JSON.parse(this.formData.ProfileColumn) : []
      },
      deep: true,
      immediate: true
    }
  },*/
  data() {
    return {
      returnValue: "",
      returnArrValue: [],
      selectVal: [],
      options: [],
      uploadHeader: {
        Authorization: `Bearer ${window.localStorage.getItem("Token")}`,
      },
    };
  },
  computed: {
    getValue() {
      const vm = this;
      if (vm.formData.ColumnType == 3) {
        let str = vm.returnArrValue.join();
        return {
          Id: vm.formData.Id,
          arrValue: JSON.stringify(vm.returnArrValue),
          inputVal: JSON.stringify(vm.returnArrValue),
        };
      } else if (vm.formData.ColumnType == 2) {
        let arr = vm.selectVal.filter((obj) => {
          return obj.value !== "";
        });
        let arr2 = [];
        arr.forEach((item) => {
          arr2.push(item.value);
        });
        let mark = JSON.parse(vm.formData.ProfileColumn)[0].mark;
        let str = arr2.join(mark);

        return {
          Id: vm.formData.Id,
          inputVal: str,
        };
      } else if (vm.formData.ColumnType == 7) {
        let max = vm.returnValue.length;
        return {
          Id: vm.formData.Id,
          inputVal: vm.returnValue[max - 1],
        };
      } else {
        return {
          Id: vm.formData.Id,
          inputVal: vm.returnValue,
        };
      }
    },
  },
  methods: {
    successUpload(res) {
      const vm = this;
      vm.returnValue = res.response.split("\\")[1];
    },
    handleChange(val) {
      console.log(val);
    },
  },
  created: function () {
    let len = 10;
    for (let i = 0; i < len; i++) {
      let item = { value: "" };
      this.selectVal.push(item);
    }
  },
  mounted() {
    const vm = this;
    if (vm.formData.ColumnType == 7) {
      vm.options = JSON.parse(vm.formData.ProfileColumn);
    }
  },
};
</script>

<style>
.formComp {
  display: flex;
  align-items: center;
  width: 90%;
  /* margin-bottom: 1rem; */
}

.formTitle {
  width: 90px;
  text-align: right;
  margin-right: 0.5rem;
}

.el-input-group__append {
  background-color: #fff !important;
  border: none !important;
}
</style>