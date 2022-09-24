<template>
  <el-container>
    <el-header>
      <el-form :model="form" ref="formComponent" :inline="true">
        <el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="removeBatch">删除</el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <el-input class="mo-el-input" v-model="form.key" placeholder="请输入关键词" clearable maxlength="100" size="small"
              style="width: 300px;">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="search">
              <e-icon icon-name="el-icon-search"></e-icon>
            </el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table ref="tableComponent" :data="tagInfoList" style="width: 100%;" height="68vh">
        <el-table-column type="selection" width="55" />
        <el-table-column label="#" type="index" width="50" />
        <el-table-column label="名称" property="name" width="120" />
        <el-table-column label="描述" property="description" show-overflow-tooltip />
        <el-table-column label="包含文章数量" property="articleAmount" :align="'center'" width="130" />
        <el-table-column label="状态" property="status" :align="'center'" width="120">
          <template #default="scope">
            <el-switch v-model="scope.row.status" class="ml-2" @change="statusChange(scope.row)"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'" width="140">
          <template #default="scope">
            <el-button type="primary" size="small" @click="update(scope.row.id)">更新</el-button>
            <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination layout="prev, pager, next" :page-size="currentPageSize" :current-page="currentPage" :total="total"
        :hide-on-single-page="true" @current-change="listTagInfoList" />
      <mo-tag-add-or-update ref="moTagAddOrUpdate" @refresh="listTagInfoList" />
    </el-footer>
  </el-container>
</template>

<script setup>

import MoTagAddOrUpdate from './MoTagAddOrUpdate.vue';
import { getCurrentInstance, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import appConfig from 'app-config';


// axios实体对象
const axiosInstance = getCurrentInstance().appContext.config.globalProperties.$axiosInstance;

// 回调对象
const emits = defineEmits(['menu-item']);


// 表格组件对象
const tableComponent = ref();
// 标签添加或更新组件对象
const moTagAddOrUpdate = ref();
// 表单对象
const form = reactive({
  key: ''
});
// 表格数据
const tagInfoList = reactive([]);
// 分页每页数目
const currentPageSize = ref(appConfig.pageSize['admin']);
// 当前页
const currentPage = ref(1);
// 分页总数据条数
const total = ref(0);


/**
 * 搜索事件
 */
const search = async () => {
  await listTagInfoList();
};

/**
 * 添加事件
 */
const add = async () => {
  moTagAddOrUpdate.value.init();
};

/**
 * 更新事件
 */
const update = async (id) => {
  moTagAddOrUpdate.value.init(id);
};

/**
 * 删除事件
 */
const remove = async (row) => {
  ElMessageBox.confirm(`确定要删除标签[${row.name}]吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      axiosInstance.delete(appConfig.api.removeTagURL + row.id)
        .then(({ data: res }) => {
          console.log(res.message);
          if (res.code === 0) {
            ElMessage({ message: `标签[${row.name}]删除成功!`, type: 'success' });
            // 刷新列表
            if (tagInfoList.length > 1) {
              listTagInfoList(currentPage.value);
            } else if (currentPage.value > 1 && Math.ceil(total.value / currentPageSize.value) > 1) {
              listTagInfoList(currentPage - 1);
            } else {
              listTagInfoList();
            }
          } else {
            ElMessage({ message: `标签[${row.name}]删除失败!`, type: 'error' });
            console.log(res.data.errorMessage);
          }
        })
        .catch(error => {
          console.log(error);
          ElMessage({ message: '标签删除异常!', type: 'error' });
        });
    })
    .catch(() => 'cancel');
};

/**
 * 批量删除事件
 */
const removeBatch = async () => {
  const selectRows = getSelectRows();
  if (selectRows.length === 0) {
    ElMessageBox.alert('请选择需要删除的标签!', '系统提示', { confirmButtonText: '确定' });
  } else {
    ElMessageBox.confirm('确定要删除所选标签吗?', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        const ids = selectRows.map(row => row.id);
        axiosInstance.delete(appConfig.api.removeBatchTagURL, { data: ids })
          .then(({ data: res }) => {
            console.log(res.message);
            if (res.code === 0) {
              ElMessage({ message: '标签批量删除成功!', type: 'success' });
              // 刷新列表
              if (tagInfoList.length > ids.length) {
                listTagInfoList(currentPage.value);
              } else if (currentPage.value > 1 && Math.ceil(total.value / currentPageSize.value) > 1) {
                listTagInfoList(currentPage - 1);
              } else {
                listTagInfoList();
              }
            } else {
              ElMessage({ message: '标签批量删除失败!', type: 'error' });
              console.log(res.data.errorMessage);
            }
          })
          .catch(error => {
            console.log(error);
            ElMessage({ message: '标签批量删除异常!', type: 'error' });
          });
      })
      .catch(() => 'cancel');
  }
};

/**
 * 标签状态修改
 */
const statusChange = (row) => {
  axiosInstance.post(appConfig.api.statusTagURL + row.id)
    .then(({ data: res }) => {
      console.log(res.message);
      if (res.code !== 0 || res.data.status !== row.status) {
        row.status = !row.status;
        ElMessage({ message: '标签状态更新失败!', type: 'error' });
        console.log(res.data.errorMessage);
      } else {
        ElMessage({ message: row.status ? '已启用' : '已禁用', type: row.status ? 'success' : 'error' });
      }
    })
    .catch(error => {
      row.status = !row.status;
      console.log(error);
      ElMessage({ message: '标签状态更新异常!', type: 'error' });
    });
};

/**
 * 获取标签列表
 */
const listTagInfoList = async (page = 1) => {
  currentPage.value = page;
  return new Promise((rev, rej) => {
    // 获取文章信息列表数据
    axiosInstance.post(appConfig.api.listTagURL + `?limit=${currentPageSize.value}&page=${currentPage.value}`, form)
      .then(({ data: res }) => {
        if (res.code === 0) {
          tagInfoList.splice(0, tagInfoList.length);
          res.data.list.map(item => tagInfoList.push(item));
          total.value = res.data.total;
        }
        console.log(res.message);
        rev(res.message);
      })
      .catch(error => {
        console.log(error);
        rej(error);
      });
  });
};

/**
 * 获取当前选择行
 */
const getSelectRows = () => {
  const store = tableComponent.value.store;
  const selectRows = [];
  for (let i = 0; i < tagInfoList.length; ++i) {
    if (store.isSelected(tagInfoList[i])) {
      selectRows.push(tagInfoList[i]);
    }
  }
  return selectRows;
};


// 初始化操作
(async () => {
  // 获取标签列表
  listTagInfoList();
})();

</script>

<style>
.mo-el-input .el-input__clear {
  margin-top: 8px;
}
</style>
<style scoped>
.el-header {
  padding: 0;
  margin: 0 13px 30px 13px;
  height: 20px;
}

.el-main,
.el-footer {
  padding: 0;
}

.el-form {
  display: flex;
  justify-content: space-between;
}

.el-form-item {
  margin-right: 10px;
}
</style>