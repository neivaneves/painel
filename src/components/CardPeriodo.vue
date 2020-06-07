<template>
	<v-card v-if="loaded">
		<v-card-text>
			<div v-if="multiple">Casos novos no período:</div>
			<div v-else>Novos casos no dia:</div>
			<p class="display-1 text--primary">
				{{ casosPeriodo }}
			</p>
			<div v-if="multiple">Óbitos novos no período:</div>
			<div v-else>Novos óbitos no dia:</div>
			<p class="display-1 text--primary">
				{{ obitosPeriodo }}
			</p>
		</v-card-text>
		<v-card-actions>
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
export default {
	name: "CardPeriodo",
	data: () => ({
		multiple: true,
		dates: [],
		overlay: false,
		menu: false,
		casosPeriodo: null,
		obitosPeriodo: null,
		loaded: false,
		min: "",
		max: "",
		fetchData: null,
	}),
	async mounted() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/brasil"
		);
		const msData = await response.json();
		this.fetchData = msData;
		console.log(this.fetchData)
		const maxIndex = this.fetchData.length - 1;
		this.dates = [this.min, this.max];
		// console.log(this.fetchData);
		// console.log(this.dates.length);
		if (this.dates.length === 1) {
			this.multiple = false;
			const findId = this.dates[0];
			const findIdParsed = this.parsedDate(findId);
			this.casosPeriodo = this.fetchData.find(
				(x) => x._id == findIdParsed
			).casosNovos;
			this.obitosPeriodo = this.fetchData.find(
				(x) => x._id == findIdParsed
			).obitosNovos;
		} else {
			this.multiple = true;
			const datesOrdered = this.dates.sort((a, b) => a.localeCompare(b));
			this.dates = datesOrdered;
			const findIdI = this.dates[0];
			const findIdParsedI = this.parsedDate(findIdI);
			const casosI = this.fetchData.find((x) => x._id == findIdParsedI)
				.casosAcumulado;
			const obitosI = this.fetchData.find((x) => x._id == findIdParsedI)
				.obitosAcumulado;
			const findIdF = this.dates[1];
			const findIdParsedF = this.parsedDate(findIdF);
			const casosF = this.fetchData.find((x) => x._id == findIdParsedF)
				.casosAcumulado;
			const obitosF = this.fetchData.find((x) => x._id == findIdParsedF)
				.obitosAcumulado;
			this.casosPeriodo = casosF - casosI;
			this.obitosPeriodo = obitosF - obitosI;
		}
		this.loaded = true;
	},
	// wach: {
	// 	dates: function() {
	// 		console.log(this.dates);
	// 	},
	// },
	computed: {
		dateRangeText() {
			return this.dates.join(" ~ ");
		},
	},
	methods: {
		save(dates) {
			this.menu = false;
			// console.log(dates);
			if (this.dates.length === 1 || dates[0] === dates[1]) {
				this.multiple = false;
				const findId = this.dates[0];
				const findIdParsed = this.parsedDate(findId);
				this.casosPeriodo = this.fetchData.find(
					(x) => x._id == findIdParsed
				).casosNovos;
				this.obitosPeriodo = this.fetchData.find(
					(x) => x._id == findIdParsed
				).obitosNovos;
				// let today = this.dates[0]
				// let debug = parseISO(today)              //new Date().toISOString().substr(0, 7)
				// console.log(debug);
			} else {
				this.multiple = true;
				const datesOrdered = this.dates.sort((a, b) => a.localeCompare(b));
				this.dates = datesOrdered;
				const findIdI = this.dates[0];
				const findIdParsedI = this.parsedDate(findIdI);
				const casosI = this.fetchData.find((x) => x._id == findIdParsedI)
					.casosAcumulado;
				const casosINovos = this.fetchData.find(
					(x) => x._id == findIdParsedI
				).casosNovos;
				const obitosI = this.fetchData.find((x) => x._id == findIdParsedI)
					.obitosAcumulado;
				const obitosINovos = this.fetchData.find(
					(x) => x._id == findIdParsedI
				).obitosNovos;
				const findIdF = this.dates[1];
				const findIdParsedF = this.parsedDate(findIdF);
				const casosF = this.fetchData.find((x) => x._id == findIdParsedF)
					.casosAcumulado;
				const obitosF = this.fetchData.find((x) => x._id == findIdParsedF)
					.obitosAcumulado;
				// console.log(casosF, casosI);
				// console.log(obitosF, obitosI);
				this.casosPeriodo = casosF - casosI + casosINovos;
				this.obitosPeriodo = obitosF - obitosI + obitosINovos;
			}
		},
		parsedDate(date) {
			if (!date) return null;

			const [year, month, day] = date.split("-");
			return `${day}/${month}/${year}`;
		},
	},
};
</script>

<style scoped>
/* .row {
	padding: 20px;
} */
</style>
