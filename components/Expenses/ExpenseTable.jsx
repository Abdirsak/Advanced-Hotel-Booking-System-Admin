import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2, CreditCard } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { ExpensesApi } from "common/utils/axios/api";
import ExpenseModal from "./ExpenseModal";
import PaymentModal from "./PaymentModal";
import useDelete from "hooks/useDelete";

//

const CategoryTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(ExpensesApi, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete This Category`,
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
      name: "Date",
      sortable: true,
      sortField: "date",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.date).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      name: "Amount",
      sortable: true,
      sortField: "amount",
      selector: (row) => row.amount,
      cell: (row) => <div className="">{row?.amount ?? ""}</div>,
    },
    {
      name: "Description",
      sortable: true,
      sortField: "description",
      selector: (row) => row.description,
      cell: (row) => <div className="">{row?.description ?? ""}</div>,
    },
    {
      name: "Category",
      sortable: true,
      sortField: "category",
      selector: (row) => row.category?._id,
      cell: (row) => <div className="">{row?.category?.name ?? ""}</div>,
    },
    {
      name: "Status",
      minWidth: "100px",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge color={`${row?.status === "unPaid" ? "warning" : "success"}`}>
          <span className="text-capitalize fs-6">{row?.status}</span>
        </Badge>
      ),
    },
    {
      name: "createdBy",
      sortable: true,
      width: "20%",
      sortField: "name",
      selector: (row) => row?.createdBy ?? "",
      cell: (row) => <div className="">{row?.createdBy ?? ""}</div>,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div className="ms-0">
            <div className="fw-bold">{row?.createdBy?.fullName ?? ""}</div>
            <div className="font-small-2 text-muted">
              {row?.createdBy?.username || ""}
            </div>
          </div>
        </div>
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
          {row.status !== "paid" && (
            <Edit2
              style={{ marginRight: 10 }}
              color="MidnightBlue"
              size={18}
              onClick={(e) => {
                setSelectedCategory(row);
                setShowModal(true);
              }}
            />
          )}
          {row.status !== "paid" && (
            <Trash2
              style={{ marginLeft: 10 }}
              color="red"
              size={18}
              onClick={() => {
                handleConfirmDelete(row._id, row.name);
              }}
            />
          )}
          {row.status !== "paid" && (
            <CreditCard
              style={{ marginLeft: 20 }}
              color="green"
              size={18}
              onClick={(e) => {
                setSelectedExpense(row);
                setShowPayModal(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <ExpenseModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedCategory}
        setSelectedRow={setSelectedCategory}
      />
      <PaymentModal
        showModal={showPayModal}
        setShowModal={setShowPayModal}
        selectedRow={selectedExpense}
        setSelectedRow={setSelectedExpense}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Expense"
        url={ExpensesApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default CategoryTable;
