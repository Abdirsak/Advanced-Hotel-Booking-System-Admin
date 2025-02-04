import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

// Custom packages
import Table from "common/Table";
import { BookingsApi } from "common/utils/axios/api";
import BookingModal from "./BookingModal";
import useDelete from "hooks/useDelete";

const BookingTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const router = useRouter();

  // Delete mutation
  const { mutate, isPending: isLoading } = useDelete(BookingsApi, false, () => {
    // Optional: Add any post-delete actions
  });

  // Delete function
  const handleConfirmDelete = async (id, customerName) => {
    return Swal.fire({
      title: `Delete Booking for ${customerName}?`,
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

  // Status badge color mapping
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Canceled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Columns definition
  const columns = [
    {
      name: "Customer",
      sortable: true,
      sortField: "customer.fullName",
      selector: (row) => row?.customer?.fullName ?? "",
      cell: (row) => <div className="">{row?.customer?.fullName ?? "N/A"}</div>,
    },
    {
      name: "Room",
      sortable: true,
      sortField: "room.roomNo",
      selector: (row) => row?.room?.roomNo ?? "",
      cell: (row) => <div className="">{row?.room?.roomNo ?? "N/A"}</div>,
    },
    {
      name: "Check-in Date",
      sortable: true,
      sortField: "checkInDate",
      selector: (row) => row.checkInDate,
      cell: (row) => (
        <span className="text-capitalize">
          {moment(row.checkInDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      name: "Check-out Date",
      sortable: true,
      sortField: "checkOutDate",
      selector: (row) => row.checkOutDate,
      cell: (row) => (
        <span className="text-capitalize">
          {moment(row.checkOutDate).format("DD-MMM-YYYY")}
        </span>
      ),
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
            onClick={() => {
              setSelectedBooking(row);
              setShowModal(true);
            }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => {
              handleConfirmDelete(row._id, row.customer?.name);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <BookingModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedBooking}
        setSelectedRow={setSelectedBooking}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={["customer", "room"]}
        query={{}}
        title="Bookings"
        url={BookingsApi}
        searchFields={["customer.fullName", "room.roomNo"]}
      />
    </>
  );
};

export default BookingTable;