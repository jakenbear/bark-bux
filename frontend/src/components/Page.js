// src/components/Page.js
// Reusable layout wrapper that sets the page <title> dynamically using react-helmet

import React from "react";
import { Helmet } from "react-helmet";

// Adds dynamic page title and renders child components
const Page = ({ title, children }) => (
  <>
    <Helmet>
      <title>{title ? `${title} | Bark Bux` : "Bark Bux"}</title>
    </Helmet>
    {children}
  </>
);

export default Page;
