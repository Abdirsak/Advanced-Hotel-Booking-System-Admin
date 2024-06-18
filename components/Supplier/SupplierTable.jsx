import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { SuppliersApi } from "common/utils/axios/api";
import SupplierModal from "./SupplierModal";
import useDelete from "hooks/useDelete";

//

const CategoryTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [SelectedSupplier, setSelectedSupplier] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(SuppliersApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

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
      sortField: "SupplierName",
      selector: (row) => row?.SupplierName ?? "",
      cell: (row) => <div className="">{row?.SupplierName ?? ""}</div>,
    },
    {
      name: "Phone",
      sortable: true,
      sortField: "phone",
      selector: (row) => row?.phone ?? "",
      cell: (row) => <div className="">{row?.phone ?? ""}</div>,
    },
    {
      name: "Address",
      sortable: true,
      sortField: "address",
      selector: (row) => row?.address ?? "",
      cell: (row) => <div className="">{row?.address ?? ""}</div>,
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      selector: (row) => row?.email ?? "",
      cell: (row) => <div className="">{row?.email ?? ""}</div>,
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
              setSelectedSupplier(row);
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
      <SupplierModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={SelectedSupplier}
        setSelectedRow={setSelectedSupplier}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Suppliers"
        url={SuppliersApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default CategoryTable;
