import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    
    layout("./layouts/layout.tsx", [
        index("routes/home.tsx"),
        route("news", "routes/news.tsx"),
        route("news/:id", "routes/news.$id.tsx"),
        route("team", "routes/team.tsx"),
        route("schedules", "routes/schedules.tsx"),
        route("*", "routes/not-found.tsx"),
    ]),
    route("api/webhook", "routes/api/webhook.tsx"),
    ...prefix("panel", [
        route("login", "routes/panel/login.tsx"),
        route("register", "routes/panel/register.tsx"),
        layout("./layouts/panel.layout.tsx", [
            route("home", "routes/panel/dashboard.tsx"),
            route("schedules", "routes/panel/schedules.tsx"),
            route("*", "routes/panel/not-found.tsx"),
            route("logout", "routes/panel/logout.tsx"),
            route("users", "routes/panel/users.tsx"),
            route("news","routes/panel/news.tsx"),
            route("news/create","routes/panel/newsCreate.tsx"),
            route("news/categories","routes/panel/categories.tsx"),
            route("news/edit/:id","routes/panel/news.$id.tsx"),
            route("schedules/users/list", "routes/panel/schedulesUsers.tsx"),
        ]),
    ]),
] satisfies RouteConfig;
