<script setup lang="ts" xmlns:el-col="http://www.w3.org/1999/html">
import Charts from "./Charts.vue";
import {onMounted, reactive, ref} from "vue";
import FileSaver from "file-saver";
import InfoFrame from "./InfoFrame.vue";
import tools from "../tools";
import PathFinder from "./PathFinder.vue";
import MatingResult from "./MatingResult.vue";

let props = defineProps(["data"])

let per = reactive([])
let pathWindow = ref<HTMLDivElement| null>(null)
async function computeCount(){
  let datas = new Map<string,any>()
  let ids = []
  //加入id列表
  for (let res of props.data.data) {
    ids.push(res.id)

    datas.set(res.id,{
      x: res.x,
      y: res.y
    })
  }
  let a = 0
  let b = 0
  //遍历交配关系
  while (true){
    if (ids.length == 0) break
    let currentId = ids.pop()
    let current = datas.get(currentId)
    datas.forEach((value,id)=>{
      if (id != currentId && ids.includes(id)){
        if (value.x != current.x && value.y != current.y){
          a++
        }else {
          b++
        }
      }
    })
  }
  Object.assign(per,[
    {
    name: "兼容",
    value: a
    },
    {
      name: "不兼容",
      value: b
    },
  ])
}

function day():string{
  let now = new Date();
  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, '0');
  let day = now.getDate().toString().padStart(2, '0');
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
let input_message = {
  "number_of_monokaryons": "单核体数量",
  "number_of_mating_info": "交配信息数量",
  'number_of_OS_exp_info': "OS 实验信息数量",
}
let output_message = {
  'number_of_missed_mating_info':"缺失交配信息数量",
  "number_of_missed_OS_exp_info": "缺失 OS 实验信息数量",
  'score': "分数",
  "total_score": "总分数",
  "total_number_of_mating-type_combinations": "交配型组合总数",
  "total_number_of_all-right_mating-type_combinations": "所有正确交配类型组合的数量"
}
let miss_list = reactive([])
function showMiss(k:string){
  miss_list.length = 0
  if (k === 'number_of_missed_mating_info'){
    Object.assign(miss_list,props.data.missed_mating_list)
  }else {
    Object.assign(miss_list,props.data.missed_OS_exp_list)
  }
  drawer.value = true
}
function getBiData(){
  return {
    type: 'pie',
    selectedMode: 'multiple',
    data: per,
    label:{
      type: "percent",
      labelHtml: "{b|{b}:}{c|{d}%}",
      rich: {
        b: {
          padding: [2, 4, 0, 0]
        },
        c: {
          fontWeight: 'bold',
          padding: [2, 0, 0, 0]
        }
      }
    },
    color: [
      '#41ba41',
      '#fa2a2d'
    ],
  }
}

function printpage() {
  window.print()
}
function download(){
  let data = JSON.stringify(props.data);
  let blob = new Blob([data], { type: "application/json" });
  FileSaver.saveAs(blob, `result.json`);
}
function refresh(){
  window.location.reload()
}
computeCount()
function getSize(){
  return pathWindow.value!.clientWidth!
}
function getDefaultSize(){
  return 800
}
let size = ref(0)
let sizeMax = 0
onMounted(()=>{
  size.value = getDefaultSize()
  sizeMax = getSize()
})

let drawer = ref(false)
</script>

<template>
  <el-drawer
      v-model="drawer"
      title="提示"
      direction="rtl"
  >
    <el-card v-if="miss_list.length !== 0" v-for="e in miss_list" shadow="never">
      {{ e }}
    </el-card>
    <span v-else>无</span>
  </el-drawer>
  <el-button @click="printpage()">打印本页</el-button>
  <el-button @click="download()">下载原始文件</el-button>
  <el-button @click="refresh()">新的分析</el-button>
  <info-frame title="输入信息">
    <el-descriptions
        :column="3"
        border
    >
      <el-descriptions-item
          v-for="(v,k) in input_message"
          label-align="center"
          align="center"
          label-class-name="title-c"
          :label="v"
      >
        {{props.data[k]}}
      </el-descriptions-item>
    </el-descriptions>
  </info-frame>

  <info-frame class="top-20" title="输出信息">
    <el-descriptions
        :column="4"
        border
    >
      <el-descriptions-item
          v-for="(v,k) in output_message"
          label-align="center"
          align="center"
          label-class-name="title-c"
          :label="v"
      >
        <span v-if="k.indexOf('miss') === -1"> {{props.data[k]}} </span>
        <el-tooltip v-else content="点击查看详情">
          <span style="cursor: pointer" @click="showMiss(k)"> {{props.data[k]}} </span>
        </el-tooltip>
      </el-descriptions-item>
      <el-descriptions-item
          label-align="center"
          align="center"
          label-class-name="title-c"
          label="系统时间"
      >
        {{day()}}
      </el-descriptions-item>
    </el-descriptions>
  </info-frame>

  <info-frame class="top-20" title="分析结果">
    <hr>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-row :gutter="24">
          <el-col :span="5">
            图表大小：
            <el-input-number :max="sizeMax" v-model="size" >
              <template #suffix>
                <span>px</span>
              </template>
            </el-input-number>
          </el-col>
        </el-row>
        <div ref="pathWindow" style="text-align: center">
          <path-finder :key="size" v-if="size != 0" :size="size" :data="data.data"></path-finder>
        </div>
      </el-col>
    </el-row>
    <hr>
    <el-row :gutter="24">
      <el-col :span="24">
        <MatingResult :data="data.data">
<!--          <div style="text-align: center">
            <charts chart-type="HeatMapChart" :options="tools.transferHeat(data.data)" width="100%" height="1100px"></charts>
          </div>-->
        </MatingResult>

      </el-col>
    </el-row>
    <hr>
    <el-row :gutter="24">
      <el-col :span="24">
        <div style="text-align: center">
          <charts title="各交配型出现的次数" chart-type="BarChart" :options="tools.transferSunChart(data.data)" width="100%" height="600px"></charts>
        </div>
      </el-col>
    </el-row>


    <hr>
    <el-row :gutter="24">
      <el-col :span="24">
        <div style="text-align: center">
          <charts title="交配兼容与交配不兼容的比例" chart-type="PieChart" :options="getBiData()" width="100%" height="400px"></charts>
        </div>
      </el-col>
    </el-row>
  </info-frame>


</template>

<style scoped>
.cell-item {
  display: flex;
  align-items: center;
}
:deep(.title-c){
  background: #87CEEB !important;
}
.top-20{
  margin-top: 20px;
}
</style>