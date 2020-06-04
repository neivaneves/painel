<template>
	<v-container fluid>
		<v-row dense>
			<v-col :sm="6" :md="8" :lg="4">
				<CardChart />
			</v-col>
			<v-col :sm="6" :md="4" :lg="3">
				<CardPeriodo />
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

export default {
	name: "DashboardContents",
	components: {
		CardChart,
		CardPeriodo,
		CardCrescimento,
		CardTempoDobrar,
		CardInfectados,
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
