const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "", component: () => import("pages/Index.vue") },
			{
				path: "/chat/:id",
				component: () => import("pages/Chat.vue"),
				props: true,
			},
			{ path: "/signin", component: () => import("pages/SignIn.vue") },
			{ path: "/profile", component: () => import("pages/Profile.vue") },
			{ path: "/friends", component: () => import("pages/Friends.vue") },
			{ path: "/adduser", component: () => import("pages/CreateUser.vue") },
			{
				path: "/messages",
				component: () => import("pages/MessageGroups.vue"),
			},
			{
				path: "/user/:id",
				component: () => import("pages/User.vue"),
				props: true,
			},
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/Error404.vue"),
	},
];

export default routes;
