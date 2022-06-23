<template>
    <div class="mo-404">
        <img src="../picture/4.png">
        <h2>小笨蛋，页面跑偏啦～</h2>
        <p>你可以选择刷新页面或者返回主页</p>
        <a href="/" class="mo-btn mo-btn-primary mo-btn-blue">返回主页</a>
    </div>
</template>

<script setup>

// 初始化操作
; (() => {
    import(`../css/${window.screen.width < 960 ? "mobile" : "pc"}/404.css`);
    window["document"].getElementsByTagName("title")[0].innerHTML = window["MoConfig"].params.title["404"];
})();

</script>
