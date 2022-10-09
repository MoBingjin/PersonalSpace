<template>
  <el-container>
    <el-header>
      <el-form :model="form" ref="formComponent" :inline="true">
        <el-form-item>
          <el-select
            v-model="form.year"
            placeholder="年"
            size="small"
            @change="yearChange"
            style="width: 80px"
          >
            <el-option
              v-for="item in yearList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.month"
            placeholder="月"
            size="small"
            style="width: 80px"
          >
            <el-option
              v-for="item in monthList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.type"
            placeholder="文章类型"
            size="small"
            style="width: 120px"
          >
            <el-option
              v-for="item in typeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.key"
            placeholder="请输入关键词"
            maxlength="100"
            :show-word-limit="true"
            size="small"
            style="width: 25vw"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="search">
            <e-icon icon-name="el-icon-search"></e-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-scrollbar>
        <div
          v-if="articleInfoList.length > 0"
          v-for="(item, index) in articleInfoList"
          :key="item"
          style="padding: 0 10px 0 10px"
        >
          <mo-article-column
            :model="item"
            @view="view"
            @edit="edit"
            @remove="remove"
          />
        </div>
        <div v-if="isFinish && articleInfoList.length === 0">
          <el-empty description="没有找到符合条件的数据！">
            <el-button
              type="primary"
              @click="openTab('发布文章', 'MoPublishArticle', {})"
              >发布文章</el-button
            >
          </el-empty>
        </div>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-pagination
        layout="prev, pager, next"
        :page-size="currentPageSize"
        :current-page="currentPage"
        :total="total"
        :hide-on-single-page="true"
        @current-change="listArticleInfoList"
      />
    </el-footer>
  </el-container>
</template>

<script setup>
import MoArticleColumn from './components/MoArticleColumn.vue';
import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate, parse2Time } from '@/utils/date-utils.mod.js';
import storage from '@/utils/storage.mod.js';

const api = storage.getObject('api');

// 回调对象
const emits = defineEmits(['menu-item']);

// 表单对象
const form = reactive({
  year: '',
  month: '',
  type: '',
  key: ''
});
// 年列表
const yearList = reactive(
  (() => {
    const yearList = [
      {
        value: 'all',
        label: '不限'
      }
    ];
    const nowYear = formatDate(new Date().getTime(), 'yyyy');
    const lastYear = String(Number(nowYear) - 1);
    const previousYear = String(Number(nowYear) - 2);
    yearList.push({
      value: previousYear,
      label: previousYear
    });
    yearList.push({
      value: lastYear,
      label: lastYear
    });
    yearList.push({
      value: nowYear,
      label: nowYear
    });
    return yearList;
  })()
);
// 文章类型列表
const typeList = reactive(['不限', '原创', '转载', '其他']);
// 文章信息列表
const articleInfoList = reactive([]);
// 分页每页数目
const currentPageSize = ref(storage.getObject('pageSize')['admin']);
// 当前页
const currentPage = ref(1);
// 分页总数
const total = ref(0);
// 搜索条件
const searchParams = ref({});
// 是否初始完成
const isFinish = ref(false);

// 月列表
const monthList = computed(() => {
  const monthList = [
    {
      value: 'all',
      label: '不限'
    }
  ];
  if (form.year !== '' && form.year !== 'all') {
    for (let i = 1; i <= 12; ++i) {
      const month = i < 10 ? '0' + i : String(i);
      monthList.push({
        value: month,
        label: month
      });
    }
  }
  return monthList;
});

/**
 * 获取文章信息列表
 *
 * @param {number} page 当前页
 */
const listArticleInfoList = async (page = 1) => {
  currentPage.value = page;
  searchParams.value['page'] = page;
  return new Promise((rev, rej) => {
    // 获取文章信息列表数据
    fetch(api.listArticleURL, {
      method: 'post',
      body: JSON.stringify(searchParams.value)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 0) {
          articleInfoList.splice(0, articleInfoList.length);
          data.data.list.map((item) => articleInfoList.push(item));
          total.value = data.data.total;
        }
        console.log(data.message);
        rev(data.message);
      })
      .catch((error) => {
        console.log(error);
        rej(error);
      });
  });
};

