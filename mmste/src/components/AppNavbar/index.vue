<template>
  <div class="navbar">
    <el-menu
      :router="true"
      :default-active="$route.path"
      z
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/members">
        <i class="el-icon-s-custom"></i>
        <span slot="title">部员管理</span>
      </el-menu-item>
      <el-menu-item index="/sponsor">
        <i class="el-icon-s-data"></i>
        <span slot="title">赞助管理</span>
      </el-menu-item>
      <el-menu-item index="/admin">
        <i class="el-icon-s-data"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

<style scoped></style>
