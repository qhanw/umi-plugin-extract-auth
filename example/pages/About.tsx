import React from "react";
import router from "umi/router";
import { Card, Button } from "antd";
export default function() {
  return (
    <Card>
      {/**@CONFIGURE_AUTH
       * title: Docs
       * type: component
       * action: TEST/DOCS
       */}
      <Button onClick={() => router.push("/docs")}>Docs</Button>
    </Card>
  );
}
