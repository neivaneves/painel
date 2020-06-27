<template>
	<div style="height: 397px; width: 99%">
		<l-map
			style="z-index: 0;"
			v-if="showMap"
			:zoom="zoom"
			:center="center"
			:options="mapOptions"
		>
			<l-tile-layer :url="url" :attribution="attribution" />
			<l-geo-json
				v-for="jsonBairros of bairros.features"
				:key="jsonBairros.properties.nome"
				:geojson="jsonBairros"
				:options-style="jsonBairros.properties.style"
				:options="options"
				@click="select(jsonBairros.properties.nome)"
			/>
			<l-control position="bottomright">
				<v-card>
					<v-card-text style="padding: 10px; padding-bottom: 5px;">
						<p class="leg">
							Risco:
						</p>
						<p class="leg"><v-avatar color="#e31a1c" size="15" /> Altíssimo</p>
						<p class="leg"><v-avatar color="#fd8d3c" size="15" /> Alto</p>
						<p class="leg"><v-avatar color="#fecc5c" size="15" /> Médio</p>
						<p class="leg"><v-avatar color="#ffffb2" size="15" /> Baixo</p>
					</v-card-text>
				</v-card>
			</l-control>
		</l-map>
	</div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LGeoJson, LControl } from "vue2-leaflet";

export default {
	name: "MapBandeirasComponent",
	components: {
		LMap,
		LTileLayer,
		LControl,
		LGeoJson,
	},
	props: {
		bairros: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			zoom: 12,
			center: latLng(-22.92235, -43.05551),
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			showMap: false,
			mapOptions: {
				zoomSnap: 0.25,
			},
			geojson: null,
		};
	},
	mounted() {
		this.showMap = false;
		this.geojson = this.bairros;
		this.showMap = true;
	},
	computed: {
		options() {
			return {
				onEachFeature: this.onEachFeatureFunction,
			};
		},
		onEachFeatureFunction() {
			return (feature, layer) => {
				layer.bindTooltip(
					"<div>Bairro:" +
						feature.properties.nome +
						"</div><div>Risco: " +
						feature.properties.risco.toFixed(2) +
						"</div>",
					{ permanent: false, sticky: true }
				);
			};
		},
	},
	methods: {
		select(regiao) {
			// console.log(regiao, this.$store)
			this.$store.commit('select', regiao)
		},
	},
	watch: {
		bairros: function(arg) {
			this.geojson = arg;
		},
	},
};
</script>

<style scoped>
.leg {
	margin-bottom: 5px;
	font-size: 0.75rem !important;
	letter-spacing: 0.0103529412em !important;
}
</style>