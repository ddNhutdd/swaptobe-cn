import React from "react";
import { Route } from "react-router-dom";
import Footer from "src/components/Footer";
import Header1 from "src/components/Header1";
import Header2 from "src/components/Header2";
export default function MainTemplate(props) {
  return (
    <Route
      exact
      path={props.path}
      render={(propsRoute) => {
        return (
          <div className="main-template">
            <div className="main-template__bg-1"></div>
            <div className="main-template__bg-2"></div>
            <div className="main-template__bg-3"></div>
            <Header1 {...propsRoute} />
            <Header2 {...propsRoute} />
            <div style={{ minHeight: "70vh" }}>
              <props.component {...propsRoute} />
            </div>
            <Footer {...propsRoute} />
          </div>
        );
      }}
    />
  );
}
