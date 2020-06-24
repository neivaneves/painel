<template>
	<v-skeleton-loader
		:loading="!loaded"
		height="400"
		type="card-heading, card"
	>
		<v-card>
			<v-row dense no-gutters>
				<v-col :cols="12" :sm="4">
					<v-list v-if="loaded">
						<v-list two-line>
							<v-list-item v-for="i of rank.slice(0, 6)" :key="i.estado">
								<v-list-item-content>
									<v-list-item-title v-text="i.estado"></v-list-item-title>
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
					<MapBandeirasComponent :bairros="bairros" />
				</v-col>
			</v-row>
			<v-card-actions>
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
		overlay: false,
        rank: [],
        bairros: [],
        
	}),
	components: {
		MapBandeirasComponent,
	},
	async mounted() {
        this.loaded = false;
		const geojsonBairros = require("../assets/Bairros_Niteroi");
		this.bairros = geojsonBairros;
		this.loaded = true;
	},
	methods: {
		dynamicsort(property, order = "asc") {
			var sort_order = 1;
			if (order === "desc") {
				sort_order = -1;
			}
			return function(a, b) {
				// a should come before b in the sorted order
				if (parseFloat(a[property]) < parseFloat(b[property])) {
					return -1 * sort_order;
					// a should come after b in the sorted order
				} else if (parseFloat(a[property]) > parseFloat(b[property])) {
					return 1 * sort_order;
					// a and b are the same
				} else {
					return 0 * sort_order;
				}
			};
		},
		rankAll(rawData, data) {
			this.rank = [];
			for (let elt of rawData) {
				let obj = Object.keys(elt)[0];
				this.rank.push(
					elt[obj].find((obj) => {
						return obj.data == data;
					})
				);
			}
			this.rank.sort(this.dynamicsort("tempoParaDobrar"));
		},
	},
	watch: {
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
}
#dataFormatada {
	padding-left: 5px;
}
</style>
