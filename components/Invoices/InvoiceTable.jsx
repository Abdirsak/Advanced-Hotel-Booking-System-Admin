import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 3rd party libraries
import { XCircle, CheckCircle } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

// Custom packages
import Table from "common/Table";
import { InvoicesApi } from "common/utils/axios/api";
import useDelete from "hooks/useDelete";
import request from "common/utils/axios";

const InvoiceTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const router = useRouter();

  // Delete mutation
  const { mutate, isPending: isLoading } = useDelete(InvoicesApi, false, () => {
    // Optional: Add any post-delete actions
  });

  // Cancel invoice function
  const handleCancelInvoice = async (id, invoiceNo) => {
    return Swal.fire({
      title: `Cancel Invoice ${invoiceNo}?`,
      text: "This will mark the invoice as canceled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-primary ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {
        try {
          await request({
            url: `${InvoicesApi}/${id}`,
            method: 'PATCH',
            data: { status: 'Cancelled' }
          });
          
          Swal.fire({
            title: 'Invoice Cancelled!',
            text: `Invoice ${invoiceNo} has been cancelled.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to cancel invoice.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error cancelling invoice:', error);
        }
      }
    });
  };

  // Pay invoice function
  const handlePayInvoice = async (id, invoiceNo) => {
    return Swal.fire({
      title: `Pay Invoice ${invoiceNo}?`,
      text: "This will mark the invoice as paid.",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Yes, pay it!",
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-primary ms-1",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {
        try {
          await request({
            url: `${InvoicesApi}/${id}`,
            method: 'PATCH',
            data: { status: 'Paid' }
          });
          
          Swal.fire({
            title: 'Invoice Paid!',
            text: `Invoice ${invoiceNo} has been paid.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to mark invoice as paid.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error paying invoice:', error);
        }
      }
    });
  };

  // Status badge color mapping
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Columns definition
  const columns = [
    {
      name: "Invoice No",
      sortable: true,
      sortField: "invoiceNo",
      selector: (row) => row.invoiceNo ?? "",
      cell: (row) => <div className="">{row.invoiceNo ?? "N/A"}</div>,
    },
    {
      name: "Customer",
      sortable: true,
      sortField: "customer.fullName",
      selector: (row) => row?.customer?.fullName ?? "",
      cell: (row) => <div className="">{row?.customer?.fullName ?? "N/A"}</div>,
    },
    {
      name: "Total Amount",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row.totalAmount,
      cell: (row) => (
        <div className="">
          ${row.totalAmount?.toFixed(2) ?? "0.00"}
        </div>
      ),
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge color={getStatusBadgeColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      name: "Created By",
      sortable: true,
      sortField: "createdBy.fullName",
      selector: (row) => row?.createdBy?.fullName ?? "",
      cell: (row) => <div className="">{row?.createdBy?.fullName ?? "N/A"}</div>,
    },
    {
      name: "Created Date",
      sortable: true,
      sortField: "createdAt",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span className="text-capitalize">
          {moment(row.createdAt).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => {
        // Only show actions for Pending invoices
        if (row.status === 'Paid' || row.status === 'Cancelled') {
          return <div>-</div>;
        }

        return (
          <div
            style={{
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            className="column-action"
          >
            <XCircle
              style={{ marginRight: 10 }}
              color="red"
              size={18}
              onClick={() => {
                handleCancelInvoice(row._id, row.invoiceNo);
              }}
              title="Cancel Invoice"
            />
            <CheckCircle
              style={{ marginLeft: 10 }}
              color="green"
              size={18}
              onClick={() => {
                handlePayInvoice(row._id, row.invoiceNo);
              }}
              title="Pay Invoice"
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        populate={["customer", "createdBy"]}
        query={{}}
        title="Invoices"
        url={InvoicesApi}
        searchFields={["invoiceNo", "customer.fullName"]}
      />
    </>
  );
};

export default InvoiceTable;