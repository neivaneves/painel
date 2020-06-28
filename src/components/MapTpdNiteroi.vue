<template>
	<div style="height: 397px; width: 99%">
		<l-map
			style="z-index: 0;"
			v-if="showMap"
			:zoom="zoom"
			:center="center"
			:options="mapOptionsTpd"
		>
			<l-tile-layer :url="url" :attribution="attribution" />
			<l-geo-json
				v-for="jsonBairrosTpd of geojson.features"
				:key="jsonBairrosTpd.properties.nome"
				:geojson="jsonBairrosTpd"
				:options-style="jsonBairrosTpd.properties.style"
				:options="optionsTpd"
			/>
			<l-control position="bottomright">
				<v-card>
					<v-card-text style="padding: 10px; padding-bottom: 5px;">
						<p class="leg">
							{{ legendaTpd.titulo }}
						</p>
						<p class="leg" v-for="tier of legendaTpd.tiers" :key="tier.tier">
							<v-avatar :color="tier.cor" size="15" />
							{{ tier.tier }}
						</p>
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
	name: "MapTpdNiteroi",
	components: {
		LMap,
		LTileLayer,
		LControl,
		LGeoJson,
	},
	props: ["bairrosTpd", "mutation", "legendaTpd"],
	data() {
		return {
			zoom: 12,
			center: latLng(-22.92235, -43.05551),
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			showMap: false,
			mapOptionsTpd: {
				zoomSnap: 0.25,
			},
		};
	},
	mounted() {
        this.showMap = false;
        this.geojson = this.bairrosTpd;
		this.showMap = true;
	},
	computed: {
		optionsTpd() {
			return {
				onEachFeature: this.onEachFeatureFunctionTpd,
			};
		},
		onEachFeatureFunctionTpd() {
			return (feature, layer) => {
				layer.bindTooltip(
					"<div>Bairro: " +
						feature.properties.nome +
						"</div><div>" + this.legendaTpd.titulo + " " +
						parseInt(feature.properties.tempoParaDobrar) +
						"</div>",
					{ permanent: false, sticky: true }
				);
			};
		},
		// onEachFeatureFunctionTpd() {
		// 	if (this.dados === "risco") {
		// 		return (feature, layer) => {
		// 			layer.bindTooltip(
		// 				"<div>Bairro:" +
		// 					feature.properties.nome +
		// 					"</div><div>Risco: " +
		// 					feature.properties.risco.toFixed(2) +
		// 					"</div>",
		// 				{ permanent: false, sticky: true }
		// 			);
		// 		};
		// 	} else {
		// 		return (feature, layer) => {
		// 			layer.bindTooltip(
		// 				"<div>Bairro:" +
		// 					feature.properties.nome +
		// 					"</div><div>Tempo para dobrar: " +
		// 					feature.properties.risco.toFixed(2) +
		// 					"</div>",
		// 				{ permanent: false, sticky: true }
		// 			);
		// 		};
		// 	}
		// },
	},
	watch: {
		mutation: function() {
            this.showMap = false;
            this.geojson = this.bairrosTpd;
            this.showMap = true;
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
