import SalesForm from "components/Sales/SalesForm";
import React from "react";

const Sales = ({ params }) => {
  return <SalesForm id={params.id} />;
};

export default Sales;
