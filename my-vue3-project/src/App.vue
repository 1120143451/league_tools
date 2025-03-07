<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-card>
          <div :key="o" class="text item">{{ 'List item ' + o }}</div>
        </el-card>
      </el-header>
      <el-main ref="mainRef">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-card>
              <div :key="o" class="text item">{{ 'List item ' + o }}</div>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card>
              <div :key="o" class="text item">{{ 'List item ' + o }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-card>
          <div :key="o" class="text item">{{ 'List item ' + o }}</div>
        </el-card>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 引用 el-main 元素
const mainRef = ref(null);
onMounted(() => {
  // 获取 el-main 元素
  const mainElement = mainRef.value;
  console.log("mainRef.value", mainElement.parentElement.offsetHeight)
  // 获取父容器 el-container 的高度
  const containerHeight = mainElement.parentElement.offsetHeight;

  // 获取 el-header 和 el-footer 的高度
  const headerHeight = mainElement.parentElement.querySelector('el-header').offsetHeight;
  const footerHeight = mainElement.parentElement.querySelector('el-footer').offsetHeight;

  // 计算 el-main 的高度
  const mainHeight = containerHeight - headerHeight - footerHeight;

  // 设置 el-main 的高度
  mainElement.style.height = mainHeight + 'px';
});
</script>

<style>
html,
body {
  margin: 0 !important;
}
</style>
<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: #2c3e50;
  background-color: #e6e6e6;
  padding: 10px;
  box-sizing: border-box;
}
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #e6e6e6;
  height: 100vh;
  width: 100vw;
}*/
</style>
