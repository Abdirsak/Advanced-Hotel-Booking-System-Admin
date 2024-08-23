"use client";

import React, { useState, useEffect } from "react";
import DateFilter from "./components/DateFilter";
import EmployeeSalesTable from "./components/EmployeeSalesTable";
import ExportButtons from "./components/ExportButtons";
import { EmployeeSalesReportAPI } from "common/utils/axios/api";
import { Card, CardBody, CardHeader, Container, Spinner } from "reactstrap";
import { useQuery } from "@tanstack/react-query"; // Importing useQuery from react-query
import request from "common/utils/axios";

const columns = [
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: "Employee Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Total Amount",
    selector: (row) => row.totalAmount,
    sortable: true,
  },
  {
    name: "Transactions",
    selector: (row) => row.transactions,
    sortable: true,
  },
];

const SalesReport = () => {
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
    queryKey: ["/reports/employee-sales"],
    queryFn: () =>
      request({
        url: "/reports/employee-sales",
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
        (!startDate || entry.date >= startDate) &&
        (!endDate || entry.date <= endDate);
      const matchesSearchTerm = entry.name
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
          <h3 className="mb-4">Employee Sales Report</h3>
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
            <EmployeeSalesTable data={filteredData} />
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default SalesReport;
