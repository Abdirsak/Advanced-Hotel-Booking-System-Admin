"use client";
import { useRouter } from "next/navigation";
import { Button } from "reactstrap";
// 3rd party libraries
import { Edit2, Trash2, Plus } from "react-feather";
import Link from "next/link";
import { Badge } from "reactstrap";
import moment from "moment";


// custom packages
import Table from "common/Table/TableFilteration";
import { useState } from "react";


const PurchaseReport = () => {
   const [showModal, setShowModal] = useState(false);
   const [selectedSales, setSelectedSales] = useState(null);


   const router = useRouter();

   // columns
   const columns = [
      // ... your columns definition here
      {
         name: "Purchase Date",
         sortable: true,
         sortField: "purchaseDate",
         selector: (row) => row.purchaseDate,
         cell: (row) => <div>{moment(row.purchaseDate).format("DD-MMM-YYYY")}</div>,
      },

      {
         name: "Invoice No",
         sortable: true,
         sortField: "invoiceData.reference",
         selector: (row) => row.invoiceData.reference,
         cell: (row) => <div>{row.invoiceData.reference}</div>,
      },
      {

         name: "Supplier",
         sortable: true,
         sortField: "supplierData?.SupplierName",
         selector: (row) => row?.supplierData?.SupplierName,
         cell: (row) => <div>{row?.supplierData?.SupplierName}</div>,
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
         name: "Unit Price",
         sortable: true,
         sortField: "productsData?.price",
         selector: (row) => "$" + row?.productsData?.price,
         cell: (row) => <div>{"$" + row?.productsData?.price}</div>,
      },
      {
         name: "Total Amount",
         sortable: true,
         sortField: "totalAmount",
         selector: (row) => "$" + row?.invoiceData?.totalAmount,
         cell: (row) => <div>{"$" + row?.invoiceData?.totalAmount}</div>,
      },
      {
         name: "Paid Amount",
         sortable: true,
         sortField: "paidAmount",
         selector: (row) => "$" + row?.invoiceData?.paidAmount,
         cell: (row) => <div>{"$" + row?.invoiceData?.paidAmount}</div>
      },
      {
         name: "Bakance",
         sortable: true,
         sortField: "balance",
         selector: (row) => "$" + (row?.invoiceData?.totalAmount - row?.invoiceData?.paidAmount),
         cell: (row) => <div>{"$" + (row?.invoiceData?.totalAmount - row?.invoiceData?.paidAmount)}</div>
      },
      {
         name: "Status",
         minWidth: "100px",
         sortable: true,
         sortField: "status",
         selector: (row) => row.status,
         cell: (row) => (
            <Badge color={`${row?.status == "pending" ? "warning" : "success"}`}>
               <span className="text-capitalize fs-6">{row?.status}</span>
            </Badge>
         ),
      },

   ];



   return (
      <>

         {/* <Table
            columns={columns}
            // onCreateAction={() => router.push("/dashboard/sales/new")}
            populate={[]}
            query={{}}
            title="Purchase Report"
            url="/purchases"
            searchFields={["name"]}
         /> */}
      </>
   );
};

export default PurchaseReport;
