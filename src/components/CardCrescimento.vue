<template>
	<v-card :max-height="400">
		<ChartComponent
			v-if="loaded"
			:chartData="chartData"
			:chartOptions="chartOptions"
		></ChartComponent>
	</v-card>
</template>

<script>
import ChartComponent from "./ChartComponent";

export default {
	name: "CardCrescimento",
	components: {
		ChartComponent,
	},
	data: () => ({
		loaded: false,
		chartData: null,
		chartOptions: null,
	}),
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/estados"
		);
		const data = await response.json();
		const parsed = [
			{
				borderColor: "#d8bc00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "São Paulo",
				yAxisID: "log",
			},
			{
				borderColor: "#000000",
				data: [],
				borderDash: [5, 15],
				pointRadius: 0,
				pointHitRadius: 0,
				fill: false,
				label: "hideMe",
			},
			{
				borderColor: "#000000",
				data: [],
				borderDash: [5, 15],
				pointRadius: 0,
				pointHitRadius: 0,
				fill: false,
				label: "hideMe",
			},
		];
		const datas = [];
		let indexDoisDias = 1;
		let indexOitoDias = 1;
		const minCasos = 5;
		for (let elt of data) {
			if (elt.estado == "SP") {
				let casosLogDois = 2 ** indexDoisDias;
				let casosLogOito = 2 ** indexOitoDias;
				if (elt.casosAcumulado >= minCasos) {
					parsed[0].data.push(elt.casosAcumulado);
					const [day, month] = elt.data.split("-").reverse();
					const parsedDate = `${day}/${month}`;
					datas.push(parsedDate);
					parsed[1].data.push(casosLogDois);
					parsed[2].data.push(casosLogOito);
				}
				indexDoisDias += 0.5;
				indexOitoDias += 0.125;
			}
        }
        const max = Math.floor(Number(parsed[0].data[86]) * 2);
        // console.log(max)
		this.chartData = {
			labels: datas,
			datasets: parsed,
		};
		this.chartOptions = {
			scales: {
				yAxes: [
					{
						id: "log",
						type: "logarithmic",
						ticks: {
							max: max,
						},
					},
				],
			},
			maintainAspectRatio: false,
			legend: {
				labels: {
					filter: function(item) {
						return !item.text.includes("hideMe");
					},
				},
			},
		};
		this.loaded = true;
	},
};
</script>

