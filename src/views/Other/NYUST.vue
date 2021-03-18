<template>
  <div id="NYUST">
    <div class="buttonList">
      <el-date-picker v-model="search.startDate" type="date" value-format="yyyy-MM-dd" placeholder="開始日期" style="margin: 0 10px 0 0" @change="showTest"></el-date-picker>
      <el-date-picker v-model="search.endDate" type="date" value-format="yyyy-MM-dd" placeholder="結束日期" style="margin: 0 10px 0 0" @change="showTest"></el-date-picker>
      <el-select v-model="search.actStatus">
        <el-option label="全部" value=""></el-option>
        <el-option label="未簽核" value="W"></el-option>
        <el-option label="簽核中" value="I"></el-option>
        <el-option label="已簽核" value="E"></el-option>
      </el-select>
      <el-input style="width: 240px" v-model="search.key" placeholder="關鍵字"></el-input>
      <el-button type="primary" @click="getData">搜尋</el-button>
      <el-button type="primary" @click="toDownload">匯出</el-button>
    </div>
    <div class="tableD">
      <el-table header-cell-class-name="tableHeader" :data="list" style="width: 100%" height="700">
        <el-table-column v-for="(item, index) in listTitle" :label="item" :prop="item" :key="index" sortable></el-table-column>
        <el-table-column label="活動起始日期">
          <template slot-scope="scope">
            <p>{{ YYYYMMDD(scope.row.活動起始日期) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="活動終止日期">
          <template slot-scope="scope">
            <p>{{ YYYYMMDD(scope.row.活動終止日期) }}</p>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      search: {
        key: "",
        startDate: "",
        endDate: "",
        actStatus: "",
      },
      list: [],
    };
  },
  computed: {
    listTitle() {
      if (this.list && this.list[0]) {
        return Object.keys(this.list[0]).filter(
          (i) =>
            i !== "證書連結" &&
            i !== "證書字號" &&
            i !== "活動起始日期" &&
            i !== "活動終止日期"
        );
      } else {
        return [];
      }
    },
    YYYYMMDD() {
      return (date) => moment(date).format("YYYY-MM-DD");
    },
  },
  async created() {
    // await this.getData();
  },
  methods: {
    async getData() {
      this.$store.dispatch("loadingHandler", true);

      await this.$api.GetActivityExcelList(this.search).then((res) => {
        this.list = res.data.response;
        this.$store.dispatch("loadingHandler", false);
      });
      //await this.$api.GetActivityExcel(this.search);
    },
    async toDownload() {
      let flag = await this.$api
        .GetActivityExcel(this.search)
        .then((res) => res.data);
      window.open(this.$store.state.fileBase + flag);
      console.log(flag);
    },
    showTest() {
      console.log(this.search.startDate);
    },
  },
};
</script>

<style>
</style>