<template>
	<v-card>
		<ChartComponent
			style="height: 445px;"
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
				solo
				hide-details
				return-object
				item-text="label"
			>
			</v-autocomplete>
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
		</v-card-actions>
		<v-overlay :absolute="true" :opacity="0.9" :value="overlay">
			<p style="margin: 30px;" class="text-justify">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies
				lorem quam, eget vehicula elit tincidunt nec. Proin auctor ac enim sed
				lobortis. Donec sed accumsan risus, sed placerat ex. Phasellus accumsan
				mi nec ex sagittis, a congue odio commodo. Cras non congue enim, in
				vestibulum tortor. Fusce quis mattis mi, eget interdum nibh. Sed auctor
				tempus dolor.
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
</template>

<script>
import ChartComponent from "./ChartComponent";
import Vue from "vue";

export default {
	name: "CardChart",
	components: {
		ChartComponent,
	},
	props: ["addTodos"],
	data: () => ({
		loaded: false,
		overlay: false,
		items: null,
		values: [],
		chartData: {
			labels: 1,
			datasets: 1,
		},
		chartOptions: null,
	}),
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalRegiaoUf",
			{
				referrerPolicy: "no-referrer-when-downgrade",
				body: null,
				method: "GET",
				credentials: "omit",
			}
		);
		const estados = await response.json();
		this.items = [
			{
				borderColor: "#d8bc00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "São Paulo",
			},
			{
				borderColor: "#ac4dd4",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Rio de Janeiro",
			},
			{
				borderColor: "#00b340",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Espírito Santo",
			},
			{
				borderColor: "#e1016d",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Minas Gerais",
			},
			{
				borderColor: "#98d845",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Ceará",
			},
			{
				borderColor: "#5b40a4",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Pernambuco",
			},
			{
				borderColor: "#dbc749",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Maranhão",
			},
			{
				borderColor: "ac8e5e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Bahia",
			},
			{
				borderColor: "#0163b3",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Paraíba",
			},
			{
				borderColor: "#ffaa4c",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Alagoas",
			},
			{
				borderColor: "#b69dff",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Sergipe",
			},
			{
				borderColor: "#008934",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Rio Grande do Norte",
			},
			{
				borderColor: "#ff62a4",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Piauí",
			},
			{
				borderColor: "#01ae8b",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Amazonas",
			},
			{
				borderColor: "#ba2e00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Pará",
			},
			{
				borderColor: "#007e6b",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Amapá",
			},
			{
				borderColor: "#961d74",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Rondônia",
			},
			{
				borderColor: "#bbd05e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Acre",
			},
			{
				borderColor: "#9d203a",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Roraima",
			},
			{
				borderColor: "ff8e77",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Tocantins",
			},
			{
				borderColor: "#9bd49e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Santa Catarina",
			},
			{
				borderColor: "#ff738e",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Rio Grande do Sul",
			},
			{
				borderColor: "#3e5b10",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Paraná",
			},
			{
				borderColor: "#ffa8e1",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Distrito Federal",
			},
			{
				borderColor: "#9b8c00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Goiânia",
			},
			{
				borderColor: "#ab6575",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Mato Grosso",
			},
			{
				borderColor: "#bc5f00",
				data: [],
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 3,
				fill: false,
				label: "Mato Grosso do Sul",
			},
		];
		// this.items[0].data.push("a")
		// console.log(estados)
		// console.log(this.items)
		let index = 0;
		for (let i in estados) {
			if (i != "labelsDias" && i != "labelsSemanas" && i != "geral") {
				for (let j in estados[i]) {
					for (let k in estados[i][j].dias) {
						this.items[index].data.push(
							estados[i][j].dias[k]["casosAcumulado"]
						);
					}
					index++;
				}
			}
		}
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
		this.items.unshift(dataPointBrasil);
		for (let elt of this.items) {
			for (let comp of this.addTodos) {
				if (elt.label === comp.label) {
					this.values.push(elt);
				}
			}
		}
		Vue.set(this.chartData, "labels", estados.labelsDias);
		Vue.set(this.chartData, "datasets", this.values);
		this.chartOptions = {
			title: {
				display: true,
				text: "Casos acumulados",
			},
			maintainAspectRatio: false,
		};
		this.loaded = true;
		// console.log(this.items);
		// console.log(this.values);
		// console.log(this.chartData);
	},
	// async updated() {
	// 	this.$nextTick(function() {
	// 		this.chartData.datasets = this.values;
	// 	});
	// },
	watch: {
		values: function(val) {
			Vue.set(this.chartData, "datasets", val);
			// console.log(this.chartData)
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
