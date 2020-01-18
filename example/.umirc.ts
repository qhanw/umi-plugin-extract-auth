import { join } from "path";
import { IConfig } from "umi-types";

export default {
  routes: [
    {
      path: "/",
      component: "./index",
      routes: [
        { path: "/home", component: "./Home" },
        { path: "/about", component: "./About" },
        { path: "/docs", component: "./Docs" }
      ]
    }
  ],
  plugins: [
    [
      join(__dirname, "..", require("../package").main || "index.js"),
      {
        external: true,
        version: "4.17.11"
      }
    ]
  ]
} as IConfig;
