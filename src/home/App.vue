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
const { getCurrentInstance, ref } = window["Vue"];
const { createRouter, createWebHashHistory } = window["VueRouter"];


// 导航栏class
const headerClass = ref("mo-header mo-header-init");


// 路由规则
const routes = [
  {
    path: "/:home(home)?",
    component: () => import("./components/mo-home.vue")
  },
  {
    path: "/archives",
    component: () => import("./components/mo-archives.vue")
  },
  {
    path: "/about",
    component: () => import("./components/mo-about.vue")
  },
  {
    path: "/:other",
    component: () => {
      headerClass.value += " mo-hidden";
      window["document"].body.style.background = "none";
      return import("../common/components/404.vue");
    }
  }
];


// 初始化操作
(() => {

  // 设置标题
  window["document"].getElementsByTagName("title")[0].innerHTML = window["MoConfig"].params.title["home"];

  // 设置背景图片
  window["document"].body.style.background = `url("${window["MoConfig"].params.rootPath}src/home/picture/background.png") no-repeat fixed`;
  window["document"].body.style.backgroundSize = "100vw 100vh";

  // 监听滚动条
  window.addEventListener("scroll", event => {
    if (event.target.documentElement.scrollTop > 0) {
      headerClass.value = "mo-header mo-header-show";
    } else {
      headerClass.value = "mo-header mo-header-hidden";
    }
  });

  // 设置路由
  const router = createRouter({ history: createWebHashHistory(), routes });
  getCurrentInstance().appContext.app.use(router);

})();

</script>

<style scoped>
.mo-header {
  position: fixed;
  width: 100vw;
  height: 60px;
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
