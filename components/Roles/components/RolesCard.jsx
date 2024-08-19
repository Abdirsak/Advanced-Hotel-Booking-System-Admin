"use client";
import React from "react";
import { Card, CardBody, CardTitle, Button } from "reactstrap";
import { Users } from "react-feather";
import { useRouter } from "next/navigation";

const RolesCard = ({ role }) => {
  const router = useRouter();

  const handleEditRole = () => {
    const url = `/dashboard/create-role?id=${role._id}`;
    router.push(url);
  };

  return (
    <Card className="my-3">
      <CardBody style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>
          <Users />
        </div>
        <CardTitle tag="h5" style={{ fontWeight: "bold" }}>
          {role.name}
        </CardTitle>
        <Button color="primary" onClick={handleEditRole}>
          Edit
        </Button>
      </CardBody>
    </Card>
  );
};

export default RolesCard;