/**
 * 浏览文章
 *
 * @param {string} articleId 文章ID
 */
const view = (articleId) => {
  // 获取文章数据
  fetch(api.dataArticleURL, {
    method: 'post',
    body: JSON.stringify({ articleId })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 0) {
        openTab(
          data.data.title,
          'content-management/article-management/MoArticleView',
          { articleData: data.data }
        );
      }
      console.log(data.message);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * 编辑文章
 *
 * @param {string} articleId 文章ID
 */
const edit = (articleId) => {
  // 获取文章数据
  fetch(api.dataArticleURL, {
    method: 'post',
    body: JSON.stringify({ articleId })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 0) {
        openTab('编辑文章', 'article-publish/MoPublishArticle', {
          articleData: data.data
        });
      }
      console.log(data.message);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * 删除文章
 *
 * @param {string} articleId 文章ID
 */
const remove = ({ articleId, title }) => {
  ElMessageBox.confirm(
    `确定要删除标题为'${
      title.length < 10 ? title : title.substring(0, 8) + '...'
    }'的文章吗？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
      fetch(api.deleteArticleURL, {
        method: 'post',
        body: JSON.stringify({ articleId })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 0) {
            listArticleInfoList();
            ElMessage({ message: '删除成功！', type: 'success' });
          } else {
            ElMessage({ message: '删除失败！', type: 'error' });
          }
        })
        .catch((error) => {
          ElMessage({ message: '删除异常！', type: 'error' });
          console.log(error);
        });
    })
    .catch(() => {});
};

/**
 * 年选择事件
 *
 * @param {any} value
 */
const yearChange = (value) => value === 'all' && (form.month = 'all');

/**
 * 搜索事件
 */
const search = async () => {
  // 搜索参数
  searchParams.value = { limit: currentPageSize.value };

  // 关键词
  const keyValue = form.key.trim();
  if (keyValue !== '') {
    searchParams.value['title'] = keyValue;
    searchParams.value['description'] = keyValue;
  }

  // 文章类型
  const typeValue = form.type;
  if (typeValue !== '' && typeValue !== '不限') {
    searchParams.value['type'] = typeValue;
  }

  // 时间
  const yearValue = form.year;
  if (yearValue !== '' && yearValue !== 'all') {
    const monthValue = form.month;
    if (monthValue !== '' && monthValue !== 'all') {
      let endTimeYear;
      let endTimeMonth;
      let endMonthNumber = Number(monthValue) + 1;
      if (endMonthNumber > 12) {
        endTimeYear = Number(yearValue) + 1;
        endTimeMonth = '01';
      } else {
        endTimeYear = yearValue;
        endTimeMonth =
          endMonthNumber < 10 ? '0' + endMonthNumber : endMonthNumber;
      }
      searchParams.value['startTime'] = parse2Time(
        `${yearValue}-${monthValue}-01 00:00:00`
      );
      searchParams.value['endTime'] = parse2Time(
        `${endTimeYear}-${endTimeMonth}-01 00:00:00`
      );
    } else {
      searchParams.value['startTime'] = parse2Time(
        `${yearValue}-01-01 00:00:00`
      );
      searchParams.value['endTime'] = parse2Time(
        `${Number(yearValue) + 1}-01-01 00:00:00`
      );
    }
  }

  // 获取文章信息列表
  await listArticleInfoList(1);
};

/**
 * 打开标签
 *
 * @param {string} title 菜单标题
 * @param {string} componentName 组件名称
 * @param {any} params 组件参数
 */
const openTab = (title, componentName, params) =>
  emits('menu-item', { title, componentName, params });

// 初始化操作
(async () => {
  // 获取文章信息列表
  await search();
  isFinish.value = true;
})();
</script>

<style scoped>
.el-header {
  height: 20px;
  margin: 0 13px 30px 13px;
  padding: 0;
}

.el-main,
.el-footer {
  padding: 0;
}

.el-form-item {
  margin-right: 10px;
}

.el-scrollbar {
  height: 68vh;
}

.el-pagination {
  margin-top: 20px;
}
</style>
