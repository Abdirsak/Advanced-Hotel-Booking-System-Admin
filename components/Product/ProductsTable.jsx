import React, { useState } from "react";
import { Button} from "reactstrap";
//3rd party libraries
import { Edit2, Plus, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";
import Link from "next/link"
//custom packages
import Table from "common/Table";
import { ProductsApi } from "common/utils/axios/api";

import ProductsModal from "./ProductsModal";
import ProductsRegistrationForm from "./ProductsRegistrationForm"
import useDelete from "hooks/useDelete";
//

const ProductsTable = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [SelectedAgent, setSelectedAgent] = useState(null);
  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(ProductsApi, false, () => {
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
      width: "15%",
      selector: (row) => row?.name ?? "",
      cell: (row) => <div className="">{row?.name ?? ""}</div>,
    },
    {
      name: "Category",
      sortable: true,
      sortField: "category.name",
      selector: (row) => row?.category?.name ?? "",
      cell: (row) => <div className="">{row?.category?.name ?? ""}</div>,
    },
    {
      name: "Supplier",
      sortable: true,
      sortField: "SupplerName",
      selector: (row) => row?.supplier?.SupplierName ?? "",
      cell: (row) => <div className="">{row?.supplier?.SupplierName ?? ""}</div>,
    },
    {
      name: "Brand",
      sortable: true,
      sortField: "brand",
      selector: (row) => row?.brand ?? "",
      cell: (row) => <div className="">{row?.brand ?? ""}</div>,
    },
    {
      name: "Expire Date",
      sortable: true,
      sortField: "expireDate",
      selector: (row) => row.expireDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.expireDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      name: "Quantity",
      sortable: true,
      sortField: "quantity",
      selector: (row) => row?.quantity ?? "",
      cell: (row) => <div className="">{row?.quantity ?? ""}</div>,
    },
    {
      name: "Price",
      sortable: true,
      sortField: "price",
      selector: (row) => row?.price ?? "",
      cell: (row) => <div className="">{row?.price ?? ""}</div>,
    },
    {
      name: "Cost",
      sortable: true,
      sortField: "cost",
      selector: (row) => row?.cost ?? "",
      cell: (row) => <div className="">{row?.cost ?? ""}</div>,
    },
    {
      name: "CreatedBy",
      sortable: true,
      sortField: "createdBy.username",
      selector: (row) => row?.createdBy?.username ?? "",
      cell: (row) => <div className="">{row?.createdBy?.username ?? ""}</div>,
    },
  

    // {
    //   name: "Status",
    //   sortable: true,
    //   sortField: "status",
    //   selector: (row) => row.status,
    //   cell: (row) => (
    //     <Badge
    //       color={
    //         row?.status?.toLowerCase() == "inactive" ? "warning" : "success"
    //       }
    //       className="text-capitalize"
    //     >
    //       <span className="">{row.status || "Active"}</span>
    //     </Badge>
    //   ),
    // },
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
      <Button color="primary"  className="px-4 justify-end text-white">
        
      <Link href={"/products/Register"}  color="primary" className="px-4 text-white">
    <Plus /> New Products
  </Link>
            </Button>
        
      </div>
     
      <Table
        columns={columns}
        // onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Products"
        url={ProductsApi}
      />
    </>
  );
};

export default ProductsTable;