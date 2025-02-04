"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import BookingTable from "./BookingTable";

const Bookings = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Bookings" /> */}
      <div className="py-2">
        <BookingTable />
      </div>
    </Container>
  );
};

export default Bookings;