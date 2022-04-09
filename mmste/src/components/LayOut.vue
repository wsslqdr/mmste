<template>
  <div>
    <!--    头部-->
    <app-header></app-header>
    <!--    主体-->
    <app-main></app-main>
    <!--    左侧-->
    <app-navbar></app-navbar>
  </div>
</template>
<script>
// 导入子组件
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";

// 注册子组件
export default {
  components: {
    AppMain,
    AppNavbar,
    AppHeader
  }
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  background: #2d3a4b;
}

.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  background-color: #545c64;
}

.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  overflow-y: auto;
}
</style>
