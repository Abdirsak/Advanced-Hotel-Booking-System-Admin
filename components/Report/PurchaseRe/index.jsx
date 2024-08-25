"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import DateFilter from "./components/DateFilter";
import PurchaseTable from "./components/PurchaseTable";
import ExportButtons from "./components/ExportButtons";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Spinner,
  Badge,
} from "reactstrap";
import { useQuery } from "@tanstack/react-query"; // Importing useQuery from react-query
import request from "common/utils/axios";

const columns = [
  {
    name: "Purchase Date",
    sortable: true,
    sortField: "purchaseDate",
    selector: (row) => row.purchaseDate,
    cell: (row) => <div>{moment(row.purchaseDate).format("DD-MMM-YYYY")}</div>,
  },
  {
    name: "Supplier",
    sortable: true,
    sortField: "supplierName",
    selector: (row) => row.supplierName,
    cell: (row) => <div>{row.supplierName}</div>,
  },
  {
    name: "Total Amount",
    sortable: true,
    sortField: "totalAmount",
    selector: (row) => row?.totalAmount,
    cell: (row) => <div>{"$" + row.totalAmountSpent?.toFixed(2)}</div>,
  },
  {
    name: "Purchase Count",
    sortable: true,
    sortField: "purchaseCount",
    selector: (row) => row.purchaseCount,
    cell: (row) => <div>{row.purchaseCount || 0}</div>,
  },
  // {
  //   name: "Status",
  //   sortable: true,
  //   sortField: "orderStatus",
  //   selector: (row) => row.orderStatus,
  //   cell: (row) => (
  //     <Badge color={row.orderStatus === "Pending" ? "warning" : "success"}>
  //       <span className="text-capitalize fs-6">{row.orderStatus}</span>
  //     </Badge>
  //   ),
  // },
];

const PurchaseReport = () => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetching data using react-query
  const {
    data: EmployeeSales = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/reports/purchase-report"],
    queryFn: () =>
      request({
        url: "/reports/purchase-report",
        method: "GET",
        params: {},
        options: {
          sort: { createdAt: "desc" },
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    keepPreviousData: true,
    select: (res) => (Array.isArray(res?.data?.data) ? res?.data?.data : []),
  });

  // Apply initial data to filteredData
  useEffect(() => {
    setFilteredData(EmployeeSales);
  }, [EmployeeSales]);

  // Refetch data on filter change
  useEffect(() => {
    refetch();
  }, [startDate, endDate, searchTerm, page, rowsPerPage, sortBy, refetch]);

  // Filter data by date and search term
  const filterData = () => {
    const filtered = EmployeeSales.filter((entry) => {
      const isWithinDateRange =
        (!startDate || entry.purchaseDate >= startDate) &&
        (!endDate || entry.purchaseDate <= endDate);
      const matchesSearchTerm = entry.supplierName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return isWithinDateRange && matchesSearchTerm;
    });
    setFilteredData(filtered);
  };

  // Update filters
  const filterDataByDate = (fromDate, toDate) => {
    setStartDate(fromDate);
    setEndDate(toDate);
    filterData();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterData();
  };

  return (
    <Container className="mt-5">
      <Card>
        <CardHeader>
          <h3 className="mb-4">Purchase Report</h3>
        </CardHeader>
        <CardBody>
          <DateFilter onFilter={filterDataByDate} />
          <ExportButtons
            onSearch={handleSearch}
            columns={columns}
            tableData={filteredData}
          />
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "200px" }}
            >
              <Spinner
                color="primary"
                style={{ width: "3rem", height: "3rem" }}
              >
                Loading...
              </Spinner>
            </div>
          ) : (
            <PurchaseTable data={filteredData} />
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default PurchaseReport;
