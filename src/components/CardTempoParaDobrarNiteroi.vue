<template>
	<v-skeleton-loader :loading="!loaded" height="400" type="card-heading, card">
		<v-card>
			<v-row dense no-gutters>
				<v-col :cols="12" :sm="4">
					<v-list>
						<v-list two-line>
							<v-list-item v-for="i of rank.slice(0, 6)" :key="i.regiao">
								<v-list-item-content>
									<v-list-item-title v-text="i.regiao"></v-list-item-title>
									<v-list-item-subtitle
										>Dias para dobrar:
										<v-chip small>{{
											parseFloat(i.tempoParaDobrar).toFixed()
										}}</v-chip>
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-list>
				</v-col>
				<v-col :cols="12" :sm="8" dense>
					<MapTpdNiteroi :bairrosTpd="bairrosTpd" :legendaTpd="legendaTpd" :mutation="mutation" />
				</v-col>
			</v-row>
			<v-card-actions v-if="loaded">
				<v-slider
					v-model="dataLeitura"
					:min="0"
					:max="dataMaxIndex"
					label="Data:"
					dense
					hide-details
				/>
				<p id="dataFormatada">{{ formatDate(parsedDataLeitura) }}</p>
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
import MapTpdNiteroi from "../components/MapTpdNiteroi";

export default {
	name: "CardTempoDobrarNiteroi",
	data: () => ({
		loaded: false,
		overlay: false,
		bairrosTpd: null,
		datas: [],
		rank: [],
		legendaTpd: {
			titulo: "Tempo para dobrar:",
			tiers: [
				{ tier: "6 dias", cor: "#bd0026" },
				{ tier: "16 dias", cor: "#fc4e2a" },
				{ tier: "36 dias", cor: "#fed976" },
				{ tier: "+56 dias", cor: "#ffffcc" },
			],
		},
		dataMaxIndex: null,
        dataLeitura: null,
        mutation: false,
		parsedDataLeitura: null,
		allDataRaw: null,
	}),
	components: {
		MapTpdNiteroi,
	},
	async mounted() {
		this.loaded = false;
		let geojsonBairros = require("../assets/Bairros_Niteroi_tpd");
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/fakeNiteroi?arg1=data&arg2=a"
		);
        this.allDataRaw = await response.json();
		this.bairrosTpd = geojsonBairros;
		for (let regiao of this.allDataRaw) {
            regiao.data.splice(0, 60)
			if (regiao.regiao === "NITEROI") {
				for (let dia of regiao.data) {
					this.datas.push(dia.dia);
				}
			}
		}
		this.parsedDataLeitura = this.datas[this.datas.length - 1];
		this.dataMaxIndex = this.datas.length;
		this.dataLeitura = this.datas.length;
		for (let feature of this.bairrosTpd.features) {
			for (let regiao of this.allDataRaw) {
				if (feature.properties.nome === regiao.regiao) {
					let tpd = null;
					if (
						regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberDouble !=
						undefined
					) {
						tpd =
							regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberDouble;
					} else if (
						regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberInt !=
						undefined
					) {
						tpd =
							regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberInt;
					} else {
						tpd = 0;
					}
					feature.properties.style = {
						fillOpacity: 0.5,
						fillColor: this.getColor(tpd),
						color: "white",
						weight: 1,
						dashArray: "3",
					};
					feature.properties.tempoParaDobrar = tpd;
				}
			}
		}
		let rank = [];
		for (let regiao of this.allDataRaw) {
			let tpd = null;
			if (
				regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberDouble !=
				undefined
			) {
				tpd = regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberDouble;
			} else if (
				regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberInt !=
				undefined
			) {
				tpd = regiao.data[regiao.data.length - 1].tempoParaDobrar.$numberInt;
			} else {
				tpd = 0;
			}
			if (tpd > 0) {
				rank.push({
					regiao: regiao.regiao,
					tempoParaDobrar: tpd,
				});
			}
		}
		rank.sort((a, b) =>
			parseFloat(a.tempoParaDobrar) > parseFloat(b.tempoParaDobrar) ? 1 : -1
		);
		this.rank = rank;
		this.loaded = true;
	},
	methods: {
		formatDate(date) {
			const [day, month] = date.split("-").reverse();
			return `${day}/${month}`;
		},
		getColor(a) {
            const d = parseFloat(a)
            return d > 56
				? "#ffffcc"
				: d > 46
				? "#ffeda0"
				: d > 36
				? "#fed976" //mais claro
				: d > 28
				? "#feb24c"
				: d > 24
				? "#fd8d3c"
				: d > 16
				? "#fc4e2a"
				: d > 10
				? "#e31a1c"
				: d > 6
				? "#bd0026"
				: d > 0
				? "#800026" //mais vermelho
				: "#ffffcc"; //sem dados
		},
		rankAll(dataSlider) {
			let rank = [];
			let primeiroFor = true;
			for (let feature of this.bairrosTpd.features) {
                const indexDia = this.allDataRaw[0].data.findIndex((x) => x.dia === dataSlider);
				for (let regiao of this.allDataRaw) {
                    let tpd = null;
					if (primeiroFor) {
						if (
							regiao.data[indexDia].tempoParaDobrar.$numberDouble != undefined
						) {
							tpd = regiao.data[indexDia].tempoParaDobrar.$numberDouble;
						} else if (
							regiao.data[indexDia].tempoParaDobrar.$numberInt != undefined
						) {
							tpd = regiao.data[indexDia].tempoParaDobrar.$numberInt;
						} else {
							tpd = 0;
						}
						if (tpd > 0) {
							rank.push({
								regiao: regiao.regiao,
								tempoParaDobrar: tpd,
							});
                        }
					}
					if (feature.properties.nome === regiao.regiao) {
						if (
							regiao.data[indexDia].tempoParaDobrar.$numberDouble != undefined
						) {
							tpd = regiao.data[indexDia].tempoParaDobrar.$numberDouble;
						} else if (
							regiao.data[indexDia].tempoParaDobrar.$numberInt != undefined
						) {
							tpd = regiao.data[indexDia].tempoParaDobrar.$numberInt;
						} else {
							tpd = 0;
						}
						feature.properties.style = {
							fillOpacity: 0.5,
							fillColor: this.getColor(tpd),
							color: "white",
							weight: 1,
							dashArray: "3",
						};
						feature.properties.tempoParaDobrar = tpd;
					}
                }
                primeiroFor = false;
			}
			rank.sort((a, b) =>
				parseFloat(a.tempoParaDobrar) > parseFloat(b.tempoParaDobrar) ? 1 : -1
			);
            this.rank = rank;
            this.mutation = !this.mutation
		},
	},
	watch: {
		dataLeitura: function(val) {
			this.parsedDataLeitura = this.datas[
				Math.min(
					Math.floor((val / this.dataMaxIndex) * this.dataMaxIndex),
					this.dataMaxIndex - 1
				)
			];
			this.rankAll(this.parsedDataLeitura);
		},
	},
};
</script>

<style scoped>
.row {
	padding: 5px;
	padding-top: 10px;
	margin-bottom: 4px;
}
.v-card {
	padding-bottom: 5px;
}
.v-list {
	padding-top: 0;
}
#dataFormatada {
	padding-left: 5px;
}
</style>
