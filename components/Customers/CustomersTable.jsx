import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { customersApi } from "common/utils/axios/api";
import CustomersModal from "./CustomersModal";
import useDelete from "hooks/useDelete";

//

const CustomersTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [SelectedCustomer, setSelectedCustomer] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(customersApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Customer ${name}?`,
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
      sortField: "fullName",
      selector: (row) => row?.fullName ?? "",
      cell: (row) => <div className="">{row?.fullName ?? ""}</div>,
    },
    {
      name: "Gender",
      sortable: true,
      sortField: "gender",
      selector: (row) => row?.gender ?? "",
      cell: (row) => <div className="">{row?.gender ?? ""}</div>,
    },
    {
      name: "Phone",
      sortable: true,
      sortField: "contact",
      selector: (row) => row?.contact ?? "",
      cell: (row) => <div className="">{row?.contact ?? ""}</div>,
    },
    {
      name: "Address",
      sortable: true,
      sortField: "address",
      selector: (row) => row?.address ?? "",
      cell: (row) => <div className="">{row?.address ?? ""}</div>,
    },

    {
      name: "Description",
      sortable: true,
      sortField: "description",
      selector: (row) => row?.description,
      cell: (row) => <div className="">{row?.description ?? ""}</div>,
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
              setSelectedCustomer(row);
              setShowModal(true);
            }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => {
              handleConfirmDelete(row._id, row.fullName);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <CustomersModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={SelectedCustomer}
        setSelectedRow={setSelectedCustomer}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Customers"
        url={customersApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default CustomersTable;
