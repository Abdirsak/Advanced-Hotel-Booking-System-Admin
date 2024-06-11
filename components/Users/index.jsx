"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import UsersTable from "./UsersTable";

const Users = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Users" /> */}
      <div className="py-2">
        <UsersTable />
      </div>
    </Container>
  );
};

export default Users;
