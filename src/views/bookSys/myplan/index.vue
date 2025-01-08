<template>
    <div class="app-container">
      <el-form
      class="top-form"
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="计划名称" prop="bookName">
        <el-input
          v-model="queryParams.bookName"
          placeholder="请输入计划名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
 
      <!-- <el-form-item label="类型" prop="menuType">
        <el-select
          v-model="queryParams.menuType"
          placeholder="图书类型"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in sys_book_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
        <!-- <el-button @click="getList">刷新</el-button>  -->
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:notice:add']"
          >新增</el-button
        >
    
        <el-table
        height="100%"
        v-loading="loading"
        :data="bookList"
      
      >
      <!-- @selection-change="handleSelectionChange" -->
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="序号"
          align="center"
          prop="progressId"
          width="100"
        />
        <el-table-column
          label="计划名"
          align="center"
          prop="planId"
        >
        <template #default="scope">
            <span>{{  scope.row.plan.planName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="读书人员"
          align="center"
          prop="menuType"
          width="100"
        >
          <template #default="scope">
            <span>{{  scope.row.user.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="精选书单"
          align="center"
          prop="menuType"
          width="150"
        >
          <template #default="scope">
            <el-tag v-for="item in filterBooks(scope.row.plan.ids)" class="ml5">{{  item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="完成进度" align="center" prop="status" width="150">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
 
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="156"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="任务截止日期"
          align="center"
          prop="createTime"
          width="156"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.plan.endTime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:notice:edit']"
              >修改</el-button
            >
            <!-- <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:notice:remove']"
              >修改</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
       
    />

    <el-dialog
      :title="title"
      v-model="open"
      draggable
      :close-on-click-modal="false"
      width="780px"
      append-to-body
    >

      <el-form ref="noticeRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划名称" prop="plan.planName">
              {{ form.plan.planName }}
 
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="我的图书" prop="ids">
              <el-select v-model="form.ids" multiple placeholder="请选择" disabled>
                <el-option
                  v-for="dict in bookLists"
                  :key="dict.bookId"
                  :label="dict.bookName"
                  :value="dict.bookId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面预览" prop="price">
              <!-- {{ findPic( form.ids) }}  -->
              <el-image v-for="item in findPic(form.ids)" style="width: 100px; height: 100px" :src="`${baseUrl}${item}`" :fit="fit" class="ml5" />
            
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="我的阅读进度" prop="progress">
              <el-progress
                :percentage="form.progress"
                :stroke-width="16"
                style=" width:220px"
                placeholder="请输入进度"
              />
              <el-button-group>
        <el-button :icon="Minus" @click="decrease" />
        <el-button :icon="Plus" @click="increase" />
      </el-button-group>
            </el-form-item>
          </el-col>
 
 
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    </div>
</template>

<script setup name="Book">
 const { proxy } = getCurrentInstance()
const { sys_book_type, } = proxy.useDict('sys_book_type',);
import {
  listProgress ,selflist,updateProgress
 
} from '@/api/book/planProgress'
import { Minus, Plus } from '@element-plus/icons-vue'
import { onMounted } from 'vue';
const baseUrl = import.meta.env.VITE_APP_BASE_API;

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bookName: undefined,
    createBy: undefined,
  },
  rules: {
    bookName: [
      { required: true, message: '标题不能为空', trigger: 'blur' }
    ],
    menuType: [
      { required: true, message: '图书类型不能为空', trigger: 'change' }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)
const bookList = ref([])
const total =ref(null)
const loading = ref(false)
const open = ref(false)
const title = ref(null)
const ids = ref([])
const showSearch =ref(true)
const bookLists = ref([])
onMounted(async ()=>{
  let res = await  listProgress()
  bookLists.value =  res.bookLists
})
function getList () {
//   loading.value = true
 
selflist(queryParams.value).then(response => {
    bookList.value = response.rows
    total.value = response.total
    loading.value = false
 
  })
}

getList()

/** 表单重置 */
function reset () {
  form.value = {
    bookId: undefined,
    bookName: undefined,
    menuType: undefined,
 
  }
  proxy.resetForm('noticeRef')
}
/** 搜索按钮操作 */
function handleQuery () {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery () {
  proxy.resetForm('queryRef')
  handleQuery()
}
function cancel () {
  open.value = false
  // reset()
}
/** 新增按钮操作 */

function handleAdd () {
   reset()
  open.value = true
  title.value = '添加图书'
}
  function filterBooks(bookids){
 
   
  let result= bookLists.value.filter(book=> bookids.includes(book.bookId) )
  let bookNames = result.map(item=>{
    return item.bookName
  })
  // console.log(bookNames,'bookNames')
   return bookNames
  
}
function findPic(bookids){
 
   
 let result= bookLists.value.filter(book=> bookids.includes(book.bookId) )
 let bookNamesPic = result.map(item=>{
   return item.bookPic
 })
 
  return bookNamesPic
 
}

/**修改按钮操作 */
function handleUpdate (row) {
   reset()
   open.value = true
   form.value = row
   form.value.ids = row.plan.ids.split(',').map(Number)
  // const noticeId = row.bookId || ids.value
  // getBook(noticeId).then(response => {
  //   form.value = response.data
  //   open.value = true
  //   title.value = '修改图书'
  // })
}
/** 提交按钮 */
function submitForm () {
  proxy.$refs['noticeRef'].validate(valid => {
    if (valid) {
      if (form.value.progressId != undefined) {
        form.value.ids = form.value.ids.toString()
        // form.value.planId_userId = form.value.planId
        updateProgress(form.value).then(response => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addBook(form.value).then(response => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

const increase = () => {
  form.value.progress += 10
  if (form.value.progress > 100) {
    form.value.progress = 100
  }
}
const decrease = () => {
  form.value.progress -= 10
  if (form.value.progress < 0) {
    form.value.progress = 0
  }
}

/** 删除按钮操作 */
function handleDelete (row) {
  const noticeIds = row.bookId || ids.value
  proxy.$modal
    .confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？')
    .then(function () {
      return delBook(noticeIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}


</script>