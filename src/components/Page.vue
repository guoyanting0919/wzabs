<template>
  <div class="page">
    <template v-for="(item,index) in pList">  
      <div class="pageD" :class="{'pageDonc':item==now}" :key="index" v-if="item>0&&item<=count" @click="goTo(item)">{{item}}</div>
    </template>
    <select :value="now" @change="goTo($event.target.value)" v-if="now">
      <option v-for="(item,index) in count" :key="index" :value="item">{{item+" / "+count}}</option>
    </select>
  </div>
</template>

<script>
export default {
  props:["now","count","rightPage","leftPage"],
  data() {
    return {
    }
  },
  computed: {
    pList() {
      var arr=[]
      for(let i=this.now-this.leftPage;i<=this.now+this.rightPage;i++) {
        arr.push(i)
      }
      return arr
    }
  },
  methods: {
    goTo(x) {
      this.$emit("changePage", x);
    }
  }
}
</script>
