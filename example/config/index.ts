import home from "./home";
export default [
  {
    path: "/",
    component: "./index",
    routes: [
      home,
      { path: "/about", component: "./About" },
      { path: "/docs", component: "./Docs" }
    ]
  }
];
