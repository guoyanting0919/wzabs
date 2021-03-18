<template>
  <div style="width:100%">
    <el-row v-for="(item,index) in list " :key="index" :gutter="16">
      <el-col>
        <div class="el-col-item">{{item.ColumnName}}</div>
        <formComp :formData="item" :ref="'Row'"></formComp>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import formComp from "@/components/formComp.vue";
//import alldata from "@/assets/route";
export default {
  components: { formComp },
  props:{
    data: {
      type: Array,
      default: [],
    }
  },
  watch: {
    data: {
      handler (newVal) {
        this.list=newVal
        console.log(this.list)
        this.$forceUpdate()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      list:[]
    };
  },
  computed: {
    getMax() {
      let arr = [];
      this.list.map(obj => {
        arr.push(obj.CRow);
      });

      let max = arr.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return max;
    }
  },
  methods: {
    getRow(id) {
      console.log("getRow",this.list.filter(obj => {return obj.CRow === id}))
      return this.list.filter(obj => {
        return obj.CRow === id;
      });
    },
    showRow() {
      /*
        {
    "id": 0,
    "activityRegisterId": 0,
    "formDtlId": 0,
    "inputVal": "string"
  }
      */
      let obj = {};
      for (let i in this.$refs.Row) {
        obj["Row" + i] = this.$refs.Row[i].getValue;
      }
      //console.log(Object.values(obj));
      return Object.values(obj)
    }
  },
  created() {
  },
  mounted() {
    // console.log(this.$refs.Row);
  }
};
</script>
<style lang='scss'>

.el-col {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.el-col-item {
  width: 90px;
  margin: 0 10px;
  text-align: left;
}
</style>