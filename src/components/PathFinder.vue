<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";

let props = defineProps(["data","size"])
let canvas = ref<HTMLCanvasElement|null>(null)
let tooltipElement = ref<HTMLDivElement|null>(null)
let length = props.data.length + 1

let attr = {
  cubeSize: -1
}



function transfrom(x:number,y:number):number[]{
  let nx = x-1
  let ny = y-1
  return [nx*attr.cubeSize,ny*attr.cubeSize]
}
function transfromReverse(x:number,y:number):number[]{
  let nx = Math.ceil(x / attr.cubeSize)
  let ny = Math.ceil(y / attr.cubeSize)
  return [nx,ny]
}

function transfromFont(x:number,y:number):number[]{
  let nx = x
  let ny = y
  return [nx*attr.cubeSize,ny*attr.cubeSize]
}

function drawCubeLine(){
  let context = canvas.value?.getContext("2d")
  for (let x = 2;x <= length+1;x++) {
    let start = transfrom(x,1)
    context?.moveTo(start[0],start[1] + attr.cubeSize)
    context?.lineTo(start[0],props.size)
    context?.stroke();
  }
  for (let y = 2;y <= length+1;y++) {
    let start = transfrom(1,y)
    context?.moveTo(start[0] + attr.cubeSize,start[1])
    context?.lineTo(props.size,start[1])
    context?.stroke();
  }
}

function drawAxisLine(){
  let context = canvas.value!.getContext("2d")!
  context.font=`${attr.cubeSize*0.8}px Arial`;
  context.fillText("#",0,attr.cubeSize-3);
  for (let y = 1;y <= length;y++) {
    context.fillText(y.toString(),y*attr.cubeSize,attr.cubeSize-2);
    context.fillText(y.toString(),0,(y+1)*attr.cubeSize-3);
  }
}

let animation = {
  index: 0
}

function line2Point(start:number[], end:number[]) {
  // 计算两点之间的差值
  let dx = (end[0]+attr.cubeSize/2) - (start[0]+attr.cubeSize/2);
  let dy = (end[1]+attr.cubeSize/2) - (start[1]+attr.cubeSize/2);

  // 计算两点之间的距离
  let steps = Math.max(Math.abs(dx), Math.abs(dy));

  // 计算每一步的增量
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;

  // 初始化点的集合
  let points = [];

  // 计算并添加每个点
  for (let i = 0; i <= steps; i++) {
    // 计算当前点的坐标
    let x = (start[0]+attr.cubeSize/2) + xIncrement * i;
    let y = (start[1]+attr.cubeSize/2) + yIncrement * i;

    // 将当前点添加到集合中
    points.push([Math.round(x), Math.round(y)]);
  }

  return points;
}
function hasNext():boolean{
  return animation.index < length-1
}
function nextNode(){
  if (animation.index >= length) return null
  let ele = props.data[animation.index]
  let index = transfromFont(ele.x,ele.y)

  animation.index++
  if (hasNext()){
    let ele2 = props.data[animation.index]
    let index2 = transfromFont(ele2.x,ele2.y)
    return {
      point:{
        x: index[0]+attr.cubeSize/2,
        y: index[1]+attr.cubeSize/2,
        r: (attr.cubeSize/2)*0.8
      },
      line:line2Point(index2,index).reverse()
    }
  }else {
    return {
      point:{
        x: index[0]+attr.cubeSize/2,
        y: index[1]+attr.cubeSize/2,
        r: (attr.cubeSize/2)*0.8
      },
      line:[]
    }
  }

}
function drawPoint(x:number,y:number,r:number){
  let context = canvas.value!.getContext("2d")!
  context.beginPath();//开始绘制
  context.arc(x,y,r,0,2*Math.PI);//arc 的意思是“弧”
  context.fillStyle="blue";//设置填充颜色
  context.fill();//开始填充
  context.strokeStyle="blue";//将线条颜色设置为蓝色
  context.stroke();//stroke() 方法默认颜色是黑色（如果没有上面一行，则会是黑色）。
}
function drawLine(line:any[], finish:any) {
  // line是点的集合，结构例子为：[[1,1], [2,2], ...]
  // 需要每100ms绘制一个点，当点绘制结束后执行finish函数
  let context = canvas.value!.getContext("2d")!;

  let i = 0;

  // 设置定时器，每100ms绘制一个点
  let id = setInterval(() => {
    if (i < line.length-1) {
      // 移动到下一个点但不画线
      context.beginPath();
      context.moveTo(line[i][0], line[i][1]);
      // 画线到当前点
      context.lineTo(line[i+1][0], line[i+1][1]);
      context.stroke();
      i++; // 移动到下一个点
    } else {
      // 如果所有点都绘制完毕，清除定时器并执行finish函数
      clearInterval(id);
      finish();
    }
  }, 1);
}
function drawAnimation(){
  let node = nextNode()!
  //*需要先画点，防止线完毕点未出现
  drawPoint(node.point.x,node.point.y,node.point.r)
  drawLine(node.line,()=>{
    if (hasNext()){
      drawAnimation()
    }
  })
}
onMounted(()=>{
  attr.cubeSize = Math.floor(props.size / length)
  canvas.value?.setAttribute("width",(attr.cubeSize * length).toString())
  canvas.value?.setAttribute("height",(attr.cubeSize * length).toString())

  drawCubeLine()
  drawAxisLine()
  drawAnimation()
})

function findNode(x:number,y:number):string{
  for (let ele of props.data) {
    if (ele.x == x && ele.y == y){
      return ele.id
    }
  }
  return "无"
}
let isShow= ref(false)
let tooltip = reactive({
  id: "无",
  x: -1,
  y: -1
})
function onLeave() {
  isShow.value = false
}
function onMove(event:MouseEvent){
  let index = transfromReverse(event.offsetX,event.offsetY).map((ele)=>ele-1)
  tooltip.id = findNode(index[0],index[1])
  tooltip.x = index[0]
  tooltip.y = index[1]
  isShow.value = true
  //tooltipElement.value!.style!.top! = `${event.offsetY}px`
  //tooltipElement.value!.style!.left! = `${event.offsetX}px`
}
</script>

<template>
  <div ref="tooltipElement" style="position: fixed;z-index: 999;opacity: 0.9" v-show="isShow">
    <el-card>
      <h5>数据</h5>
      <p>{{tooltip.id}}({{tooltip.x}},{{tooltip.y}})</p>
    </el-card>
  </div>


  <canvas @mouseleave="onLeave" @mousemove="onMove" ref="canvas" />


</template>

<style scoped>

</style>