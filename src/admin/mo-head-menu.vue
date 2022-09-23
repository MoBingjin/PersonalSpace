<template>
  <div class="mo-head">
    <span>个人空间</span>
    <span title="退出" @click="emits('loginout', {})">
      <e-icon icon-name="fa fa-sign-in" />
    </span>
  </div>
</template>

<script setup>

// 回调对象
const emits = defineEmits(['loginout']);

</script>

<style scoped>
.mo-head {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mo-head>span:first-child {
  font-family: '宋体';
  color: #e6e6e6;
  font-size: 30px;
  margin-left: 30px;
  padding: 5px;
  border: 1px solid #f5f5f5;
  border-radius: 5px;
}

.mo-head>span:last-child {
  font-size: 24px;
  margin-right: 20px;
  color: #e6e6e6;
}

.mo-head>span:last-child:hover {
  cursor: pointer;
  color: #ffd04b;
}
</style>