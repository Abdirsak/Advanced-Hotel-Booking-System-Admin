"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import LoansTable from "./LoansTable";

const Category = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Categories" /> */}
      <div className="py-2">
        <LoansTable />
      </div>
    </Container>
  );
};

export default Category;