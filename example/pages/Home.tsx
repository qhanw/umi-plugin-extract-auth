import React from "react";
import router from "umi/router";
import { Card, Button } from "antd";
export default function() {
  return (
    <Card>
      {/**@CONFIGURE_AUTH
       * title: About
       * type: component
       * action: TEST/ABOUT
       * path: api/about
       */}
      <Button onClick={() => router.push("/about")}>About</Button>
    </Card>
  );
}
