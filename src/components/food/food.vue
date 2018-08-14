<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.image"/>
          <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="count">月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <v-cart v-show="food.count" :food="food"></v-cart>
          </div>
          <transition name="fade">
            <div @click="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <v-split></v-split>
        <div class="info">
          <h1 title="title" >商品信息</h1>
          <p class="text" v-show="food.info">{{food.info}}</p>
        </div>
        <v-split></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-ratingselect v-on:ratingTypeSelect="ratingTypeSelect" v-on:contentToggle="contentToggle"
            :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></v-ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
               <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                   :key="rating.key" class="rating-item">
                 <div class="user">
                   <span class="name">{{rating.username}}</span>
                   <img class="avatar" width="12" height="12" :src="rating.avatar"/>
                 </div>
                 <div class="time">{{rating.rateTime | formatDate}}</div>
                 <p class="text">
                   <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                 {{rating.text}}
                 </p>
               </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import ratingselect from '../ratingselect/ratingSelect'; // export default 出来的直接可以引用
  import Vue from 'vue';
  import split from '../split/split';
  import {formatDate} from '../../common/js/date';// export function 出来的需要带花括号引入
  const ALL = 2;
    export default {
        name: 'food',
        props: {
          food: {
            type: Object
          }
        },
      components: {
        'v-cart': cartcontrol,
        'v-split': split,
        'v-ratingselect': ratingselect
      },
      data() {
          return {
            showFlag: false,
            selectType: ALL,
            onlyContent: true,
            desc: {
              all: '全部',
              positive: '推荐',
              negative: '吐槽'
            }
          };
      },
      methods: {
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
        },
          show() {
            this.showFlag = true;
            this.selectType = ALL;
            this.onlyContent = true;
            this.$nextTick(() => {
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.food, {
                  click: true
                });
              } else {
                this.scroll.refresh();
              }
            });
          },
        hide() {
            this.showFlag = false;
        },
        addFirst(event) {
            if (!event._constructed) {
              return;
            }
            Vue.set(this.food, 'count', 1);
        },
        needShow(type, text) {
          if (this.onlyContent && !text) {
            return false;
          }
          if (this.selectType === ALL) {
            return true;
          } else {
            return type === this.selectType;
          }
        }
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
  .food
   position:fixed
   left:0
   top:0
   bottom:48px
   z-index:30
   width:100%
   background-color #fff
   transform :translate3d(0,0,0)
   &.move-enter-active,&.move-leave-active
     transition :all 0.2s linear
   &.move-enter,&.move-leave-to
     transform :translate3d(100%,0,0)
   .img-header
     position :relative
     width: 100%
     height:0
     padding-top:100%
     img
       position :absolute
       top:0
       left:0
       width: 100%
       height: 100%
     .back
        position :absolute
        top:10px
        left:0
        .icon-arrow_lift
           display:block
           padding:10px
           font-size:20px
           color:#fff
   .content
     position:relative
     padding:18px
     .title
       margin-bottom 8px
       line-height 14px
       font-size:14px
       font-weight :700
       color rgb(7,17,27)
     .detail
       margin-bottom 18px
       line-height 10px
       font-size 10px
       color rgb(147,153,159)
       .count
         margin-right:12px
     .price
       font-size: 14px
       color:red
       font-weight :700
       line-height:24px
       .oldPrice
         font-size: 10px
         color:rgb(147,153,159)
         font-weight :700
         line-height:24px
         margin-left :8px
         text-decoration :line-through
     .cartcontrol-wrapper
       position absolute
       right 12px
       bottom 18px
     .buy
        position absolute
        right 8px
        bottom 18px
        z-index 10
        line-height 24px
        height 24px
        width 50px
        padding 0 12px
        font-size 10px
        border-radius 12px
        color #fff
        background rgb(0,160,220)
        opacity:1
        &.fade-enter-active,&.fade-leave-active
          transition all 0.2s
        &.fade-enter,&.fade-leave-to
          opacity :0
   .info
     padding:18px
     .title
       line-height :14px
       margin-bottom :6px
       font-size :14px
       color:rgb(7,17,27)
     .text
       line-height :24px
       padding:0 8px
       font-size 12px
       color:rgb(77,85,93)
   .rating
     padding-top:18px
     .title
       line-height :14px
       margin-left :18px
       font-size :14px
       color:rgb(7,17,27)
     .rating-wrapper
       padding:0 18px
       .rating-item
         position :relative
         padding:16px 0
         border-1px(rgba(7,17,27,0.1))
         .user
           position :absolute
           right:0
           top:16px
           line-height:12px
           font-size:0
           .name
             display :inline-block
             vertical-align :top
             font-size :10px
             margin-right:6px
             color:rgb(147,153,159)
           .avatar
             display :inline-block
             vertical-align :top
             height:12px
             width:12px
             border-radius :50%
         .time
           margin-bottom:6px
           line-height:12px
           font-size:10px
           color:rgb(7,17,27)

         .text
           line-height:16px
           font-size:12px
           color:rgb(7,17,27)
           .icon-thumb_up,.icon-thumb_down
              line-height :16px
              margin-right:4px
              font-size:12px
           .icon-thumb_up
              color:rgb(0,160,220)
           .icon-thumb_down
               color:rgb(7,17,27)
       .no-rating
         padding:16px 0
         font-size:12px
         color:rgb(147,153,159)
</style>
