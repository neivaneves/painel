<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
		<v-card>
			<v-card-text>
				<v-row>
					<v-col>
						<v-btn
							style="width: 240px; margin: 10px; margin-bottom: 0px"
							x-large
							v-show="loaded"
							v-bind:color="colors[0]"
							top
							right
							@click="changeDataset(colors, 0)"
						>
							Incidência:
							<span class="nC">
								{{ coef.incidencia }}
							</span>
						</v-btn>
						<v-btn
							style="width: 240px; margin: 10px; margin-bottom: 0px"
							x-large
							v-show="loaded"
							v-bind:color="colors[1]"
							top
							right
							@click="changeDataset(colors, 1)"
						>
							Prevalência:
							<span class="nC">
								{{ coef.prevalencia }}
							</span>
						</v-btn>
					</v-col>
					<v-spacer></v-spacer>
					<v-col>
						<v-btn
							style="width: 240px; margin: 10px; margin-bottom: 0px"
							x-large
							v-show="loaded"
							v-bind:color="colors[2]"
							top
							right
							@click="changeDataset(colors, 2)"
						>
							Mortalidade:
							<span class="nC"> {{ coef.mortalidade }} </span>
						</v-btn>
						<v-btn
							style="width: 240px; margin: 10px; margin-bottom: 0px"
							x-large
							v-show="loaded"
							v-bind:color="colors[3]"
							top
							right
							@click="changeDataset(colors, 3)"
						>
							Letalidade:
							<span class="nC">
								{{ coef.letalidade }}%
							</span>
						</v-btn>
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
					deletableChips
					v-model="value"
					:items="items"
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
					},
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
.v-text-field {
	padding-top: 0;
}
.v-application--is-ltr .v-input__prepend-outer {
	margin-right: 7px;
	margin-left: 7px;
}
</style>
