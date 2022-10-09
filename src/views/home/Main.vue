<template>
  <div :class="homeAppClass">
    <span :class="sideMenuClass">
      <mo-side-menu @close-side-menu="sideMenuStatus = false"></mo-side-menu>
    </span>
    <span :class="mainContainerClass">
      <div :class="sideMenuBtnClass" @click="sideMenuStatus = !sideMenuStatus">
        <e-icon v-if="sideMenuStatus" class="mo-side-menu-btn-icon" icon-name="fa fa-remove" />
        <e-icon v-if="!sideMenuStatus" class="mo-side-menu-btn-icon" icon-name="fa fa-navicon" />
      </div>
      <div :class="hiddenAreaClass" @click="sideMenuStatus = !sideMenuStatus"></div>
      <div :class="headerClass">
        <mo-head-menu></mo-head-menu>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </span>
  </div>
</template>

<script setup>

import MoHeadMenu from './MoHeadMenu.vue';
import MoSideMenu from './MoSideMenu.vue';
import { computed, getCurrentInstance, ref, watch } from 'vue';
import router from '@/router/router.mod.js';
import storage from '@/utils/storage.mod.js';


// 设置路由
getCurrentInstance().appContext.app.use(router);

const title = storage.getObject('title');

// 导航栏class
const headerClass = ref('mo-hidden');
// 侧边栏打开状态
const sideMenuStatus = ref(false);


const homeAppClass = computed(() => sideMenuStatus.value ? 'mo-home-app open' : 'mo-home-app');
const sideMenuClass = computed(() => sideMenuStatus.value ? 'mo-side-menu open' : 'mo-side-menu');
const mainContainerClass = computed(() => sideMenuStatus.value ? 'mo-main-container open' : 'mo-main-container');
const sideMenuBtnClass = computed(() => sideMenuStatus.value ? 'mo-side-menu-btn open' : 'mo-side-menu-btn');
const hiddenAreaClass = computed(() => sideMenuStatus.value ? 'mo-hidden-area open' : 'mo-hidden-area');


/**
 * 滚动条监听事件
 * 
 * @param {Event} event 事件对象
 */
const handleScroll = event => {
  if (event.target.documentElement.scrollTop > 0) {
    headerClass.value = 'mo-header mo-header-show';
  } else {
    headerClass.value = 'mo-header mo-header-hidden';
  }
}


// 初始化操作
(() => {

  // 淡入效果
  window['document'].body.style.opacity = '0';
  setTimeout(() => {
    window['document'].body.style.transition = 'opacity 1.5s';
    window['document'].body.style.opacity = '1';
  }, 0);

  // 路由监听
  watch(router.currentRoute, (route) => {

    // 404
    if (route.matched[0].path === '/:other') {
      window['document'].getElementsByTagName('title')[0].innerHTML = title['_404'];
      window['document'].getElementsByClassName('mo-side-menu-btn')[0].style['display'] = 'none';
      headerClass.value = 'mo-hidden';
      window.removeEventListener('scroll', handleScroll);
      return;
    }

    window['document'].getElementsByTagName('title')[0].innerHTML = `${route.matched[0].name} | ${title['home']}`;

    // 主页
    if (['/', '/main'].includes(route.path)) {
      headerClass.value = 'mo-header mo-header-init';
      window.addEventListener('scroll', handleScroll);
      return;
    }

    // 其他
    headerClass.value = 'mo-header mo-header-show';
    window.removeEventListener('scroll', handleScroll);
  });

})();

</script>

<style scoped>
@media screen and (max-width: 960px) {

  .mo-home-app.open {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: fixed;
  }

  .mo-side-menu {
    width: 0;
    height: 100%;
    max-width: 250px;
    position: absolute;
    display: none;
    background-color: #fff;
    transition: all .3s ease;
    z-index: 999;
  }

  .mo-side-menu.open {
    display: block;
    width: 250px;
  }

  .mo-main-container {
    width: 100%;
    display: block;
    padding-left: 0;
    transition-duration: .5s;
  }

  .mo-main-container.open {
    padding-left: 250px;
  }

  .mo-side-menu-btn {
    width: 50px;
    height: 50px;
    position: absolute;
    text-shadow: 2px 2px 10px #000;
    z-index: 2;
  }

  .mo-side-menu-btn-icon {
    width: 100%;
    height: 100%;
    font-size: 40px;
    text-align: center;
    line-height: 50px;
    color: #ffffff;
  }

  .mo-hidden-area.open {
    width: 100%;
    height: 100vh;
    display: block;
    position: absolute;
    background-color: #99999957;
    z-index: 1;
  }

  .mo-header {
    display: none;
  }

}

@media screen and (min-width: 961px) {

  .mo-side-menu,
  .mo-side-menu-btn {
    display: none;
  }

}

.mo-header {
  position: fixed;
  width: 100%;
  height: 60px;
  top: 0;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 998;
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
