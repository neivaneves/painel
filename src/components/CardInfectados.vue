<template>
	<v-card>
		<ChartComponent
			height="445"
			v-if="loaded"
			:chartData="chartData"
			:chartOptions="chartOptions"
		></ChartComponent>
		<v-card-actions>
			<v-autocomplete
				deletableChips
				v-model="values"
				:items="items"
				chips
				multiple
				readonly
				solo
				hide-details
				return-object
				item-text="label"
			>
			</v-autocomplete>
		</v-card-actions>
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
		values: {
			label: "Brasil",
		},
		items: {
			label: "Brasil",
		},
		chartData: null,
		chartOptions: null,
	}),
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/brasilInfectados"
		);
		const data = await response.json();
		let datas = [];
		const parsed = [
			{
				borderColor: "#bc5941",
				backgroundColor: "#bc5941",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				fill: 1,
				label: "Casos acumulados",
			},
			{
				borderColor: "#965ea7",
				backgroundColor: "#965ea7",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				fill: 2,
				borderWidth: 0,
				label: "Óbitos",
			},
			{
				borderColor: "#88a752",
				backgroundColor: "#88a752",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 0,
				fill: true,
				label: "Casos recuperados",
			},
			{
				borderColor: "#bc5941",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				borderWidth: 0,
				hoverRadius: 0,
				pointHitRadius: 30,
				fill: false,
				label: "hideMe",
			},
		];
		for (let elt of data) {
			const [day, month] = elt.data.split("-").reverse();
			const parsedDate = `${day}/${month}`;
			datas.push(parsedDate);
			parsed[0].data.push(elt.casosAcumulado);
			const sum =
				parseInt(elt.obitosAcumulado) + parseInt(elt.recuperadosAcumulado);
			const dif = parseInt(elt.casosAcumulado) - sum;
			const hDif = Math.floor(dif / 2);
			const offsetDif = sum + hDif;
			parsed[1].data.push(sum);
			parsed[2].data.push(elt.recuperadosAcumulado);
			parsed[3].data.push(offsetDif);
		}
		this.chartData = {
			labels: datas,
			datasets: parsed,
		};
		this.chartOptions = {
			maintainAspectRatio: false,
			tooltips: {
				mode: "nearest",
				axis: "x",
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
						const ativos =
							data.datasets[0].data[tooltipItem.index] -
							data.datasets[1].data[tooltipItem.index];
						// if (tooltipItem.datasetIndex === 3) {
						return ativos + " casos ativos";
						// }
					},
				},
			},
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
