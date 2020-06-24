<template>
	<v-skeleton-loader
		:loading="!loaded"
		height="500"
		type="card-heading, card"
	>
		<v-card>
			<BarChart
				v-if="loaded"
				style="height: 445px;"
				:chartData="dadosObitosDia"
				:chartOptions="chartOptions"
			/>
			<v-card-actions>
				<v-autocomplete
					deletableChips
					v-model="values"
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
		dadosObitosDia: null,
		chartOptions: null,
		overlay: false,
		values: "Brasil",
		items: [
			"Brasil",
			"Acre",
			"Alagoas",
			"Amapá",
			"Amazonas",
			"Bahia",
			"Ceará",
			"Distrito Federal",
			"Espírito Santo",
			"Goiás",
			"Maranhão",
			"Mato Grosso",
			"Mato Grosso do Sul",
			"Minas Gerais",
			"Pará",
			"Paraíba",
			"Paraná",
			"Pernambuco",
			"Piauí",
			"Rio de Janeiro",
			"Rio Grande do Norte",
			"Rio Grande do Sul",
			"Rondônia",
			"Roraima",
			"Santa Catarina",
			"São Paulo",
			"Sergipe",
			"Tocantins",
		],
	}),
	components: {
		BarChart,
	},
	async mounted() {
		this.loaded = false;
		const request = this.values;
		const apiResponse = await fetch(
			`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/comparacaoMortes?arg1=${request}`
		);
		const rankingObitos = await apiResponse.json();
		let top = rankingObitos[0].data;
		top.sort((a, b) =>
			parseInt(a.mortesPorDia) > parseInt(b.mortesPorDia) ? 1 : -1
		);
		top.pop();
		top.splice(0, 5);
		let labels = [];
		let data = [];
		let cores = [];
		for (let elt of top) {
			const lineBr = elt.causa.split(" ");
			labels.push(lineBr);
			data.push(elt.mortesPorDia);
			if (elt.causa === "COVID-19") {
				cores.push("coral");
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
				text: "Óbitos por dia",
			},
		};
		this.dadosObitosDia = {
			labels: labels,
			datasets: [
				{
					label: "Óbitos por dia",
					data: data,
					backgroundColor: cores,
					borderColor: cores,
				},
			],
		};
		this.loaded = true;
	},
	watch: {
		values: async function(request) {
			const apiResponse = await fetch(
				`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/comparacaoMortes?arg1=${request}`
			);
			const rankingObitos = await apiResponse.json();
			let top = rankingObitos[0].data;
			top.sort((a, b) =>
				parseInt(a.mortesPorDia) > parseInt(b.mortesPorDia) ? 1 : -1
			);
			top.pop();
			top.splice(0, 5);
			let labels = [];
			let data = [];
			let cores = [];
			for (let elt of top) {
				labels.push(elt.causa);
				data.push(elt.mortesPorDia);
				if (elt.causa === "COVID-19") {
					cores.push("coral");
				} else {
					cores.push("grey");
				}
			}
			this.chartOptions = {
				maintainAspectRatio: false,
			};
			this.dadosObitosDia = {
				labels: labels,
				datasets: [
					{
						label: "Óbitos por dia",
						data: data,
						backgroundColor: cores,
						borderColor: cores,
					},
				],
			};
		},
	},
};
</script>
