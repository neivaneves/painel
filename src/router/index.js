import Vue from "vue";
import VueRouter from "vue-router";
import DashboardBrasil from "../views/DashboardBrasil.vue";
import DashboardNiteroi from "../views/DashboardNiteroi.vue";
import ProjecoesNiteroi from "../views/ProjecoesNiteroi"

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Niteroi",
		component: DashboardNiteroi,
	},
	{
		path: "/brasil",
		name: "Brasil",
		component: DashboardBrasil,
	},
	{
		path: "/projecoesNiteroi",
		name: "Projeções de Niterói",
		component: ProjecoesNiteroi,
	}
];

const router = new VueRouter({
	routes,
});

export default router;
