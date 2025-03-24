<script setup lang="ts">
import TopMenu from "./components/TopMenu.vue";
</script>

<template>
  <el-container>
    <el-header>
      <TopMenu></TopMenu>
    </el-header>
    <el-main>
      <RouterView></RouterView>
    </el-main>
    <el-footer>
      <center>
        © MTI - 交配型推断应用平台开发团队
      </center>
    </el-footer>
  </el-container>
</template>

<style scoped>

.el-container {
  background: transparent;
  min-height: 95vh;
}
</style>
