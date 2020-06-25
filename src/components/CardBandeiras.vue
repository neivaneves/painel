<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
		<v-card>
			<v-card-text style="padding-bottom: 0px">
				Selecione a região no mapa:
			</v-card-text>
			<v-row dense no-gutters>
				<v-col :cols="12" :sm="4">
					<v-list v-if="loaded">
						<v-list two-line>
							<v-list-item v-for="i of rank.slice(0, 6)" :key="i.regiao">
								<v-list-item-content>
									<v-list-item-title v-text="i.regiao"></v-list-item-title>
									<v-list-item-subtitle
										>Risco:
										<v-chip small :color="getColor(i.risco)">{{
											parseFloat(i.risco).toFixed(2)
										}}</v-chip>
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-list>
				</v-col>
				<v-col :cols="12" :sm="8" dense>
					<MapBandeirasComponent v-if="loaded" :bairros="bairros" />
				</v-col>
			</v-row>
			<v-card-actions style="padding: 0px">
				<v-snackbar v-model="snackbar" :timeout="timeout">
					Você pode alterar todos os cards interagindo com o mapa.
					<template v-slot:action="{ attrs }">
						<v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
							Close
						</v-btn>
					</template>
				</v-snackbar>
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
						Phasellus accumsan mi nec ex sagittis, a congue odio commodo. Cras
						non congue enim, in vestibulum tortor. Fusce quis mattis mi, eget
						interdum nibh. Sed auctor tempus dolor.
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
import MapBandeirasComponent from "./MapBandeirasComponent";

export default {
	name: "CardBandeiras",
	data: () => ({
		loaded: false,
		snackbar: false,
		timeout: 5000,
		overlay: false,
		rank: [],
		bairros: null,
	}),
	components: {
		MapBandeirasComponent,
	},
	async mounted() {
		this.loaded = false;
		let geojsonBairros = require("../assets/Bairros_Niteroi");
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeDistRisc"
		);
		const dataRisco = await response.json();
		for (let feature of geojsonBairros.features) {
			for (let regiao of dataRisco) {
				if (feature.properties.nome === regiao.regiao) {
					feature.properties.style = {
						fillOpacity: 0.5,
						color: this.getColor(
							regiao.data.x.$numberDouble * regiao.data.y.$numberDouble
						),
						weight: 1,
					};
					feature.properties.risco =
						regiao.data.x.$numberDouble * regiao.data.y.$numberDouble;
				}
			}
		}
		let rank = [];
		for (let regiao of dataRisco) {
			rank.push({
				regiao: regiao.regiao,
				risco: regiao.data.x.$numberDouble * regiao.data.y.$numberDouble,
			});
		}
		rank.sort((a, b) => (parseFloat(a.risco) < parseFloat(b.risco) ? 1 : -1));
		this.rank = rank;
		this.bairros = geojsonBairros;
		this.loaded = true;
		this.snackbar = true;
	},
	methods: {
		getColor(d) {
			return d > 3
				? "#e31a1c"
				: d > 2
				? "#fd8d3c"
				: d > 1
				? "#fecc5c" //mais claro
				: "ffffb2";
		},
	},
	computed: {
		state() {
			return this.$store.state.regiao;
		},
	},
	watch: {
		state: function(a) {
			for (let feature of this.bairros.features) {
				if (feature.properties.nome === a) {
					feature.properties.style.weight = 5;
					feature.properties.style.fillOpacity = 0.7;
				} else {
					feature.properties.style.weight = 1;
					feature.properties.style.fillOpacity = 0.5;
				}
			}
		},
	},
};
</script>

<style scoped>
.row {
	padding: 5px;
	padding-bottom: 0px;
	padding-top: 10px;
	margin-bottom: 0px;
}
.v-list {
	padding-top: 0;
	padding-bottom: 0px;
}
</style>
