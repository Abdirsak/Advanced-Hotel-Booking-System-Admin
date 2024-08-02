import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "reactstrap";
// 3rd party libraries
import { Edit2, Trash2, Plus } from "react-feather";
import Link from "next/link";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

// custom packages
import Table from "common/Table/TableFilteration";
import { SalesApi } from "common/utils/axios/api";
import useDelete from "hooks/useDelete";
import FilterHeader from "/common/Table/FilterHeader";

const LossOrProfitTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSales, setSelectedSales] = useState(null);


  const router = useRouter();

  // delete function
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

  // columns
  const columns = [
    // ... your columns definition here
    {
      name: "Sales Date",
      sortable: true,
      sortField: "salesDate",
      selector: (row) => row.saleDate,
      cell: (row) => <div>{moment(row.saleDate).format("DD-MMM-YYYY")}</div>,
    },
    {
      name: "Invoice No",
      sortable: true,
      sortField: "invoiceData.invoiceNo",
      selector: (row) => row.invoiceData.invoiceNo,
      cell: (row) => <div>{row.invoiceData.invoiceNo}</div>,
    },
    {
      name: "Product",
      sortable: true,
      sortField: "productsData?.name",
      selector: (row) => row?.productsData?.name,
      cell: (row) => <div>{row?.productsData?.name}</div>,
    },
    {
      name: "Quantity",
      sortable: true,
      sortField: "salesItems?.quantity",
      selector: (row) => row?.salesItems?.quantity,
      cell: (row) => <div>{row?.salesItems?.quantity}</div>,
    },
    {
      name: "Supplier Price",
      sortable: true,
      sortField: "productsData?.cost",
      selector: (row) => "$" + row?.productsData?.cost,
      cell: (row) => <div>{"$" + row?.productsData?.cost}</div>,
    },
    {
      name: "Sales Price",
      sortable: true,
      sortField: "salesItems?.price",
      selector: (row) => "$" + row?.salesItems?.price,
      cell: (row) => <div>{"$" + row?.salesItems?.price}</div>,
    },
    {
      name: "Discount",
      sortable: true,
      sortField: "discount",
      selector: (row) => row?.discount,
      cell: (row) => <div>{"$" + row?.discount}</div>,
    },
    {
      name: "Supplier Cost",
      sortable: true,
      sortField: "salesItems",
      selector: (row) => row?.productsData?.cost * row?.salesItems?.quantity,
      cell: (row) => <div>{"$" + row?.productsData?.cost * row?.salesItems?.quantity}</div>,
    },
    {
      name: "Sales Cost",
      sortable: true,
      sortField: "salesItems",
      selector: (row) => row?.salesItems?.quantity * row?.salesItems?.price,
      cell: (row) => <div>{"$" + row?.salesItems?.quantity * row?.salesItems?.price}</div>,
    },
    {
      name: "Sold",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => "$" + row?.totalAmount,
      cell: (row) => <div>{"$" + row?.totalAmount}</div>,
    },
    {
      name: "Profit",
      sortable: true,
      sortField: "profit",
      selector: (row) => {
        const salesCost = row?.salesItems?.quantity * row?.salesItems?.price;
        const supplierCost = row?.productsData?.cost * row?.salesItems?.quantity;
        const discount = row?.discount || 0;
        const profit = salesCost - supplierCost - discount;
        return profit;
      },
      cell: (row) => {
        const salesCost = row?.salesItems?.quantity * row?.productsData?.price;
        const supplierCost = row?.productsData?.cost * row?.salesItems?.quantity;
        const discount = row?.discount || 0;
        const profit = salesCost - supplierCost - discount;
        return <div>{"$" + profit}</div>;
      },
    },
  ];

 

  return (
    <>
    
      <Table
        columns={columns}
        // onCreateAction={() => router.push("/dashboard/sales/new")}
        populate={[]}
        query={{}}
        title="Loss/Profit"
        url="/sales/los/profit"
        searchFields={["name"]}
      />
    </>
  );
};

export default LossOrProfitTable;
