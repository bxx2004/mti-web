<script setup lang="ts">
let props = defineProps(["value"])
let option = {
  status: "交配兼容"
}
</script>

<template>
  <el-result
      icon="success"
      title="可以交配"
      sub-title="Please follow the instructions"
  >
    <template #extra>
      <el-button type="primary">Back</el-button>
    </template>
  </el-result>
</template>

<style scoped>

</style>