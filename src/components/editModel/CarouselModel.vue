<template>
  <div class="editModel">
    <el-dialog :close-on-click-modal="false" :title="isAdd ? '新增' : '修改'" :visible.sync="showEdit" width="500px">
      <el-form label-width="100px">
        <el-form-item label="標題">
          <el-input v-model="form.Title"></el-input>
        </el-form-item>
        <el-form-item label="圖片">
          <div v-if="form.Pic">
            <a :href="form.Pic">{{form.Pic}}</a>
            <el-button type="danger" @click="form.Pic=''">刪除</el-button>
          </div>
          <el-upload :show-file-list="false" :action="$store.state.apiBase+'Img'" :headers="{'authorization':'Bearer '+$store.state.token}" :on-progress="()=>{this.$store.dispatch('loadingHandler', true)}" :on-success="(res,file)=>{return successUpdata(res,file)}">
            <el-button size="small" type="primary" v-if="!form.Pic">上傳圖片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="圖片連結">
          <el-input v-model="form.LinkUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.Sort" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <div class="formButtonList">
          <el-button type="primary" @click="sub()">儲存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <div class="editModelTitle">
      <h2 class="editModelTitleH2">輪播圖設定</h2>
      <el-button type="primary" @click="add()">新增輪播圖</el-button>
    </div>
    <div class="carouselBox">
      <el-carousel trigger="click" height="500px" style="width:1200px;">
        <el-carousel-item v-for="(item,index) in list" :key="index">
          <div style="cursor:pointer" class="carouselItem">
            <img @click="handleLink(item)" class="carouselItemImg" :src="item.Pic" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="tableD">
      <el-table header-cell-class-name="tableHeader" :data="list" style="width: 100%">
        <el-table-column label="排序" prop="Sort" sortable></el-table-column>
        <el-table-column label="標題" prop="Title" sortable></el-table-column>
        <el-table-column label="圖片連結" prop="LinkUrl" sortable></el-table-column>
        <el-table-column label="圖片" prop="Pic" sortable></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--<template slot-scope="scope"></template>-->
            <div class="iconList">
              <el-tooltip class="item" effect="dark" content="編輯" placement="top" :open-delay="500">
                <div class="iconListD" @click="edit(scope.row)">
                  <i class="myicon-edit"></i>
                </div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="刪除" placement="top" :open-delay="500">
                <div class="iconListD" @click="del(scope.row.Id)">
                  <i class="myicon-delete"></i>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        page: 1,
        key: "",
      },
      form: {
        Id: 0,
        Title: "",
        Pic: "",
        LinkUrl: "",
        Sort: 1,
      },
      isAdd: false,
      showEdit: false,
      list: [],
    };
  },
  async created() {
    this.$store.dispatch("loadingHandler", true);
    await this.getData();
    this.$store.dispatch("loadingHandler", false);
  },
  methods: {
    getData() {
      this.$api.GetBanner(this.search).then((res) => {
        // this.list = res.data.response.data.map((item) => {
        //   item.Sort = Math.floor(Math.random() * Math.floor(7));
        //   return item;
        // });

        this.list = res.data.response.data.sort((a, b) => {
          return a.Sort - b.Sort;
        });
      });
    },
    handleLink({ LinkUrl }) {
      console.log();
      if (LinkUrl) {
        window.open(LinkUrl);
      }
    },
    async sub() {
      this.$store.dispatch("loadingHandler", true);
      let flag = "";
      if (this.isAdd) {
        flag = await this.$api.PostBanner(this.form).then((res) => res.data);
      } else {
        flag = await this.$api.PutBanner(this.form).then((res) => res.data);
      }
      await this.getData();
      this.showEdit = false;
      this.$store.dispatch("loadingHandler", false);
    },
    add() {
      this.form = {
        Id: 0,
        Title: "",
        Pic: "",
      };
      this.isAdd = true;
      this.showEdit = true;
    },
    edit(x) {
      this.form = JSON.parse(JSON.stringify(x));
      this.isAdd = false;
      this.showEdit = true;
    },
    async del(x) {
      let flag = confirm("確定刪除?");
      if (!flag) return 0;
      await this.$api.DelBanner({ Id: x });
      await this.getData();
    },
    async successUpdata(res, file) {
      console.log(res, file);
      if (res.success) {
        this.form.Pic = this.$store.state.fileBase + "Files/" + res.response;
      }
      this.$store.dispatch("loadingHandler", false);
    },
  },
};
</script>

<style>
</style>