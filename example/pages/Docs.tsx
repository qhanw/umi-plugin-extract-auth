import React from "react";
import router from "umi/router";
import { Card, Button } from "antd";
export default function() {
  return (
    <Card>
      {/**@CONFIGURE_AUTH
       * title: Home
       * type: component
       * action: TEST/HOME
       * path: api/home
       */}
      <Button onClick={() => router.push("/home")}>Home</Button>
    </Card>
  );
}
