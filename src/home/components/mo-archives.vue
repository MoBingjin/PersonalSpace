<template>
    <div class="mo-archives">
        <el-timeline>
            <el-timeline-item v-for="item in archives" :class="item.isTime && 'mo-time'" placement="top" type="primary"
                :size="item.isTime ? 'large' : 'normal'" :hollow="!item.isTime" :timestamp="item.timestamp">
                {{ item.content }}
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script setup>

const { reactive } = window["Vue"];


// 归档信息列表
const archives = reactive([
    {
        content: '2022年06月',
        isTime: true
    },
    {
        timestamp: "2022-06-20 19:01:17",
        content: "Spring Cloud及其常用组件"
    },
    {
        timestamp: "2022-06-20 18:55:08",
        content: "ElasticSearcher的部署和使用"
    },
    {
        timestamp: "2022-06-20 18:49:53",
        content: "RabbitMQ中间件部署及使用"
    },
    {
        timestamp: "2022-06-20 18:49:09",
        content: "JavaScript基础"
    },
    {
        timestamp: "2022-06-20 18:48:35",
        content: "CSS基础"
    },
    {
        timestamp: "2022-06-20 18:46:59",
        content: "HTML基础"
    },
    {
        timestamp: "2022-06-20 18:46:21",
        content: "Java反射"
    },
    {
        timestamp: "2022-06-20 18:45:42",
        content: "Java注解"
    },
    {
        timestamp: "2022-06-20 18:45:18",
        content: "Java生产者/消费者问题"
    },
    {
        timestamp: "2022-06-20 18:44:39",
        content: "Java多线程"
    },
    {
        timestamp: "2022-06-20 18:43:58",
        content: "Java的Lambda表达式"
    },
    {
        timestamp: "2022-06-20 18:43:28",
        content: "Java静态代理模式"
    },
    {
        timestamp: "2022-06-20 18:42:54",
        content: "Java网络编程"
    },
    {
        timestamp: "2022-06-20 18:41:02",
        content: "Java异常"
    },
    {
        timestamp: "2022-06-20 18:40:04",
        content: "Java中static的使用"
    },
    {
        timestamp: "2022-06-20 18:39:15",
        content: "Java面向对象"
    },
    {
        timestamp: "2022-06-20 18:37:48",
        content: "数据结构：稀疏数组"
    },
    {
        timestamp: "2022-06-20 18:36:49",
        content: "排序算法：冒泡排序"
    },
    {
        timestamp: "2022-06-20 18:35:41",
        content: "Java数组"
    },
    {
        timestamp: "2022-06-20 18:33:34",
        content: "Java方法"
    },
    {
        timestamp: "2022-06-20 18:32:39",
        content: "Java流程控制"
    },
    {
        timestamp: "2022-06-20 18:31:38",
        content: "Java基础语法"
    },
    {
        timestamp: "2022-06-20 18:28:21",
        content: "Windows下Java JDK1.8安装及环境变量配置"
    },
    {
        timestamp: "2022-06-20 18:14:16",
        content: "MarkDown常用语法"
    }
]);

</script>

<style>
.mo-time .el-timeline-item__wrapper {
    font-size: 16px;
    top: -17px;
    right: 130px;
}
</style>
<style scoped>
.mo-archives {
    width: 100%;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.el-timeline {
    padding: 0 50px 0 115px;
}
</style>