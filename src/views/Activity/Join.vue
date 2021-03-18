<template>
  <div id="ActivityJoin">
    <Title :title="$router.currentRoute.meta.title"></Title>
    <div class="form">
      <el-form ref="form" label-width="110px" style="width: 100%; display: flex">
        <div class="formLeft">
          <div class="formLeftTitle">活動名稱 {{ ActivityData.ActName }}</div>
          <el-form-item label="所屬單位">
            <el-select v-model="changeUnit">
              <el-option v-for="item in UnitList" :key="item.Id" :label="item.UntNameFull" :value="item.UntId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-select v-model="form.MemberId">
              <el-option v-for="item in getMember" :key="item.Id" :label="item.UnitName" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <!--<FormModelTable ref="form" :data="FormData.FormDtlDTO" v-if="FormData.FormDtlDTO&&FormData.FormDtlDTO.length>0"></FormModelTable>-->
          <!--<el-form-item label="姓名 / 職工編號">
            <el-input style="width:240px;"></el-input>
          </el-form-item>
          <el-form-item label="職級">
            <el-input style="width:240px;"></el-input>
          </el-form-item>
          <el-form-item label="職別">
            <el-input style="width:240px;"></el-input>
          </el-form-item>
          <el-form-item label="請選擇到職日期">
            <el-input style="width:240px;"></el-input>
          </el-form-item>
            <el-form-item label="兼任行政工作">
            <el-input style="width:240px;"></el-input>
          </el-form-item>
          <el-form-item label="專兼任">
            <el-input style="width:240px;"></el-input>
          </el-form-item>-->
          <el-button class="formLeftSearch">查詢</el-button>
          <el-button type="primary" @click="$refs.form.showRow()">確認送出</el-button>
        </div>
        <!--<div class="formRight">
          <div class="formRightList">
            <div class="formRightListTitle">已選中</div>
          </div>
          <div class="formRightList">
            <div class="formRightListTitle">搜尋結果</div>
          </div>
        </div>-->
      </el-form>
    </div>
    <div class="formButtonList">
      <el-button type="primary" @click="sub">儲存並發送郵件</el-button>
      <el-button type="primary" @click="subNoEmail">儲存並返回</el-button>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
//import FormModelTable from '@/components/FormModelTable'
export default {
  data() {
    return {
      step: 1,
      UnitList: [],
      MemberList: [],
      ActivityData: "",
      FormData: "",
      form: "",
      changeUnit: "",
      form: {
        MemberId: null,
        ActivityId: null,
        Status: 0,
        JoinType: 0,
      },
    };
  },
  computed: {
    getMember() {
      return this.MemberList.filter((res) => res.UnitCode == this.changeUnit);
    },
  },
  async created() {
    this.ActivityData = await this.$api
      .GetActivityById({ Id: this.$router.currentRoute.query.Id })
      .then((res) => res.data.response);
    this.FormData = await this.$api
      .GetFormById({ Id: this.ActivityData.FormId })
      .then((res) => res.data.response);
    this.UnitList = await this.$api.GetUnits().then((res) => res.data);
    this.MemberList = await this.$api.GetMemberNoPage().then((res) => res.data);
    this.form.ActivityId = this.$router.currentRoute.query.Id;
  },
  components: { Title },
  methods: {
    async sub() {
      /*let data=this.$refs.form.showRow()
      console.log(data)*/
      let flag = await this.$api
        .PostActivityRegister(this.form)
        .then((res) => res.data);
    },
    async subNoEmail() {
      /*let data=this.$refs.form.showRow()
      console.log(data)*/
      let flag = await this.$api
        .PostActivityRegisterNoEmail(this.form)
        .then((res) => res.data);
    },
  },
};
</script>
