<script>
import { Bar, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['chartData', 'chartOptions'],
  mounted () {
    // console.log(this.chartData)
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
      'chartData.datasets': function () {
          this.renderChart(this.chartData, this.chartOptions)
        //   console.log("finalmente")
      },
      deep: true
  }
}
</script>

