<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="height: 810px;">
          <el-badge :value="cartList.length" class="item">
            <el-button effect="dark" type="primary">我的订单</el-button>
          </el-badge>

          <div class="bookList" v-if="!isEmpty">
            <div v-for="item in cartList" class="cartin">

              <div class="orderl">
                <div style="width: 50%;">
                  <p class="ml20"><span class="tred font18" type="danger">{{ item.book.price
                      }} ¥</span>   <span class="ml20">《{{ item.book.bookName }}》</span> </p>
                  <p class="ml20"> 购买人:  {{ item.user.nickName }}</p>
                </div>
                <div style="width: 50%;"> <el-image style="width:80px; height: 80px"
                    :src="`${baseUrl}${item.book.bookPic}`" :fit="fit" /></div>

              </div>

              <div class="orderr">
                <p>交易时间 <el-tag effect="dark" class="ml20">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}')
                    }}</el-tag></p>
                <p>购买状态 <el-tag effect="dark" class="ml20">{{ item.paymentStatus }}</el-tag></p>

              </div>
              <el-popconfirm title="是否确认移除当前商品?" @confirm="handleDelete(item)" width="260">
          <template #reference>
            <el-button circle :icon="Delete" type="danger" effect="dark"  ></el-button>

          </template>
        </el-popconfirm>
            </div>
          </div>

          <el-empty v-else></el-empty>
        </div>
      </el-col>
      <el-col :span="6">
        <el-card style="height: 810px;" class=""> <el-tag effect="dark">去支付</el-tag>
          <div class="cartlist mt20">
            <h1 style="font-weight: 800;">{{ totalPrice }} ¥</h1>

          </div>
          <el-divider></el-divider>
          <el-button type="success" :icon="WalletFilled">我的钱包</el-button>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { nextTick, onMounted, toRefs, reactive, ref } from 'vue'
import { cartView,delCart } from '@/api/bookshop/index'
import { listBook, } from '@/api/book/booklist';
import { Edit, View, Warning, Plus, WalletFilled,Delete } from '@element-plus/icons-vue'
const baseUrl = import.meta.env.VITE_APP_BASE_API;

import { getUserProfile } from '@/api/system/user'


// const state = reactive({
//   user: {},
//   roleGroup: {},
//   postGroup: {}
// })
const user = ref({})




const bookList = ref([])
const cartList = ref([])
const loading = ref(false)
const isEmpty = ref(false)

async function getList() {
  //   loading.value = true

  const res = await getUserProfile()
  user.value = res.data.userId
  console.log('state user', user.value)
  listBook().then(response => {
    bookList.value = response.rows
    // total.value = response.total
    loading.value = false
  })

  cartView(user.value).then(res => {
    if (!res.data.length) {
      isEmpty.value = true
    }
    else {
      cartList.value = res.data

    }
  })

}
getList()

const totalPrice = computed(() => {
  let totalNumber = cartList.value.map(item => {
    return item.book.price
  })
  console.log('total', totalNumber)
  let total = totalNumber.reduce((acc, curr) => acc * 1 + curr * 1, 0)
  return Number(total).toFixed(2)
})

const handleDelete =(item)=>{
  delCart(item.id).then(res=>{
    getList()
  })
}
</script>
<style lang="scss" scoped>
.cartlist {
  display: flex;
  justify-content: flex-start;

  .cartin {
    width: 50%;
  }
}

.bookList {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  flex-flow: row wrap;
  overflow-y: scroll;

  .cartin {
    padding: 5px 10px;
    width: 97%;
    height: 100px;
    margin-right: 1%;
    margin-left: 1%;
    border-radius: 5px 5px;
    margin-top: 15px;
    box-sizing: border-box;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.19);
    /* 外阴影 */
    display: flex;

    .orderl {
      width: 50%;
      display: flex;
      justify-content: flex-start;
    }

    .orderr {
      width: 50%;
    }

  }
  .tred{ color: rgb(230, 20, 20);}
  .font18{ font-size: 24px; font-weight: 800; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;}
}
</style>