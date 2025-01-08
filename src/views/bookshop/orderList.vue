<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="height: 810px;" >
          <el-badge :value="cartList.length" class="item">
          <el-button effect="dark" type="primary">我的订单</el-button>
        </el-badge>
        
          <div class="bookList">
            <div  v-for="item in cartList" class="cartin">
              
  <div class="orderl">
    <div style="width: 50%;">
     <p class="ml20">  {{ item.book.bookName }}  <el-tag effect="dark" type="danger">{{ item.book.price }}</el-tag></p>
      <p class="ml20"> 购买人 wanglei</p>
      </div>
                <div  style="width: 50%;">  <el-image style="width:80px; height: 80px" :src="`${baseUrl}${item.book.bookPic}`" :fit="fit" /></div>
              
  </div>
            
    <div class="orderr">
                <p>交易时间 <el-tag effect="dark" class="ml20">{{parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}')   }}</el-tag></p>
                <p>购买状态 <el-tag effect="dark" class="ml20">{{ item.paymentStatus }}</el-tag></p>
    
   </div>
            </div>
          </div>
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
import { nextTick, onMounted } from 'vue'
import { cartView } from '@/api/bookshop/index'
import {listBook, } from '@/api/book/booklist';
import { Edit, View, Warning,Plus,WalletFilled } from '@element-plus/icons-vue'
const baseUrl = import.meta.env.VITE_APP_BASE_API;
onMounted(() => {

})

const bookList = ref([])
const cartList = ref([])
const loading = ref(false)

function getList () {
//   loading.value = true
 
  listBook().then(response => {
    bookList.value = response.rows
    // total.value = response.total
    loading.value = false
  })
  cartView(3).then(res=>{
    cartList.value= res.data
  })

}
getList()

const totalPrice = computed(()=>{
  let totalNumber = cartList.value.map(item=>{
    return item.book.price
  })
  console.log('total',totalNumber)
  let total = totalNumber.reduce((acc,curr)=>acc*1+curr*1,0)
  return  Number(total).toFixed(2) 
})

</script>
<style lang="scss" scoped>
.cartlist { display: flex;  justify-content: flex-start;
  .cartin{ width: 50%;}
}

.bookList { display: flex;  justify-content: flex-start;  align-items:flex-start; width: 100%; height: 800px; flex-flow:column wrap; overflow-y: scroll; 
  .cartin{
    padding: 5px 10px;width: 97%; height: 100px;  
      margin-right: 1%; margin-left: 1%; border-radius: 5px 5px; margin-top: 15px; box-sizing: border-box;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.19); /* 外阴影 */  
    display: flex; 
    .orderl{ width: 50%; display: flex; justify-content: flex-start;  }
    .orderr{ width: 50%;}
    
  }
}
</style>