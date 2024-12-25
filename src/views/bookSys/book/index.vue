<template>
    <div class="app-container">
      <el-form
      class="top-form"
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="图书名" prop="bookName">
        <el-input
          v-model="queryParams.bookName"
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
          prop="bookId"
          width="100"
        />
        
        <el-table-column
          label="图书标题"
          align="center"
          prop="bookName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="图书封面"
          align="center"
          prop=""
        >
        <template #default="{ row }">
                            <el-image style="width: 100px; height: 100px" :src="`${baseUrl}${row.bookPic}`" :fit="fit" />
           </template>
        </el-table-column>
        <el-table-column
          label="图书售价"
          align="center"
          prop="price"
        />
        <el-table-column
          label="图书类型"
          align="center"
          prop="menuType"
          width="100"
        >
          <template #default="scope">
            <dict-tag
              :options="sys_book_type"
              :value="scope.row.menuType"
            />
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
          width="140"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
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
      <el-form ref="noticeRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="图书标题" prop="bookName">
              <el-input
                v-model="form.bookName"
                placeholder="请输入图书标题"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书封面" prop="price">
              <el-upload ref="upload" class="upload-demo" :headers="headers"   :on-success="handleUploadSuccess" v-if="open"
                        :action="uploadFileUrl" :limit="1" :on-exceed="handleExceed" :auto-upload="true">
                        <template #trigger>
                            <el-button type="primary">选择要上传的图片</el-button>
                        </template>

                        <template #tip>
                            <div class="el-upload__tip text-red">
                                limit 1 file, new file will cover the old file
                            </div>
                        </template>
                    </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面预览" prop="price">
              <el-image style="width: 100px; height: 100px" :src="`${baseUrl}${form.bookPic}`" :fit="fit" />
            
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="图书价格" prop="price">
              <el-input
                v-model="form.price"
                type="number"
                placeholder="请输入图书价格"
              />
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
const { sys_book_type, } = proxy.useDict('sys_book_type',)
import { genFileId } from 'element-plus'
import {listBook,getBook,updateBook,addBook,delBook} from '@/api/book/booklist';
import { getToken } from "@/utils/auth";
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const headers = ref({ Authorization: "Bearer " + getToken() });
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload"); // 上传文件服务器地址
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
  title.value = '添加图书'
}

const handleExceed = (files) => {
    proxy.$refs.upload.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    proxy.$refs.upload.handleStart(file)
}
async function handleUploadSuccess(res, file) {

    if (res.code === 200) {
        // 上传成功以后 回调
       form.value.bookPic=   res.fileName    // '/upload/2024-12-25/1735096289113-947051579-rongyu100.png'

    }
}


/**修改按钮操作 */
function handleUpdate (row) {
   reset()
  const noticeId = row.bookId || ids.value
  getBook(noticeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改图书'
  })
}
/** 提交按钮 */
function submitForm () {
  proxy.$refs['noticeRef'].validate(valid => {
    if (valid) {
      if (form.value.bookId != undefined) {
        updateBook(form.value).then(response => {
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