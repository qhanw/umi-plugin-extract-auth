import React from "react";
import router from "umi/router";
import { Card, Button } from "antd";
import { authorization } from "umi";

export default function() {
  console.log(authorization)
  return (
    <Card>
      {/**@CONFIGURE_AUTH
       * title: Docs
       * type: component
       * action: TEST/DOCS
       * path: api/docs
       */}
      <Button onClick={() => router.push("/docs")}>Docs</Button>
    </Card>
  );
}
