import React, { useState } from "react";
import { Button} from "reactstrap";
//3rd party libraries
import { Edit2, Plus, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { AgentsAPI } from "common/utils/axios/api";

import AgentsModal from "./AgentsModal";
import AgentsRegistrationForm from "./AgentsRegistrationForm"
import useDelete from "hooks/useDelete";
//

const AgentsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [SelectedAgent, setSelectedAgent] = useState(null);
  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(AgentsAPI, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Agent ${name}?`,
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
      name: "Name",
      sortable: true,
      sortField: "name",
      width: "25%",
      selector: (row) => row?.name ?? "",
      cell: (row) => <div className="">{row?.name ?? ""}</div>,
    },
    {
      name: "Address",
      sortable: true,
      sortField: "address",
      selector: (row) => row?.address ?? "",
      cell: (row) => <div className="">{row?.address ?? ""}</div>,
    },
    {
      name: "Contact",
      sortable: true,
      sortField: "contact",
      selector: (row) => row?.contactInfo ?? "",
      cell: (row) => <div className="">{row?.contactInfo ?? ""}</div>,
    },

    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          color={
            row?.status?.toLowerCase() == "inactive" ? "warning" : "success"
          }
          className="text-capitalize"
        >
          <span className="">{row.status || "Active"}</span>
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
              setSelectedAgent(row);
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
      {/* <AgentsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={SelectedAgent}
        setSelectedRow={setSelectedAgent}
      /> */}
      {/* <AgentsRegistrationForm/> */}
      <div>
        
      </div>
      <Button color="primary" className="px-4 justify-end">
              <Plus /> New Agents
            </Button>
      <Table
        columns={columns}
        // onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Agents"
        url={AgentsAPI}
      />
    </>
  );
};

export default AgentsTable;
