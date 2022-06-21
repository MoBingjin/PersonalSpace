<template>
  <el-container>
    <el-header>
      <el-form :model="form" ref="formComponent" :inline="true">
        <el-form-item>
          <el-select v-model="form.year" placeholder="年" size="small" @change="yearChange" style="width: 80px;">
            <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.month" placeholder="月" size="small" style="width: 80px;">
            <el-option v-for="item in monthList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.type" placeholder="文章类型" size="small" style="width: 120px;">
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.key" placeholder="请输入关键词" maxlength="100" :show-word-limit="true" size="small"
            style="width: 25vw;">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round size="small" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-scrollbar>
        <div v-if="articleInfoList.length > 0" v-for="(item, index) in articleInfoList" :key="item"
          style="padding: 0 10px 0 10px;">
          <el-row class="mo-scrollbar-item">
            <el-col :span="20">
              <div class="mo-article-title" @click="view(item.articleId)" :title="item.title">
                <div>{{ item.title }}</div>
              </div>
              <div>
                <el-tag type="danger" size="small">{{ item.type }}</el-tag>
              </div>
              <div class="mo-article-description" :title="item.description">
                <div>{{ item.description }}</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="mo-article-update-time">{{ formatDate(item.updateTime) }}</div>
              <div class="mo-article-action">
                <span style="margin-right: 10px;" @click="view(item.articleId)">浏览</span>
                <span style="margin-right: 10px;" @click="edit(item.articleId)">编辑</span>
                <span @click="remove(item.articleId, item.title, index)">删除</span>
              </div>
            </el-col>
          </el-row>
          <el-divider border-style="dashed" />
        </div>
        <div v-if="isFinish && articleInfoList.length === 0">
          <el-empty description="没有找到符合条件的数据！">
            <el-button type="primary" @click="openTab('发布文章', 'mo-publish-article', {})">发布文章</el-button>
          </el-empty>
        </div>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-pagination layout="prev, pager, next" :page-size="currentPageSize" :current-page="currentPage" :total="total"
        :hide-on-single-page="true" @current-change="listArticleInfoList" />
    </el-footer>
  </el-container>
</template>

<script setup>

import { formatDate, parse2Time } from "../../../common/js/utils.js";
const { computed, reactive, ref } = window["Vue"];
const { ElMessage, ElMessageBox } = window["ElementPlus"];
const { pageSize } = window["MoConfig"].params;
const { dataArticleURL, deleteArticleURL, listArticleURL } = window["MoConfig"].api;


// 回传参数
const emits = defineEmits(["menu-item"]);


