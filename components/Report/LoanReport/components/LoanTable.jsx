"use client";

import React from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import { Badge } from "react-bootstrap";

const LoanTable = ({ data }) => {
  const columns = [
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      selector: (row) => row?.name ?? "",
      cell: (row) => <div style={{ width: "500px" }} className="">{row?.name ?? ""}</div>,
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
      name: "Amount",
      sortable: true,
      sortField: "amount",
      selector: (row) => row?.amount ?? "",
      cell: (row) => <div className="">{row?.amount ?? ""}</div>,
    },
    {
      name: "Returned Amount",
      sortable: true,
      sortField: "returnedAmount",
      selector: (row) => row?.returnedAmount ?? "",
      cell: (row) => <div className="">{row?.returnedAmount ?? ""}</div>,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row?.status ?? "",
      cell: (row) => <div className="">{row?.status ?? ""}</div>,
    },

    {
      name: "StartDate Date",
      sortable: true,
      sortField: "startDate",
      selector: (row) => row.startDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.startDate).format("DD-MM-YYYY")}
        </span>
      ),
    },
    {
      name: "End Date",
      sortable: true,
      sortField: "endDate",
      selector: (row) => row.endDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.endDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      name: "Description",
      sortable: true,
      sortField: "description",
      selector: (row) => row?.description,
      cell: (row) => <div className="">{row?.description ?? ""}</div>,
    },



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

export default LoanTable;
