<template>
  <div id="main" style="width: 600px;height:400px;"></div>
</template>


<script>
import members from "../../api/members";
import sponsor from "../../api/sponsor";
import * as echarts from "echarts"

async function getMemData() {
  var mem = await members.getList()
  return mem.data.data

}

async function getSponData() {
  var spon = await sponsor.getList()
  return spon.data.data
}

export default {
  // data(){
  //
  // },
  methods: {
    drawPie() {
      var myChart = echarts.init(document.getElementById('main'));
      myChart.showLoading();
      // console.log(myChart)
      // console.log(this.mem)
      // console.log(this.spon)
      var memData;
      var sponData;

      async function getData() {
        memData = await getMemData()
        // console.log("memData",memData)
        sponData = await getSponData()
        // console.log("sponData", sponData)
        let optData = []
        for (let i = 0; i < sponData.total; i++) {
          optData.push(sponData.rows[i])
        }
        // console.log(optData)
        let optShowData = []
        for (let i = 0; i < optData.length; i++) {
          optShowData.push({
            value: optData[i].cash,
            name: optData[i].sponsorName
          })
        }
        // console.log(optShowData)


        var option = {
          title: {
            text: '赞助商金额',
            left: 'center',
            top: 'center'
          },
          series: [
            {
              name: '金额',
              type: 'pie',
              data: optShowData,
              radius: ['40%', '70%'],
              label:{
                normal:{
                  formatter: '{b}:{c}' + '\n\r' + '({d}%)'
                }
              }
            }
          ]
        };
        myChart.hideLoading();
        myChart.setOption(option);

      }

      getData()


      // var option = {
      //   series: [
      //     {
      //       type: 'pie',
      //       data:[]
      //     }
      //   ]
      // };
      // myChart.setOption(option);
    }
  },
  mounted() {
    this.drawPie()
  }

};
</script>

<style scoped>
div {
  text-align: center;
}
</style>