// 表单对象
const form = reactive({
  year: "",
  month: "",
  type: "",
  key: ""
});
// 年列表
const yearList = reactive((() => {
  const yearList = [{
    value: "all",
    label: "不限",
  }];
  const nowYear = formatDate(new Date().getTime(), "yyyy");
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
})());
// 文章类型列表
const typeList = reactive(["不限", "原创", "转载", "其他"]);
// 文章信息列表
const articleInfoList = reactive([]);
// 分页每页数目
const currentPageSize = ref(pageSize);
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
  const monthList = [{
    value: "all",
    label: "不限"
  }];
  if (form.year !== "" && form.year !== "all") {
    for (let i = 1; i <= 12; ++i) {
      const month = i < 10 ? "0" + i : String(i);
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
  searchParams.value["page"] = page;
  return new Promise((rev, rej) => {
    // 获取文章信息列表数据
    fetch(listArticleURL, {
      method: "post",
      body: JSON.stringify(searchParams.value)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 0) {
          articleInfoList.splice(0, articleInfoList.length);
          data.data.list.map(item => articleInfoList.push(item));
          total.value = data.data.total;
        }
        console.log(data.message);
        rev(data.message);
      })
      .catch(error => {
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
  fetch(dataArticleURL, {
    method: "post",
    body: JSON.stringify({ articleId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.code === 0) {
        openTab(data.data.title, "content-management/mo-article-view", { articleData: data.data });
      }
      console.log(data.message);
    })
    .catch(error => {
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
  fetch(dataArticleURL, {
    method: "post",
    body: JSON.stringify({ articleId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.code === 0) {
        openTab("编辑文章", "mo-publish-article", { articleData: data.data });
      }
      console.log(data.message);
    })
    .catch(error => {
      console.log(error);
    });
};

/**
 * 删除文章
 * 
 * @param {string} articleId 文章ID 
 */
const remove = (articleId, title, index) => {
  ElMessageBox.confirm(
    `确定要删除标题为"${title.length < 10 ? title : title.substring(0, 8) + "..."}"的文章吗？`,
    "系统提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }
  )
    .then(() => {
      fetch(deleteArticleURL, {
        method: "post",
        body: JSON.stringify({ articleId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 0) {
            articleInfoList.splice(index, 1);
            ElMessage({ message: "删除成功！", type: "success" });
          } else {
            ElMessage({ message: "删除失败！", type: "error" });
          }
        })
        .catch(error => {
          ElMessage({ message: "删除异常！", type: "error" });
          console.log(error);
        });
    })
    .catch(() => { });
};

/**
 * 年选择事件
 * 
 * @param {any} value 
 */
const yearChange = value => value === "all" && (form.month = "all");

/**
 * 搜索事件
 */
const search = async () => {

  // 搜索参数
  searchParams.value = { limit: currentPageSize.value };

  // 关键词
  const keyValue = form.key.trim();
  if (keyValue !== "") {
    searchParams.value["title"] = keyValue;
    searchParams.value["description"] = keyValue;
  }

  // 文章类型
  const typeValue = form.type;
  if (typeValue !== "" && typeValue !== "不限") {
    searchParams.value["type"] = typeValue;
  }

  // 时间
  const yearValue = form.year;
  if (yearValue !== "" && yearValue !== "all") {
    const monthValue = form.month;
    if (monthValue !== "" && monthValue !== "all") {
      let endTimeYear;
      let endTimeMonth;
      let endMonthNumber = Number(monthValue) + 1;
      if (endMonthNumber > 12) {
        endTimeYear = Number(yearValue) + 1;
        endTimeMonth = "01";
      } else {
        endTimeYear = yearValue;
        endTimeMonth = endMonthNumber < 10 ? "0" + endMonthNumber : endMonthNumber;
      }
      searchParams.value["startTime"] = parse2Time(`${yearValue}-${monthValue}-01 00:00:00`);
      searchParams.value["endTime"] = parse2Time(`${endTimeYear}-${endTimeMonth}-01 00:00:00`);
    } else {
      searchParams.value["startTime"] = parse2Time(`${yearValue}-01-01 00:00:00`);
      searchParams.value["endTime"] = parse2Time(`${Number(yearValue) + 1}-01-01 00:00:00`);
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
const openTab = (title, componentName, params) => emits("menu-item", { title, componentName, params });


// 初始化操作
(async () => {
  // 获取文章信息列表
  await search();
  isFinish.value = true;
})();

</script>

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

.el-scrollbar {
  height: 73vh;
}

.el-pagination {
  margin-top: 20px;
}

.mo-scrollbar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  border-radius: 10px;
}

.mo-article-title {
  padding: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
  color: #555666;
}

.mo-article-title:hover {
  cursor: pointer;
  color: red;
}

.mo-article-title>div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mo-article-description {
  padding: 10px 0 10px 0;
  font-size: 14px;
  color: #999aaa;
}

.mo-article-description>div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mo-article-update-time {
  text-align: right;
  font-size: 14px;
  color: #999999;
  margin-bottom: 40px;
}

.mo-article-action {
  text-align: right;
  font-size: 14px;
  color: #222226;
}

.mo-article-action>span {
  user-select: none;
}

.mo-article-action>span:hover {
  cursor: pointer;
  color: #666666;
}

.el-divider {
  margin: 10px 0 10px 0;
}
</style>