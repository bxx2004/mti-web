<script setup lang="ts">


import {router} from "../router";

const handleSelect = (key: string) => {
  if (key != "logo"){
    router.push(key)
  }

}
let active = window.location.href.split("/")[3]
if (active.length == 0){
  active = "home"
}
</script>

<template>
  <el-menu
      mode="horizontal"
      :ellipsis="false"
      :collapse-transition="true"
      @select="handleSelect"
      class="nav"
      :default-active="active"
  >
<!--    <el-menu-item index="logo" >
      <img
          style="width: 150px"
          src="/src/assets/logo.png"
          alt="LOGO2"
      />
    </el-menu-item>-->
    <el-menu-item index="home">
      主页
    </el-menu-item>
    <el-menu-item index="help">
      使用帮助
    </el-menu-item>
    <div class="flex-grow" />

  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.el-menu-item {
  background-color: transparent !important;
  border-bottom-color: transparent !important;
}
.el-sub-menu{
  background-color: transparent !important;
  border-bottom-color: transparent !important;
}
.el-menu-item {
  background-color: transparent !important;
  border-bottom-color: transparent !important;
}
</style>