<script setup lang="ts">
import RelationGraphComponent, {RGLine, RGLink, RGNode} from "relation-graph-vue3";

let props = defineProps(["datas","layout"])
import RelationGraph, {RGOptions} from "relation-graph-vue3";
import {onMounted, ref, watch} from "vue";

  const graphRef = ref<RelationGraphComponent | null>(null);

  const graphOptions: RGOptions = {
    debug: false,
    backgroundColor: "transparent",
    allowShowMiniToolBar: true,
    defaultNodeBorderWidth: 2,
    allowSwitchLineShape: true,
    allowSwitchJunctionPoint: true,
    defaultLineShape: 1,
    layout: {
      layoutName: props.layout,
      maxLayoutTimes: 1,
      force_node_repulsion: 4,
      force_line_elastic: 0.01
    },
    toolBarDirection: 'h',
    toolBarPositionH: 'right',
    toolBarPositionV: 'bottom',
    defaultJunctionPoint: 'border'
  };
  onMounted(() => {
    showGraph();
  });
  watch(props.datas,()=>showGraph())
  const showGraph = async() => {
    const __graph_json_data = ref(props.datas);
    const graphInstance = graphRef.value!.getInstance();
    if (graphInstance) {
      await graphInstance.setJsonData(__graph_json_data.value);
      await graphInstance.moveToCenter();
      // await graphInstance.zoomToFit();
      graphInstance.setZoom(30);
    }
  };
  function onLineClick(lineObject: RGLine, line: RGLink){
    lineObject
    line
  }
  function onNodeClick(nodeObject: RGNode){
    showNodeTips(nodeObject)
  }
let currentNode = ref()
let isShowType = ref(false)
const showNodeTips = (nodeObject:RGNode) => {
  isShowType.value = true
  currentNode.value = nodeObject;
};

const hideNodeTips = () => {
  currentNode.value = null;
  isShowType.value = false
};
function getscore(v:any){
  if (v==undefined){
    return "-"
  }else {
    return v
  }
}
</script>

<template>

  <div style="height:calc(60vh);">
    <RelationGraph ref="graphRef" :options="graphOptions" :on-node-click="onNodeClick" :on-line-click="onLineClick">
    </RelationGraph>
    <div v-if="isShowType" :style="{left: '0px', top: '0px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
      <el-alert :title="currentNode.text" type="success" @close="hideNodeTips()"  />
      <el-tag type="warning">x: {{currentNode.data.x}}</el-tag>
      <el-tag type="warning">y: {{currentNode.data.y}}</el-tag>
      <el-tag type="warning">score: {{getscore(currentNode.data.score)}}</el-tag>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.relation-graph) {
  .rel-map {
    background: none !important;
    .rel-node-shape-1 {
    }
  }
  .rel-toolbar{
    color: #ffffff;
    .c-current-zoom{
      color: #ffffff;
    }
  }
}
</style>