import React from "react";
import Tabs from "./components/Tabs";
import { Outlet } from "react-router-dom";

const EmailSettingsLayout = () => {
  return (
    <>
      <Tabs />
      <Outlet />
    </>
  );
};

export default EmailSettingsLayout;
