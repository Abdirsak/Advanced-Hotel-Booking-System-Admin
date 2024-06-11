import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { AmenitiesAPI } from "common/utils/axios/api";

import useDelete from "hooks/useDelete";
import AmenitiesModal from "./AmenitiesModal";

//

const AmenityTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(
    AmenitiesAPI,
    false,
    () => {
      //   setShowModal(false);
      //   setSelectedRow(null);
    }
  );

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Category ${name}?`,
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

  //columns
  const columns = [
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      selector: (row) => row?.name ?? "",
      cell: (row) => <div className="">{row?.name ?? ""}</div>,
    },
    {
      name: "Type",
      sortable: true,
      sortField: "type",
      selector: (row) => row?.type ?? "",
      cell: (row) => <div className="">{row?.type ?? ""}</div>,
    },

    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          color={row?.status?.toLowerCase() == "active" ? "success" : "warning"}
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
              setSelectedCategory(row);
              setShowModal(true);
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
      <AmenitiesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedCategory}
        setSelectedRow={setSelectedCategory}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Categories"
        url={AmenitiesAPI}
        searchFields={["name", "type"]}
      />
    </>
  );
};

export default AmenityTable;
