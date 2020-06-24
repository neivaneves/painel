<template>
	<v-container fluid>
		<v-row dense>
			<v-col :sm="6" :md="8" :lg="4">
				<CardRecentes />
			</v-col>
			<v-col :sm="6" :md="4" :lg="4">
				<!-- <v-row dense no-gutters>
					<v-col :cols="12">
						<CardPeriodo />
					</v-col>
				</v-row>
				<v-row dense no-gutters>
					<v-col :cols="12" class="mgT">
					<v-col :cols="12"> -->
						<CardObitos :addTodos="addTodos" />
					<!-- </v-col>
				</v-row> -->
			</v-col>
			<v-col :sm="6" :lg="4">
				<CardCrescimento :addTodos="addTodos" />
			</v-col>
			<v-col :sm="6" :lg="4">
				<CardInfectados />
			</v-col>
			<v-col :sm="12" :lg="8">
				<CardTempoDobrar />
			</v-col>
			<v-col :sm="12" :lg="4">
				<CardCompObitos />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import CardObitos from "../components/CardObitos";
// import CardPeriodo from "../components/CardPeriodo";
import CardCrescimento from "../components/CardCrescimento";
import CardTempoDobrar from "../components/CardTempoDobrar";
import CardInfectados from "../components/CardInfectados";
import CardRecentes from "../components/CardRecentes";
import CardCompObitos from "../components/CardCompObitos"

export default {
	name: "DashboardContents",
	components: {
		CardObitos,
		// CardPeriodo,
		CardCompObitos,
		CardCrescimento,
		CardTempoDobrar,
		CardInfectados,
		CardRecentes,
	},
	props: ["addTodos"],
};
</script>

<style scoped>
.mgT {
	padding-top: 5px;
	padding-bottom: 0;
}
</style>