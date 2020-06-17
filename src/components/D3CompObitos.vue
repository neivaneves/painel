<template>
	<svg width="400px" height="400px">
		<path
			d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zm2 -16c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"
		/>
	</svg>
</template>

<script>
import * as d3 from "d3";

export default {
	props: ["dadosObitosDia"],
	created() {
		const square = [];
		const sLen = Math.floor(Math.sqrt(parseInt(this.dadosObitosDia)) + 1);
		const numS = Math.floor(parseInt(this.dadosObitosDia) / sLen);
		const resto = parseInt(this.dadosObitosDia) % sLen;
		for (let i = 0; i < numS; i++) {
			square.push(sLen);
		}
		square.push(resto);
		this.plotSquare(square);
	},
	methods: {
		plotSquare(sq) {
			d3.select("svg")
				.selectAll("path")
				.data(sq)
				.enter()
				.append("path");
		},
	},
};
</script>
