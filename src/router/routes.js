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
			{
				path: "/friends",
				component: () => import("pages/Friends.vue"),
			},
			{
				path: "/adduser",
				component: () => import("pages/CreateUser.vue"),
			},
			{
				path: "/messages",
				component: () => import("pages/MessageGroups.vue"),
			},
			{
				path: "/user/:id",
				component: () => import("pages/User.vue"),
				props: true,
			},
			{
				path: "/rankfriends",
				component: () => import("src/pages/RankFriends.vue"),
			},
			{
				path: "/rankings",
				component: () => import("src/pages/Rankings.vue"),
			},
			{
				path: "/uploadphoto",
				component: () => import("src/pages/UploadPhoto.vue"),
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
