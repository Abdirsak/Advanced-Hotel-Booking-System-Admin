import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { EmployeesApi } from "common/utils/axios/api";
import PurchasesModal from "./PurchasesModal";
import useDelete from "hooks/useDelete";

//

const EmployeesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(EmployeesApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Employee ${name}?`,
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
      selector: (row) => row?.fullName ?? "",
      cell: (row) => <div className="">{row?.fullName ?? ""}</div>,
    },

    {
      name: "Gender",
      sortable: true,
      sortField: "gender",
      selector: (row) => row.gender,
      cell: (row) => <div className="">{row?.gender ?? ""}</div>,
    },
    {
      name: "Contact",
      sortable: true,
      sortField: "contact",
      selector: (row) => row.contact,
      cell: (row) => <div className="">{row?.contact ?? ""}</div>,
    },
    {
      name: "Emergencey Contact",
      sortable: true,
      sortField: "emergencyContact",
      selector: (row) => row.emergencyContact,
      cell: (row) => <div className="">{row?.emergencyContact ?? ""}</div>,
    },
    {
      name: "Address",
      sortable: true,
      sortField: "address",
      selector: (row) => row.address,
      cell: (row) => <div className="">{row?.address ?? ""}</div>,
    },
    {
      name: "Salary",
      sortable: true,
      sortField: "salary",
      selector: (row) => row.salary,
      cell: (row) => <div className="">{row?.salary ?? ""}</div>,
    },
    {
      name: "Department",
      sortable: true,
      sortField: "department",
      selector: (row) => row?.department,
      cell: (row) => <div className="">{row?.department ?? ""}</div>,
    },
    {
      name: "Position",
      sortable: true,
      sortField: "position",
      selector: (row) => row?.position,
      cell: (row) => <div className="">{row?.position ?? ""}</div>,
    },
   
    {
      name: "Hire Date",
      sortable: true,
      sortField: "hireDate",
      selector: (row) => row.hireDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.hireDate).format("DD-MMM-YYYY")}
        </span>
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
              // router.push("/create");
              setSelectedEmployee(row);
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
      <PurchasesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedEmployee}
        setSelectedRow={setSelectedEmployee}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Employees"
        url={EmployeesApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default EmployeesTable;
