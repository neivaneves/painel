<template>
	<v-card v-if="loaded">
		<v-card-text v-if="!janela">
			<div>Numero total de casos:</div>
			<p class="nC">
				{{ casosTotais }}
				<v-chip v-if="this.continuaIgual(casosNovos)">
					<v-avatar>
						<v-icon>remove_circle</v-icon>
					</v-avatar>
				</v-chip>
				<v-chip color="red lighten-1" v-else>
					<v-avatar left>
						<v-icon>arrow_circle_up</v-icon>
					</v-avatar>
					{{ casosNovos }}
				</v-chip>
			</p>
			<div>Numero total de óbitos:</div>
			<p class="nC">
				{{ obitosTotais }}
				<v-chip v-if="this.continuaIgual(obitosNovos)">
					<v-avatar>
						<v-icon>remove_circle</v-icon>
					</v-avatar>
				</v-chip>
				<v-chip color="red lighten-1" v-else>
					<v-avatar left>
						<v-icon>arrow_circle_up</v-icon>
					</v-avatar>
					{{ obitosNovos }}
				</v-chip>
			</p>
		</v-card-text>
		<v-card-text v-else>
			<div>Numero total de casos:</div>
			<p class="nC">
				{{ casosTotais }}
			</p>
			<div>Numero total de óbitos:</div>
			<p class="nC">
				{{ obitosTotais }}
			</p>
		</v-card-text>
		<v-row no-gutters>
			<v-btn
				style="left: 35%;"
				v-if="plot"
				v-show="loaded"
				color="green lighten-1"
				small
				absolute
				@click="plot = !plot"
			>
				casos novos
			</v-btn>
			<v-btn
				style="left: 35%;"
				v-if="!plot"
				v-show="loaded"
				color="red lighten-1"
				small
				absolute
				@click="plot = !plot"
			>
				obitos novos
			</v-btn>
		</v-row>
		<ChartComponent
			style="height: 257px;"
			v-if="loaded"
			:chartData="chartData"
			:chartOptions="chartOptions"
			:escala="menu"
		/>
		<v-card-actions>
			<v-autocomplete
				deletableChips
				v-model="value"
				:items="items"
				chips
				solo
				hide-details
				item-text="label"
			>
			</v-autocomplete>
			<v-menu
				ref="menu"
				v-model="menu"
				:close-on-content-click="false"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on }">
					<v-text-field
						v-model="dateRangeText"
						label="Período"
						prepend-icon="event"
						readonly
						v-on="on"
						hide-details
					></v-text-field>
				</template>
				<v-date-picker
					v-model="dates"
					range
					locale="brazil"
					:min="min"
					:max="max"
				>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
					<v-btn text color="primary" @click="save(dates)">OK</v-btn>
				</v-date-picker>
			</v-menu>
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
					lorem quam, eget vehicula elit tincidunt nec.
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
</template>

<script>
// import { mdiArrowUpDropCircle, mdiMinusCircle } from "@mdi/js";
import ChartComponent from "./ChartComponent";

