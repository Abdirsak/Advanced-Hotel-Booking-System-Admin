import React, { useState } from "react";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { PropertiesAPI } from "common/utils/axios/api";

import PropertiesModal from "./PropertiesModal";
import useDelete from "hooks/useDelete";
import { Image } from "react-bootstrap";
//

const PropertiesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [SelectedProperty, setSelectedProperty] = useState(null);

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(
    PropertiesAPI,
    false,
    () => {
      //   setShowModal(false);
      //   setSelectedRow(null);
    }
  );

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Property ${name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-primary ms-1",
      },

      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {
        mutate(id);
      }
    });
  };

  const columns = [
    {
      name: "Photo",
      sortable: true,
      sortField: "name",
      selector: (row) => row?.image,
      cell: (row) => (
        <div className="avatar avatar-md avatar-indicators">
          <Image
            alt="avatar"
            src="../images/avatar/avatar-1.jpg"
            className="rounded-circle"
          />
        </div>
      ),
    },
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      selector: (row) => row?.name ?? "",
      cell: (row) => <div className="">{row?.name ?? ""}</div>,
    },
    {
      name: "Purpose",
      sortable: true,
      sortField: "purpose",
      selector: (row) => row?.purpose ?? "",
      cell: (row) => <div className="">{row?.purpose ?? ""}</div>,
    },
    {
      name: "Price",
      sortable: true,
      sortField: "price",
      selector: (row) => row?.price ?? "",
      cell: (row) => <div className="">{row?.price ?? ""}</div>,
    },
    {
      name: "Built",
      sortable: true,
      sortField: "yearBuilt",
      selector: (row) => row?.yearBuilt ?? "",
      cell: (row) => <div className="">{row?.yearBuilt ?? ""}</div>,
    },
    {
      name: "Agent",
      sortable: true,
      sortField: "agent",
      selector: (row) => row?.agent?.name ?? "",
      cell: (row) => <div className="">{row?.agent?.name ?? ""}</div>,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          color={
            row?.status?.toLowerCase() == "available" ? "success" : "warning"
          }
          className="text-capitalize"
        >
          <span className="">{row.status}</span>
        </Badge>
      ),
    },
    {
      name: "Created Date",
      sortable: true,
      sortField: "createdAt",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.createdAt).format("DD-MMM-YYYY")}
        </span>
      ),
    },

    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          className="column-action"
        >
          <Edit2
            style={{ marginRight: 10 }}
            color="MidnightBlue"
            size={18}
            onClick={(e) => {
              setShowModal(true);
              setSelectedProperty(row);
            }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => {
              handleConfirmDelete(row._id, row.name);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <PropertiesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={SelectedProperty}
        setSelectedRow={setSelectedProperty}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[
          {
            path: "agent",
            dir: "agents",
            select: "_id name",
          },
          {
            path: "owner",
            dir: "users",
            select: "_id name",
          },
        ]}
        query={{}}
        title="Properties"
        url={PropertiesAPI}
      />
    </>
  );
};

export default PropertiesTable;
