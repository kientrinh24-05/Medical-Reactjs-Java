import { Space, Button, Tooltip } from "antd";
import React, { useContext, useState } from "react";
import Avatar from "./avatar";
import Notification from "./notification";
const GlobalHeaderRight = () => {
  return (
    <Space size={"middle"}>
      <Notification />
      <Avatar className="ml-10" />
    </Space>
  );
};
export default GlobalHeaderRight;
