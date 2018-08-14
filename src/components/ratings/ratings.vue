<template>
    <div class="ratings" ref="ratings">
      <div class="ratings-content">
        <div class="overview">
          <div class="o-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="o-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <v-star :size="36" :score="seller.serviceScore"></v-star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <v-star :size="36" :score="seller.foodScore"></v-star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <v-split></v-split>
        <ratingSelect v-on:ratingTypeSelect="ratingTypeSelect" v-on:contentToggle="contentToggle"
          :ratings="ratings" :select-type="selectType" :only-content="onlyContent"></ratingSelect>
        <div class="rating-wrapper">
          <ul>
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" :key="rating.key" class="rating-item">
               <div class="avatar">
                 <img width="28" height="28" :src="rating.avatar"/>
               </div>
               <div class="content">
                 <span class="name">{{rating.username}}</span>
                 <div class="star-wrapper">
                   <v-star :size="24" :score="rating.score"></v-star>
                   <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                 </div>
                 <p class="text">{{rating.text}}</p>
                 <div class="recommend" v-show="rating.recommend.length && rating.recommend.length">
                   <span :class="{'icon-thumb_up':rating.rateType === 0}"></span>
                   <span class="item" v-for="item in rating.recommend" :key="item.key">{{item}}</span>
                 </div>
                 <div class="time">{{rating.rateTime | formatDate}}</div>
               </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import star from '../star/star';
  import split from '../split/split';
  import ratingSelect from '../ratingselect/ratingSelect';
  import {formatDate} from '../../common/js/date';
  const ALL = 2;
  const ERR_OK = 0;
    export default {
        name: 'ratings',
      props: {
          seller: {
            type: Object
          }
      },
      data() {
        return {
          ratings: [],
          selectType: ALL,
          onlyContent: false
        };
      },
      methods: {
        needShow(type, text) {
          if (this.onlyContent && !text) {
            return false;
          }
          if (this.selectType === ALL) {
            return true;
          } else {
            return type === this.selectType;
          }
        },
        contentToggle(onlyContent) {
          this.onlyContent = onlyContent;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        ratingTypeSelect(type) {
          this.selectType = type;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        }
      },
      components: {
          'v-star': star,
          'v-split': split,
          'ratingSelect': ratingSelect
      },
      created() {
         this.$http.get('./api/ratings').then((response) => {
            response = response.body;
            if (response.errno === ERR_OK) {
              this.ratings = response.data;
              this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.ratings, {
                  click: true
                });
              });
            }
         });
      },
      filters: {
        formatDate(time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
      }
    };
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
  @import '../../common/stylus/mixin.styl';
 .ratings
   position :absolute
   top:174px
   bottom:0
   width: 100%
   left:0
   overflow :hidden
   .overview
      display:flex
      padding:18px 0
      .o-left
        flex:0 0 137px
        width:137px
        border-right:1px solid rgba(7,17,27,0.1)
        text-align:center
        padding:6px 0
        @media only screen and (max-width:320px)
           flex:0 0 120px
           width:120px
        .score
          margin-bottom :6px
          height:28px
          line-height :28px
          font-size:24px
          color:rgb(255,153,0)
        .title
           margin-bottom :8px
           height:12px
           line-height :12px
           font-size : 12px
           color:rgb(7,17,27)
        .rank
            line-height :10px
            height:10px
            font-size :10px
            color:rgb(147,153,159)
      .o-right
         flex:1
         padding:6px 0 6px 24px
         margin-bottom :6px
         @media only screen and (max-width:320px)
            padding-left:6px
         .score-wrapper
           font-size:0
           .title
             line-height:18px
             display:inline-block
             vertical-align :top
             font-size :12px
             color:rgb(7,17,27)
           .star
              line-height:18px
              display:inline-block
              vertical-align :top
              margin:0 12px
           .score
             line-height:18px
             display:inline-block
             vertical-align :top
             font-size :12px
             color:rgb(255,153,0)
         .delivery-wrapper
           font-size:0
           .title
             line-height:18px
             font-size :12px
             color:rgb(7,17,27)
           .delivery
              margin-left:12px
              font-size:12px
              color :rgb(147,153,159)
   .rating-wrapper
      padding:0 18px
      .rating-item
         display:flex
         padding:18px 0
         border-1px(rgba(7,17,27,0.1))
         .avatar
           flex:0 0 28px
           width:28px
           margin-right:12px
           img
             border-radius :50%
         .content
            position:relative
            flex:1
            .name
              margin-bottom :4px
              line-height:12px
              font-size:10px
              color:rgb(7,17,27)
            .star-wrapper
               margin-bottom:6px
               font-size:0
               .star
                 display:inline-block
                 vertical-align :top
                 margin-right:6px
               .delivery
                 display:inline-block
                 vertical-align :top
                 line-height:12px
                 font-size:10px
                 font-weight :200
                 color:rgb(7,17,27)
            .text
               margin-bottom :8px
               line-height:18px
               color:rgb(7,17,27)
               font-size:12px
            .recommend
               line-height:16px
               font-size :0
               .icon-thumb_up,.item
                  display:inline-block
                  margin:0 8px 4px 0
                  font-size :10px
               .icon-thumb_up
                   color:rgb(0,160,220)
               .item
                  padding:0 6px
                  border:1px solid rgba(7,17,27,0.2)
                  border-radius :2px
                  color :rgb(147,153,159)

         .time
            position :absolute
            top:0
            right:0
            line-height:12px
            font-size:10px
            color:rgb(7,17,27)
</style>
