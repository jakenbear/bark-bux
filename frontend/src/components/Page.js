// src/components/Page.js
import React from "react";
import { Helmet } from "react-helmet";

const Page = ({ title, children }) => (
  <>
    <Helmet>
      <title>{title ? `${title} | Bark Bux` : "Bark Bux"}</title>
    </Helmet>
    {children}
  </>
);

export default Page;
