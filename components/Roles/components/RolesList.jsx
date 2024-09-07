"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import RolesCard from "./RolesCard";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query"; // Importing useQuery from react-query
import request from "../../../common/utils/axios";

const RolesList = () => {
  const router = useRouter();

  // Define the queryKey and queryFn for useQuery
  const {
    data: roles = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/roles"],
    queryFn: () =>
      request({
        url: "/roles",
        method: "GET",
        params: {
          options: {
            limit: 1000,
            page: 1,
          },
        },
        options: {
          sort: { createdAt: "desc" },
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    keepPreviousData: true,
    select: (res) => res.data,
  });

  const handleAddNewRole = () => {
    router.push("/dashboard/create-role");
  };

  // Function to add a new role to the list
  const addRoleToList = (newRole) => {
    refetch(); // Refetch the data after adding a new role
  };

  if (isLoading) {
    return <p>Loading...</p>; // Display a loading message or spinner
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Card>
        <CardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5>Roles Management</h5>
          <Button color="primary" onClick={handleAddNewRole}>
            + New Role
          </Button>
        </CardHeader>
        <CardBody>
          <Row>
            {roles?.data?.map((role, index) => (
              <Col key={index} sm="6" md="4" lg="3">
                <RolesCard role={role} />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RolesList;
