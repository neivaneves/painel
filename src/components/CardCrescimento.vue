<template>
	<v-skeleton-loader
		:loading="!loaded"
		height="400"
		type="card-heading, card"
	>
		<v-card>
			<ChartComponent
				style="height: 445px;"
				v-if="loaded"
				:chartData="chartData"
				:chartOptions="chartOptions"
				:escala="log"
			></ChartComponent>
			<v-card-actions>
				<v-autocomplete
					deletableChips
					v-model="values"
					:items="items"
					chips
					multiple
					solo
					hide-details
					return-object
					item-text="label"
				>
				</v-autocomplete>
			</v-card-actions>
			<v-btn
				v-if="log"
				v-show="loaded"
				color="green lighten-1"
				absolute
				top
				left
				small
				@click="log = !log"
			>
				log
			</v-btn>
			<v-btn
				v-if="!log"
				v-show="loaded"
				color="red lighten-1"
				absolute
				top
				left
				small
				@click="log = !log"
			>
				linear
			</v-btn>
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
import ChartComponent from "./ChartComponent";
import Vue from "vue";
// import Vue from "vue";

export default {
	name: "CardCrescimento",
	components: {
		ChartComponent,
	},
	props: ["addTodos"],
	data: () => ({
		loaded: false,
		log: false,
		overlay: false,
		chartData: null,
		chartOptions: null,
		items: [],
		values: [],
	}),
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/estados"
		);
		const data = await response.json();
		// const parsed = [
		// 	{
		// 		borderColor: "#d8bc00",
		// 		data: [],
		// 		lineTension: 0,
		// 		pointRadius: 0,
		// 		pointHitRadius: 3,
		// sigla: "SP",
		// 		fill: false,
		// 		label: "São Paulo",
		// 		yAxisID: "log",
		// 	},
		// {
		// 	borderColor: "#000000",
		// 	data: [],
		// 	borderDash: [5, 15],
		// 	pointRadius: 0,
		// 	pointHitRadius: 0,
		// 	fill: false,
		// 	label: "hideMe",
		// },
		// {
		// 	borderColor: "#000000",
		// 	data: [],
		// 	borderDash: [5, 15],
		// 	pointRadius: 0,
		// 	pointHitRadius: 0,
		// 	fill: false,
		// 	label: "hideMe",
		// },
		// ];
		let template = [
			{
				borderColor: "#d8bc00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "SP",
				fill: false,
				label: "São Paulo",
			},
			{
				borderColor: "#ac4dd4",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "RJ",
				fill: false,
				label: "Rio de Janeiro",
			},
			{
				borderColor: "#00b340",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "ES",
				fill: false,
				label: "Espírito Santo",
			},
			{
				borderColor: "#e1016d",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "MG",
				fill: false,
				label: "Minas Gerais",
			},
			{
				borderColor: "#98d845",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "CE",
				fill: false,
				label: "Ceará",
			},
			{
				borderColor: "#5b40a4",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "PE",
				fill: false,
				label: "Pernambuco",
			},
			{
				borderColor: "#dbc749",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "MA",
				fill: false,
				label: "Maranhão",
			},
			{
				borderColor: "ac8e5e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "BA",
				fill: false,
				label: "Bahia",
			},
			{
				borderColor: "#0163b3",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "PB",
				fill: false,
				label: "Paraíba",
			},
			{
				borderColor: "#ffaa4c",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "AL",
				fill: false,
				label: "Alagoas",
			},
			{
				borderColor: "#b69dff",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "SE",
				fill: false,
				label: "Sergipe",
			},
			{
				borderColor: "#008934",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "RN",
				fill: false,
				label: "Rio Grande do Norte",
			},
			{
				borderColor: "#ff62a4",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "PI",
				fill: false,
				label: "Piauí",
			},
			{
				borderColor: "#01ae8b",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "AM",
				fill: false,
				label: "Amazonas",
			},
			{
				borderColor: "#ba2e00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "PA",
				fill: false,
				label: "Pará",
			},
			{
				borderColor: "#007e6b",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "AP",
				fill: false,
				label: "Amapá",
			},
			{
				borderColor: "#961d74",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "RO",
				fill: false,
				label: "Rondônia",
			},
			{
				borderColor: "#bbd05e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "AC",
				fill: false,
				label: "Acre",
			},
			{
				borderColor: "#9d203a",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "RR",
				fill: false,
				label: "Roraima",
			},
			{
				borderColor: "ff8e77",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "TO",
				fill: false,
				label: "Tocantins",
			},
			{
				borderColor: "#9bd49e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "SC",
				fill: false,
				label: "Santa Catarina",
			},
			{
				borderColor: "#ff738e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "RS",
				fill: false,
				label: "Rio Grande do Sul",
			},
			{
				borderColor: "#3e5b10",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "PR",
				fill: false,
				label: "Paraná",
			},
			{
				borderColor: "#ffa8e1",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "DF",
				fill: false,
				label: "Distrito Federal",
			},
			{
				borderColor: "#9b8c00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "GO",
				fill: false,
				label: "Goiás",
			},
			{
				borderColor: "#ab6575",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "MT",
				fill: false,
				label: "Mato Grosso",
			},
			{
				borderColor: "#bc5f00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				sigla: "MS",
				fill: false,
				label: "Mato Grosso do Sul",
			},
		];
		const datas = [];
		const responseBrasil = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/brasil"
		);
		const totalBrasil = await responseBrasil.json();
		const dataPointBrasil = {
			borderColor: "#CCCCCC",
			data: [],
			lineTension: 0,
			pointRadius: 0,
			pointHitRadius: 3,
			fill: false,
			label: "Brasil",
		};
		for (let elt of totalBrasil) {
			dataPointBrasil.data.push(elt.casosAcumulado);
		}
		// let indexDoisDias = 1;
		// let indexOitoDias = 1;
		// const minCasos = 5;
		for (let elt of data) {
			if (elt.estado === "SP") {
				const [day, month] = elt.data.split("-").reverse();
				const parsedDate = `${day}/${month}`;
				datas.push(parsedDate);
			}
		}
		for (let elt of data) {
			for (let chartDataItems of template) {
				if (elt.estado === chartDataItems.sigla) {
					const templateIndex = template.findIndex(
						(x) => x.sigla == elt.estado
					);
					template[templateIndex].data.push(elt.casosAcumulado);
				}
			}
		}
		template.unshift(dataPointBrasil);
		for (let elt of template) {
			while (elt.data.length < template[1].data.length) {
				elt.data.splice(0, 0, "");
			}
		}
		this.items = template;
		this.values.push(this.items[0]);
		// Vue.set(this.chartData, "labels", datas);
		// Vue.set(this.chartData, "datasets", this.values);
		// console.log(max)
		this.chartData = {
			labels: datas,
			datasets: this.values,
		};
		const escala = this.log ? "logarithmic" : "linear";
		this.chartOptions = {
			title: {
				display: true,
				text: "Casos acumulados",
			},
			scales: {
				yAxes: [
					{
						id: "log",
						type: escala,
						// afterTickToLabelConversion: function(axis) {
						// 	axis.ticks[0] = "";
						// const [tick, exp] = axis.ticks[0].split("e");
						// const roundTick = parseInt(tick);
						// const parsedTick = `${roundTick}e${exp}`;
						// axis.ticks[0] = parsedTick;
						// },
						// ticks: {
						// 	max: max,
						// },
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
	watch: {
		values: function() {
			this.chartData.datasets = this.values;
		},
		log: function() {
			const escala = this.log ? "logarithmic" : "linear";
			Vue.set(this.chartOptions.scales.yAxes[0], "type", escala);
		},
		addTodos: function() {
			let newDataset = [];
			for (let elt of this.items) {
				for (let comp of this.addTodos) {
					if (elt.label === comp.label) {
						newDataset.push(elt);
					}
				}
			}
			this.values = newDataset;
		},
		deep: true,
	},
};
</script>
