<template>
  <div class="mo-tag-management">
    <mo-management
      :model="model"
      @add="add"
      @remove-batch="removeBatch"
      @search="search"
      @change-page="listTagInfoList"
    >
      <template #list>
        <el-table
          ref="tableComponent"
          :data="tagInfoList"
          style="width: 100%"
          height="68vh"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="#" type="index" width="50" />
          <el-table-column label="名称" property="name" width="120" />
          <el-table-column
            label="描述"
            property="description"
            show-overflow-tooltip
          />
          <el-table-column
            label="包含文章数量"
            property="articleAmount"
            :align="'center'"
            width="130"
          />
          <el-table-column
            label="状态"
            property="status"
            :align="'center'"
            width="120"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                class="ml-2"
                @change="statusChange(scope.row)"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" :align="'center'" width="140">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="update(scope.row.id)"
                >更新</el-button
              >
              <el-button type="danger" size="small" @click="remove(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #dialog>
        <mo-tag-add-or-update
          ref="moTagAddOrUpdate"
          @refresh="listTagInfoList"
        />
      </template>
    </mo-management>
  </div>
</template>

<script setup>
import MoManagement from '@/components/management/MoManagement.vue';
import MoTagAddOrUpdate from './components/MoTagAddOrUpdate.vue';
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import tagService from '@/api/tag-service.mod.js';
import appConfig from '@/app.config.mod.js';

// 回调对象
const emits = defineEmits(['menu-item']);

const model = reactive({
  // toolbar: {
  //   key: 'ccc'
  // },
    currentPageSize: appConfig.pageSize['admin'],
    currentPage: 1,
    total: 0
});

// 表格组件对象
const tableComponent = ref();
// 标签添加或更新组件对象
const moTagAddOrUpdate = ref();
// 表格数据
const tagInfoList = reactive([]);

/**
 * 搜索事件
 */
const search = () => {
  listTagInfoList();
};

/**
 * 添加事件
 */
const add = () => {
  moTagAddOrUpdate.value.init();
};

/**
 * 更新事件
 */
const update = (id) => {
  moTagAddOrUpdate.value.init(id);
};

/**
 * 删除事件
 */
const remove = (row) => {
  ElMessageBox.confirm(`确定要删除标签[${row.name}]吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      tagService
        .removeTag(row.id)
        .then((res) => {
          ElMessage({ message: `标签[${row.name}]删除成功!`, type: 'success' });
          // 刷新列表
          if (tagInfoList.length > 1) {
            listTagInfoList(model.currentPage);
          } else if (
            model.currentPage > 1 &&
            Math.ceil(model.total / model.currentPageSize) > 1
          ) {
            listTagInfoList(model.currentPage - 1);
          } else {
            listTagInfoList();
          }
        })
        .catch((error) => {});
    })
    .catch(() => 'cancel');
};

/**
 * 批量删除事件
 */
const removeBatch = () => {
  const selectRows = getSelectRows();
  if (selectRows.length === 0) {
    ElMessageBox.alert('请选择需要删除的标签!', '系统提示', {
      confirmButtonText: '确定'
    });
  } else {
    ElMessageBox.confirm('确定要删除所选标签吗?', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        const ids = selectRows.map((row) => row.id);
        tagService
          .removeBatchTag(ids)
          .then((res) => {
            ElMessage({ message: '标签批量删除成功!', type: 'success' });
            // 刷新列表
            if (tagInfoList.length > ids.length) {
              listTagInfoList(model.currentPage);
            } else if (
              model.currentPage > 1 &&
              Math.ceil(model.total / model.currentPageSize) > 1
            ) {
              listTagInfoList(model.currentPage - 1);
            } else {
              listTagInfoList();
            }
          })
          .catch((error) => {});
      })
      .catch(() => 'cancel');
  }
};

/**
 * 标签状态修改
 */
const statusChange = (row) => {
  tagService
    .statusTag(row.id)
    .then((res) => {
      if (res.data.status !== row.status) {
        row.status = !row.status;
        ElMessage({ message: '标签状态更新失败!', type: 'error' });
      } else {
        ElMessage({
          message: row.status ? '已启用' : '已禁用',
          type: row.status ? 'success' : 'error'
        });
      }
    })
    .catch((error) => {
      row.status = !row.status;
    });
};

/**
 * 获取标签列表
 */
const listTagInfoList = (page = 1) => {
  model.currentPage = page;
  // 获取文章信息列表数据
  tagService
    .listTag(model.toolbar, model.currentPage, model.currentPageSize)
    .then((res) => {
      tagInfoList.splice(0, tagInfoList.length);
      res.data.list.map((item) => tagInfoList.push(item));
      model.total = res.data.total;
    })
    .catch((error) => {});
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

<style scoped></style>