export default {
	name: "CardRecentes",
	components: {
		ChartComponent,
	},
	data: () => ({
		loaded: false,
		items: null,
		janela: false,
		datasetCasos: [],
		datasetObitos: [],
		plot: false,
		fetchData: null,
		casosTotais: null,
		casosNovos: null,
		obitosTotais: null,
		obitosNovos: null,
		chartOptions: null,
		chartData: null,
		overlay: false,
		value: "Brasil",
		dates: [],
		menu: false,
		min: null,
		max: null,
	}),
	async created() {
		this.loaded = false;
		const todasAsRegioes = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/todasAsRegioes?arg1=regioes`
		);
		const dadosRegioes = await todasAsRegioes.json();
		this.items = dadosRegioes[0].ids;
		const request = this.textToUrl(this.value);
		const response = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/todasAsRegioes?arg1=${request}`
		);
		const dadosDaRegiao = await response.json();
		this.fetchData = dadosDaRegiao[0];
		let dataCasos = [];
		let dataObitos = [];
		let labels = [];
		for (let elt of dadosDaRegiao[0].data) {
			labels.push(elt.data);
			const dpCasos = {
				x: elt.data,
				y: elt.casosNovos,
			};
			const dpObitos = {
				x: elt.data,
				y: elt.obitosNovos,
			};
			dataCasos.push(dpCasos);
			dataObitos.push(dpObitos);
		}
		this.datasetCasos = [{
			data: dataCasos,
			backgroundColor: "indigo",
			borderColor: "indigo",
			label: "Novos Casos",
			pointRadius: 0,
			borderWidth: 2,
			pointHitRadius: 10,
			fill: false,
		}];
		this.datasetObitos = [{
			data: dataObitos,
			backgroundColor: "orange",
			borderColor: "orange",
			label: "Novos Óbitos",
			pointRadius: 0,
			pointHitRadius: 10,
			fill: false,
			borderWidth: 2,
		}];
		let dataMedia = [];
		let stream = [];
		for (let elt of this.datasetObitos[0].data) {
			stream.unshift(Number(elt.y));
			if (stream.length == 7) {
				const med = stream.reduce((a, b) => a + b) / stream.length;
				const dia = elt.x;
				dataMedia.push({
					x: dia,
					y: med.toFixed(),
				});
				stream.pop();
			}
		}
		this.datasetObitos.push({
			data: dataMedia,
			backgroundColor: "grey",
			borderColor: "grey",
			label: "Média móvel",
			pointRadius: 0,
			pointHitRadius: 10,
			fill: false,
			borderWidth: 2,
		});
		dataMedia = [];
		stream = [];
		for (let elt of this.datasetCasos[0].data) {
			stream.unshift(Number(elt.y));
			if (stream.length == 7) {
				const med = stream.reduce((a, b) => a + b) / stream.length;
				const dia = elt.x;
				dataMedia.push({
					x: dia,
					y: med.toFixed(),
				});
				stream.pop();
			}
		}
		this.datasetCasos.push({
			data: dataMedia,
			backgroundColor: "grey",
			borderColor: "grey",
			label: "Média móvel",
			pointRadius: 0,
			pointHitRadius: 10,
			fill: false,
			borderWidth: 2,
		});
		const ds = this.plot ? this.datasetCasos : this.datasetObitos;
		this.chartData = {
			labels: labels,
			datasets: ds,
		};
		const indexView = dadosDaRegiao[0].data.length - 1;
		this.casosNovos = dadosDaRegiao[0].data[indexView].casosNovos;
		this.obitosNovos = dadosDaRegiao[0].data[indexView].obitosNovos;
		this.casosTotais = dadosDaRegiao[0].data[indexView].casosAcumulado;
		this.obitosTotais = dadosDaRegiao[0].data[indexView].obitosAcumulado;
		this.dates.push(dadosDaRegiao[0].data[0].data);
		this.dates.push(dadosDaRegiao[0].data[indexView].data);
		this.min = this.dates[0];
		this.max = this.dates[1];
		this.chartOptions = {
			scales: {
				xAxes: [
					{
						type: "time",
						time: {
							unit: "day",
						},
						ticks: {
							min: this.min,
							max: this.max,
						},
					},
				],
			},
			legend: {
				labels: false,
			},
			maintainAspectRatio: false,
		};
		this.loaded = true;
	},
	methods: {
		continuaIgual(val) {
			if (!parseInt(val)) {
				return true;
			}
			return false;
		},
		textToUrl(regiao) {
			return regiao.replace(" ", "%20");
		},
		save(dates) {
			if (this.dates.length == 1 || dates[0] === dates[1]) {
				this.janela = false;
				const indexCasosF = this.fetchData.data.findIndex(
					(a) => a.data == dates[0]
				);
				const casosFNovos = this.fetchData.data[indexCasosF].casosNovos;
				const casosF = this.fetchData.data[indexCasosF].casosAcumulado;
				const obitosFNovos = this.fetchData.data[indexCasosF].obitosNovos;
				const obitosF = this.fetchData.data[indexCasosF].obitosAcumulado;
				this.casosTotais = casosF;
				this.obitosTotais = obitosF;
				this.casosNovos = casosFNovos;
				this.obitosNovos = obitosFNovos;
				this.chartOptions.scales.xAxes[0].ticks.min = this.min;
				this.chartOptions.scales.xAxes[0].ticks.max = this.max;
			} else {
				this.janela = true;
				const indexCasosI = this.fetchData.data.findIndex(
					(a) => a.data == dates[0]
				);
				const casosINovos = this.fetchData.data[indexCasosI].casosNovos;
				const casosI = this.fetchData.data[indexCasosI].casosAcumulado;
				const obitosINovos = this.fetchData.data[indexCasosI].obitosNovos;
				const obitosI = this.fetchData.data[indexCasosI].obitosAcumulado;
				const indexCasosF = this.fetchData.data.findIndex(
					(a) => a.data == dates[1]
				);
				// const casosFNovos = this.fetchData.data[indexCasosF].casosNovos;
				const casosF = this.fetchData.data[indexCasosF].casosAcumulado;
				// const obitosFNovos = this.fetchData.data[indexCasosF].obitosNovos;
				const obitosF = this.fetchData.data[indexCasosF].obitosAcumulado;
				this.casosTotais =
					parseInt(casosF) - parseInt(casosI) + parseInt(casosINovos);
				this.obitosTotais =
					parseInt(obitosF) - parseInt(obitosI) + parseInt(obitosINovos);
				// this.casosNovos = parseInt(casosFNovos);
				// this.obitosNovos = parseInt(obitosFNovos);
				this.chartOptions.scales.xAxes[0].ticks.min = dates[0];
				this.chartOptions.scales.xAxes[0].ticks.max = dates[1];
			}
			this.menu = false;
		},
		parsedDate(date) {
			if (!date) return null;
			const [day, month] = date.split("-").reverse();
			return `${day}/${month}`;
		},
	},
	watch: {
		value: async function() {
			const request = this.textToUrl(this.value);
			const response = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/todasAsRegioes?arg1=${request}`
			);
			const dadosDaRegiao = await response.json();
			this.fetchData = dadosDaRegiao[0];
			const dataCasos = [];
			const dataObitos = [];
			for (let elt of dadosDaRegiao[0].data) {
				const dpCasos = {
					x: elt.data,
					y: elt.casosNovos,
				};
				const dpObitos = {
					x: elt.data,
					y: elt.obitosNovos,
				};
				dataCasos.push(dpCasos);
				dataObitos.push(dpObitos);
			}
			this.datasetCasos = [
				{
					data: dataCasos,
					backgroundColor: "indigo",
					borderColor: "indigo",
					label: "Novos Casos",
					pointRadius: 0,
					borderWidth: 2,
					pointHitRadius: 15,
					fill: false,
				},
			];
			this.datasetObitos = [
				{
					data: dataObitos,
					backgroundColor: "orange",
					borderColor: "orange",
					label: "Novos Óbitos",
					pointRadius: 0,
					pointHitRadius: 15,
					fill: false,
					borderWidth: 2,
				},
			];
			let dataMedia = [];
			let stream = [];
			for (let elt of this.datasetObitos[0].data) {
				stream.unshift(Number(elt.y));
				if (stream.length == 7) {
					const med = stream.reduce((a, b) => a + b) / stream.length;
					const dia = elt.x;
					dataMedia.push({
						x: dia,
						y: med.toFixed(),
					});
					stream.pop();
				}
			}
			this.datasetObitos.push({
				data: dataMedia,
				backgroundColor: "grey",
				borderColor: "grey",
				label: "Média móvel",
				pointRadius: 0,
				pointHitRadius: 10,
				fill: false,
				borderWidth: 2,
			});
			dataMedia = [];
			stream = [];
			for (let elt of this.datasetCasos[0].data) {
				stream.unshift(Number(elt.y));
				if (stream.length == 7) {
					const med = stream.reduce((a, b) => a + b) / stream.length;
					const dia = elt.x;
					dataMedia.push({
						x: dia,
						y: med.toFixed(),
					});
					stream.pop();
				}
			}
			this.datasetCasos.push({
				data: dataMedia,
				backgroundColor: "grey",
				borderColor: "grey",
				label: "Média móvel",
				pointRadius: 0,
				pointHitRadius: 10,
				fill: false,
				borderWidth: 2,
			});
			const ds = this.plot ? this.datasetCasos : this.datasetObitos;
			this.chartData.datasets = ds;
			const indexView = dadosDaRegiao[0].data.length - 1;
			this.casosNovos = dadosDaRegiao[0].data[indexView].casosNovos;
			this.obitosNovos = dadosDaRegiao[0].data[indexView].obitosNovos;
			this.casosTotais = dadosDaRegiao[0].data[indexView].casosAcumulado;
			this.obitosTotais = dadosDaRegiao[0].data[indexView].obitosAcumulado;
		},
		plot: function() {
			const ds = this.plot ? this.datasetCasos : this.datasetObitos;
			this.chartData.datasets = ds;
		},
	},
	computed: {
		dateRangeText() {
			const a = [];
			a.push(this.parsedDate(this.dates[0]));
			a.push(this.parsedDate(this.dates[1]));
			return a.join(" a ");
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
