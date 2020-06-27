<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
		<v-card>
			<v-card-text style="padding-bottom: 0px;">
				<v-row no-gutters>
					<v-col>
						<div
							@click="changeDataset(colors, 0)"
						>
							Incidência:
							<p class="nC">
								{{ coef.incidencia }}
								<span class="sub">/100000</span>
							</p>
						</div>
						<div
							@click="changeDataset(colors, 1)"
						>
							Prevalência:
							<p class="nC">
								{{ coef.prevalencia }}
								<span class="sub">/100000</span>
							</p>
						</div>
					</v-col>
					<v-spacer></v-spacer>
					<v-col>
						<div
							@click="changeDataset(colors, 3)"
						>
							Mortalidade:
							<p class="nC"> {{ coef.mortalidade }} 
								<span class="sub">/1000</span>								
							</p>
						</div>
						<div
							@click="changeDataset(colors, 2)"
						>
							Letalidade:
							<p class="nC">
								{{ coef.letalidade }}%
							</p>
						</div>
					</v-col>
				</v-row>
			</v-card-text>
			<ChartComponent
				style="height: 267px;"
				v-if="loaded"
				:chartData="chartData"
				:chartOptions="chartOptions"
			/>
			<v-card-actions>
				<v-autocomplete
					:loading="quering"
					v-model="value"
					:items="items"
					chips
					solo
					hide-details
					item-text="label"
				>
				</v-autocomplete>
				<v-autocomplete
					:loading="quering"
					v-model="valueDs"
					:items="itemsDs"
					chips
					solo
					hide-details
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
				<v-overlay :absolute="true" :opacity="0.9" :value="overlay">
					<p style="margin: 30px;" class="text-justify">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
						ultricies lorem quam, eget vehicula elit tincidunt nec.
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
			</v-card-actions>
		</v-card>
	</v-skeleton-loader>
</template>

<script>
import ChartComponent from "./ChartComponent";

