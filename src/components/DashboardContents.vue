<template>
	<v-container fluid>
		<v-row dense>
			<v-col :sm="6" :md="8" :lg="4">
				<CardChart />
			</v-col>
			<v-col :sm="6" :md="4" :lg="3">
				<v-row dense no-gutters>
					<v-col :cols="12">
						<CardPeriodo />
					</v-col>
				</v-row>
				<v-row dense>
					<v-col :cols="12" class="mgT">
						<CardRecentes />
					</v-col>
				</v-row>
			</v-col>
			<v-col :sm="6" :lg="5">
				<CardCrescimento />
			</v-col>
			<v-col :sm="6" :lg="4">
				<CardInfectados />
			</v-col>
			<v-col :lg="8">
				<CardTempoDobrar />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CardChart from "./CardChart";
import CardPeriodo from "./CardPeriodo";
import CardCrescimento from "./CardCrescimento";
import CardTempoDobrar from "./CardTempoDobrar";
import CardInfectados from "./CardInfectados";
import CardRecentes from "./CardRecentes";

export default {
	name: "DashboardContents",
	components: {
		CardChart,
		CardPeriodo,
		CardCrescimento,
		CardTempoDobrar,
		CardInfectados,
		CardRecentes,
	},
	// data: () => ({
	// 	cards: {
	// 		cardChart: {
	// 			flex: 6,
	// 			flexxs: 12,
	// 		},
	// 		cardPeriodo: {
	// 			flex: 6,
	// 			vlexxs: 12,
	// 		},
	// 		cardCrescimento: {
	// 			flex: 6,
	// 			vlexxs: 12,
	// 		},
	// 	},
	// }),
};
</script>

<style scoped>
.mgT {
	padding-top: 5px;
	padding-bottom: 0;
}
</style>