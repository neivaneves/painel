<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
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
                    :loading="quering"
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

export default {
	name: "CardCasosObitos",
	components: {
		ChartComponent,
	},
	data: () => ({
		loaded: false,
		overlay: false,
		quering: false,
		log: false,
		chartData: null,
		chartOptions: null,
		items: null,
		colors: ["#ba4a4f", "#56ae6c", "#a24f99", "#af953c", "#6971c9"],
		values: ["NITEROI"],
	}),
	async mounted() {
		this.loaded = false;
		const responseLabelsBairros = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeLabelsBairros"
		);
		const labelsBairros = await responseLabelsBairros.json();
		this.items = labelsBairros.labels;
		const queryData = this.values.join(",");
		const responseData = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=data&arg2=${queryData}`
		);
		const dataCasosObitos = await responseData.json();
		let datasets = [];
		let colorIndex = 0;
		for (let regiao of dataCasosObitos) {
			let dpCasosObitos = {
				data: [],
				backgroundColor: this.colors[colorIndex],
				borderColor: this.colors[colorIndex],
				label: regiao.regiao,
				pointRadius: 0,
				borderWidth: 2,
				pointHitRadius: 10,
				fill: false,
			};
			for (let dia of regiao.data) {
				let nI = parseInt(dia.casosAcumulado.$numberInt);
				dpCasosObitos.data.push({
					x: dia.dia,
					y: nI,
				});
			}
			datasets.push(dpCasosObitos);
			colorIndex++;
		}
		this.chartData = {
			datasets: datasets,
		};
		const escala = this.log ? "logarithmic" : "linear";
		this.chartOptions = {
			title: {
				display: true,
				text: "Casos e Óbitos acumulados",
			},
			scales: {
				xAxes: [
					{
						type: "time",
						time: {
							unit: "month",
						},
						ticks: {
							min: "2020-01-31",
							max: "2020-06-20",
						},
					},
				],
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
        log: function() {
            const escala = this.log ? "logarithmic" : "linear";
            this.chartOptions.scales.yAxes[0].type = escala;
        },
		values: async function(newVal) {
			this.quering = true;
			const queryData = newVal.join(",");
			const responseData = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=data&arg2=${queryData}`
			);
            const dataCasosObitos = await responseData.json();
			let datasets = [];
			let colorIndex = 0;
			for (let regiao of dataCasosObitos) {
				let dpCasosObitos = {
					data: [],
					backgroundColor: this.colors[colorIndex],
					borderColor: this.colors[colorIndex],
					label: regiao.regiao,
					pointRadius: 0,
					borderWidth: 2,
					pointHitRadius: 10,
					fill: false,
				};
				for (let dia of regiao.data) {
					let nI = parseInt(dia.casosAcumulado.$numberInt);
					dpCasosObitos.data.push({
						x: dia.dia,
						y: nI,
					});
				}
				datasets.push(dpCasosObitos);
				colorIndex++;
			}
			this.chartData = {
				datasets: datasets,
			};
			const escala = this.log ? "logarithmic" : "linear";
			this.chartOptions = {
				title: {
					display: true,
					text: "Casos e Óbitos acumulados",
				},
				scales: {
					xAxes: [
						{
							type: "time",
							time: {
								unit: "month",
							},
							ticks: {
								min: "2020-01-31",
								max: "2020-06-20",
							},
						},
					],
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
			this.quering = false;
		},
	},
};
</script>
