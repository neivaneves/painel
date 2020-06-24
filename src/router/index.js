import Vue from "vue";
import VueRouter from "vue-router";
import DashboardBrasil from "../views/DashboardBrasil.vue";
import DashboardNiteroi from "../views/DashboardNiteroi.vue";

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
];

const router = new VueRouter({
	routes,
});

export default router;
