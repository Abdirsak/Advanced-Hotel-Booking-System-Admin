"use client";

import React from "react";
import DataTable from "react-data-table-component";

const EmployeeSalesTable = ({ data }) => {
  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
      sortable: true,
    },
    {
      name: "Transactions",
      selector: (row) => row.transactions,
      sortable: true,
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

export default EmployeeSalesTable;
