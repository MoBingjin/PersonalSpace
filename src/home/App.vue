<template>
  <div>
    <div :class="headerClass">
      <mo-head-menu></mo-head-menu>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

import MoHeadMenu from "./mo-head-menu.vue";
const { getCurrentInstance, ref, watch } = window["Vue"];
const { createRouter, createWebHashHistory } = window["VueRouter"];


// 导航栏class
const headerClass = ref("mo-hidden");


// 路由规则
const routes = [
  {
    path: "/:home(home)?",
    name: "首页",
    component: () => import("./components/mo-home.vue")
  },
  {
    path: "/archives",
    name: "归档",
    component: () => import("./components/mo-archives.vue")
  },
  {
    path: "/about",
    name: "关于",
    component: () => import("./components/mo-about.vue")
  },
  {
    path: "/article/:articleId",
    name: "文章",
    component: () => import("./components/mo-article-view.vue")
  },
  {
    path: "/:other",
    component: () => import("../common/components/404.vue")
  }
];


/**
 * 滚动条监听事件
 * 
 * @param {Event} event 事件对象
 */
const handleScroll = event => {
  if (event.target.documentElement.scrollTop > 0) {
    headerClass.value = "mo-header mo-header-show";
  } else {
    headerClass.value = "mo-header mo-header-hidden";
  }
}


// 初始化操作
(() => {

  // 设置路由
  const router = createRouter({ history: createWebHashHistory(), routes });
  getCurrentInstance().appContext.app.use(router);

  // 路由监听
  watch(router.currentRoute, (route) => {

    // 404
    if (route.matched[0].path === "/:other") {
      headerClass.value = "mo-hidden";
      window["document"].getElementsByTagName("title")[0].innerHTML = window["MoConfig"].params.title["404"];
      window["document"].body.style.background = "none";
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    window["document"].getElementsByTagName("title")[0].innerHTML = `${route.matched[0].name} | ${window["MoConfig"].params.title["home"]}`;

    // 首页
    if (["/", "/home"].includes(route.path)) {
      headerClass.value = "mo-header mo-header-init";
      window["document"].body.style.background = `url("${window["MoConfig"].params.rootPath}src/home/picture/background.png") no-repeat fixed`;
      window["document"].body.style.backgroundSize = "100vw 100vh";
      window.addEventListener("scroll", handleScroll);
      return;
    }

    // 其他
    headerClass.value = "mo-header mo-header-show";
    window["document"].body.style.background = "none";
    window.removeEventListener("scroll", handleScroll);
  });

})();

</script>

<style scoped>
.mo-header {
  position: fixed;
  width: 100vw;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
}

.mo-header:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 1px 40px -8px rgb(0 0 0 / 50%);
  animation: headerShow 0.5s 1;
}

.mo-header-init {
  background-color: rgba(255, 255, 255, 0);
}

.mo-header-show {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 40px -8px rgb(0 0 0 / 50%);
  animation: headerShow 0.5s 1;
}

@keyframes headerShow {
  from {
    background-color: rgba(255, 255, 255, 0);
  }

  to {
    background-color: rgba(255, 255, 255, 0.95);
  }
}

.mo-header-hidden {
  background-color: rgba(255, 255, 255, 0);
  animation: headerHidden 0.8s 1;
}

@keyframes headerHidden {
  from {
    background-color: rgba(255, 255, 255, 1);
  }

  to {
    background-color: rgba(255, 255, 255, 0);
  }
}

.mo-hidden {
  display: none;
}
</style>
