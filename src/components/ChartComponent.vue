<script>
import { Line, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions','escala'],
  mounted () {
    // console.log(this.chartData)
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
      'chartData.datasets': function () {
          this.renderChart(this.chartData, this.chartOptions)
        //   console.log("finalmente")
      },
      'escala': function() {
          this.renderChart(this.chartData, this.chartOptions)
      },
      deep: true
  }
}
</script>

<style>
</style>