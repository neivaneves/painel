<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
		<v-card>
			<ChartComponent
				style="height: 445px;"
				v-if="loaded"
				:chartData="chartData"
				:chartOptions="chartOptions"
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
				v-if="selectEnfUti"
				v-show="loaded"
				color="green lighten-1"
				absolute
                :disabled="quering"
                style="left: 40%; bottom: 80%; width: 120px"
				small
				@click="selectEnfUti = !selectEnfUti"
			>
				Enfermaria
			</v-btn>
			<v-btn
				v-if="!selectEnfUti"
				v-show="loaded"
				color="red lighten-1"
				absolute
                :disabled="quering"
                style="left: 40%; bottom: 80%; width: 120px"
				small
				@click="selectEnfUti = !selectEnfUti"
			>
				UTI
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
	name: "CardInternacoes",
	components: {
		ChartComponent,
	},
	data: () => ({
		loaded: false,
		overlay: false,
		quering: false,
		selectEnfUti: true,
		chartData: null,
		chartOptions: null,
		items: null,
		leitos: [],
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
		const dataHosp = await responseData.json();
		const responseLeitos = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=props&arg2=${queryData}`
		);
		const dataLeitos = await responseLeitos.json();
		let datasets = [];
		for (let regiao of dataLeitos) {
			let dpRegEnf = {
				data: [],
				backgroundColor: "white",
				borderColor: "white",
				label: regiao.regiao + " LEITOS SUS",
				pointRadius: 0,
				borderWidth: 2,
				pointHitRadius: 10,
				fill: false,
			};
			let dpRegUti = {
				data: [],
				backgroundColor: "white",
				borderColor: "white",
				label: regiao.regiao + " LEITOS SUS",
				pointRadius: 0,
				borderWidth: 2,
				pointHitRadius: 10,
				fill: false,
			};
			for (let dia of regiao.props.leitosEnfermaria) {
				let dpEnf = {
					x: dia.pDia,
					y: dia.leitosSUS.$numberInt,
				};
				dpRegEnf.data.push(dpEnf);
			}
			this.leitos.push(dpRegEnf);
			for (let dia of regiao.props.leitosUTI) {
				let ouLeitos = 15;
				if (dia.leitosSUSCOVID != undefined) {
					ouLeitos = dia.leitosSUSCOVID.$numberInt;
				} else if (dia.leitosSUS != undefined) {
					ouLeitos = Math.floor(parseInt(dia.leitosSUS.$numberInt / 2));
				}
				let dpUti = {
					x: dia.pDia,
					y: ouLeitos,
				};
				dpRegUti.data.push(dpUti);
			}
			this.leitos.push(dpRegUti);
		}
		let colorIndex = 0;
		if (this.selectEnfUti === true) {
			//enfermaria
			datasets.push(this.leitos[0]);
			for (let regiao of dataHosp) {
				let dpHosp = {
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
					let nI = parseInt(dia.totalEnfermaria.$numberInt);
					dpHosp.data.push({
						x: dia.dia,
						y: nI,
					});
				}
				datasets.push(dpHosp);
				colorIndex++;
			}
			this.chartData = {
				datasets: datasets,
			};
		} else {
			datasets.push(this.leitos[1]);
			for (let regiao of dataHosp) {
				let dpHosp = {
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
					let nI = parseInt(dia.totalUTI.$numberInt);
					dpHosp.data.push({
						x: dia.dia,
						y: nI,
					});
				}
				datasets.push(dpHosp);
				colorIndex++;
			}
			this.chartData = {
				datasets: datasets,
			};
		}
		this.chartOptions = {
			title: {
				display: true,
				text: "Hospitalizações",
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
			},
			maintainAspectRatio: false,
		};
		this.loaded = true;
	},
	watch: {
		selectEnfUti: async function() {
			this.quering = true;
            this.leitos = [];
            const queryData = this.values.join(",");
			const responseLeitos = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=props&arg2=${queryData}`
			);
			const dataLeitos = await responseLeitos.json();
			for (let regiao of dataLeitos) {
				let dpRegEnf = {
					data: [],
					backgroundColor: "white",
					borderColor: "white",
					label: regiao.regiao + " LEITOS SUS",
					pointRadius: 0,
					borderWidth: 2,
					pointHitRadius: 10,
					fill: false,
				};
				let dpRegUti = {
					data: [],
					backgroundColor: "white",
					borderColor: "white",
					label: regiao.regiao + " LEITOS SUS",
					pointRadius: 0,
					borderWidth: 2,
					pointHitRadius: 10,
					fill: false,
				};
				for (let dia of regiao.props.leitosEnfermaria) {
					let dpEnf = {
						x: dia.pDia,
						y: dia.leitosSUS.$numberInt,
					};
					dpRegEnf.data.push(dpEnf);
				}
				this.leitos.push(dpRegEnf);
				for (let dia of regiao.props.leitosUTI) {
					let ouLeitos = 15;
					if (dia.leitosSUSCOVID != undefined) {
						ouLeitos = dia.leitosSUSCOVID.$numberInt;
					} else if (dia.leitosSUS != undefined) {
						ouLeitos = Math.floor(parseInt(dia.leitosSUS.$numberInt / 2));
					}
					let dpUti = {
						x: dia.pDia,
						y: ouLeitos,
					};
					dpRegUti.data.push(dpUti);
				}
				this.leitos.push(dpRegUti);
			}
			const responseData = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=data&arg2=${queryData}`
			);
			const dataHosp = await responseData.json();
			let datasets = [];
			let colorIndex = 0;
			if (this.selectEnfUti === true) {
				//enfermaria
				datasets.push(this.leitos[0]);
				for (let regiao of dataHosp) {
					let dpHosp = {
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
						let nI = parseInt(dia.totalEnfermaria.$numberInt);
						dpHosp.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpHosp);
					colorIndex++;
				}
				this.chartData = {
					datasets: datasets,
				};
			} else {
				datasets.push(this.leitos[1]);
				for (let regiao of dataHosp) {
					let dpHosp = {
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
						let nI = parseInt(dia.totalUTI.$numberInt);
						dpHosp.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpHosp);
					colorIndex++;
				}
				this.chartData = {
					datasets: datasets,
				};
			}
			this.quering = false;
		},
		values: async function() {
			this.quering = true;
			const queryData = this.values.join(",");
			const responseData = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=data&arg2=${queryData}`
			);
			const dataHosp = await responseData.json();
			let datasets = [];
			let colorIndex = 0;
			if (this.selectEnfUti === true) {
				//enfermaria
				datasets.push(this.leitos[0]);
				for (let regiao of dataHosp) {
					let dpHosp = {
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
						let nI = parseInt(dia.totalEnfermaria.$numberInt);
						dpHosp.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpHosp);
					colorIndex++;
				}
				this.chartData = {
					datasets: datasets,
				};
			} else {
				datasets.push(this.leitos[1]);
				for (let regiao of dataHosp) {
					let dpHosp = {
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
						let nI = parseInt(dia.totalUTI.$numberInt);
						dpHosp.data.push({
							x: dia.dia,
							y: nI,
						});
					}
					datasets.push(dpHosp);
					colorIndex++;
				}
				this.chartData = {
					datasets: datasets,
				};
			}
			this.quering = false;
		},
	},
};
</script>
