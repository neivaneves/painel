<template>
	<v-container fluid>
		<v-row dense>
			<v-col :cols="12" :md="8" >
				<CardBandeiras />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardDistRisco />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardRecentesNiteroi />
			</v-col>
			<v-col :cols="12" :md="8" >
				<CardIsolamento />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardMorbidadeMortalidade />
			</v-col>
			<v-col :cols="12" :md="8" >
				<CardTempoParaDobrarNiteroi />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardCasosNiteroi />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardObitosNiteroi />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardInternacoes />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardRenda />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardDensidade />
			</v-col>
			<v-col :cols="12" :md="4" >
				<CardPopIdosa />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CardDistRisco from "../components/CardDistRisco"
import CardBandeiras from "../components/CardBandeiras";
import CardIsolamento from "../components/CardIsolamento";
import CardRecentesNiteroi from "../components/CardRecentesNiteroi"
import CardCasosNiteroi from "../components/CardCasosNiteroi"
import CardObitosNiteroi from "../components/CardObitosNiteroi"
import CardMorbidadeMortalidade from "../components/CardMorbidadeMortalidade"
import CardDensidade from "../components/CardDensidade"
import CardRenda from "../components/CardRenda"
import CardInternacoes from "../components/CardInternacoes"
import CardTempoParaDobrarNiteroi from "../components/CardTempoParaDobrarNiteroi"
import CardPopIdosa from "../components/CardPopIdosa"

export default {
	name: "DashboardNiteroi",
	components: {
		CardBandeiras,
		CardIsolamento,
		CardRecentesNiteroi,
		CardCasosNiteroi,
		CardTempoParaDobrarNiteroi,
		CardObitosNiteroi,
		CardMorbidadeMortalidade,
		CardRenda,
		CardPopIdosa,
		CardDensidade,
		CardInternacoes,
		CardDistRisco,
	},
};
</script>

<style scoped></style>
