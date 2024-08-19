import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { ReceiptsApi } from "common/utils/axios/api";
import ReceiptsModal from "./ReceiptModal";
import useDelete from "hooks/useDelete";

//

const ReceiptsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(ReceiptsApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Receipt ${name}?`,
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
      name: "Name",
      sortable: true,
      sortField: "name",
      selector: (row) => row?.customerData?.fullName ?? "",
      cell: (row) => <div className="">{row?.customerData?.fullName ?? ""}</div>,
    },

    {
      name: "Gender",
      sortable: true,
      sortField: "gender",
      selector: (row) => row.customerData?.gender,
      cell: (row) => <div className="">{row?.customerData?.gender ?? ""}</div>,
    },
    {
      name: "Contact",
      sortable: true,
      sortField: "contact",
      selector: (row) => row.customerData?.contact,
      cell: (row) => <div className="">{row?.customerData?.contact ?? ""}</div>,
    },
    {
      name: "ReceiptNo",
      sortable: true,
      sortField: "ReceiptNo",
      selector: (row) => row.receiptNo,
      cell: (row) => <div className="">{row?.receiptNo ?? ""}</div>,
    },
    {
      name: "Method",
      sortable: true,
      sortField: "method",
      selector: (row) => row.method,
      cell: (row) => <div className="">{row?.method ?? ""}</div>,
    },
    {
      name: "Total Amount",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row.invoiceData.totalAmount,
      cell: (row) => <div className="">{row?.invoiceData.totalAmount ?? ""}</div>,
    },
    {
      name: "amount",
      sortable: true,
      sortField: "amount",
      selector: (row) => row.amount,
      cell: (row) => <div className="">{row?.amount ?? ""}</div>,
    },
    {
      name: "Balance",
      sortable: true,
      sortField: "balance",
      selector: (row) => row?.balance,
      cell: (row) => <div className="">{row?.balance ?? ""}</div>,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row?.invoiceData.status,
      cell: (row) => <div className="">{row?.invoiceData.status ?? ""}</div>,
    },
   
    {
      name: "Sale Date",
      sortable: true,
      sortField: "createdAt",
      selector: (row) => row.salesData.saleDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.salesData.saleDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      name: "Receipt Date",
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
              setSelectedReceipt(row);
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
      <ReceiptsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedReceipt}
        setSelectedRow={setSelectedReceipt}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Receipts"
        url={ReceiptsApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default ReceiptsTable;
