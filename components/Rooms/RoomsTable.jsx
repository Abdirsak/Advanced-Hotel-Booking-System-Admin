import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { RoomsApi } from "common/utils/axios/api";
import RoomsModal from "./RoomsModal";
import useDelete from "hooks/useDelete";

const RoomsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(RoomsApi, false, () => {
    //   Additional cleanup if needed
  });

  //delete function
  const handleConfirmDelete = async (id, roomNo) => {
    return Swal.fire({
      title: `Delete Room ${roomNo}?`,
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
      name: "Room Number",
      sortable: true,
      sortField: "roomNo",
      selector: (row) => row?.roomNo ?? "",
      cell: (row) => <div className="">{row?.roomNo ?? ""}</div>,
    },
    {
      name: "Room Type",
      sortable: true,
      sortField: "roomType",
      selector: (row) => row.roomType,
      cell: (row) => (
        <Badge 
          color={
            row.roomType === "Single" ? "primary" :
            row.roomType === "Double" ? "success" :
            row.roomType === "Suite" ? "warning" :
            "info"
          }
        >
          {row?.roomType ?? ""}
        </Badge>
      ),
    },
    {
      name: "Price per Night",
      sortable: true,
      sortField: "pricePerNight",
      selector: (row) => row.pricePerNight,
      cell: (row) => <div className="">${row?.pricePerNight ?? ""}</div>,
    },
    {
      name: "Floor",
      sortable: true,
      sortField: "floor",
      selector: (row) => row.floor,
      cell: (row) => <div className="">{row?.floor ?? ""}</div>,
    },
    {
      name: "Amenities",
      sortable: false,
      selector: (row) => row.amenities,
      cell: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row?.amenities?.map((amenity, index) => (
            <Badge key={index} color="light" className="text-dark">
              {amenity}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      name: "Description",
      sortable: true,
      sortField: "description",
      selector: (row) => row.description,
      cell: (row) => (
        <div 
          className="text-truncate" 
          style={{ maxWidth: '200px' }}
          title={row?.description ?? ""}
        >
          {row?.description ?? ""}
        </div>
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
              setSelectedRoom(row);
              setShowModal(true);
            }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => {
              handleConfirmDelete(row._id, row.roomNo);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <RoomsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedRoom}
        setSelectedRow={setSelectedRoom}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Rooms"
        url={RoomsApi}
        searchFields={["roomNo", "roomType"]}
      />
    </>
  );
};

export default RoomsTable;