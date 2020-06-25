<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
		<v-card>
			<ScatterPlotComponent
				style="height: 456px;"
				v-if="loaded"
				:chartData="chartData"
				:chartOptions="chartOptions"
			></ScatterPlotComponent>
			<v-fab-transition>
				<v-btn
					v-show="loaded"
					color="grey"
					absolute
					icon
					top
					right
					@click="overlay = !overlay"
				>
					<v-icon>info</v-icon>
				</v-btn>
			</v-fab-transition>
			<v-overlay :absolute="true" :opacity="0.9" :value="overlay">
				<p style="margin: 30px;" class="text-justify">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies
					lorem quam, eget vehicula elit tincidunt nec. Proin auctor ac enim sed
					lobortis. Donec sed accumsan risus, sed placerat ex. Phasellus
					accumsan mi nec ex sagittis, a congue odio commodo. Cras non congue
					enim, in vestibulum tortor. Fusce quis mattis mi, eget interdum nibh.
					Sed auctor tempus dolor.
				</p>
				<v-btn
					color="orange lighten-2"
					absolute
					fab
					right
					@click="overlay = false"
				>
					<v-icon>close</v-icon>
				</v-btn>
			</v-overlay>
		</v-card>
	</v-skeleton-loader>
</template>

<script>
import ScatterPlotComponent from "./ScatterPlotComponent";

export default {
	name: "CardDistRisco",
	components: {
		ScatterPlotComponent,
	},
	data: () => ({
		loaded: false,
		overlay: false,
		chartData: null,
		chartOptions: null,
	}),
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeDistRisc"
		);
		const dataRisco = await response.json();
		let datasets = [
			{
				label: "NITEROI",
				data: [],
				backgroundColor: "#5e3c99",
				pointRadius: 8,
			},
			{
				label: "",
				data: [],
				pointRadius: 5,
			},
			{
				label: "",
				data: [],
				backgroundColor: "#ffffb2",
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				showLine: true,
			},
			{
				label: "",
				data: [],
				backgroundColor: "#fecc5c",
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				showLine: true,
				fill: "-1",
			},
			{
				label: "",
				data: [],
				backgroundColor: "#fd8d3c",
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				showLine: true,
				fill: "-1",
			},
			{
				label: "",
				data: [],
				backgroundColor: "#e31a1c",
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				showLine: true,
				fill: "-1",
			},
		];
		for (let i = 0.001; i <= 5; i += 0.1) {
			datasets[2].data.push({
				x: i,
				y: this.hip(i, 1),
			});
		}
		for (let i = 0.001; i <= 5; i += 0.1) {
			datasets[3].data.push({
				x: i,
				y: this.hip(i, 2),
			});
		}
		for (let i = 0.001; i <= 5; i += 0.1) {
			datasets[4].data.push({
				x: i,
				y: this.hip(i, 3),
			});
		}
		for (let i = 0.1; i <= 5; i += 0.1) {
			datasets[5].data.push({
				x: i,
				y: 5,
			});
		}
		for (let regiao of dataRisco) {
			if (regiao.regiao === "NITEROI") {
				datasets[0].data.push({
					x: parseFloat(regiao.data.x.$numberDouble),
					y: parseFloat(regiao.data.y.$numberDouble),
				});
			} else {
				datasets[1].data.push({
					x: parseFloat(regiao.data.x.$numberDouble),
					y: parseFloat(regiao.data.y.$numberDouble),
					label: regiao.regiao,
				});
			}
		}
		this.chartData = {
			datasets: datasets,
		};
		this.chartOptions = {
			title: {
				display: true,
				text: "Scatterplot de risco",
			},
			legend: {
				display: false,
			},
			tooltips: {
				// intersect: true,
				custom: function(tooltip) {
					if (!tooltip) return;
					// disable displaying the color box;
					tooltip.displayColors = false;
				},
				callbacks: {
					// title: function(tooltipItems, data) {
					// 	console.log(tooltipItems, data);
					// 	return "";
					// },
					label: function(tooltipItem, data) {
						const label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].label 
						return label;
						// }
					},
				},
			},
			scales: {
				xAxes: [
					{
						type: "linear",
						position: "bottom",
						ticks: {
							max: 4,
						},
						scaleLabel: {
							display: true,
							labelString: "Vulnerabilidade",
						},
					},
				],
				yAxes: [
					{
						ticks: {
							max: 4,
						},
						scaleLabel: {
							display: true,
							labelString: "Ameaça",
						},
					},
				],
			},
			maintainAspectRatio: false,
		};
		this.loaded = true;
	},
	methods: {
		hip(x, k) {
			return k / x;
		},
	},
};
</script>
