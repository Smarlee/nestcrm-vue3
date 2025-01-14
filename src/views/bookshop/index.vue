<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="height: 810px;" ><el-tag>读书商城-让你爱上读书</el-tag>
          <div class="bookList">
            <div  v-for="item in bookList" class="cartin">
              
             <p align="center"> <el-image style="width: 100px; height: 100px" :src="`${baseUrl}${item.bookPic}`" :fit="fit" /></p>
             <p align="center"> {{ item.bookName }}  <el-tag effect="dark" type="danger">{{ item.price }} ¥</el-tag>
              <el-button size="small" circle type="primary" :icon="Plus" @click="handleAdd(item)" class="ml20"> </el-button>
            </p>
             

            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
       <el-card style="height: 810px;" class=""> <el-tag>我的購物車</el-tag>
         <div class="cartlist mt20">
            <div  v-for="item in cartList" class="cartin">
              
              <el-image style="width: 100px; height: 100px" :src="`${baseUrl}${item.bookPic}`" :fit="fit" />
             <p align="center"> {{ item.bookName }}  <el-tag effect="dark" type="danger">{{ item.price }}</el-tag>
              <el-button size="small" type="danger" class="ml10" @click="handleRemove(item)" circle :icon="CloseBold"> </el-button>
            
            </p>
             
            </div>
         </div>
         <el-divider></el-divider>
         <h2>总价 {{ totalPrice }}</h2>
         <el-button type="primary" @click="toPay">去结算</el-button>
      </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { nextTick, onMounted } from 'vue'
import { cartView,addCarts } from '@/api/bookshop/index'
import {listBook, } from '@/api/book/booklist';
import { Edit, View, Warning,Plus,CloseBold } from '@element-plus/icons-vue'
const baseUrl = import.meta.env.VITE_APP_BASE_API;
import { ElMessageBox,ElMessage } from 'element-plus';
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
 

}
getList()
const { proxy } = getCurrentInstance();
function handleAdd(book){
  const valid = cartList.value.some(item=>item.bookId == book.bookId)
  console.log('va',valid,cartList.value,book.bookId)
  if(!valid){
  cartList.value.push(book)
  }
  else{
    proxy.$modal.msgError(book.bookName+'  只能选择一次')
     
  }
}

function handleRemove(book){
    console.log('b',book)
    const index = cartList.value.findIndex(item => item.bookId === book.bookId);

    if (index !== -1) {
      // 使用 splice 删除该元素
      cartList.value.splice(index, 1);
    }
}
const totalPrice = computed(()=>{
  let totalNumber = cartList.value.map(item=>{
    return item.price
  })
  console.log('total',totalNumber)
  let total = totalNumber.reduce((acc,curr)=>acc*1+curr*1,0)
  return  Number(total).toFixed(2) 
})
 
import { getUserProfile } from '@/api/system/user'

 async function toPay(){
  const booksList = cartList.value.map(item=>{
    return {bookId:item.bookId,quantity:1}
  })
  const res = await  getUserProfile() 
  const userId = res.data.userId
  ElMessageBox.prompt('请输入你的支付密码', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputType:'password',
    inputErrorMessage: 'Invalid Password',
  })
    .then(({ value }) => {
      addCarts(userId,booksList).then(res=>{
        proxy.$modal.msgSuccess('正在支付中,支付失败,为您跳转到我的订单页面')
        proxy.$router.push({ path: "/bookshop/orderList" });
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '支付已取消',
      })
    })

 }
</script>
<style lang="scss">
.cartlist { display: flex;  justify-content: flex-start; flex-flow: row wrap;
  .cartin{ width: 50%;  margin-bottom: 10px;}
}

.bookList { display: flex;  justify-content: flex-start; width: 100%;  flex-flow: row wrap;
  .cartin{
    padding: 15px 10px; min-width:220px ;
      margin-right: 1%; margin-bottom: 20px; border-radius: 10px 15px;
    width: 24%; box-shadow: 4px 6px 8px rgba(0, 0, 0, 0.19); /* 外阴影 */}
}
</style>