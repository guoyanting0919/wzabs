<template>
  <div id="ActivityIdentificationCard">
    <Title :title="$router.currentRoute.meta.title"></Title>
    <el-button @click="toPrint">列印</el-button>
    <div class="IdentificationCardA4">
      <div class="IdentificationCardPage">
        
        <table border=1 class="IdentificationCardPageTable">
          <tr v-for="(item,index) in getArr" :key="index">
            <td class="IdentificationCardPageCard" v-for="(item2,index2) in item" :key="index2">
              <div class="IdentificationCardPageCardTitle">{{ActivityData.ActName}}</div>
              <div class="IdentificationCardPageCardItem" v-for="(item3,index3) in IdentifyColumns" :key="index3" v-if="getTableCol(item2.ActivityRegisterFormDtlViewModel,item3)">
                {{getTableCol(item2.ActivityRegisterFormDtlViewModel,item3).FormDtl+" : "+getTableCol(item2.ActivityRegisterFormDtlViewModel,item3).InputVal}}
              </div>
            </td>
          </tr>
        </table>

        <!--<div class="IdentificationCardPageCard" v-for="item in list" :key="item.Id">
          <div class="IdentificationCardPageCardTitle">{{ActivityData.ActName}}</div>
          <div class="IdentificationCardPageCardItem" v-for="(item2,index2) in IdentifyColumns" :key="index2" v-if="getTableCol(item.ActivityRegisterFormDtlViewModel,item2)">
            {{getTableCol(item.ActivityRegisterFormDtlViewModel,item2).FormDtl+" : "+getTableCol(item.ActivityRegisterFormDtlViewModel,item2).InputVal}}
          </div>
        </div>-->
      
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Title from '@/components/Title.vue'
export default {
  data() {
    return {
      list:[],
      ActivityData:[]
    }
  },
  components:{Title},
  computed: {
    IdentifyColumns() {
      return JSON.parse(this.ActivityData.IdentifyColumns)
    },
    getArr() {
      return this.arrCombination(this.list)
    }
  },
  async created() {
    await this.getData()
    console.log(this.getArr)
  },
  methods: {
    async getData() {
      this.ActivityData=await this.$api.GetActivityById({Id:this.$router.currentRoute.query.ActivityId}).then(res=>res.data.response)
      this.list=await this.$api.GetActivityRegisterById({ActivityId:this.$router.currentRoute.query.ActivityId}).then(res=>res.data.response)
    },
    getTableCol(list,Id) {
      return list.filter(res=>res.FormDtlId==Id)[0]
    },
    toPrint() {
      let html=document.querySelectorAll(".IdentificationCardA4")[0].innerHTML
      document.body.innerHTML=html
      window.print()
      location.reload()
    },
    arrCombination(x) {
      let xl=x.length
      let arr=[]
      for(let i=0;i<(x.length/2);i++) {
        arr[i]=[x[i*2],x[(i*2)+1]]
        if(!arr[i][1]) arr[i].splice(1, 1)
      }
      return arr
    }
  }
}
</script>

<style scoped>
.print {
  page-break-after:always;    /*print分頁面*/
}
table { page-break-inside:auto }
tr    { page-break-inside:avoid; page-break-after:auto }
 .IdentificationCardA4 {
  display: flex;
  justify-content: center;
  page-break-after:always;
}
.IdentificationCardPage {
  width: 595px;
  min-height: 842px;
  display: flex;
  flex-wrap: wrap;
  page-break-after:always;
}
.IdentificationCardPageTable {
  border-collapse: collapse;
  page-break-after:always;
}
.IdentificationCardPageCard {
  width: 50%;
  height: 100px;
  padding: 5px 10px;
  box-sizing: border-box;
  position: relative;
  page-break-after:always;
}
.IdentificationCardPageCardTitle {
  text-align: center;
}
.IdentificationCardPageCardNo {
  position: absolute;
  bottom:5px;
  right:5px;
}
.IdentificationCardPageCardItem {
  word-break: break-all;
}
@page {
    margin:1cm;    /*print邊界*/
    size:210mm148mm;     /*列印紙張大小*/
    page-break-after:always;
}
@media print{
 .IdentificationCardA4 {
  display: flex;
  justify-content: center;
  page-break-after:always;
}
.IdentificationCardPageTable {
  border-collapse: collapse;
  page-break-after:always;
}
.IdentificationCardPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  page-break-after:always;
}
.IdentificationCardPageCard {
  width: 50%;
  height: 100px;
  padding: 5px 10px;
  box-sizing: border-box;
  position: relative;
  page-break-after:always;
}
.IdentificationCardPageCardTitle {
  text-align: center;
}
.IdentificationCardPageCardNo {
  position: absolute;
  bottom:5px;
  right:5px;
}
} 
</style>>
