<template>
	<v-app id="inspire">
		<v-navigation-drawer
			v-model="drawer"
			app
			clipped
			:expand-on-hover="expandOnHover"
			:mini-variant="miniVariant"
			permanent
		>
			<v-list dense>
				<v-list-item v-for="link in links" :key="link.text" router :to="link.route">
					<v-list-item-action>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>{{ link.text }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-toolbar-title>Painel</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn v-if="$route.path === '/' ? true : false" to="/projecoesNiteroi" color="red lighten-1">ir para projeções: {{ value }}</v-btn>
			<v-btn v-else to="/" color="green lighten-1">voltar aos indicadores</v-btn>
		</v-app-bar>

		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",
	components: {
	},
	data: () => ({
		links: [
			{
				icon: "assessment",
				text: "Niterói",
				route: "/",
			},
			{
				icon: "assessment",
				text: "Brasil",
				route: "/brasil",
			},
		],
		value: "NITERÓI",
		drawer: true,
		expandOnHover: true,
		miniVariant: true,
	}),
	created() {
		this.$vuetify.theme.dark = true;
	},
	computed: {
		state() {
			return this.$store.state.regiao;
		},
	},
	watch: {
		state: function(a) {
			this.value = a;
		},
	},
};
</script>
