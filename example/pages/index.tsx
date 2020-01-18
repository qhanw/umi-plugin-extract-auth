import React from "react";
import { Route, Link } from "umi";
import { Menu } from "antd";
import "antd/dist/antd.css";

export default function({
  component: Component,
  render,
  authority,
  redirectPath,
  ...rest
}) {
  return (
    <div>
      <Menu
        mode="horizontal"
      >
        <Menu.Item key="home">
          <Link to="/home">Home</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">About</Link>
        </Menu.Item>

        <Menu.Item key="docs">
          <Link to="/docs">Docs</Link>
        </Menu.Item>
      </Menu>

      <Route
        {...rest}
        render={(props: any) =>
          Component ? <Component {...props} /> : render(props)
        }
      />
    </div>
  );
}
