<template>
  <div class="CertificatePreview">
    <div style="display: flex; justify-content: center">
      <div class="CertificatePreviewBox" ref="printBox">
        <img class="CertificatePreviewImg" :src="$store.state.fileBase + 'Files/' + img" />
        <!--<img
          class="CertificatePreviewImg"
          :src="'http://enroll.wzu.edu.tw/Files/Files/201223451_0827185832.png'"
        />-->
        <div class="CertificatePreviewText" v-html="textReal" v-if="textReal"></div>
      </div>
    </div>
    <div class="formButtonList">
      <el-button type="primary" @click="toPrint" v-if="false">列印</el-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  //%cmname 使用者姓名
  //%name  活動名稱
  //%unit  主辦單位
  //%actcg  種類
  //%acttype  活動型態
  //%area  活動地點
  //%begin  開始日期
  //%end  結束日期
  //%hours  時數
  props: ["user", "act", "img", "text"],
  data() {
    return {};
  },
  computed: {
    textReal() {
      let text = this.text;
      text = text.replace(/%cmname/gm, this.user.UserName);
      text = text.replace(/%name/gm, this.act.ActName);
      text = text.replace(/%unit/gm, this.act.ActOrganizer);
      text = text.replace(
        /%actcg/gm,
        this.$store.state.actType.filter(
          (res) => res.Id == this.act.ActTypeId
        )[0].title
      );
      text = text.replace(
        /%acttype/gm,
        this.$store.state.actCategory.filter(
          (res) => res.Id == this.act.ActCategoryId
        )[0]?.title || ""
      );
      text = text.replace(/%area/gm, this.act.ActCountry);
      text = text.replace(
        /%begin/gm,
        this.YYYYMMDDhhmmss(this.act.ActStartDate)
      );
      text = text.replace(/%end/gm, this.YYYYMMDDhhmmss(this.act.ActEndDate));
      text = text.replace(/%hours/gm, this.act.ActTime);
      text = text.replace(/%regNo/gm, this.user.regNo);
      console.log(text);
      return text;
    },
  },
  methods: {
    toPrint() {
      document.body.innerHTML = this.$refs.printBox.innerHTML;
      window.print();
      //location.reload();
    },
    YYYYMMDDhhmmss(x) {
      return moment(x).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
@page {
  width: 210mm;
  min-height: 297mm;
  font-size: 20px;
}
@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
    font-size: 20px;
  }
  .CertificatePreviewBox {
    width: 210mm;
    height: 297mm;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
  .CertificatePreviewImg {
    width: 210mm;
    height: 297mm;
  }
  .CertificatePreviewText {
    width: 210mm;
    height: 297mm;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
}
.CertificatePreview {
  .CertificatePreviewBox {
    width: 100%;
    height: 370mm;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
  .CertificatePreviewImg {
    width: 100%;
    height: 370mm;
  }
  .CertificatePreviewText {
    width: 100%;
    height: 370mm;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
}
</style>