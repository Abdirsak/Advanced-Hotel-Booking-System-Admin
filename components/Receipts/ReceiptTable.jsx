import React from "react";
import moment from "moment";
import { Badge } from "reactstrap";

// 3rd party libraries
import { XCircle, CheckCircle } from "react-feather";
import Swal from "sweetalert2";

// Custom packages
import Table from "common/Table";
import { ReceiptsApi } from "common/utils/axios/api";
import request from "common/utils/axios";

const ReceiptTable = () => {
  // Payment method badge color mapping
  const getPaymentMethodBadgeColor = (method) => {
    switch (method) {
      case "Cash":
        return "success";
      case "Credit Card":
        return "primary";
      case "Mobile Payment":
        return "info";
      default:
        return "secondary";
    }
  };

  // Columns definition
  const columns = [
    {
      name: "Receipt No",
      sortable: true,
      sortField: "receiptNo",
      selector: (row) => row.receiptNo ?? "",
      cell: (row) => <div className="">{row.receiptNo ?? "N/A"}</div>,
    },
    {
      name: "Invoice",
      sortable: true,
      sortField: "invoice.invoiceNo",
      selector: (row) => row?.invoice?.invoiceNo ?? "",
      cell: (row) => <div className="">{row?.invoice?.invoiceNo ?? "N/A"}</div>,
    },
    {
      name: "Payment Method",
      sortable: true,
      sortField: "paymentMethod",
      selector: (row) => row.paymentMethod,
      cell: (row) => (
        <Badge color={getPaymentMethodBadgeColor(row.paymentMethod)}>
          {row.paymentMethod}
        </Badge>
      ),
    },
    {
      name: "Date",
      sortable: true,
      sortField: "date",
      selector: (row) => row.date,
      cell: (row) => (
        <span className="text-capitalize">
          {moment(row.date).format("DD-MMM-YYYY HH:mm")}
        </span>
      ),
    },
    {
      name: "Processed By",
      sortable: true,
      sortField: "processedBy.fullName",
      selector: (row) => row?.processedBy?.fullName ?? "",
      cell: (row) => (
        <div className="">{row?.processedBy?.fullName ?? "N/A"}</div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        populate={["invoice", "processedBy"]}
        query={{}}
        title="Receipts"
        url={ReceiptsApi}
        searchFields={["receiptNo", "invoice.invoiceNo"]}
      />
    </>
  );
};

export default ReceiptTable;
