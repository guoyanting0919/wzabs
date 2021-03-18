<template>
  <div id="NYUST">
    <div class="fw exportCSV">
      <el-button type="success" @click="exportCSV">匯出CSV檔</el-button>
    </div>

    <div class="tableD">
      <el-table header-cell-class-name="tableHeader" :data="list.data" height="calc(100vh - 190px)" style="width: 100%">
        <el-table-column label="活動名稱" prop="ActivityName" sortable></el-table-column>
        <el-table-column label="日期時間" prop="ActivityStartDate" sortable>
          <template slot-scope="scope">
            {{YYYYMMDDhhmmss(scope.row.ActivityStartDate)+" ~ "+YYYYMMDDhhmmss(scope.row.ActivityEndDate)}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="報名教師人數" prop="TeacherRegistCount" sortable></el-table-column> -->
        <el-table-column label="參加教師人數" prop="TeacherRegistCount" sortable></el-table-column>
        <!-- <el-table-column label="報名學生人數" prop="StudentRegistCount" sortable></el-table-column> -->
        <el-table-column label="參加學生人數" prop="StudentRegistCount" sortable></el-table-column>
        <!-- <el-table-column label="報名總人數" prop="TotalRegistCount" sortable></el-table-column> -->
        <el-table-column label="參加總人數" prop="TotalRegistCount" sortable></el-table-column>
        <el-table-column label="校外人士" prop="" sortable></el-table-column>
        <!-- <el-table-column label="是否已歸檔" prop="IsArchive" sortable>
          <template slot-scope="scope">
            {{scope.row.IsArchive ? "是" : "否"}}
          </template>
        </el-table-column> -->
        <el-table-column label="是否已送審核" prop="IsReviewing" sortable>
          <template slot-scope="scope">
            {{scope.row.IsReviewing ? "是" : "否"}}
          </template>
        </el-table-column>
        <el-table-column label="是否已審核通過" prop="IsPass" sortable>
          <template slot-scope="scope">
            {{scope.row.IsPass ? "是" : "否"}}
          </template>
        </el-table-column>
        <el-table-column label="申請數" prop="PassCount" sortable></el-table-column>
        <el-table-column label="退件數" prop="ReturnCount" sortable></el-table-column>
        <el-table-column label="退件率" prop="ReturnRate" sortable>
          <template slot-scope="scope">
            {{scope.row.ReturnRate+"%"}}
          </template>
        </el-table-column>
        <el-table-column label="審核通過率" prop="PassRate" sortable>
          <template slot-scope="scope">
            {{scope.row.PassRate+"%"}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page :now="search.page" :count="list.pageCount" :rightPage="5" :leftPage="5" @changePage="changePage"></Page>
  </div>
</template>

<script>
import moment from "moment";
import Page from "@/components/Page.vue";

export default {
  data() {
    return {
      search: {
        unitCode: "",
        startDate: "",
        endDate: "",
        page: 1,
      },
      list: [],
    };
  },
  components: { Page },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    await this.getData();
    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    async getData() {
      this.$store.dispatch("loadingHandler", true);
      this.list = await this.$api
        .GetActivityReport(this.search)
        .then((res) => res.data.response);
      //await this.$api.GetActivityExcel(this.search);
      this.$store.dispatch("loadingHandler", false);
    },
    async changePage(x) {
      this.search.page = x;
      await this.getData();
    },
    YYYYMMDDhhmmss(x) {
      return moment(x).format("YYYY-MM-DD HH:mm:ss");
    },
    async exportCSV() {
      this.$store.dispatch("loadingHandler", true);
      await this.$api.GetActivityReportExcel().then((res) => {
        let downloadElement = document.createElement("a");
        let href = process.env.VUE_APP_FILESURL + res.data; // 創建下載的鏈接
        downloadElement.href = href;
        console.log(href);
        downloadElement.download = res.data; // 下載後文件名
        // 此寫法兼容可火狐瀏覽器
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 點擊下載
        document.body.removeChild(downloadElement); // 下載完成移除元素
        window.URL.revokeObjectURL(href); // 釋放掉 blob 對象
        this.$alertT.fire({
          icon: "success",
          title: `匯出成功`,
        });
        this.$store.dispatch("loadingHandler", false);
      });
    },
  },
};
</script>

<style>
</style>