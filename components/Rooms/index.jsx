"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import RoomsTable from "./RoomsTable";

const Rooms = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Rooms" /> */}
      <div className="py-2">
        <RoomsTable />
      </div>
    </Container>
  );
};

export default Rooms;