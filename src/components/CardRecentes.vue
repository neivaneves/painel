<template>
	<v-card v-if="loaded">
		<v-card-text>
			<div>Numero total de casos:</div>
			<p class="nC">
				{{ values.casosAcumulado }}
				<v-chip v-if="this.continuaIgual(values.casosNovos)">
					<v-avatar>
						<v-icon>remove_circle</v-icon>
					</v-avatar>
				</v-chip>
				<v-chip color="red lighten-1" v-else>
					<v-avatar left>
						<v-icon>arrow_circle_up</v-icon>
					</v-avatar>
					{{ values.casosNovos }}
				</v-chip>
			</p>
			<div>Numero total de óbitos:</div>
			<p class="nC">
				{{ values.obitosAcumulado }}
				<v-chip v-if="this.continuaIgual(values.obitosNovos)">
					<v-avatar>
						<v-icon>remove_circle</v-icon>
					</v-avatar>
				</v-chip>
				<v-chip color="red lighten-1" v-else>
					<v-avatar left>
						<v-icon>arrow_circle_up</v-icon>
					</v-avatar>
					{{ values.obitosNovos }}
				</v-chip>
			</p>
		</v-card-text>
		<v-card-actions>
			<v-autocomplete
				deletableChips
				v-model="values"
				:items="items"
				chips
				solo
				hide-details
				return-object
				item-text="label"
			>
			</v-autocomplete>
						<v-fab-transition>
				<v-btn
					v-show="loaded"
					color="grey"
					absolute
					icon
					top
					right
					@click="overlay = !overlay"
				>
					<v-icon>info</v-icon>
				</v-btn>
			</v-fab-transition>
		<v-overlay :absolute="true" :opacity="0.9" :value="overlay">
			<p style="margin: 30px;" class="text-justify">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies
				lorem quam, eget vehicula elit tincidunt nec.
			</p>
			<v-btn
				color="orange lighten-2"
				absolute
				fab
				right
				@click="overlay = false"
			>
				<v-icon>close</v-icon>
			</v-btn>
		</v-overlay>
		</v-card-actions>
	</v-card>
</template>

<script>
// import { mdiArrowUpDropCircle, mdiMinusCircle } from "@mdi/js";

export default {
	name: "CardRecentes",
	data: () => ({
		loaded: false,
		items: null,
		overlay: false,
		values: null,
	}),
	async created() {
		this.loaded = false;
		const response = await fetch(
			"https://webhooks.mongodb-stitch.com/api/client/v2.0/app/corona_vue_2-rbdzt/service/api/incoming_webhook/dadosAtuais"
		);
		const regiao = await response.json();
		this.items = regiao;
		this.values = regiao[0];
		this.loaded = true;
	},
	methods: {
		continuaIgual(val) {
			if (!parseInt(val)) {
				return true;
			}
			return false;
		},
	},
};
</script>

<style scoped>
.nC {
	color: white;
    font-size: 2.125rem !important;
    font-weight: 400;
    line-height: 2.5rem;
    letter-spacing: 0.0073529412em !important;
    font-family: "Roboto", sans-serif !important;
}
</style>