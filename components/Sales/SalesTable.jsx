import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "reactstrap";
//3rd party libraries
import { Edit2, Trash2,Plus} from "react-feather";
import Link from "next/link";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { SalesApi } from "common/utils/axios/api";
import useDelete from "hooks/useDelete";

//

const SalesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [SelectedSales, setSelectedSales] = useState(null);

  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(SalesApi, false, () => {
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
      sortField: "customersData.fullName",
      selector: (row) => row?.customersData?.fullName,
      cell: (row) => <div>{row?.customersData?.fullName}</div>,
    },
    {
      name: "Gender",
      sortable: true,
      sortField: "customersData?.gender",
      selector: (row) => row?.customersData?.gender,
      cell: (row) => <div>{row?.customersData?.gender}</div>,
    },
    {
      name: "Sales Date",
      sortable: true,
      sortField: "salesDate",
      selector: (row) => row.salesDate,
      cell: (row) => <div>{moment(row.salesDate).format("DD-MMM-YYYY")}</div>,
    },
    {
      name: "Product",
      sortable: true,
      sortField: "productsData?.name",
      selector: (row) => row?.productsData?.name,
      cell: (row) => <div>{row?.productsData?.name}</div>,
    },
    {
      name: "Quantity",
      sortable: true,
      sortField: "salesItems?.quantity",
      selector: (row) => row?.salesItems?.quantity,
      cell: (row) => <div>{row?.salesItems?.quantity}</div>,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row?.status,
      cell: (row) => <div>{row?.status}</div>,
    },
    {
      name: "Price",
      sortable: true,
      sortField: "salesItems?.price",
      selector: (row) => row?.salesItems?.price.$numberDecimal,
      cell: (row) => <div>{row?.salesItems?.price.$numberDecimal}</div>,
    },
    {
      name: "Amount",
      sortable: true,
      sortField: "salesItems?.total",
      selector: (row) => row?.salesItems?.total.$numberDecimal,
      cell: (row) => <div>{row?.salesItems?.total.$numberDecimal}</div>,
    },
    {
      name: "Paid",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row?.totalAmount.$numberDecimal,
      cell: (row) => <div>{row?.totalAmount.$numberDecimal}</div>,
    },
    {
      name: "Discount",
      sortable: true,
      sortField: "discount",
      selector: (row) => row?.discount.$numberDecimal,
      cell: (row) => <div>{row?.discount.$numberDecimal}</div>,
    },
    {
      name: "Balance",
      sortable: true,
      sortField: "balance",
      selector: (row) => row?.balance.$numberDecimal ?? 0,
      cell: (row) => <div>{row?.balance.$numberDecimal ?? 0}</div>,
    },
    
    
   

    
    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{ justifyContent: "space-between", cursor: "pointer" }}
          className="column-action"
        >
          <Edit2
            style={{ marginRight: 10 }}
            color="MidnightBlue"
            size={18}
            onClick={() => {
              router.push(`/dashboard/sales/edit/${row._id}`);
            }}
            // onClick={() => {
            //   setSelectedSales(row);
            //   setShowModal(true);
            // }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => handleConfirmDelete(row._id, row.reference)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <Button color="primary" className="px-4 justify-end text-white">
          <Link href={"/dashboard/sales/new"} color="primary" className="px-4 text-white">
            <Plus /> New Sales
          </Link>
        </Button>
      </div>
      {/* <SalesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={SelectedSales}
        setSelectedRow={setSelectedSales}
      /> */}
      <Table
        columns={columns}
        // onCreateAction={() =>router.push("/dashboard/products/new")} 
        populate={[]}
        query={{}}
        title="Sales"
        url={SalesApi}
        searchFields={["name"]}
      />
    </>
  );
};

export default SalesTable;
