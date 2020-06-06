<template>
	<div style="height: 420px; width: 99%">
		<l-map style="z-index: 0;" v-if="showMap" :zoom="zoom" :center="center" :options="mapOptions">
			<l-tile-layer :url="url" :attribution="attribution" />
			<l-geo-json
				v-for="jsonEstado of geojson.features"
				:key="jsonEstado.properties.sigla"
				:geojson="jsonEstado"
				:options-style="jsonEstado.properties.style"
				:options="options"
			/>
		</l-map>
	</div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";

export default {
	name: "Example",
	components: {
		LMap,
		LTileLayer,
		LGeoJson,
	},
	props: {
		estados: {
			type: Array,
			default: null,
		},
	},
	data() {
		return {
			zoom: 3.5,
			center: latLng(-15.826691, -54.921822),
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			showMap: false,
			mapOptions: {
				zoomSnap: 0.5,
			},
			geojson: null,
			todosEstados: [],
		};
	},
	async mounted() {
		this.showMap = false;
		const estadosIBGE = await fetch(
			"https://servicodados.ibge.gov.br/api/v1/localidades/estados"
		);
		const dataEstadosIBGE = await estadosIBGE.json();
		const responseIBGE = await fetch(
			"https://servicodados.ibge.gov.br/api/v2/malhas/?resolucao=2&qualidade=1&formato=application/vnd.geo+json"
		);
		const geoJson = await responseIBGE.json();
		for (let elt of geoJson.features) {
			let searchCodarea = parseInt(elt.properties.codarea);
			let foundSigla = dataEstadosIBGE.find((x) => x.id === searchCodarea);
			this.todosEstados.push(foundSigla.sigla);
			elt.properties.sigla = foundSigla.sigla;
			let foundTD = this.estados.find((x) => x.estado === foundSigla.sigla);
			elt.properties.tempoParaDobrar = foundTD.tempoParaDobrar;
			elt.properties.style = {
				fillOpacity: 0.6,
				color: "#d9d9d9",
				weight: 1,
			};
			elt.properties.style.fillColor = this.getColor(
				parseInt(foundTD.tempoParaDobrar)
			);
		}
		this.geojson = geoJson;
		this.showMap = true;
	},
	methods: {
		updateGeoJson(geoJson, newEstados) {
			let todosEstados = this.todosEstados;
			for (let elt of newEstados) {
				let sigla = elt.estado;
				for (let feature of this.geojson.features) {
					if (feature.properties.sigla === sigla) {
						todosEstados = todosEstados.filter(function(element) {
							return element != sigla;
						});
						feature.properties.tempoParaDobrar = elt.tempoParaDobrar;
						feature.properties.style.fillColor = this.getColor(
							parseInt(elt.tempoParaDobrar)
						);
					}
				}
			}
			for (let esquecidos of todosEstados) {
				for (let feature of this.geojson.features) {
					if (feature.properties.sigla === esquecidos) {
						feature.properties.tempoParaDobrar = 0;
						feature.properties.style.fillColor = this.getColor(0);
					}
				}
			}
		},
		getColor(d) {
			return d > 40
				? "#ffffcc"
				: d > 35
				? "#ffeda0"
				: d > 24
				? "#fed976" //mais claro
				: d > 20
				? "#feb24c"
				: d > 16
				? "#fd8d3c"
				: d > 12
				? "#fc4e2a"
				: d > 8
				? "#e31a1c"
				: d > 4
				? "#bd0026"
				: d > 0
				? "#800026" //mais vermelho
				: "#d9d9d9"; //sem dados
		},
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
					"<div>Estado:" +
						feature.properties.sigla +
						"</div><div>Tempo para dobrar: " +
						feature.properties.tempoParaDobrar +
						"</div>",
					{ permanent: false, sticky: true }
				);
			};
		},
	},
	watch: {
		estados: function(arg) {
			this.updateGeoJson(this.geojson, arg);
		},
	},
};
</script>
