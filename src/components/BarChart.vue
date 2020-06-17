<script>
import { HorizontalBar, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions','janela'],
  mounted () {
    // console.log(this.chartData)
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
      'chartData.datasets': function () {
          this.$data._chart.update()
        //   console.log("finalmente")
      },
      'janela': function() {
          this.renderChart(this.chartData, this.chartOptions)
      },
      deep: true
  }
}
</script>

