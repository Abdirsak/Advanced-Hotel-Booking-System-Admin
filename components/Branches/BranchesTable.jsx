import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { BranchesApi } from "common/utils/axios/api";
import BranchesModal from "./BranchesModal";
import useDelete from "hooks/useDelete";

//

const BranchesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, selSelectedBranch] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(BranchesApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Branch ${name}?`,
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
      name: "Contact",
      sortable: true,
      sortField: "contact",
      selector: (row) => row.contact,
      cell: (row) => <div className="">{row?.contact ?? ""}</div>,
    },
    {
      name: "Address",
      sortable: true,
      sortField: "address",
      selector: (row) => row.address,
      cell: (row) => <div className="">{row?.address ?? ""}</div>,
    },
    {
      name: "Director",
      sortable: true,
      sortField: "director",
      selector: (row) => row.director,
      cell: (row) => <div className="">{row?.director ?? ""}</div>,
    },
    {
      name: "Working Hours",
      sortable: true,
      sortField: "workingHours",
      selector: (row) => row?.workingHours?.from +"--"+ row?.workingHours?.to,
      cell: (row) => <div className="">{row?.workingHours?.from +"--"+ row?.workingHours?.to ?? ""}</div>,
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
              // router.push("/create");
              selSelectedBranch(row);
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
      <BranchesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedBranch}
        setSelectedRow={selSelectedBranch}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Branches"
        url={BranchesApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default BranchesTable;
