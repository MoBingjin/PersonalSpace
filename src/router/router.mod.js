import { createRouter, createWebHashHistory } from 'vue-router';

// 路由规则
const routes = [
    {
        path: '/:main(main)?',
        name: '首页',
        component: () => import('@/views/home/main/MoMain.vue')
    },
    {
        path: '/archives',
        name: '归档',
        component: () => import('@/views/home/archives/MoArchives.vue')
    },
    {
        path: '/about',
        name: '关于',
        component: () => import('@/views/home/about/MoAbout.vue')
    },
    {
        path: '/article/:articleId',
        name: '文章',
        component: () => import('@/views/home/article/MoArticleView.vue')
    },
    {
        path: '/:other',
        component: () => import('@/views/common/404.vue')
    }
];

export default createRouter({ history: createWebHashHistory(), routes });
