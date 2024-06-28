import ProductForm from "components/Product/ProductForm";
import React from "react";

const NewProducts = ({ params }) => {
  return <ProductForm id={params.id} />;
};

export default NewProducts;
