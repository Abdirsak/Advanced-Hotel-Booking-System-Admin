"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import ReceiptTable from "./ReceiptTable";

const Receipts = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Receipts" /> */}
      <div className="py-2">
        <ReceiptTable />
      </div>
    </Container>
  );
};

export default Receipts;
