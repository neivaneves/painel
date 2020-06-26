<template>
	<v-skeleton-loader :loading="!loaded" height="500" type="card-heading, card">
		<v-card>
			<BarChart
				v-if="loaded"
				style="height: 445px;"
				:chartData="dadosDensidade"
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
					label="Região"
					hide-details
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
						ultricies lorem quam, eget vehicula elit tincidunt nec. Proin auctor
						ac enim sed lobortis. Donec sed accumsan risus, sed placerat ex.
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
import BarChart from "./BarChart";

export default {
	data: () => ({
		loaded: false,
		dadosDensidade: null,
		chartOptions: null,
		quering: false,
		overlay: false,
		value: "NITEROI",
		items: null,
	}),
	components: {
		BarChart,
	},
	async mounted() {
		this.loaded = false;
		const responseLabelsBairros = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeLabelsBairros`
		);
		const labelsBairros = await responseLabelsBairros.json();
		this.items = labelsBairros.labels;
		const response = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=props&arg2=a`
		);
		const responseProps = await response.json();
		let top = [];
		for (let regiao of responseProps) {
			top.push({
				regiao: regiao.regiao,
				densidade: parseFloat(
					regiao.props.pessoasPorDomicilio.$numberDouble
				).toFixed(2),
			});
		}
		top.sort((a, b) =>
			parseFloat(a.densidade) > parseFloat(b.densidade) ? 1 : -1
		);
		top.splice(0, 48);
		let iValue = top.findIndex((x) => x.regiao === this.value);
		if (iValue === -1) {
			top.splice(0, 1);
			let dV = null;
			for (let regiao of responseProps) {
				if (regiao.regiao === this.value) {
					dV = parseFloat(
						regiao.props.pessoasPorDomicilio.$numberDouble
					).toFixed(2);
					break;
				}
			}
			top.unshift({
				regiao: this.value,
				densidade: dV,
			});
		}
		let labels = [];
		let data = [];
		let cores = [];
		for (let elt of top) {
			labels.push(elt.regiao);
			data.push(elt.densidade);
			if (elt.regiao === this.value) {
				cores.push("#ba4a4f");
			} else {
				cores.push("grey");
			}
		}
		this.chartOptions = {
			maintainAspectRatio: false,
			legend: {
				labels: false,
			},
			title: {
				display: true,
				text: "Pessoas por domicílio",
			},
		};
		this.dadosDensidade = {
			labels: labels,
			datasets: [
				{
					label: "Pessoas por domicílio",
					data: data,
					backgroundColor: cores,
					borderColor: cores,
				},
			],
		};
		this.loaded = true;
	},
	computed: {
		state() {
			return this.$store.state.regiao;
		},
	},
	watch: {
		state: function(a) {
			this.value = a;
		},
		value: async function() {
			this.quering = true;
			const response = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=props&arg2=a`
			);
			const responseProps = await response.json();
			let top = [];
			for (let regiao of responseProps) {
				top.push({
					regiao: regiao.regiao,
					densidade: parseFloat(
						regiao.props.pessoasPorDomicilio.$numberDouble
					).toFixed(2),
				});
			}
			top.sort((a, b) =>
				parseFloat(a.densidade) > parseFloat(b.densidade) ? 1 : -1
			);
			top.splice(0, 48);
			let iValue = top.findIndex((x) => x.regiao === this.value);
			if (iValue === -1) {
				top.splice(0, 1);
				let dV = null;
				for (let regiao of responseProps) {
					if (regiao.regiao === this.value) {
						dV = parseFloat(
							regiao.props.pessoasPorDomicilio.$numberDouble
						).toFixed(2);
						break;
					}
				}
				top.unshift({
					regiao: this.value,
					densidade: dV,
				});
			}
			let labels = [];
			let data = [];
			let cores = [];
			for (let elt of top) {
				labels.push(elt.regiao);
				data.push(elt.densidade);
				if (elt.regiao === this.value) {
					cores.push("#ba4a4f");
				} else {
					cores.push("grey");
				}
			}
			this.chartOptions = {
				maintainAspectRatio: false,
				legend: {
					labels: false,
				},
				title: {
					display: true,
					text: "Pessoas por domicílio",
				},
			};
			this.dadosDensidade = {
				labels: labels,
				datasets: [
					{
						label: "Pessoas por domicílio",
						data: data,
						backgroundColor: cores,
						borderColor: cores,
					},
				],
			};
			this.quering = false;
		},
	},
};
</script>
