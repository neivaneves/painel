<template>
	<v-card>
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
		<v-row v-if="loaded">
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
		</v-row>
	</v-card>
</template>

<script>
export default {
	name: "CardPeriodo",
	data: () => ({
        multiple: true,
		dates: [],
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
			"https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalCasos",
			{
				referrerPolicy: "no-referrer-when-downgrade",
				body: null,
				method: "GET",
				credentials: "omit",
			}
		);
		const msData = await response.json();
		this.fetchData = msData;
		for (let i in this.fetchData.dias) {
			this.fetchData.dias[i]._id = this.fetchData.dias[i]._id + "/2020";
		}
		const [dayMin, monthMin, yearMin] = this.fetchData.dias[0]._id.split("/");
		this.min = `${yearMin}-${monthMin}-${dayMin}`;
		const maxIndex = this.fetchData.dias.length - 1;
		const [dayMax, monthMax, yearMax] = this.fetchData.dias[maxIndex]._id.split(
			"/"
		);
		this.max = `${yearMax}-${monthMax}-${dayMax}`;
		this.dates = [this.min, this.max];
		console.log(this.fetchData);
		console.log(this.dates.length);
		if (this.dates.length === 1) {
            this.multiple = false
			const findId = this.dates[0];
			const findIdParsed = this.parsedDate(findId);
			this.casosPeriodo = this.fetchData.dias.find(
				(x) => x._id == findIdParsed
			).casosNovos;
			this.obitosPeriodo = this.fetchData.dias.find(
				(x) => x._id == findIdParsed
			).obitosNovos;
		} else {
            this.multiple = true
			const datesOrdered = this.dates.sort((a, b) => a.localeCompare(b));
			this.dates = datesOrdered;
			const findIdI = this.dates[0];
			const findIdParsedI = this.parsedDate(findIdI);
			const casosI = this.fetchData.dias.find((x) => x._id == findIdParsedI)
				.casosAcumulado;
			const obitosI = this.fetchData.dias.find((x) => x._id == findIdParsedI)
				.obitosAcumulado;
			const findIdF = this.dates[1];
			const findIdParsedF = this.parsedDate(findIdF);
			const casosF = this.fetchData.dias.find((x) => x._id == findIdParsedF)
				.casosAcumulado;
			const obitosF = this.fetchData.dias.find((x) => x._id == findIdParsedF)
				.obitosAcumulado;
			this.casosPeriodo = casosF - casosI;
			this.obitosPeriodo = obitosF - obitosI;
		}
		this.loaded = true;
	},
	wach: {
		dates: function() {
			console.log(this.dates);
		},
	},
	computed: {
		dateRangeText() {
			return this.dates.join(" ~ ");
		},
	},
	methods: {
		save(dates) {
            this.menu = false
			console.log(dates);
			if (this.dates.length === 1 || dates[0] === dates[1]) {
                this.multiple = false
				const findId = this.dates[0];
				const findIdParsed = this.parsedDate(findId);
				this.casosPeriodo = this.fetchData.dias.find(
					(x) => x._id == findIdParsed
				).casosNovos;
				this.obitosPeriodo = this.fetchData.dias.find(
					(x) => x._id == findIdParsed
				).obitosNovos;
				// let today = this.dates[0]
				// let debug = parseISO(today)              //new Date().toISOString().substr(0, 7)
				// console.log(debug);
			} else {
                this.multiple = true
				const datesOrdered = this.dates.sort((a, b) => a.localeCompare(b));
				this.dates = datesOrdered;
				const findIdI = this.dates[0];
				const findIdParsedI = this.parsedDate(findIdI);
				const casosI = this.fetchData.dias.find((x) => x._id == findIdParsedI)
					.casosAcumulado;
				const casosINovos = this.fetchData.dias.find(
					(x) => x._id == findIdParsedI
				).casosNovos;
				const obitosI = this.fetchData.dias.find((x) => x._id == findIdParsedI)
					.obitosAcumulado;
				const obitosINovos = this.fetchData.dias.find(
					(x) => x._id == findIdParsedI
				).obitosNovos;
				const findIdF = this.dates[1];
				const findIdParsedF = this.parsedDate(findIdF);
				const casosF = this.fetchData.dias.find((x) => x._id == findIdParsedF)
					.casosAcumulado;
				const obitosF = this.fetchData.dias.find((x) => x._id == findIdParsedF)
					.obitosAcumulado;
				console.log(casosF, casosI);
				console.log(obitosF, obitosI);
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
.row {
	padding: 20px;
}
</style>
