<template>
	<v-container fluid>
		<v-row dense>
			<v-col :sm="cards.cardChart.flex" :xs="cards.cardChart.flexxs">
				<CardChart />
			</v-col>
			<v-col :sm="cards.cardPeriodo.flex" :xs="cards.cardPeriodo.flexxs">
				<CardPeriodo />
			</v-col>
		</v-row>
		<v-row dense>
			<v-col :sm="cards.cardCrescimento.flex" :xs="cards.cardCrescimento.flex">
				<CardCrescimento />
			</v-col>
			<v-col :sm="cards.cardCrescimento.flex" :xs="cards.cardCrescimento.flex"> 
				<CardInfectados />
			</v-col>
		</v-row>
		<v-row dense>
			<v-col :sm="12" :xs="12">
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
	data: () => ({
		cards: {
			cardChart: {
				flex: 6,
				flexxs: 12,
			},
			cardPeriodo: {
				flex: 6,
				vlexxs: 12,
			},
			cardCrescimento: {
				flex: 6,
				vlexxs: 12,
			},
		},
	}),
};
</script>
