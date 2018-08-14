<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link  to="/goods"><span>商品</span></router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings"><span>评论</span></router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller"><span>商家</span></router-link>
      </div>
    </div>
    <keep-alive><router-view v-bind:seller="seller" ></router-view></keep-alive>

  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/util';
  const ERR_OK = 0;
export default {
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
};
  },
  components: {
    'v-header': header
  },
  created() {
    this.$http.get('/api/seller?=' + this.seller.id).then((response) => {
     response = response.body;
     if (response.errno === ERR_OK) {
       // this.seller = response.data;
       this.seller = Object.assign({}, this.seller, response.data);// 给对象扩展属性
     }
    });
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin.styl";

  #app .tab {
    display: flex //布局写在前面
    width: 100% //宽高其次
    height: 40px
    line-height: 40px
  }
    .tab{
      border-1px(rgba(7,17,27,0.1))
    }
    .tab-item
     flex:1
     text-align:center
     &>a
       display:block
       font-size 14px
       color rgb(77,85,93)
       &.is-active {color:rgb(240,20,20)}
</style>
