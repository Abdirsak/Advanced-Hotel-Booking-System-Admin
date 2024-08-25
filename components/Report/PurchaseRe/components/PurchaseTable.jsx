"use client";

import React from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import { Badge } from "react-bootstrap";

const EmployeeSalesTable = ({ data }) => {
  const columns = [
    {
      name: "Purchase Date",
      sortable: true,
      sortField: "purchaseDate",
      selector: (row) => row.purchaseDate,
      cell: (row) => (
        <div>{moment(row.purchaseDate).format("MM-DD-YYYY")}</div>
      ),
    },

    {
      name: "Supplier",
      sortable: true,
      sortField: "supplierName",
      selector: (row) => row.supplierName,
      cell: (row) => <div>{row.supplierName}</div>,
    },
    {
      name: "Total Amount",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row?.totalAmount,
      cell: (row) => <div>{"$" + row.totalAmountSpent?.toFixed(2)}</div>,
    },
    {
      name: "Purchase Count",
      sortable: true,
      sortField: "purchaseCount",
      selector: (row) => row.purchaseCount,
      cell: (row) => <div>{row.purchaseCount || 0}</div>,
    },
    // {
    //   name: "Status",
    //   sortable: true,
    //   sortField: "orderStatus",
    //   selector: (row) => row.orderStatus,
    //   cell: (row) => (
    //     <Badge color={row.orderStatus === "Pending" ? "warning" : "success"}>
    //       <span className="text-capitalize fs-6">{row.orderStatus}</span>
    //     </Badge>
    //   ),
    // },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 10, 50, 100]}
    />
  );
};

export default EmployeeSalesTable;
