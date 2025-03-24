<script setup lang="ts">

</script>

<template>
  <el-row :gutter="24">
    <el-col :span="6">
      <el-image fit="cover" src="../../public/help.jpg" />
    </el-col>
    <el-col :span="12">
      <h1>软件介绍：</h1>
      <p>功能：根据交配结果推断交配类型。</p>

      <h1>交配结果矩阵文件：</h1>
      <p>文件需要有一行标题行，一列标题列。</p>
      <p>* 其中第一行和第一列是 <el-tag>菌株名称</el-tag>，必须保证行和列的标题完全相等。</p>
      <p>* 菌株名称规定为：<el-tag>菌株id-单核体id</el-tag>,例如：<el-tag>GS0169-121</el-tag>。</p>
      <p>
        * 数据只能用<el-tag>+</el-tag>,<el-tag>-</el-tag>和<el-tag>x</el-tag>表示;
        其中<el-tag>+</el-tag>指的是<el-tag>亲和</el-tag>;
        <el-tag>-</el-tag>指的是<el-tag>不亲和</el-tag>;
        <el-tag>x</el-tag>指的是<el-tag>未知</el-tag>。
      </p>

      <h1>OWE-SOJ 实验结果文件：</h1>
      <p>文件的第一行需为标题行，共四列。</p>
      <p>其中标题行规定为：<el-tag>stain1</el-tag>,<el-tag>stain2</el-tag>,<el-tag>x</el-tag>,<el-tag>y</el-tag>。</p>
      <p>* 其中<el-tag>stain1</el-tag>是菌株名称1。</p>
      <p>* 其中<el-tag>stain2</el-tag>是菌株名称2。</p>
      <p>* 其中<el-tag>x</el-tag>和<el-tag>y</el-tag>的取值只能是：<el-tag>diff</el-tag>和<el-tag>same</el-tag>。</p>

      <h1>提示：</h1>
      <p>菌株名称不应包含 <el-tag>#</el-tag>,<el-tag>_</el-tag> 或 <el-tag>空格</el-tag>。</p>
    </el-col>
  </el-row>


  <h1>文件示例</h1>
  <el-row :gutter="24">
    <el-col :span="12">
      <el-card>
        <template #header>
          <div>
            <span>交配结果矩阵文件 mating_result.dat</span>
          </div>
        </template>
        <img src="../../public/1.png">
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <template #header>
          <div>
            <span>OWE-SOJ 实验的表格结果 owe-soj_result.dat</span>
          </div>
        </template>
        <img src="../../public/2.png">
      </el-card>
    </el-col>
  </el-row>

</template>

<style scoped>

</style>