export default {
	name: "CardMorbidadeMortalidade",
	components: {
		ChartComponent,
	},
	data: () => ({
		loaded: false,
		colors: ["#ba4a4f", "grey", "grey", "grey"],
		value: "NITEROI",
		items: null,
		itemsDs: ["INCIDÊNCIA", "PREVALÊNCIA", "MORTALIDADE", "LETALIDADE"],
		valueDs: "INCIDÊNCIA",
		fetchData: null,
		quering: false,
		overlay: false,
		coef: {
			incidencia: 0,
			prevalencia: 0,
			mortalidade: 0,
			letalidade: 0,
		},
	}),
	async mounted() {
		this.loaded = false;
		const responseLabelsBairros = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeLabelsBairros`
		);
		const labelsBairros = await responseLabelsBairros.json();
		this.items = labelsBairros.labels;
		const response = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=coeficientes&arg2=${this.value}`
		);
		this.fetchData = await response.json();
		let datasets = [];
		this.coef = {
			incidencia: parseInt(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].incidencia.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].incidencia.$numberInt
			),
			prevalencia: parseInt(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].prevalencia.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].prevalencia.$numberInt
			),
			letalidade: parseFloat(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].letalidade.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].letalidade.$numberInt
			).toFixed(2),
			mortalidade: parseFloat(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].mortalidade.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].mortalidade.$numberInt
			).toFixed(2),
		};
		for (let regiao of this.fetchData) {
			let dpCoeficientes = {
				data: [],
				backgroundColor: "#ba4a4f",
				borderColor: "#ba4a4f",
				label: regiao.regiao,
				pointRadius: 0,
				borderWidth: 2,
				pointHitRadius: 10,
				fill: false,
			};
			for (let dia of regiao.coeficientes) {
				let nI = parseInt(
					dia.incidencia.$numberDouble || dia.incidencia.$numberInt
				);
				dpCoeficientes.data.push({
					x: dia.dia,
					y: nI,
				});
			}
			datasets.push(dpCoeficientes);
		}
		this.chartData = {
			datasets: datasets,
		};
		this.chartOptions = {
			scales: {
				xAxes: [
					{
						type: "time",
						time: {
							unit: "month",
						},
						scaleLabel: {
							display: true,
							labelString: "Data",
						},
					},
				],
				yAxes: [
					{
						scaleLabel: {
							display: true,
							labelString: "Incidência",
						},
					}
				],
			},
			maintainAspectRatio: false,
		};
		this.loaded = true;
	},
	computed: {
		state() {
			return this.$store.state.regiao
		},
	},
    watch: {
		state: function(a) {
			this.value = a
		},
		valueDs: function (val) {
			switch (val) {
				case "INCIDÊNCIA":
					this.changeDataset(this.colors, 0)
					break
				case "PREVALÊNCIA":
					this.changeDataset(this.colors, 1)
					break
				case "MORTALIDADE":
					this.changeDataset(this.colors, 3)
					break
				case "LETALIDADE":
					this.changeDataset(this.colors, 2)
					break
			}
		},
        value: async function () {
        this.quering = true;
            const response = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=coeficientes&arg2=${this.value}`
		);
		this.fetchData = await response.json();
		let datasets = [];
		this.coef = {
			incidencia: parseInt(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].incidencia.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].incidencia.$numberInt
			),
			prevalencia: parseInt(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].prevalencia.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].prevalencia.$numberInt
			),
			letalidade: parseFloat(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].letalidade.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].letalidade.$numberInt
			).toFixed(2),
			mortalidade: parseFloat(
				this.fetchData[0].coeficientes[
					this.fetchData[0].coeficientes.length - 1
				].mortalidade.$numberDouble ||
					this.fetchData[0].coeficientes[
						this.fetchData[0].coeficientes.length - 1
					].mortalidade.$numberInt
			).toFixed(2),
        };
        const bIndex = this.colors.findIndex((x) => x === "#ba4a4f");
        if (bIndex === 0) {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.incidencia.$numberDouble || dia.incidencia.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Incidência"
			} else if (bIndex === 1) {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.prevalencia.$numberDouble || dia.prevalencia.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Prevalência"
			} else if (bIndex === 2) {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.letalidade.$numberDouble || dia.letalidade.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Letalidade"
			} else {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.mortalidade.$numberDouble || dia.mortalidade.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Mortalidade"
			}
        this.quering = false;
        }
    },
	methods: {
		changeDataset(colors, bIndex) {
			this.loaded = false;
			const rIndex = colors.findIndex((x) => x === "#ba4a4f");
			this.colors[rIndex] = "grey";
			this.colors[bIndex] = "#ba4a4f";
			let datasets = [];
			if (bIndex === 0) {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.incidencia.$numberDouble || dia.incidencia.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Incidência"
			} else if (bIndex === 1) {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.prevalencia.$numberDouble || dia.prevalencia.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Prevalênca"
			} else if (bIndex === 2) {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.letalidade.$numberDouble || dia.letalidade.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Letalidade"
			} else {
				for (let regiao of this.fetchData) {
					let dpCoeficientes = {
						data: [],
						backgroundColor: "#ba4a4f",
						borderColor: "#ba4a4f",
						label: regiao.regiao,
						pointRadius: 0,
						borderWidth: 2,
						pointHitRadius: 10,
						fill: false,
					};
					for (let dia of regiao.coeficientes) {
						let nI = parseFloat(
							dia.mortalidade.$numberDouble || dia.mortalidade.$numberInt
						).toFixed(2);
						dpCoeficientes.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpCoeficientes);
				}
				this.chartData = {
					datasets: datasets,
				};
				this.chartOptions.scales.yAxes[0].scaleLabel.labelString = "Mortalidade"
			}
			this.loaded = true;
		},
	},
};
</script>

<style scoped>
.nC {
	color: white;
	font-size: 2.125rem !important;
	font-weight: 400;
	line-height: 2.5rem;
	letter-spacing: 0.0073529412em !important;
	font-family: "Roboto", sans-serif !important;
}
.sub {
	color: grey;
	font-size: 0.6rem !important;
}

.v-text-field {
	padding-top: 0;
}
.v-application--is-ltr .v-input__prepend-outer {
	margin-right: 7px;
	margin-left: 7px;
}
</style>
