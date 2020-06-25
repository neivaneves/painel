<script>
import { Scatter, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

export default {
  extends: Scatter,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions','escala'],
  mounted () {
    // console.log(this.chartData)
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
      'chartData.datasets': function () {
          this.$data._chart.update()
        //   console.log("finalmente")
      },
      deep: true
  }
}
</script>

<style>
</style>