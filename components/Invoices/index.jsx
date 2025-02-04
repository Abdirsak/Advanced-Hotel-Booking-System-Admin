"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import InvoiceTable from "./InvoiceTable";

const Invoices = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Invoices" /> */}
      <div className="py-2">
        <InvoiceTable />
      </div>
    </Container>
  );
};

export default Invoices;