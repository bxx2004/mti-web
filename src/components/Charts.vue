<script setup lang="ts">
  import HuiCharts from '@opentiny/huicharts';
  import {onMounted, watch} from "vue";
  let props = defineProps(["chartType","options","width","height","title"])
  let events = defineEmits(["rendered"])
  let chartIns = new HuiCharts();
  let randomId = guid()
  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  onMounted(()=>{
    let chartContainerDom = document.getElementById(randomId);
    chartIns.init(chartContainerDom);
    chartIns.setSimpleOption(props.chartType, props.options)
    chartIns.onRenderReady(()=>{events("rendered")})
    chartIns.render();
    changeSize(80,500)
  })
  watch(()=>props.options,()=>{
    chartIns.refresh(props.options)
    chartIns.render()
  })
  watch(()=>props.width,()=>{
    document.getElementById(randomId)!.style.width = props.width
  })
  watch(()=>props.height,()=>{
    document.getElementById(randomId)!.style.height = props.height
  })
  function style(){
    return "width: " + props.width + "; height: " + props.height
  }
  function changeSize(w:number,h:number){
    document.getElementById(randomId)!.style.height = h + "px"
    document.getElementById(randomId)!.style.width = w + "%"
  }
</script>

<template>
  <el-card shadow="never" style="text-align: center;width: 100%">

    <b>{{props.title}}</b>
    <br>
    <el-button-group style="left: 1%;top: 1px">
      <el-button @click="changeSize(40,300)">小</el-button>
      <el-button @click="changeSize(80,600)">中</el-button>
      <el-button @click="changeSize(100,1000)">大</el-button>
    </el-button-group>

    <center>
      <div :style="style()" :id="randomId" />
    </center>
  </el-card>
</template>

<style scoped>

</style>