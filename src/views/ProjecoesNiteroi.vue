<template>
    <v-container fluid>
        <v-row dense>
            <v-col :cols="12" :md="8" >
                <CardBandeiras />
            </v-col>
            <v-col :cols="12" :md="4">
                <CardAcoes />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import CardBandeiras from "../components/CardBandeiras"
import CardAcoes from "../components/CardAcoes"

export default {
	name: "ProjecoesNiteroi",
	components: {
        CardBandeiras,
        CardAcoes,
	},
};
</script>