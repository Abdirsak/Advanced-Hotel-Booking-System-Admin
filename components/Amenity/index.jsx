"use client";
// core packages
import React from "react";

import { Container } from "react-bootstrap";
import AmenitiesTable from "./AmenitiesTable";

const Amenities = () => {
  return (
    <Container fluid className="p-6">
      <div className="py-2">
        <AmenitiesTable />
      </div>
    </Container>
  );
};

export default Amenities;
