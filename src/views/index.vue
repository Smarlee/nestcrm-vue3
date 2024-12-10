<template>
  <div class="app-container">
      <el-row :gutter="20">
          <el-col :span="6">
              <el-card>
                  巡检监控
                  <el-divider></el-divider>
                  <p align="center">
                      <img src="img/card1.png" width="240" alt="">
                  </p>
              </el-card>

              <el-card class="mt20">
                  资源监控
                  <el-divider></el-divider>
                  <!-- <p align="left">
                      <img src="img/card2.png" width="356" alt="">
                  </p> -->
                  <el-empty></el-empty>
              </el-card>

              <el-link class="mt20" type="primary" icon="Warning">
                  <span class="ml10">统计非实时数据，按小时统计</span>
              </el-link>
          </el-col>
          <el-col :span="18">
              <el-card>
                  地图监控
                  <el-divider></el-divider>
                  <div id="map"></div>
              </el-card>
          </el-col>
      </el-row>
  </div>
</template>

<script setup>
import { nextTick, onMounted } from 'vue'
import { Edit, View, Warning } from '@element-plus/icons-vue'
onMounted(() => {
  nextTick(() => {
      initMap()
  })
})

const initMap = () => {
  var list = [
      { lat: 39.841938, lng: 116.25837, con: "我是C", title: "老三" },
      { lat: 39.809815, lng: 116.740079, con: "我是D", title: "老四" },
      { lat: 39.93428, lng: 116.37319, con: "我是E", title: "老五" }
  ];
  var map = new BMapGL.Map('map');
  var point = new BMapGL.Point(118.640871, 32.102098);
  map.centerAndZoom(point, 7);
  var marker = new BMapGL.Marker(point);
  map.addOverlay(marker);
  // 创建信息窗口
  var opts = {
      width: 200,
      height: 100,
      title: '南京金陵石化'
  };
  var infoWindow = new BMapGL.InfoWindow('地址：南京金陵石化<br>当日巡检：0', opts);
  // 点标记添加点击事件
  map.openInfoWindow(infoWindow, point)
  // marker.addEventListener('click', function () {
  //     map.openInfoWindow(infoWindow, point); // 开启信息窗口
  // });





}

</script>
<style>
#map {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 240px);
  margin: 0;
  font-family: "微软雅黑";
}
</style>