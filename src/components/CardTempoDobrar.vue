<template>
	<v-skeleton-loader
		:loading="!loaded"
		height="400"
		type="card-heading, card"
	>
		<v-card>
			<v-row dense no-gutters>
				<v-col :cols="12" :sm="4">
					<v-list>
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
					<MapComponent :estados="rank" />
				</v-col>
			</v-row>
			<v-card-actions>
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
import MapComponent from "./MapComponent";

export default {
	name: "CardTempoDobrar",
	data: () => ({
		loaded: false,
		overlay: false,
		rank: [],
		datas: [],
		dataMaxIndex: null,
		dataLeitura: null,
		parsedDataLeitura: "",
		allDataRaw: null,
	}),
	components: {
		MapComponent,
	},
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/tempoDobrar"
		);
		const data = await response.json();
		this.allDataRaw = data;
		this.datas = data[19].SP.map((x) => x.data);
		this.dataMaxIndex = this.datas.length;
		this.dataLeitura = this.datas.length;
		// console.log(this.datas);
		for (let elt of data) {
			let obj = Object.keys(elt)[0];
			this.rank.push(
				elt[obj].find((obj) => {
					return obj.data == this.datas[this.datas.length - 1];
				})
			);
		}
		this.rank.sort(this.dynamicsort("tempoParaDobrar"));
		this.loaded = true;
	},
	methods: {
		formatDate(date) {
			const [day, month] = date.split("-").reverse();
			return `${day}/${month}`;
		},
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
		dataLeitura: function(val) {
			this.parsedDataLeitura = this.datas[
				Math.min(
					Math.floor((val / this.dataMaxIndex) * this.dataMaxIndex),
					this.dataMaxIndex - 1
				)
			];
			this.rankAll(this.allDataRaw, this.parsedDataLeitura);
			this.rank = this.rank.filter(function(element) {
				return element !== undefined;
			});
			this.rank = this.rank.filter(function(obj) {
				return obj.tempoParaDobrar !== "0.00";
			});
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
