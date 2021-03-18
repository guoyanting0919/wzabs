<template>
  <div id="home">
  </div>
</template>

<script>
import formComp from "@/components/formComp.vue";
import alldata from "@/assets/route";
export default {
  name: "Home",
  components: { formComp },
  data() {
    return {
      data: alldata.response.FormDtlDTO,
    };
  },
  computed: {
    getMax() {
      let arr = [];
      this.data.map((obj) => {
        arr.push(obj.CRow);
      });

      let max = arr.reduce(function (a, b) {
        return Math.max(a, b);
      });
      return max;
    },
  },
  methods: {
    getRow(id) {
      return this.data.filter((obj) => {
        return obj.CRow === id;
      });
    },
    showRow() {
      let obj = {};
      for (let i in this.$refs.Row) {
        obj["Row" + i] = this.$refs.Row[i].getValue;
      }
      console.log(Object.values(obj));
    },
  },
  created() {},
  mounted() {
    // console.log(this.$refs.Row);
    if (!window.localStorage.Token) {
      this.$router.push("/Login");
    }
    else {
      this.$router.push("/Activity/List");
    }
  },
};
</script>
<style lang='scss'>
#home {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // font-size: 3rem;
  // padding-bottom: 5rem;
}

.el-col {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
