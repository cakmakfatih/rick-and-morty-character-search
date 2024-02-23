import React from "react";
import "./Layout.css";

function Layout({ children }: { children?: React.ReactNode }) {
  return <div className="app-layout">{children}</div>;
}

export default Layout;
