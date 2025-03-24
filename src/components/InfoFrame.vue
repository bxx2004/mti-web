<script setup lang="ts">
let attr = defineProps(["title","tooltip"])

</script>

<template>
  <el-card>
    <el-divider border-style="solid" content-position="left">
      <el-tooltip v-if="attr.tooltip!=null" effect="light" :content="attr.tooltip">
        <span class="title">{{ attr.title }}</span>
      </el-tooltip>
      <span v-else class="title">{{ attr.title }}</span>
    </el-divider>
    <slot name="default"></slot>
  </el-card>
</template>

<style scoped>
.title{
  font-size: 25px;
  color: darkturquoise;
  cursor: pointer;
}
</style>