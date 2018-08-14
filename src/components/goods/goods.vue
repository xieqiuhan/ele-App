<template>
  <div>
  <div  class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,key) in goods" :key="item.key" class="menu-item"
        :class="{'current':currentIndex===key}" @click="selectMenu(key,$event)">
          <span class="text">
            <span  v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class='food-list food-list-hook' v-for="item in goods" :key="item.key">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" class="food-item border-1px" v-for="food in item.foods" :key="food.key">
              <div class="icon">
                <img height="57" width="57" :src="food.icon"/>
              </div>
              <div class="content">
                <span class="name">{{food.name}}</span>
                <p v-show="food.description" class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span >￥{{food.price}}</span>
                  <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-wrapper">
                  <v-cart  :select-foods="selectFoods" v-bind:food="food"></v-cart>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shop v-bind:select-foods="selectFoods" v-bind:deliveryPrice="seller.deliveryPrice"
    v-bind:minPrice="seller.minPrice"></v-shop>
  </div>
    <v-food :food="selectedFood" ref="food"></v-food>
  </div>
</template>
<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food';
  const ERR_OK = 0;
  export default {
    name: 'goods',
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: {},
        classMap: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
       currentIndex() {
         for (let i = 0; i < this.listHeight.length; i++) {
           let height1 = this.listHeight[i];
           let height2 = this.listHeight[i + 1];
           if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                  return i;
           }
         }
         return 0;
       },
      selectFoods() {
         let foods = [];
         this.goods.forEach((good) => {
           good.foods.forEach((food) => {
             if (food.count) {
               foods.push(food);
             }
           });
         });
         return foods;
       }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
           this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        let LEN = foodList.length;
        this.listHeight.push(height);
        for (let i = 0; i < LEN; i++) {
         let item = foodList[i];
         height += item.clientHeight;
         this.listHeight.push(height);
        }
      },
      selectMenu(key, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[key];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, $event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      'v-shop': shopcart,
      'v-cart': cartcontrol,
      'v-food': food
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special',
        'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
        }
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      });
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
  @import "../../common/stylus/mixin.styl";
  .goods
    display: flex
    position: absolute
    top: 174px
    width: 100%
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      text-align :center
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding:0 12px
        &.current
          position:relative
          margin-top: -1px
          z-index:10
          background-color :#fff
          font-weight :700
          .text
             border-none()
        .icon
          display: inline-block
          vertical-align :top
          height: 12px
          width: 12px
          margin-right: 2px
          margin-bottom: 2px;
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          vertical-align :middle
          width: 56px
          border-1px(rgba(7, 17, 27, 0.2))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left :14px
        height:26px
        line-height :26px
        border-left:2px solid #d9dde1
        font-size:12px;
        color:rgb(147,153,159)
        background-color :#f3f5f7
      .food-item
         display :flex
         margin:18px
         padding-bottom :18px
         border-1px(rgba(7,17,27,0.1))
         &:last-child
            border-none()
            margin-bottom:0
         .icon
            flex:0 0 57
            margin-right:10px
         .content
             flex:1
           .name
             display:inline-block
             margin:2px 0 8px 0
             height:14px
             line-height:14px
             font-size:14px
             color:rgb(7,17,27)
           .desc
             margin-bottom :8px
             font-size :10px
             color:rgb(147,153,159)
             line-height :12px
           .extra
             margin-bottom :8px
             line-height :10px
             font-size :10px
             color:rgb(147,153,159)
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
           .cart-wrapper
              position :absolute
              right:0
              bottom:12px
</style>
