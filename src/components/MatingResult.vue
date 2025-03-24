<script setup lang="ts">
import {reactive, ref} from "vue";

let props = defineProps(["data"])

let choose1 = ref(props.data[0].id)
let choose2 = ref(props.data[1].id)
function getOptions() : any[]{
  return props.data.map((ele:any)=>{
    return {
      label: ele.id,
      value: ele.id
    }
  })
}

function findNode(id:string){
  for (let d of props.data) {
    if (d.id === id){
      return d
    }
  }
  return {}
}

let info = reactive({
  mating: "",
  ele1:{
    id: "",
    x: 0,
    y: 0
  },
  ele2:{
    id: "",
    x: 0,
    y: 0
  }
})
function updateInfo(){
  let n1 = findNode(choose1.value)
  let n2 = findNode(choose2.value)
  if (n1.x !== n2.x && n1.y !== n2.y){
    info.mating = "亲和"
  }else {
    info.mating = "不亲和"
  }
  info.ele1 = n1
  info.ele2 = n2
}
updateInfo()
</script>

<template>
  <el-card>
    <template #header>
      <b>交配兼容性结果</b>&nbsp;
      <el-select @change="updateInfo" v-model="choose1" placeholder="请选择菌株" style="width: 10%">
        <el-option
            v-for="item in getOptions()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      和
      <el-select @change="updateInfo" v-model="choose2" placeholder="请选择菌株" style="width: 10%;">
        <el-option
            v-for="item in getOptions()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      &nbsp;

    </template>

    <el-descriptions :column="2" border>
      <el-descriptions-item align="center" :span="2" label="交配兼容性">{{ info.mating }}</el-descriptions-item>
      <el-descriptions-item align="center" :rowspan="2" label="一号菌株">{{ info.ele1.id }}</el-descriptions-item>
      <el-descriptions-item align="center" label="x">{{ info.ele1.x }}</el-descriptions-item>
      <el-descriptions-item align="center" label="y">{{ info.ele1.y }}</el-descriptions-item>
      <el-descriptions-item align="center" :rowspan="2" label="二号菌株">{{ info.ele2.id }}</el-descriptions-item>
      <el-descriptions-item align="center" label="x">{{ info.ele2.x }}</el-descriptions-item>
      <el-descriptions-item align="center" label="y">{{ info.ele2.y }}</el-descriptions-item>
    </el-descriptions>
    <slot></slot>
  </el-card>
</template>

<style scoped>

</style>