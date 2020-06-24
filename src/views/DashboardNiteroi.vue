<template>
	<v-container fluid>
		<v-row dense>
			<v-col>
				<CardBandeiras :sm="12" :md="12" :lg="12" />
			</v-col>
			<v-col>
				<CardRenda :sm="12" :md="12" :lg="12"/>
			</v-col>
			<v-col>
				<CardDensidade :sm="12" :md="12" :lg="12"/>
			</v-col>
			<v-col>
				<CardCasosObitos :sm="12" :md="12" :lg="12" />
			</v-col>
			<v-col>
				<CardMorbidadeMortalidade :sm="12" :md="12" :lg="12" />
			</v-col>
			<v-col>
				<CardIsolamento :sm="12" :md="12" :lg="12" />
			</v-col>
			<v-col>
				<CardRecentesNiteroi :sm="12" :md="12" :lg="12" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CardBandeiras from "../components/CardBandeiras";
import CardIsolamento from "../components/CardIsolamento";
import CardRecentesNiteroi from "../components/CardRecentesNiteroi"
import CardCasosObitos from "../components/CardCasosObitos"
import CardMorbidadeMortalidade from "../components/CardMorbidadeMortalidade"
import CardDensidade from "../components/CardDensidade"
import CardRenda from "../components/CardRenda"

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
	},
};
</script>

<style scoped></style>
