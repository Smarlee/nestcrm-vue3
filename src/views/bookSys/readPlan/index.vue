<template>
    <div class="app-container">
      <el-form
      class="top-form"
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="计划名" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入图书名"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
 
      <el-form-item label="类型" prop="menuType">
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
      </el-form-item>
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
          prop="planId"
          width="100"
        />
        
        <el-table-column
          label="计划名称"
          align="center"
          prop="planName"
          :show-overflow-tooltip="true"
        />
 
        <el-table-column
          label="参与的读者"
          align="center"
          prop="users"
        >
          <template #default="scope" >
           <span v-if="scope.row.sys_user.length" v-for="item in scope.row.sys_user"> {{item.nickName}},</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划周期"
          align="center"
          prop="menuType"
          width="200"
        >
          <template #default="scope">
            {{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }} 至 {{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}
            
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            <dict-tag :options="sys_notice_status" :value="scope.row.status" />
          </template>
        </el-table-column>
 
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="100"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
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
            <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:notice:remove']"
              >删除</el-button
            >
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
      <el-form ref="noticeRef" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="阅读计划名" prop="planName">
              <el-input
                v-model="form.planName"
                placeholder="请输入图书标题"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="图书类型" prop="menuType">
              <el-select v-model="form.menuType" placeholder="请选择">
                <el-option
                  v-for="dict in sys_book_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="选择图书" prop="books">
              <el-select
                v-model="form.books"
                type="number"
                placeholder="请选择图书"
              >
              <el-option value="钢铁是怎么练成的">钢铁是怎么练成的</el-option>
              <el-option value="弗洛娃">弗洛娃</el-option>
              <el-option value="十万个为什么">十万个为什么</el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                 value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
                placeholder="请输入图书价格"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                 type="datetime"
                 value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请输入图书价格"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="多选读者" prop="userIds" v-if="true">
              <el-select
                v-model="form.userIds"
                placeholder="请输入"
                multiple
              >
                <el-option v-for="item in userIds" :label="item.nickName" :value="item.userId"></el-option>
              </el-select>
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

<script setup name="Bookplan">
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';


 const { proxy } = getCurrentInstance()
const { sys_book_type, } = proxy.useDict(
  'sys_book_type',
)
import {
  listBook,getBookplan,updateBook,addBook,delBook
 
} from '@/api/book/plan'
import { onMounted } from 'vue';
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planName: undefined,
    createBy: undefined,

  },
  rules: {
    planName: [
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
const userIds = ref([])
import {
  listUser,
} from '@/api/system/user'
onMounted( async()=>{
   let res =await listUser() 
   userIds.value = res.rows
})

dayjs.extend(timezone);
dayjs.extend(utc);

function formatForApi(date) {
      return dayjs(date).utc(8).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }

function getList () {
//   loading.value = true
 
  listBook(queryParams.value).then(response => {
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
    userId:1,
     startTime:'2025-01-21T14:31:04.000Z',
    endTime:'2025-02-21T14:31:04.000Z'
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
  reset()
}
/** 新增按钮操作 */
function handleAdd () {
   reset()
  open.value = true
  title.value = '添加图书plan'
}
/**修改按钮操作 */
function handleUpdate (row) {
   reset()
  const noticeId = row.planId || ids.value
  getBookplan(noticeId).then(res => {
    form.value = res.data
    form.value.userIds = res.userIds
    open.value = true
    title.value = '修改图书'
  })
}
/** 提交按钮 */
function submitForm () {
  proxy.$refs['noticeRef'].validate(valid => {
    if (valid) {
      form.value.startTime =formatForApi(form.value.startTime)
      form.value.endTime =formatForApi(form.value.endTime)

      if (form.value.planId != undefined) {
       
        updateBook(form.value).then(response => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId=2
        addBook(form.value).then(response => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
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