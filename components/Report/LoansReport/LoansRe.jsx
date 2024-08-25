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
import { SalesLedgerApi } from "common/utils/axios/api";
import useDelete from "hooks/useDelete";
import FilterHeader from "/common/Table/FilterHeader";

const LoansReTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSales, setSelectedSales] = useState(null);


  const router = useRouter();

  // columns
  const columns = [
    // ... your columns definition here
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      selector: (row) => row?.name ?? "",
      cell: (row) => <div style={{width:"500px"}} className="">{row?.name ?? ""}</div>,
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
          {moment(row.startDate).format("DD-MMM-YYYY")}
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
              handleConfirmDelete(row._id, row.name);
            }}
          />
        </div>
      ),
    },
  ];

 

  return (
    <>
    
    <Table
        columns={columns}
        // onCreateAction={() => router.push("/dashboard/sales/new")}
        populate={[]}
        query={{}}
        title="LoanReport"
        url="/report/loanreport"
        searchFields={["name"]}
      />
    </>
  );
};

export default LoansReTable;
