import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "reactstrap";
//3rd party libraries
import { Edit2, Trash2, Plus } from "react-feather";
import Link from "next/link";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { PurchasesApi } from "common/utils/axios/api";
import PurchasesModal from "./PurchasesModal";
import useDelete from "hooks/useDelete";

//

const PurchasesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(
    PurchasesApi,
    false,
    () => {
      //   setShowModal(false);
      //   setSelectedRow(null);
    }
  );

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
      name: "Product Name",
      sortable: true,
      sortField: "productsData.name",
      selector: (row) => row.productsData.name,
      cell: (row) => <div>{row.productsData.name}</div>,
    },
    {
      name: "Supplier Name",
      sortable: true,
      sortField: "supplierData.SupplierName",
      selector: (row) => row.supplierData.SupplierName,
      cell: (row) => <div>{row.supplierData.SupplierName}</div>,
    },
    {
      name: "Reference",
      sortable: true,
      sortField: "reference",
      selector: (row) => row.reference,
      cell: (row) => <div>{row.reference}</div>,
    },
    {
      name: "Purchase Date",
      sortable: true,
      sortField: "purchaseDate",
      selector: (row) => row.purchaseDate,
      cell: (row) => (
        <div>{moment(row.purchaseDate).format("DD-MMM-YYYY")}</div>
      ),
    },
    {
      name: "Expected Date",
      sortable: true,
      sortField: "expectedDate",
      selector: (row) => row.expectedDate,
      cell: (row) => (
        <div>{moment(row.expectedDate).format("DD-MMM-YYYY")}</div>
      ),
    },
    {
      name: "Order Status",
      sortable: true,
      sortField: "orderStatus",
      selector: (row) => row.orderStatus,
      cell: (row) => <div>{row.orderStatus}</div>,
    },
    {
      name: "Payment Status",
      sortable: true,
      sortField: "paymentStatus",
      selector: (row) => row.paymentStatus,
      cell: (row) => <div>{row.paymentStatus}</div>,
    },
    {
      name: "Billing Address",
      sortable: true,
      sortField: "billingAddress",
      selector: (row) => row.billingAddress,
      cell: (row) => <div>{row.billingAddress}</div>,
    },
    {
      name: "Shipping Address",
      sortable: true,
      sortField: "shippingAddress",
      selector: (row) => row.shippingAddress,
      cell: (row) => <div>{row.shippingAddress}</div>,
    },
    {
      name: "Total Amount",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row.totalAmount,
      cell: (row) => <div>{row.totalAmount}</div>,
    },
    {
      name: "Tax Information",
      sortable: true,
      sortField: "taxInformation",
      selector: (row) => row.taxInformation,
      cell: (row) => <div>{row.taxInformation}</div>,
    },
    {
      name: "Invoice ID",
      sortable: true,
      sortField: "invoiceId",
      selector: (row) => row.invoiceId,
      cell: (row) => <div>{row.invoiceId || "N/A"}</div>,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{ justifyContent: "space-between", cursor: "pointer" }}
          className="column-action"
        >
          <Edit2
            style={{ marginRight: 10 }}
            color="MidnightBlue"
            size={18}
            onClick={() => {
              setSelectedPurchase(row);
              setShowModal(true);
            }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => handleConfirmDelete(row._id, row.reference)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* <div className="flex">
        <Button color="primary" className="px-4 text-white  justify-end">
          <Link href={"/dashboard/purchases/new"} color="primary" className="px-4 text-white">
            <Plus /> New Purchases
          </Link>
        </Button>
      </div> */}
      {/* <PurchasesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedEmployee}
        setSelectedRow={setSelectedEmployee}
      /> */}
      <Table
        columns={columns}
        onCreateAction={() => router.push("/dashboard/purchases/new")}
        populate={[]}
        query={{}}
        title="Purchases"
        url={PurchasesApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default PurchasesTable;
