<template>
	<v-container fluid>
		<v-row dense>
			<v-col :sm="6" :md="8" :lg="4">
				<CardObitos :addTodos="addTodos" />
			</v-col>
			<v-col :sm="6" :md="4" :lg="3">
				<v-row dense no-gutters>
					<!-- <v-col :cols="12">
						<CardPeriodo />
					</v-col> -->
				</v-row>
				<v-row dense no-gutters>
					<!-- <v-col :cols="12" class="mgT"> -->
					<v-col :cols="12">
						<CardRecentes />
					</v-col>
				</v-row>
			</v-col>
			<v-col :sm="6" :lg="5">
				<CardCrescimento :addTodos="addTodos" />
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
import CardObitos from "./CardObitos";
// import CardPeriodo from "./CardPeriodo";
import CardCrescimento from "./CardCrescimento";
import CardTempoDobrar from "./CardTempoDobrar";
import CardInfectados from "./CardInfectados";
import CardRecentes from "./CardRecentes";

export default {
	name: "DashboardContents",
	components: {
		CardObitos,
		// CardPeriodo,
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