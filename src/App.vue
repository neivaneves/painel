<template>
	<v-app id="inspire">
		<!-- <v-navigation-drawer
			v-model="drawer"
			app
			clipped
			:expand-on-hover="expandOnHover"
			:mini-variant="miniVariant"
			permanent
		>
			<v-list dense>
				<v-list-item link>
					<v-list-item-action>
						<v-icon>mdi-view-dashboard</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Painel</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-action>
						<v-icon>mdi-settings</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Settings</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer> -->

		<v-app-bar app clipped-left>
			<v-toolbar-title>Painel</v-toolbar-title>
			<v-spacer />
			<v-menu
				v-model="menu"
				:close-on-content-click="false"
				:nudge-width="200"
				offset-x
			>
				<template v-slot:activator="{ on }">
					<v-btn color="indigo" dark v-on="on">
						estados nos cards
					</v-btn>
				</template>

				<v-card>
					<v-card-actions>
						<v-autocomplete
							placeholder="Selecione os estados para mostrar a todos os cards"
							deletableChips
							v-model="addTodos"
							:items="estados"
							chips
							multiple
							solo
							:clearable=true
							hide-details
							return-object
							item-text="label"
						>
						</v-autocomplete>
					</v-card-actions>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn text @click="menu = false">Cancelar</v-btn>
					</v-card-actions>
				</v-card>
			</v-menu>
		</v-app-bar>

		<v-main>
			<DashboardContents :addTodos="addTodos" />
		</v-main>
	</v-app>
</template>

<script>
import DashboardContents from "./components/DashboardContents";

export default {
	name: "App",
	components: {
		DashboardContents,
	},
	props: {
		source: String,
	},
	data: () => ({
		drawer: true,
		expandOnHover: true,
		miniVariant: true,
		estados: [
			{
				sigla: "SP",
				label: "São Paulo",
			},
			{
				sigla: "RJ",
				label: "Rio de Janeiro",
			},
			{
				sigla: "ES",
				label: "Espírito Santo",
			},
			{
				sigla: "MG",
				label: "Minas Gerais",
			},
			{
				sigla: "CE",
				label: "Ceará",
			},
			{
				sigla: "PE",
				label: "Pernambuco",
			},
			{
				sigla: "MA",
				label: "Maranhão",
			},
			{
				sigla: "BA",
				label: "Bahia",
			},
			{
				sigla: "PB",
				label: "Paraíba",
			},
			{
				sigla: "AL",
				label: "Alagoas",
			},
			{
				sigla: "SE",
				label: "Sergipe",
			},
			{
				sigla: "RN",
				label: "Rio Grande do Norte",
			},
			{
				sigla: "PI",
				label: "Piauí",
			},
			{
				sigla: "AM",
				label: "Amazonas",
			},
			{
				sigla: "PA",
				label: "Pará",
			},
			{
				sigla: "AP",
				label: "Amapá",
			},
			{
				sigla: "RO",
				label: "Rondônia",
			},
			{
				sigla: "AC",
				label: "Acre",
			},
			{
				sigla: "RR",
				label: "Roraima",
			},
			{
				sigla: "TO",
				label: "Tocantins",
			},
			{
				sigla: "SC",
				label: "Santa Catarina",
			},
			{
				sigla: "RS",
				label: "Rio Grande do Sul",
			},
			{
				sigla: "PR",
				label: "Paraná",
			},
			{
				sigla: "DF",
				label: "Distrito Federal",
			},
			{
				sigla: "GO",
				label: "Goiás",
			},
			{
				sigla: "MT",
				label: "Mato Grosso",
			},
			{
				sigla: "MS",
				label: "Mato Grosso do Sul",
			},
			{
				sigla: "BR",
				label: "Brasil",
			},
		],
		addTodos: [
			{
				sigla: "BR",
				label: "Brasil",
			},
		],
		menu: false,
	}),
	created() {
		this.$vuetify.theme.dark = true;
	},
};
</script>
