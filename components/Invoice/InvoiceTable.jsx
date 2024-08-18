import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { InvoicesApi } from "common/utils/axios/api";
import InvoiceModal from "./InvoiceModal";
import useDelete from "hooks/useDelete";

//

const InvoicesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setselectedInvoice] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(InvoicesApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

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
      name: "Customer",
      sortable: true,
      sortField: "customerData.fullName",
      selector: (row) => row.customerData?.fullName,
      cell: (row) => <div style={{width:"400px"}} className="">{row?.customerData?.fullName ?? ""}</div>,
    },
    {
      name: "Contact",
      sortable: true,
      sortField: "customerData.contact",
      selector: (row) => row.customerData?.contact,
      cell: (row) => <div className="">{row?.customerData?.contact ?? ""}</div>,
    },
    {
      name: "Invoice Date",
      sortable: true,
      sortField: "invoiceDate",
      selector: (row) => row.invoiceDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.invoiceDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },

    {
      name: "Due Date",
      sortable: true,
      sortField: "dueDate",
      selector: (row) => row.dueDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.dueDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },
 
    
    {
      name: "Total Amount",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row.totalAmount,
      cell: (row) => <div className="">{row?.totalAmount ?? ""}</div>,
    },
    {
      name: "Paid Amount",
      sortable: true,
      sortField: "paidAmount",
      selector: (row) => row.paidAmount,
      cell: (row) => <div className="">{row?.paidAmount ?? ""}</div>,
    },
    {
      name: "Balance",
      sortable: true,
      sortField: "balance",
      selector: (row) => row?.balance,
      cell: (row) => <div className="">{row?.totalAmount - row?.paidAmount  ?? ""}</div>,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => ( <Badge color={`${row?.status === "unpaid" ? "warning" : "success"}`}>
      <span className="text-capitalize fs-6">{row?.status}</span>
    </Badge>
      )
    },
 
    // {
    //   name: "Created Date",
    //   sortable: true,
    //   sortField: "createdAt",
    //   selector: (row) => row.createdAt,
    //   cell: (row) => (
    //     <span className="text-capitalize">
    //       {" "}
    //       {moment(row.createdAt).format("DD-MMM-YYYY")}
    //     </span>
    //   ),
    // },

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
              setselectedInvoice(row);
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
      <InvoiceModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedInvoice}
        setSelectedRow={setselectedInvoice}
      />
      <Table
        columns={columns}
        // onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Invoices"
        url={InvoicesApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default InvoicesTable;
