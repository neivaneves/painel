<template>
	<v-container fluid>
		<v-row dense>
			<v-col :md="8" >
				<CardBandeiras />
			</v-col>
			<v-col :md="4" >
				<CardDistRisco />
			</v-col>
			<v-col :md="4" >
				<CardRecentesNiteroi />
			</v-col>
			<v-col :md="8" >
				<CardIsolamento />
			</v-col>
			<v-col :md="4" >
				<CardCasosObitos />
			</v-col>
			<v-col :md="8" >
				<CardMorbidadeMortalidade />
			</v-col>
			<v-col :md="4" >
				<CardInternacoes />
			</v-col>
			<v-col :md="4" >
				<CardDensidade />
			</v-col>
			<v-col :md="4" >
				<CardRenda />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CardDistRisco from "../components/CardDistRisco"
import CardBandeiras from "../components/CardBandeiras";
import CardIsolamento from "../components/CardIsolamento";
import CardRecentesNiteroi from "../components/CardRecentesNiteroi"
import CardCasosObitos from "../components/CardCasosObitos"
import CardMorbidadeMortalidade from "../components/CardMorbidadeMortalidade"
import CardDensidade from "../components/CardDensidade"
import CardRenda from "../components/CardRenda"
import CardInternacoes from "../components/CardInternacoes"

export default {
	name: "DashboardNiteroi",
	components: {
		CardBandeiras,
		CardIsolamento,
		CardRecentesNiteroi,
		CardCasosObitos,
		CardMorbidadeMortalidade,
		CardRenda,
		CardDensidade,
		CardInternacoes,
		CardDistRisco,
	},
};
</script>

<style scoped></style>
