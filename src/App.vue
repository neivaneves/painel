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
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-toolbar-title>Application</v-toolbar-title>
		</v-app-bar>

		<v-content>
			<DashboardContents />
		</v-content>
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
    miniVariant: true
	}),
	created() {
		this.$vuetify.theme.dark = true;
	},
};
</script>
